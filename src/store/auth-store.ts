import { create } from 'zustand';
import { User } from '@/types';
import { STORAGE_KEYS, ROLES } from '@/constants';
import api from '@/lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
  isAdmin: () => boolean;
  isWorker: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      set({ user, token, isAuthenticated: true });
      return true;
    } catch {
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === ROLES.ADMIN;
  },

  isWorker: () => {
    const { user } = get();
    return user?.role === ROLES.WORKER;
  },
}));
