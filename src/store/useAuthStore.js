import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearTokens } from '../api/client';

const normalizeUser = (userData = {}, prevUser = {}) => {
  const mergedUser = { ...prevUser, ...userData };
  const normalizedName =
    mergedUser.userName ??
    mergedUser.name ??
    prevUser.userName ??
    prevUser.name;

  return {
    ...mergedUser,
    userName: normalizedName ?? '',
    name: normalizedName ?? '',
  };
};

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setAuth: (userData) =>
        set((state) => ({
          isLoggedIn: true,
          user: normalizeUser(userData ?? {}, state.user ?? {}),
        })),
      logout: () => {
        clearTokens();
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
