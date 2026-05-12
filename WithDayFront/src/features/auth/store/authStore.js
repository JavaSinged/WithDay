import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const AUTH_STORAGE_KEY = 'auth-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      setLogin: (token, userData) =>
        set({
          token,
          user: userData ?? null,
          isLoggedIn: Boolean(token && userData?.email),
        }),

      setLogout: () =>
        set({
          token: null,
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
    }
  )
);
