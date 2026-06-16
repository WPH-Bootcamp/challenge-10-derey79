import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      // Fungsi untuk menyimpan token & user setelah login/register sukses
      setAuth: (token, user) => set({ token, user, isLoggedIn: true }),

      // Fungsi untuk logout (membersihkan data)
      clearAuth: () => set({ token: null, user: null, isLoggedIn: false }),
    }),
    {
      name: 'restaurant-auth-storage', // Nama key di localStorage browser
    }
  )
);
