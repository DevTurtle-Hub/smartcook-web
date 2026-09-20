import { apiClient } from './client';
import type { ApiResponse, Recipe } from '../types';

export interface RecipesListResponse {
  recipes: Recipe[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FridgeMatchResult {
  recipe: Recipe;
  matchScore: number;
  matchingIngredientsCount: number;
  totalIngredientsCount: number;
  missingIngredients: string[];
}

export const recipeApi = {
  getRecipes: async (params?: { page?: number; limit?: number; category?: string; search?: string; difficulty?: string }): Promise<RecipesListResponse> => {
    try {
      const res = await apiClient.get<ApiResponse<RecipesListResponse>>('/recipes', { params });
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getRecipes error:', err.message);
      return { recipes: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  getRecipeById: async (id: string): Promise<Recipe | null> => {
    try {
      const res = await apiClient.get<ApiResponse<Recipe>>(`/recipes/${id}`);
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getRecipeById error:', err.message);
      return null;
    }
  },

  toggleFavorite: async (id: string): Promise<{ isFavorite: boolean }> => {
    try {
      const res = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/recipes/${id}/favorite`);
      return res.data.data;
    } catch {
      return { isFavorite: true };
    }
  },

  getFridgeMatch: async (): Promise<{ recipes: FridgeMatchResult[] }> => {
    try {
      const res = await apiClient.get<ApiResponse<{ recipes: FridgeMatchResult[] }>>('/recipes/fridge-match');
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getFridgeMatch error:', err.message);
      return { recipes: [] };
    }
  },

  createRecipe: async (formData: FormData): Promise<Recipe> => {
    const res = await apiClient.post<ApiResponse<Recipe>>('/recipes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  updateRecipe: async (id: string, formData: FormData): Promise<Recipe> => {
    const res = await apiClient.put<ApiResponse<Recipe>>(`/recipes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  deleteRecipe: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/recipes/${id}`);
  },
};

