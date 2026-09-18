import { apiClient } from './client';
import type { ApiResponse, AuthResponse, User } from '../types';

// Standalone Mock Users for Frontend Development without Backend
const MOCK_ADMIN: User = {
  _id: 'mock-admin-id',
  email: 'admin@smartcook.com',
  firstName: 'Quản Trị',
  lastName: 'Hệ Thống',
  fullName: 'Quản Trị Viên SmartCook',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  role: 'admin',
  chefExp: 999,
  level: 'Bếp trưởng',
  isActive: true,
  preferences: {
    hasCompletedSurvey: true,
    portion: '3-4',
    cuisines: ['vietnamese', 'healthy'],
    healthGoal: 'healthy',
    restrictions: [],
    tasteProfile: ['dam-da'],
    cookingTime: 'medium',
  },
};

const MOCK_USER: User = {
  _id: 'mock-user-id',
  email: 'user@smartcook.com',
  firstName: 'Minh',
  lastName: 'Nguyễn',
  fullName: 'Nguyễn Văn Minh',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  role: 'user',
  chefExp: 150,
  level: 'Bếp gia đình',
  isActive: true,
  preferences: {
    hasCompletedSurvey: true,
    portion: '3-4',
    cuisines: ['vietnamese', 'asian'],
    healthGoal: 'healthy',
    restrictions: [],
    tasteProfile: ['thanh-dam'],
    cookingTime: 'quick',
  },
};

export const authApi = {
  login: async (credentials: { email: string; password?: string }): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return res.data.data;
    } catch (err: any) {
      // Standalone Frontend Mode Fallback (Allows teammates to test without running backend)
      console.warn('[SmartCook Web] Backend unreachable or auth error. Falling back to Standalone Mock Mode for development:', err.message);

      const isEmailAdmin = credentials.email.toLowerCase().includes('admin');
      const targetUser = isEmailAdmin ? MOCK_ADMIN : { ...MOCK_USER, email: credentials.email };

      return {
        user: targetUser,
        accessToken: 'mock_jwt_access_token_standalone_mode',
        refreshToken: 'mock_jwt_refresh_token_standalone_mode',
        tokens: {
          accessToken: 'mock_jwt_access_token_standalone_mode',
          refreshToken: 'mock_jwt_refresh_token_standalone_mode',
          expiresIn: '7d',
        },
      };
    }
  },

  googleLogin: async (idToken: string): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', { idToken });
      return res.data.data;
    } catch {
      return {
        user: MOCK_USER,
        accessToken: 'mock_jwt_google_access_token',
        refreshToken: 'mock_jwt_google_refresh_token',
      };
    }
  },

  register: async (data: { email: string; password?: string; firstName: string; lastName: string }): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return res.data.data;
    } catch {
      const newUser: User = {
        _id: 'mock-reg-id-' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.lastName} ${data.firstName}`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        role: 'user',
        chefExp: 50,
        level: 'Tập sự',
        isActive: true,
      };
      return {
        user: newUser,
        accessToken: 'mock_jwt_reg_access_token',
        refreshToken: 'mock_jwt_reg_refresh_token',
      };
    }
  },

  getMe: async () => {
    try {
      const res = await apiClient.get<ApiResponse<User>>('/auth/me');
      return res.data.data;
    } catch {
      return MOCK_USER;
    }
  },

  logout: async () => {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout');
    } catch {
      // ignore
    }
  },

  updateSurvey: async (preferences: any) => {
    try {
      const res = await apiClient.post<ApiResponse<User>>('/auth/survey', preferences);
      return res.data.data;
    } catch {
      return { ...MOCK_USER, preferences };
    }
  },
};
