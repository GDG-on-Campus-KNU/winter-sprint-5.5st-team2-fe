import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearTokens } from '../api/client';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      admin: null,

      setAuth: (userData) =>
        set({
          isLoggedIn: true,
          user: userData,
          admin: userData?.role === 'ADMIN' ? userData : null,
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
