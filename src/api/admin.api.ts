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

export interface ModerationReportApiItem {
  id: string;
  _id?: string;
  targetType: 'post' | 'comment' | 'recipe' | 'user';
  targetId: string;
  reporterId?: any;
  reporterName?: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed' | 'action_taken';
  targetPreview?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  reportedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SystemSettingsData {
  appName: string;
  appVersion: string;
  geminiApiKey: string;
  cloudinaryName: string;
  pushServiceKey: string;
  visionEndpoint: string;
}

export interface AIEngineConfigData {
  systemPrompt: string;
  personaTone?: string;
  selectedModel: string;
  quickPrompts: string[];
  visionConfidenceThreshold: number;
  maxIngredientsPerScan: number;
  enableBoundingBoxes: boolean;
}

export interface AIEngineStatusData {
  status: 'ready' | 'degraded' | 'unavailable';
  model: string;
  latencyMs: number;
  connected: boolean;
  provider: string;
  timestamp: string;
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

  getReports: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    targetType?: string;
  }): Promise<{ reports: ModerationReportApiItem[]; total: number; page: number; totalPages: number }> => {
    const res = await apiClient.get<any>('/admin/reports', { params });
    return {
      reports: res.data.data || [],
      total: res.data.pagination?.total || (res.data.data?.length ?? 0),
      page: res.data.pagination?.page || 1,
      totalPages: res.data.pagination?.totalPages || 1,
    };
  },

  resolveReport: async (
    reportId: string,
    body: {
      status: 'resolved' | 'dismissed';
      resolutionNotes?: string;
      action?: 'hide' | 'delete' | 'ban';
    }
  ) => {
    const res = await apiClient.patch<ApiResponse<any>>(`/admin/reports/${reportId}`, body);
    return res.data.data;
  },

  getSystemSettings: async (): Promise<SystemSettingsData> => {
    const res = await apiClient.get<ApiResponse<SystemSettingsData>>('/admin/settings');
    return res.data.data;
  },

  updateSystemSettings: async (data: Partial<SystemSettingsData>): Promise<SystemSettingsData> => {
    const res = await apiClient.patch<ApiResponse<SystemSettingsData>>('/admin/settings', data);
    return res.data.data;
  },

  getAIEngineConfig: async (): Promise<AIEngineConfigData> => {
    const res = await apiClient.get<ApiResponse<AIEngineConfigData>>('/admin/ai-engine/config');
    return res.data.data;
  },

  updateAIEngineConfig: async (data: Partial<AIEngineConfigData>): Promise<AIEngineConfigData> => {
    const res = await apiClient.patch<ApiResponse<AIEngineConfigData>>('/admin/ai-engine/config', data);
    return res.data.data;
  },

  getAIEngineStatus: async (): Promise<AIEngineStatusData> => {
    const res = await apiClient.get<ApiResponse<AIEngineStatusData>>('/admin/ai-engine/status');
    return res.data.data;
  },
};
