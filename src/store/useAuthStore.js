import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { clearTokens } from '../api/client';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      setAuth: (userData) => set({ isLoggedIn: true, user: userData }),
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
