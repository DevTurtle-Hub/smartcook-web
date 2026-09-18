import { apiClient } from './client';
import type { ApiResponse } from '../types';

export const adminApi = {
  getDashboardStats: async () => {
    const res = await apiClient.get<ApiResponse<any>>('/admin/dashboard');
    return res.data.data;
  },

  getUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await apiClient.get<ApiResponse<any>>('/admin/users', { params });
    return res.data.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean) => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/users/${userId}/status`, { isActive });
    return res.data.data;
  },
};
