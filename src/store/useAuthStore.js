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
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
