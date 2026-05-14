import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKSERVER;

export const api = axios.create({
  baseURL: `http://${BASE_URL}`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchScheduleDetail = async (scheduleId) => {
  const { data } = await api.get(`/schedules/${scheduleId}`);

  if (import.meta.env.DEV) {
    console.debug("[schedule-detail] response", data);
  }

  return data;
};

export const fetchSchedules = async ({ category, keyword }) => {
  const params = {};

  // 🌟 "all"이 아닐 때만 백엔드로 카테고리 파라미터를 보냄
  if (category && category !== "all") {
    params.category = category;
  }

  if (keyword) {
    params.keyword = keyword;
  }

  const { data } = await api.get("/schedules", { params });
  console.log("API 응답 데이터:", data); // 디버깅용 로그
  return data;
};

export const insertSchedule = async (post, images, detailSchedule) => {
  const formData = new FormData();

  const formatDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // 시간 초기화
    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  // 날짜 변환
  const convertedPost = {
    ...post,
    startDate: formatDate(post.startDate),
    endDate: formatDate(post.endDate),
    recruitStartDate: formatDate(post.recruitStartDate),
    recruitEndDate: formatDate(post.recruitEndDate),
  };

  console.log(post);
  console.log(images);
  console.log(detailSchedule);

  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          schedule: convertedPost,
          detailSchedule: detailSchedule,
          email: post.email,
        }),
      ],
      { type: "application/json" },
    ),
  );

  // 이미지파일 넣음
  images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await api.post("/schedules", formData);

  return response.data;
};

export const updateSchedule = async (
  scheduleId,
  post,
  images,
  detailSchedule,
  deletedImageIds,
) => {
  const formData = new FormData();

  const formatDate = (date) => {
    if (!date) return null;

    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) return null;

    d.setHours(0, 0, 0, 0);

    return d.toISOString().slice(0, 19).replace("T", " ");
  };

  // 날짜 변환
  const convertedPost = {
    ...post,
    startDate: formatDate(post.startDate),
    endDate: formatDate(post.endDate),
    recruitStartDate: formatDate(post.recruitStartDate),
    recruitEndDate: formatDate(post.recruitEndDate),
  };

  formData.append(
    "data",
    new Blob(
      [
        JSON.stringify({
          schedule: convertedPost,
          detailSchedule,
          deletedImageIds,
          email: post.email,
        }),
      ],
      { type: "application/json" },
    ),
  );

  // 새 파일만 들어있음
  images.forEach((file) => {
    formData.append("images", file);
  });

  console.log(images);

  const response = await api.put(`/schedules/${scheduleId}`, formData);

  return response.data;
};

export const deleteSchedule = async (scheduleId) => {
  const response = await api.delete(`/schedules/${scheduleId}`);

  return response.data;
};
