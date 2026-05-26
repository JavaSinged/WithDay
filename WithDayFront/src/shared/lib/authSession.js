import { useAuthStore } from "../../features/auth/store/authStore";

/*
 * 여러 axios 인스턴스가 동시에 401을 받더라도 로그아웃/리다이렉트는 한 번만 실행되게 막는다.
 * 만료 토큰 상태에서는 Header refetch, 팝오버 조회 등 인증 요청이 연달아 붙을 수 있어 중복 이동 방지가 필요하다.
 */
let isHandlingAuthFailure = false;

const AUTH_ERROR_CODES = new Set(["TOKEN_EXPIRED", "INVALID_TOKEN"]);

export const isTokenAuthFailure = (error) => {
  const status = error?.response?.status;
  const code = error?.response?.data?.code;

  return status === 401 && AUTH_ERROR_CODES.has(code);
};

export const handleTokenAuthFailure = (error) => {
  if (!isTokenAuthFailure(error) || isHandlingAuthFailure) {
    return false;
  }

  isHandlingAuthFailure = true;

  useAuthStore.getState().setLogout();

  /*
   * React Router 바깥 일반 JS 모듈에서도 동작해야 하므로 window.location을 사용한다.
   * replace를 쓰면 만료된 상태의 이전 페이지로 뒤로가기가 반복되는 문제를 줄일 수 있다.
   */
  window.location.replace("/login");
  return true;
};
