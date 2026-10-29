import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
  setAccessToken: (accessToken: string) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

const getStoredAuth = () => {
  try {
    const userStr = localStorage.getItem('smartcook_user');
    const token = localStorage.getItem('smartcook_token');
    const refresh = localStorage.getItem('smartcook_refresh_token');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user && user.avatar && user.avatar.includes('unsplash.com')) {
      user.avatar = '';
    }
    return {
      user,
      accessToken: token,
      refreshToken: refresh,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
    };
  } catch {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }
};

const initialAuth = getStoredAuth();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialAuth.user,
  accessToken: initialAuth.accessToken,
  refreshToken: initialAuth.refreshToken,
  isAuthenticated: initialAuth.isAuthenticated,
  isAdmin: initialAuth.isAdmin,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('smartcook_user', JSON.stringify(user));
    localStorage.setItem('smartcook_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('smartcook_refresh_token', refreshToken);
    }
    set({
      user,
      accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
    });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem('smartcook_token', accessToken);
    set({ accessToken });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('smartcook_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('smartcook_refresh_token', refreshToken);
    }
    set((state) => ({
      accessToken,
      refreshToken: refreshToken || state.refreshToken,
    }));
  },

  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedFields };
      localStorage.setItem('smartcook_user', JSON.stringify(newUser));
      return {
        user: newUser,
        isAdmin: newUser.role === 'admin',
      };
    });
  },

  logout: () => {
    localStorage.removeItem('smartcook_user');
    localStorage.removeItem('smartcook_token');
    localStorage.removeItem('smartcook_refresh_token');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },
}));
