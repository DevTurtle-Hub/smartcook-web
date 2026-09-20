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

const normalizeAuthResponse = (raw: any): AuthResponse => {
  if (!raw) {
    throw new Error('Không nhận được dữ liệu phản hồi từ máy chủ.');
  }

  const rawUser = raw.user || raw;
  const user: User = {
    _id: rawUser._id || rawUser.id || 'usr-' + Date.now(),
    email: rawUser.email || '',
    firstName: rawUser.firstName || '',
    lastName: rawUser.lastName || '',
    fullName: rawUser.fullName || `${rawUser.lastName || ''} ${rawUser.firstName || ''}`.trim(),
    avatar: rawUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: rawUser.role === 'admin' ? 'admin' : 'user',
    chefExp: rawUser.chefExp ?? 0,
    level: rawUser.level || 'Tập sự',
    isActive: rawUser.isActive ?? true,
    preferences: rawUser.preferences,
  };

  const accessToken = raw.tokens?.accessToken || raw.accessToken || '';
  const refreshToken = raw.tokens?.refreshToken || raw.refreshToken || '';

  return {
    user,
    accessToken,
    refreshToken,
    tokens: {
      accessToken,
      refreshToken,
      expiresIn: raw.tokens?.expiresIn || '7d',
    },
  };
};

export const authApi = {
  login: async (credentials: { email: string; password?: string }): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>('/auth/login', credentials);
      return normalizeAuthResponse(res.data.data);
    } catch (err: any) {
      // If backend responded with an error (e.g., 400, 401, 403, 404), throw it so user gets feedback
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
        throw new Error(errorMsg);
      }

      // If backend server is completely offline / network error, fallback to standalone dev mode
      console.warn('[SmartCook Web] Backend unreachable. Falling back to Standalone Mock Mode for development:', err.message);
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
      const res = await apiClient.post<ApiResponse<any>>('/auth/google', { idToken });
      return normalizeAuthResponse(res.data.data);
    } catch (err: any) {
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Đăng nhập Google thất bại.';
        throw new Error(errorMsg);
      }
      console.warn('[SmartCook Web] Google Auth fallback to mock:', err.message);
      return {
        user: MOCK_USER,
        accessToken: 'mock_jwt_google_access_token',
        refreshToken: 'mock_jwt_google_refresh_token',
      };
    }
  },

  register: async (data: { email: string; password?: string; firstName: string; lastName: string }): Promise<AuthResponse> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>('/auth/register', data);
      return normalizeAuthResponse(res.data.data);
    } catch (err: any) {
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Đăng ký tài khoản không thành công.';
        throw new Error(errorMsg);
      }
      console.warn('[SmartCook Web] Backend unreachable. Fallback register:', err.message);
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

  getMe: async (): Promise<User> => {
    try {
      const res = await apiClient.get<ApiResponse<any>>('/auth/me');
      const u = res.data.data;
      return {
        _id: u._id || u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: u.fullName || `${u.lastName || ''} ${u.firstName || ''}`.trim(),
        avatar: u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: u.role === 'admin' ? 'admin' : 'user',
        chefExp: u.chefExp ?? 0,
        level: u.level || 'Tập sự',
        isActive: u.isActive ?? true,
        preferences: u.preferences,
      };
    } catch (err: any) {
      console.warn('[SmartCook Web] getMe error, using local/mock user');
      return MOCK_USER;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout');
    } catch {
      // ignore network errors on logout
    }
  },

  updateSurvey: async (preferences: any): Promise<User> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>('/auth/survey', preferences);
      const u = res.data.data;
      return {
        ...u,
        _id: u._id || u.id,
      };
    } catch (err: any) {
      console.warn('[SmartCook Web] updateSurvey error, saving locally');
      return { ...MOCK_USER, preferences };
    }
  },
};

