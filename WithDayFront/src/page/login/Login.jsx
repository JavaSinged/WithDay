import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import { loginSchema } from '../../features/auth/validation/authSchema';
import { loginUser } from '../../features/auth/api';
import FormField from '../../shared/ui/Form/FormField';
import { Input } from '../../shared/ui/Form/Form';
import Button from '../../shared/ui/Button/Button';
import styles from './Auth.module.css';

const Login = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onSubmit', 
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (token) => {
      alert('로그인 성공!');
      // TODO: 홈 화면으로 이동 로직 추가 예정
    },
    onError: (error) => {
      alert(`로그인 실패: ${error.response?.data || error.message}`);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>WithDay 로그인</h1>
          <p className={styles.subtitle}>당신의 여행 일정을 확인해보세요.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormField label="이메일" error={errors.email}>
            <Input type="email" placeholder="이메일을 입력하세요" {...register('email')} />
          </FormField>

          <FormField label="비밀번호" error={errors.password}>
            <Input type="password" placeholder="비밀번호를 입력하세요" {...register('password')} />
          </FormField>

          {/* 💡 로그인 버튼도 공통 Button으로 교체! */}
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            fullWidth 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </form>

        <p className={styles.linkText}>
          아직 계정이 없으신가요? <span onClick={() => navigate('/signup')}>회원가입하기</span>
        </p>
      </div>
    </div>
  );
};

export default Login;