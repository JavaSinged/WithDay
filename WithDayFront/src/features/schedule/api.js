import axios from "axios";

// 🔥 기본 인스턴스 (JSON용)
export const api = axios.create({
  baseURL: `http://${import.meta.env.VITE_BACKSERVER}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 multipart 전용 인스턴스 생성
const multipartApi = axios.create({
  baseURL: `http://${import.meta.env.VITE_BACKSERVER}`,
  // Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 설정)
});

export const insertSchedule = async (post, files, detailSchedule) => {
  const formData = new FormData();

  formData.append(
    "postData",
    new Blob([JSON.stringify(post)], { type: "application/json" })
  );

  formData.append(
    "detailSchedule",
    new Blob([JSON.stringify(detailSchedule)], {
      type: "application/json",
    })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("images", file);
    });
  }

  console.log("=== FormData 내용 확인 ===");
  for (let [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      console.log(`${key}:`, value.type, value.size + " bytes");
    } else if (value instanceof File) {
      console.log(`${key}:`, value.name, value.type, value.size + " bytes");
    }
  }

  try {
    // 🔥 multipartApi 사용 + headers 설정 없음
    const response = await multipartApi.post("/schedules/insert-schedule", formData);

    console.log("✅ 응답 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 에러 발생:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Headers:", error.response?.headers);
    throw error;
  }
};