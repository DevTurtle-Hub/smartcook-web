import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface CategoryDTO {
  _id: string;
  name: string;
  code: string;
  icon?: string;
  description?: string;
  itemCount?: number;
}

export interface IngredientDTO {
  _id: string;
  name: string;
  category: string;
  commonUnits: string[];
  shelfLifeDays?: number;
  storageInstructions?: string;
  nutritionPer100g?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

const MOCK_CATEGORIES: CategoryDTO[] = [
  { _id: 'cat-1', name: 'Món Xào', code: 'mon-xao', icon: '🍲', description: 'Các món xào thanh đậm, nhanh gọn' },
  { _id: 'cat-2', name: 'Món Canh', code: 'mon-canh', icon: '🥣', description: 'Canh thanh mát, canh súp bồi bổ' },
  { _id: 'cat-3', name: 'Món Kho', code: 'mon-kho', icon: '🥘', description: 'Kho đậm đà chuẩn vị gia đình' },
  { _id: 'cat-4', name: 'Món Nướng', code: 'mon-nuong', icon: '🍖', description: 'Món nướng thơm lừng cuối tuần' },
  { _id: 'cat-5', name: 'Món Chay', code: 'mon-chay', icon: '🥗', description: 'Ăn chay lành mạnh, thanh lọc' },
  { _id: 'cat-6', name: 'Eat Clean & Healthy', code: 'eat-clean', icon: '🥑', description: 'Kiểm soát calo, giàu protein' },
];

export const ingredientApi = {
  getCategories: async (): Promise<CategoryDTO[]> => {
    try {
      const res = await apiClient.get<ApiResponse<CategoryDTO[]>>('/categories');
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getCategories fallback:', err.message);
      return MOCK_CATEGORIES;
    }
  },

  getIngredients: async (params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<IngredientDTO[]> => {
    try {
      const res = await apiClient.get<ApiResponse<IngredientDTO[]>>('/ingredients', { params });
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getIngredients fallback:', err.message);
      return [];
    }
  },

  createIngredient: async (data: Partial<IngredientDTO>): Promise<IngredientDTO> => {
    const res = await apiClient.post<ApiResponse<IngredientDTO>>('/ingredients', data);
    return res.data.data;
  },

  updateIngredient: async (id: string, data: Partial<IngredientDTO>): Promise<IngredientDTO> => {
    const res = await apiClient.put<ApiResponse<IngredientDTO>>(`/ingredients/${id}`, data);
    return res.data.data;
  },

  deleteIngredient: async (id: string): Promise<void> => {
    await apiClient.delete<ApiResponse<void>>(`/ingredients/${id}`);
  },
};
