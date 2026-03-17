import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({ user: data, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post('/auth/register', { name, email, password });
          set({ user: data, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
