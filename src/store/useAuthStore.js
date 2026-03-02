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
      admin: null,
      setAuth: (userData) =>
        set((state) => {
          const normalizedUser = normalizeUser(
            userData ?? {},
            state.user ?? {},
          );
          return {
            isLoggedIn: true,
            user: normalizedUser,
            admin: normalizedUser?.role === 'ADMIN' ? normalizedUser : null,
          };
        }),

      adminLogin: (adminData) => set({ admin: adminData }),

      logout: () => {
        clearTokens();
        set({
          isLoggedIn: false,
          user: null,
          admin: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
