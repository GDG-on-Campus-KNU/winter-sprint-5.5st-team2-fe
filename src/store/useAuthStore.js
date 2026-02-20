import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: true,
      user: null,
      login: (userData) => set({ isLoggedIn: true, user: userData }),
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
