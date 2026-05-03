import * as yup from 'yup';

/* 
  [ yup의 역할 ]
  if문으로 일일이 length 검사, 정규식 검사를 할 필요 없이,
  데이터의 조건(모양)을 객체 형태로 선언만 해두면 알아서 검사해 주는 라이브러리야!
*/

// 1. 회원가입용 검사 규칙
export const signupSchema = yup.object().shape({
  email: yup.string().required('이메일은 필수 입력입니다.').email('올바른 이메일 형식이 아닙니다.'),
  password: yup.string().required('비밀번호는 필수 입력입니다.').min(8, '비밀번호는 최소 8자리 이상이어야 합니다.'),
  nickname: yup.string().required('닉네임을 입력해주세요.'),
  birthday: yup.string().required('생년월일을 선택해주세요.'),
  gender: yup.string().required('성별을 선택해주세요.'),
  phone: yup.string().required('전화번호를 입력해주세요.'),
  postcode: yup.string().required('우편번호를 검색해주세요.'),
  address: yup.string().required('주소를 입력해주세요.'),
  detailAddress: yup.string().required('상세 주소를 입력해주세요.'),
  // profile_image, Lat, Lng 등은 필수가 아니거나 숨겨진 값이므로 생략해도 됨
});

// 2. 로그인용 검사 규칙 (로그인은 이메일, 비번만 있으면 됨)
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.'),
    
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
});