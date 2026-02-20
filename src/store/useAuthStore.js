import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      admin:null,
      login: (userData) => set({ isLoggedIn: true, user: userData }),
      adminLogin:(adminData) => set({isLoggedIn: true,admin:adminData}),
      logout: () => {
        set({ isLoggedIn: false, user: null,admin:null });
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
