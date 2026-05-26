import axios from "axios";
import { useAuthStore } from "../../features/auth/store/authStore";
import { handleTokenAuthFailure } from "./authSession";

const BASE_URL = import.meta.env.VITE_BACKSERVER;

export const api = axios.create({
  baseURL: `http://${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  /*
   * participation API는 local/session storage를 혼용할 수 있으므로
   * localStorage 직접 조회 대신 authStore를 단일 진실 공급원으로 사용한다.
   */
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleTokenAuthFailure(error);
    return Promise.reject(error);
  },
);
