import axios from 'axios';

// Vite 환경 변수 활용. .env 파일의 VITE_BACKSERVER 값을 가져옴
const API_BASE_URL = `http://${import.meta.env.VITE_BACKSERVER}/api/users`;

// 회원가입 요청 API
export const signupUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/signup`, userData);
  return response.data;
};

// 로그인 요청 API
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_BASE_URL}/login`, loginData);
  return response.data; // 성공하면 백엔드에서 만든 JWT 토큰이 리턴될 거야!
};