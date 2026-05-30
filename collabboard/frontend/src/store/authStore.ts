import { create } from 'zustand';
import type { User } from '../types';

// Preset colors assigned to users as cursor colors
const CURSOR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
];

let colorIndex = 0;
const getNextColor = () => CURSOR_COLORS[colorIndex++ % CURSOR_COLORS.length];

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setUser: (user: User, token: string) => void;
  setGuest: (username: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },

  setGuest: (username) => {
    const guestUser: User = {
      id: `guest_${Math.random().toString(36).slice(2, 9)}`,
      username,
      email: '',
      avatar: '',
      color: getNextColor(),
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    set({ user: guestUser, token: null, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));