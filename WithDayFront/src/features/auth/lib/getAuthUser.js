import { AUTH_STORAGE_KEY } from "../store/authStore";

const isRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeAuthUser = (value) => {
  if (!isRecord(value)) {
    return null;
  }

  const candidate = isRecord(value.user) ? value.user : value;
  const email = typeof candidate.email === "string" ? candidate.email.trim() : "";

  if (!email) {
    return null;
  }

  return {
    ...candidate,
    email,
  };
};

export const getAuthUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    const candidates = [
      parsedValue?.state?.user,
      parsedValue?.user,
      parsedValue,
    ];

    for (const candidate of candidates) {
      const normalizedUser = normalizeAuthUser(candidate);

      if (normalizedUser) {
        return normalizedUser;
      }
    }
  } catch {
    return null;
  }

  return null;
};
