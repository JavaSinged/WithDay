import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs'; // 날짜 포맷팅 라이브러리
import clsx from 'clsx'; // 클래스명 조건부 결합 라이브러리

import { signupSchema } from '../../features/auth/validation/signupSchema';
import { signupUser } from '../../features/auth/api';
// 네가 올려준 기존 공통 컴포넌트들을 그대로 import 해!
import FormField from '../../shared/ui/Form/FormField';
import { Input } from '../../shared/ui/Form/Form';
import styles from './Signup.module.css';

const Signup = () => {
  /* =========================================================================
     [ react-hook-form 세팅 ]
     register: 인풋 창에 이름표를 붙여서 값을 추적하게 만듦 (onChange, useState 대체)
     handleSubmit: 폼 제출 시 유효성 검사(yup)를 먼저 실행하고, 통과하면 지정한 함수 실행
     errors: yup 규칙을 어겼을 때 발생하는 에러 메시지들이 쏙쏙 담기는 객체
  ========================================================================= */
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signupSchema), // yup 스키마를 이 폼의 검사관으로 임명!
    mode: 'onBlur', // 유저가 인풋 창에서 마우스 포커스를 바깥으로 뺄 때마다 에러 검사
  });

  /* =========================================================================
     [ React Query 세팅 (useMutation) ]
     서버에 데이터를 '저장/수정/삭제' 할 때 사용하는 훅이야.
     mutation.mutate() 를 호출하면 아래의 mutationFn(여기선 signupUser)이 실행돼.
     isPending: 서버와 통신 중일 때 true가 되는 마법의 변수 (로딩 스피너 띄울 때 씀)
  ========================================================================= */
  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      // API 통신 성공 시 실행
      alert('환영합니다! 회원가입이 완료되었습니다.');
      // TODO: 네비게이트를 이용해 로그인 페이지로 이동 (ex. navigate('/login'))
    },
    onError: (error) => {
      // API 통신 실패 시 실행
      alert(`회원가입 실패: ${error.response?.data || error.message}`);
    }
  });

  /* =========================================================================
     [ 폼 제출 함수 ]
     유효성 검사를 무사히 통과하면 이 함수가 실행돼. 'data'에는 유저가 입력한 값이 다 들어있어.
  ========================================================================= */
  const onSubmit = (data) => {
    // Dayjs 사용법: dayjs()는 현재 시간을 가져오고, .format()으로 원하는 모양으로 바꿔줘.
    // DB의 created_at 컬럼에 예쁘게 넣기 위해 포맷팅을 해주는 거야.
    const formattedData = {
      user: {
        ...data,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), 
      },
      termsList: [] // 약관 동의 내역은 추후 추가
    };

    // 서버로 포맷팅된 데이터 날리기!
    mutation.mutate(formattedData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>WithDay 시작하기</h1>  
          <p className={styles.subtitle}>새로운 동행을 찾아 떠나볼까요?</p>
        </div>

        {/* 폼 제출 이벤트 발생 시 handleSubmit이 가로채서 유효성 검사 후 onSubmit 실행 */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          
          {/* 
            네가 알려준 구조야! FormField가 라벨과 에러를 관리하고, 
            내부에 Input을 넣었어. error 객체가 내려가면 FormField가 알아서 빨간 글씨를 띄워줘!
          */}
          <FormField label="이메일" error={errors.email}>
            <Input
              type="email"
              placeholder="example@withday.com"
              {...register('email')} // 이 인풋의 이름은 'email'이야! (상태 추적)
              error={errors.email}   // 에러가 있으면 Input 컴포넌트 안의 clsx가 작동해서 테두리가 빨개짐
            />
          </FormField>

          <FormField label="비밀번호" error={errors.password}>
            <Input
              type="password"
              placeholder="8자리 이상 입력해주세요"
              {...register('password')}
              error={errors.password}
            />
          </FormField>

          <FormField label="닉네임" error={errors.nickname} helperText="모든 여행지에서 사용될 이름입니다.">
            <Input
              type="text"
              placeholder="멋진 닉네임을 지어주세요"
              {...register('nickname')}
              error={errors.nickname}
            />
          </FormField>

          <FormField label="생년월일" error={errors.birthday}>
            <Input
              type="date"
              {...register('birthday')}
              error={errors.birthday}
            />
          </FormField>

          {/* clsx 활용: 기본 버튼 스타일 + isPending이 true일 때만 loading 스타일 덮어씌우기 */}
          <button 
            type="submit" 
            disabled={mutation.isPending} // 로딩 중 버튼 클릭(따닥) 방지
            className={clsx(styles.submitButton, mutation.isPending && styles.loading)}
          >
            {mutation.isPending ? '가입하는 중...' : '회원가입 완료'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;