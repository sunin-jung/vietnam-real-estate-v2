import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      username: null,
      login: (username: string) => {
        set({ isLoggedIn: true, username });
        // 로컬 스토리지에 토큰이 있는지 확인
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('admin-token');
          if (!token) {
            localStorage.setItem('admin-token', 'admin-token-123');
          }
        }
      },
      logout: () => {
        set({ isLoggedIn: false, username: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin-token');
        }
      },
      initialize: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('admin-token');
          if (token === 'admin-token-123') {
            set({ isLoggedIn: true, username: 'admin' });
          }
        }
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ 
        isLoggedIn: state.isLoggedIn, 
        username: state.username 
      }),
    }
  )
); 