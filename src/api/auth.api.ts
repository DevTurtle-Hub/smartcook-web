import { apiClient } from './client';
import type { ApiResponse, AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password?: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return res.data.data;
  },

  googleLogin: async (idToken: string) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/google', { idToken });
    return res.data.data;
  },

  register: async (data: { email: string; password?: string; firstName: string; lastName: string }) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data.data;
  },

  logout: async () => {
    const res = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return res.data;
  },

  updateSurvey: async (preferences: any) => {
    const res = await apiClient.post<ApiResponse<User>>('/auth/survey', preferences);
    return res.data.data;
  },
};
