import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import storage from '../../core/storage';

import type { AuthState } from './authStore.types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: '@petradar:auth',
      storage: createJSONStorage(() => storage),
    }
  )
);
