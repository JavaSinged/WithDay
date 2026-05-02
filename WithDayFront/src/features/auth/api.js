import axios from 'axios';

// Vite 환경에서는 process.env 대신 import.meta.env를 사용해!
// .env 파일에 VITE_BACKSERVER=localhost:10400 이라고 적혀있어야 정상 작동해[cite: 7].
const API_BASE_URL = `http://${import.meta.env.VITE_BACKSERVER}/api/users`;

// 이 함수는 나중에 React Query의 useMutation이 호출할 거야.
export const signupUser = async (userData) => {
  // axios.post(주소, 보낼데이터) 형식이야.
  const response = await axios.post(`${API_BASE_URL}/signup`, userData);
  return response.data; // 성공 시 백엔드에서 보낸 문자열("회원가입이 완료되었습니다.") 반환
};