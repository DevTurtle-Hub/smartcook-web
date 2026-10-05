import { apiClient } from './client';
import type { ApiResponse, AuthResponse, User } from '../types';



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
      if (err.response) {
        const errorMsg = err.response.data?.message || err.response.data?.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
        throw new Error(errorMsg);
      }
      throw new Error('Không thể kết nối đến máy chủ Backend (http://localhost:5000). Vui lòng kiểm tra và khởi động Backend.');
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
      throw new Error('Không thể kết nối đến máy chủ Backend (http://localhost:5000). Vui lòng kiểm tra và khởi động Backend.');
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
      throw new Error('Không thể kết nối đến máy chủ Backend (http://localhost:5000). Vui lòng kiểm tra và khởi động Backend.');
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
      throw new Error(err.response?.data?.message || 'Không thể lấy thông tin người dùng từ máy chủ.');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse<void>>('/auth/logout');
    } catch {
      // ignore network errors on logout
    }
  },

  updateProfile: async (data: { firstName?: string; lastName?: string; avatar?: string } | FormData): Promise<User> => {
    try {
      const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
      const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const res = await apiClient.put<ApiResponse<any>>('/auth/profile', data, { headers });
      const u = res.data.data;
      return {
        _id: u._id || u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: u.fullName || `${u.lastName || ''} ${u.firstName || ''}`.trim(),
        avatar: u.avatar,
        role: u.role === 'admin' ? 'admin' : 'user',
        chefExp: u.chefExp ?? 0,
        level: u.level || 'Tập sự',
        isActive: u.isActive ?? true,
        preferences: u.preferences,
      };
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Không thể cập nhật hồ sơ người dùng.');
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
      throw new Error(err.response?.data?.message || 'Không thể lưu khảo sát lên máy chủ.');
    }
  },
};

