import { apiClient } from './client';
import type { ApiResponse, Recipe } from '../types';

export const recipeApi = {
  getRecipes: async (params?: { page?: number; limit?: number; category?: string; search?: string; difficulty?: string }) => {
    const res = await apiClient.get<ApiResponse<{ recipes: Recipe[]; total: number; page: number; totalPages: number }>>('/recipes', { params });
    return res.data.data;
  },

  getRecipeById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`);
    return res.data.data;
  },

  toggleFavorite: async (id: string) => {
    const res = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/recipes/${id}/favorite`);
    return res.data.data;
  },

  getFridgeMatch: async () => {
    const res = await apiClient.get<ApiResponse<any>>('/recipes/fridge-match');
    return res.data.data;
  },
};
