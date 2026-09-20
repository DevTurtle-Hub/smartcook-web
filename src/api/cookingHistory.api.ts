import { apiClient } from './client';
import type { ApiResponse, User } from '../types';

export interface CookingRecordDTO {
  _id: string;
  userId: string;
  recipeId: any;
  notes?: string;
  rating?: number;
  image?: string;
  cookedAt: string;
}

export interface CookingSessionResponse {
  cookingHistory: CookingRecordDTO;
  user: User;
  xpEarned: number;
}

export const cookingHistoryApi = {
  completeCookingSession: async (
    recipeId: string,
    recipeName?: string,
    durationMinutes?: number,
    notes?: string
  ): Promise<CookingSessionResponse> => {
    try {
      const res = await apiClient.post<ApiResponse<any>>('/cooking-history', {
        recipeId,
        recipeName: recipeName || 'Món ngon SmartCook',
        durationMinutes: durationMinutes || 20,
        servings: 2,
        notes: notes || 'Hoàn thành nấu món trên SmartCook Web',
      });
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] completeCookingSession fallback:', err.message);
      return {
        cookingHistory: {
          _id: 'mock-hist-' + Date.now(),
          userId: 'mock-user',
          recipeId,
          notes,
          cookedAt: new Date().toISOString(),
        },
        user: {
          _id: 'mock-user',
          email: 'user@smartcook.com',
          firstName: 'Minh',
          lastName: 'Nguyễn',
          role: 'user',
          chefExp: 200,
          level: 'Đầu bếp tài ba',
          isActive: true,
        },
        xpEarned: 50,
      };
    }
  },

  getMyCookingHistory: async (): Promise<CookingRecordDTO[]> => {
    try {
      const res = await apiClient.get<ApiResponse<CookingRecordDTO[]>>('/cooking-history');
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getMyCookingHistory fallback:', err.message);
      return [];
    }
  },
};
