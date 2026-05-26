import axios from "axios";
import { useAuthStore } from "../auth/store/authStore";
import { handleTokenAuthFailure } from "../../shared/lib/authSession";

const BASE_URL = import.meta.env.VITE_BACKSERVER;

export const api = axios.create({
  baseURL: `http://${BASE_URL}`,
});

// 인증에 필요한 토큰을 로그인 후 최신 토큰 반영
api.interceptors.request.use((config) => {
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

// 알림 개수 조회
export const getNotificationCount = async () => {
  // Authorization 헤더는 request interceptor가 최신 authStore 토큰으로 자동 주입한다.
  const response = await api.get("/notifications/count");

  return response.data;
};

// 알림 조회
export const getNotifications = async () => {
  const response = await api.get("/notifications");

  return response.data;
};

// 알림 읽음 처리
export const readNotification = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);

  return response.data;
};

// 알림 동의 여부 조회
export const getNotificationTerm = async (token) => {
  const response = await api.get("/notifications/notification-term", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 알림 삭제
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);

  return response.data;
};
