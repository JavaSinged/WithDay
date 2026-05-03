import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { signupSchema } from '../../features/auth/validation/authSchema';
import { signupUser } from '../../features/auth/api';
import FormField from '../../shared/ui/Form/FormField';
import { Input } from '../../shared/ui/Form/Form';
import Button from '../../shared/ui/Button/Button'; 
import styles from './Auth.module.css'; 

const Signup = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur', 
  });

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      alert('회원가입이 완료되었습니다.');
      navigate('/login'); 
    },
    onError: (error) => {
      // 서버에서 보내주는 에러 메시지 객체를 정확히 파고들기
      const errMsg = error.response?.data?.message || error.response?.data || error.message;
      alert(`회원가입 실패: ${typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg}`);
    }
  });

  const handleAddressSearch = () => {
    setValue('postcode', '12345');
    setValue('address', '서울시 강남구 테헤란로 123');
    setValue('lat', 37.498095);
    setValue('lng', 127.027610);
    alert('주소 검색 API가 연결될 자리입니다.');
  };

  const onSubmit = (data) => {
    // 1. data 객체 안에서 파일 덩어리인 profileImage만 쏙 빼고, 나머지를 restData에 담기
    const { profileImage, ...restData } = data;

    const formattedData = {
      user: {
        ...restData, // 파일 빼고 나머지(이메일, 비밀번호 등) 쫙 펼치기
        provider: 'local',
        profileImage: null, // 나중에 파일 업로드 기능 붙이기 전까지는 일단 null로 전송!
        
        // 2. 빈 글자("")로 넘어오면 에러 나니까, 값이 없으면 0.0으로 숫자(Double) 변환해서 보내기!
        lat: data.lat ? parseFloat(data.lat) : 0.0, 
        lng: data.lng ? parseFloat(data.lng) : 0.0, 
      },
      termsList: [] 
    };

    mutation.mutate(formattedData);
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
            <Input type="email" placeholder="example@withday.com" {...register('email')} />
          </FormField>

          <FormField label="비밀번호" error={errors.password}>
            <Input type="password" placeholder="8자리 이상" {...register('password')} />
          </FormField>

          <FormField label="닉네임" error={errors.nickname}>
            <Input type="text" placeholder="멋진 닉네임" {...register('nickname')} />
          </FormField>

          <FormField label="프로필 이미지" error={errors.profileImage}>
            <Input type="file" accept="image/*" {...register('profileImage')} />
          </FormField>

          <FormField label="생년월일" error={errors.birthday}>
            <Input type="date" {...register('birthday')} />
          </FormField>

          <FormField label="성별" error={errors.gender}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <label><input type="radio" value="1" {...register('gender')} /> 남</label>
              <label><input type="radio" value="2" {...register('gender')} /> 여</label>
            </div>
          </FormField>

          <FormField label="전화번호" error={errors.phone}>
            <Input type="tel" placeholder="010-1234-5678" {...register('phone')} />
          </FormField>

          <FormField label="주소" error={errors.postcode || errors.address}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <Input type="text" placeholder="우편번호" readOnly {...register('postcode')} />
              {/* 💡 주소 검색 버튼도 공통 Button 적용 (크기는 작게, 스타일은 outline으로!) */}
              <Button type="button" variant="outline" size="sm" onClick={handleAddressSearch}>
                주소 검색
              </Button>
            </div>
            <Input type="text" placeholder="기본 주소" readOnly {...register('address')} style={{ marginBottom: '8px' }}/>
            <Input type="text" placeholder="상세 주소를 입력해주세요" {...register('detailAddress')} error={errors.detailAddress} />
          </FormField>

          <input type="hidden" {...register('lat')} />
          <input type="hidden" {...register('lng')} />

          {/* 💡 메인 제출 버튼 적용! fullWidth 속성 하나면 너비 100%가 알아서 맞춰짐 */}
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? '가입하는 중...' : '회원가입 완료'}
          </Button>
        </form>
        
        <p className={styles.linkText}>
          이미 계정이 있으신가요? <span onClick={() => navigate('/login')}>로그인하기</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;