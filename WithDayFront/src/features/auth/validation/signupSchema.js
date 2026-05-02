import * as yup from 'yup';

/*
  [ yup 라이브러리의 역할 ]
  if (password.length < 8) { alert('에러') } 같은 복잡한 if문들을 쓸 필요 없이,
  데이터의 "모양(shape)"과 "조건(규칙)"을 한눈에 알아보기 쉽게 정의해 주는 도구야.
*/
export const signupSchema = yup.object().shape({
  email: yup
    .string()
    .required('이메일은 필수 입력입니다.') // 값을 아예 안 적었을 때 뱉는 에러
    .email('올바른 이메일 형식이 아닙니다.'), // 값은 있는데 이메일 형태(xx@xx.com)가 아닐 때

  password: yup
    .string()
    .required('비밀번호는 필수 입력입니다.')
    .min(8, '비밀번호는 최소 8자리 이상이어야 합니다.'), // 글자 수 제한

  nickname: yup
    .string()
    .required('닉네임을 입력해주세요.'),

  birthday: yup
    .string()
    .required('생년월일을 선택해주세요.')
});