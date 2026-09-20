import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface FridgeItemDTO {
  _id?: string;
  id?: string;
  name: string;
  amount?: string;
  category?: string;
  storageLocation?: 'chilled' | 'frozen' | 'pantry';
  expiryDate?: string | Date;
  note?: string;
  addedAt?: string | Date;
}

export interface FridgeResponse {
  _id: string;
  userId: string;
  items: FridgeItemDTO[];
  updatedAt: string;
}

// Fallback initial fridge state for development/offline
const MOCK_FRIDGE_ITEMS: FridgeItemDTO[] = [
  { id: 'f-1', name: 'Trứng gà', amount: '4 quả', category: 'Trứng & Đậu hũ', storageLocation: 'chilled', note: 'Trứng gà ta Ba Huân' },
  { id: 'f-2', name: 'Cà chua', amount: '3 quả', category: 'Rau củ', storageLocation: 'chilled', note: 'Cà chua Đà Lạt' },
  { id: 'f-3', name: 'Hành lá', amount: '1 bó', category: 'Gia vị & Rau thơm', storageLocation: 'chilled' },
  { id: 'f-4', name: 'Thịt heo xay', amount: '300g', category: 'Thịt', storageLocation: 'frozen', note: 'CP Meat' },
  { id: 'f-5', name: 'Đậu phụ non', amount: '1 hộp', category: 'Trứng & Đậu hũ', storageLocation: 'chilled' },
  { id: 'f-6', name: 'Tỏi & Hành khô', amount: '5 củ', category: 'Gia vị & Rau thơm', storageLocation: 'pantry' },
];

let localMockFridge = [...MOCK_FRIDGE_ITEMS];

export const fridgeApi = {
  getMyFridge: async (): Promise<FridgeItemDTO[]> => {
    try {
      const res = await apiClient.get<ApiResponse<FridgeResponse>>('/fridge/my-fridge');
      return res.data.data.items.map((it: any) => ({
        ...it,
        id: it._id || it.id,
      }));
    } catch (err: any) {
      console.warn('[SmartCook Web] getMyFridge fallback to local state:', err.message);
      return localMockFridge;
    }
  },

  addItem: async (item: {
    name: string;
    amount?: string;
    category?: string;
    storageLocation?: 'chilled' | 'frozen' | 'pantry';
    expiryDate?: string;
    note?: string;
  }): Promise<FridgeItemDTO[]> => {
    try {
      const res = await apiClient.post<ApiResponse<FridgeResponse>>('/fridge/items', item);
      return res.data.data.items.map((it: any) => ({
        ...it,
        id: it._id || it.id,
      }));
    } catch (err: any) {
      console.warn('[SmartCook Web] addItem fallback to local state:', err.message);
      const newItem: FridgeItemDTO = {
        id: 'mock-' + Date.now(),
        ...item,
        addedAt: new Date().toISOString(),
      };
      localMockFridge = [newItem, ...localMockFridge];
      return localMockFridge;
    }
  },

  updateItem: async (
    itemId: string,
    updates: Partial<FridgeItemDTO>
  ): Promise<FridgeItemDTO[]> => {
    try {
      const res = await apiClient.put<ApiResponse<FridgeResponse>>(`/fridge/items/${itemId}`, updates);
      return res.data.data.items.map((it: any) => ({
        ...it,
        id: it._id || it.id,
      }));
    } catch (err: any) {
      console.warn('[SmartCook Web] updateItem fallback to local state:', err.message);
      localMockFridge = localMockFridge.map((it) =>
        (it.id === itemId || it._id === itemId) ? { ...it, ...updates } : it
      );
      return localMockFridge;
    }
  },

  removeItem: async (itemId: string): Promise<FridgeItemDTO[]> => {
    try {
      const res = await apiClient.delete<ApiResponse<FridgeResponse>>(`/fridge/items/${itemId}`);
      return res.data.data.items.map((it: any) => ({
        ...it,
        id: it._id || it.id,
      }));
    } catch (err: any) {
      console.warn('[SmartCook Web] removeItem fallback to local state:', err.message);
      localMockFridge = localMockFridge.filter((it) => it.id !== itemId && it._id !== itemId);
      return localMockFridge;
    }
  },

  clearFridge: async (): Promise<void> => {
    try {
      await apiClient.delete<ApiResponse<void>>('/fridge/clear');
    } catch (err: any) {
      console.warn('[SmartCook Web] clearFridge fallback:', err.message);
    } finally {
      localMockFridge = [];
    }
  },
};
