import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';

import DaumPostcode from 'react-daum-postcode';
import { Snackbar, Alert, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { signupSchema } from '../../features/auth/validation/authSchema';
import { signupUser, fetchTerms, sendEmailVerification } from '../../features/auth/api';
import FormField from '../../shared/ui/Form/FormField';
import { Input } from '../../shared/ui/Form/Form';
import Button from '../../shared/ui/Button/Button';
import styles from './Auth.module.css'; 

const Signup = () => {
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split('T')[0];

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const [openTerms, setOpenTerms] = useState(null);

  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);

  const [mailAuth, setMailAuth] = useState(0); 
  const [mailAuthCode, setMailAuthCode] = useState(null);
  const [mailAuthInput, setMailAuthInput] = useState('');
  
  const [time, setTime] = useState(180);
  const timerRef = useRef(null);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onChange', 
    defaultValues: {
      agreeTos: false,
      agreePrivacy: false,
      agreeMarketing: false
    }
  });

  const allAgreed = watch('agreeTos') && watch('agreePrivacy') && watch('agreeMarketing');
  const handleAgreeAll = (e) => {
    const isChecked = e.target.checked;
    setValue('agreeTos', isChecked, { shouldValidate: true });
    setValue('agreePrivacy', isChecked, { shouldValidate: true });
    setValue('agreeMarketing', isChecked, { shouldValidate: true });
  };

  const { data: termsData } = useQuery({ queryKey: ['terms'], queryFn: fetchTerms });

  const getTermTitle = (type) => {
    if (type === 'TOS') return '이용약관';
    if (type === 'PRIVACY') return '개인정보 수집 및 이용';
    if (type === 'MARKETING') return '마케팅 정보 수신';
    return '약관';
  };

  const getTermContent = (type) => {
    if (!termsData) return '약관 데이터를 불러오는 중입니다...';
    const term = termsData.find(t => t.type === type);
    return term ? term.content : '약관 내용이 없습니다.';
  };

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      // 💡 지연 없이 즉시 로그인 페이지로 가면서, 보따리(state)에 성공 메시지를 담아 보냅니다!
      navigate('/login', { state: { toastMessage: '환영합니다! 회원가입이 완료되었습니다.' } });
    },
    onError: (error) => {
      const errMsg = error.response?.data || '회원가입에 실패했습니다.';
      setToast({ open: true, message: errMsg, severity: 'error' });
    }
  });

  const handleCompletePostcode = (data) => {
    let fullAddress = data.address; 
    let extraAddress = ''; 

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setValue('postcode', data.zonecode);
    setValue('address', fullAddress); 
    setIsPostcodeOpen(false);
  };

  const handleSendMail = async () => {
    const emailValue = getValues('email');
    if (!emailValue) {
      setToast({ open: true, message: '이메일을 먼저 입력해주세요.', severity: 'warning' });
      return;
    }

    setTime(180); 
    setMailAuthCode(null);
    if (timerRef.current) window.clearInterval(timerRef.current);

    setMailAuth(1);
    setToast({ open: true, message: '인증번호를 발송 중입니다...', severity: 'info' });

    try {
      const res = await sendEmailVerification(emailValue);
      setToast({ open: true, message: '이메일로 인증번호가 발송되었습니다!', severity: 'success' });
      setMailAuthCode(String(res)); 
      setMailAuth(2);

      timerRef.current = window.setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            window.clearInterval(timerRef.current);
            setToast({ open: true, message: '인증 시간이 만료되었습니다. 다시 시도해주세요.', severity: 'warning' });
            setMailAuthCode(null);
            setMailAuth(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setToast({ open: true, message: '이메일 발송에 실패했습니다. 이메일을 확인해주세요.', severity: 'error' });
      setMailAuth(0);
    }
  };

  const handleVerifyCode = () => {
    if (mailAuthCode === mailAuthInput && mailAuthInput !== "") {
      setMailAuth(3);
      window.clearInterval(timerRef.current); 
      setToast({ open: true, message: '이메일 인증이 완료되었습니다.', severity: 'success' });
    } else {
      setToast({ open: true, message: '인증코드가 올바르지 않습니다.', severity: 'error' });
    }
  };

  const showTime = () => {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const onSubmit = (data) => {
    setIsSubmitAttempted(true); 

    if (mailAuth !== 3) {
      setToast({ open: true, message: '이메일 인증을 완료해주세요.', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    const signupData = {
      user: {
        email: data.email,
        password: data.password,
        nickname: data.nickname,
        birthday: data.birthday,
        gender: data.gender,
        phone: data.phone,
        postcode: data.postcode,
        address: data.address,
        detailAddress: data.detailAddress,
      },
      terms: {
        TOS: data.agreeTos,
        PRIVACY: data.agreePrivacy,
        MARKETING: data.agreeMarketing || false 
      }
    };

    formData.append('signupData', new Blob([JSON.stringify(signupData)], { type: 'application/json' }));
    
    if (data.profileImage && data.profileImage[0]) {
      formData.append('profileImage', data.profileImage[0]);
    }

    mutation.mutate(formData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>WithDay 시작하기</h1>
          <p className={styles.subtitle}>새로운 동행을 찾아 떠나볼까요?</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          
          <FormField label="이메일" error={errors.email}>
            <div className={styles.inputRow}>
              <div className={styles.flex1}>
                <Input 
                  type="email" 
                  placeholder="example@withday.com" 
                  {...register('email')} 
                  readOnly={mailAuth > 0}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleSendMail} disabled={mailAuth === 1 || mailAuth === 3}>
                {mailAuth >= 2 ? "재전송" : "인증번호 전송"}
              </Button>
            </div>
            {isSubmitAttempted && mailAuth !== 3 && (
              <p className={styles.errorText}>이메일 인증을 완료해주세요.</p>
            )}
          </FormField>

          {mailAuth > 1 && (
            <FormField label="인증번호 확인">
              <div className={styles.inputRowCenter}>
                <div className={styles.authInputWrap}>
                  <Input 
                    type="text" 
                    placeholder="인증코드 6자리" 
                    value={mailAuthInput}
                    onChange={(e) => setMailAuthInput(e.target.value)}
                    disabled={mailAuth === 3}
                    style={{ paddingRight: '60px' }}
                  />
                  {mailAuth !== 3 && <span className={styles.timerText}>{showTime()}</span>}
                </div>
                <Button type="button" variant="primary" size="sm" onClick={handleVerifyCode} disabled={mailAuth === 3 || !mailAuthInput}>
                  인증하기
                </Button>
              </div>
              {mailAuth === 3 && <p className={styles.successText}>✔ 이메일 인증이 완료되었습니다.</p>}
            </FormField>
          )}

          <FormField label="비밀번호" error={errors.password}>
            <div className={styles.pwInputWrap}>
              <Input 
                type={showPw ? "text" : "password"} 
                placeholder="8자리 이상" 
                {...register('password')} 
                style={{ paddingRight: '40px' }}
              />
              <div className={styles.pwIcon} onClick={() => setShowPw(!showPw)}>
                {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </div>
            </div>
          </FormField>
          
          <FormField label="비밀번호 확인" error={errors.passwordConfirm}>
            <div className={styles.pwInputWrap}>
              <Input 
                type={showPwConfirm ? "text" : "password"} 
                placeholder="비밀번호를 다시 입력하세요" 
                {...register('passwordConfirm')} 
                style={{ paddingRight: '40px' }}
              />
              <div className={styles.pwIcon} onClick={() => setShowPwConfirm(!showPwConfirm)}>
                {showPwConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </div>
            </div>
          </FormField>

          <FormField label="닉네임" error={errors.nickname}>
            <Input type="text" placeholder="멋진 닉네임" {...register('nickname')} />
          </FormField>
          <FormField label="프로필 이미지" error={errors.profileImage}>
            <Input type="file" accept="image/*" {...register('profileImage')} />
          </FormField>
          <FormField label="생년월일" error={errors.birthday}>
            <Input type="date" max={todayDate} {...register('birthday')} />
          </FormField>
          <FormField label="성별" error={errors.gender}>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}><input type="radio" value="1" {...register('gender')} /> 남</label>
              <label className={styles.radioLabel}><input type="radio" value="2" {...register('gender')} /> 여</label>
            </div>
          </FormField>
          <FormField label="전화번호" error={errors.phone}>
            <Input type="tel" placeholder="010-1234-5678" {...register('phone')} />
          </FormField>

          <FormField label="주소" error={errors.postcode || errors.address}>
            <div className={`${styles.inputRow} ${styles.marginBottom8}`}>
              <div className={styles.flex1}>
                <Input type="text" placeholder="우편번호" readOnly {...register('postcode')} />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setIsPostcodeOpen(true)}>주소 검색</Button>
            </div>
            <div className={styles.marginBottom8}>
              <Input type="text" placeholder="기본 주소" readOnly {...register('address')} />
            </div>
            <Input type="text" placeholder="상세 주소를 입력해주세요" {...register('detailAddress')} error={errors.detailAddress} />
          </FormField>

          <div className={styles.termsContainer}>
            <label className={styles.termLabelAll}>
              <input type="checkbox" checked={allAgreed} onChange={handleAgreeAll} />
              <span className={styles.termText}>이용약관 전체 동의합니다.</span>
            </label>

            <label className={styles.termLabel}>
              <input type="checkbox" {...register('agreeTos')} />
              <span className={styles.termText}>[필수] 이용약관에 동의합니다.</span>
              <span className={styles.termLink} onClick={(e) => { e.preventDefault(); setOpenTerms('TOS'); }}>보기</span>
            </label>
            {errors.agreeTos && <p className={styles.termError}>{errors.agreeTos.message}</p>}

            <label className={styles.termLabel}>
              <input type="checkbox" {...register('agreePrivacy')} />
              <span className={styles.termText}>[필수] 개인정보 수집 및 이용에 동의합니다.</span>
              <span className={styles.termLink} onClick={(e) => { e.preventDefault(); setOpenTerms('PRIVACY'); }}>보기</span>
            </label>
            {errors.agreePrivacy && <p className={styles.termError}>{errors.agreePrivacy.message}</p>}

            <label className={styles.termLabel}>
              <input type="checkbox" {...register('agreeMarketing')} />
              <span className={styles.termText}>[선택] 마케팅 정보 수신에 동의합니다.</span>
              <span className={styles.termLink} onClick={(e) => { e.preventDefault(); setOpenTerms('MARKETING'); }}>보기</span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={mutation.isPending}>
            {mutation.isPending ? '가입하는 중...' : '회원가입 완료'}
          </Button>
        </form>
        <p className={styles.linkText}>
          이미 계정이 있으신가요? <span className={styles.linkClickable} onClick={() => navigate('/login')}>로그인하기</span>
        </p>
      </div>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>

      <Dialog open={isPostcodeOpen} onClose={() => setIsPostcodeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          주소 검색
          <IconButton onClick={() => setIsPostcodeOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <DaumPostcode onComplete={handleCompletePostcode} style={{ width: '100%', height: '400px' }} />
        </DialogContent>
      </Dialog>

      <Dialog open={openTerms !== null} onClose={() => setOpenTerms(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          {openTerms ? getTermTitle(openTerms) : ''}
          <IconButton onClick={() => setOpenTerms(null)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <pre className={styles.termPre}>
            {openTerms ? getTermContent(openTerms) : ''}
          </pre>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Signup;