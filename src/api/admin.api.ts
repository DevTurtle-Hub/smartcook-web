import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface DashboardStatsResponse {
  kpis: {
    totalUsers: number;
    totalRecipes: number;
    totalIngredients: number;
    totalFridgeItems: number;
    aiScansToday: number;
    communityPosts: number;
  };
  userGrowth?: { _id: string; count: number }[];
  topRecipes?: any[];
  categoryDistribution?: { _id: string; count: number }[];
}

export interface AdminUsersResponse {
  users: Array<{
    _id?: string;
    id?: string;
    email: string;
    fullName: string;
    role: string;
    chefTitle?: string;
    chefLevel?: number;
    chefExp?: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
  }>;
  total: number;
  page: number;
  totalPages: number;
}

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStatsResponse> => {
    const res = await apiClient.get<ApiResponse<DashboardStatsResponse>>('/admin/dashboard');
    return res.data.data;
  },

  getUsers: async (params?: { page?: number; limit?: number; search?: string }): Promise<AdminUsersResponse> => {
    const res = await apiClient.get<ApiResponse<AdminUsersResponse>>('/admin/users', { params });
    return res.data.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean) => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/users/${userId}/status`, { isActive });
    return res.data.data;
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin') => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/users/${userId}/role`, { role });
    return res.data.data;
  },
};
