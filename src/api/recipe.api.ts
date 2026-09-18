import { apiClient } from './client';
import type { ApiResponse, Recipe } from '../types';

export const recipeApi = {
  getRecipes: async (params?: { page?: number; limit?: number; category?: string; search?: string; difficulty?: string }) => {
    try {
      const res = await apiClient.get<ApiResponse<{ recipes: Recipe[]; total: number; page: number; totalPages: number }>>('/recipes', { params });
      return res.data.data;
    } catch {
      return { recipes: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  getRecipeById: async (id: string) => {
    try {
      const res = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      const res = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/recipes/${id}/favorite`);
      return res.data.data;
    } catch {
      return { isFavorite: true };
    }
  },

  getFridgeMatch: async () => {
    try {
      const res = await apiClient.get<ApiResponse<any>>('/recipes/fridge-match');
      return res.data.data;
    } catch {
      return { recipes: [] };
    }
  },
};
