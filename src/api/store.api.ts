import { apiClient } from './client';
import type { ApiResponse } from '../types';

export interface StoreItem {
  id: string;
  name: string;
  brand: string;
  address: string;
  openHours: string;
  phone?: string;
  logo?: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  formattedDistance?: string;
  travelTimeMotoMinutes?: number;
  travelTimeWalkMinutes?: number;
}

export const storeApi = {
  getNearbyStores: async (
    lat: number,
    lng: number,
    radiusKm: number = 20,
    limit: number = 10
  ): Promise<StoreItem[]> => {
    try {
      const res = await apiClient.get<ApiResponse<StoreItem[]>>('/stores/nearby', {
        params: { lat, lng, radiusKm, limit },
      });
      return res.data.data || [];
    } catch (err: any) {
      console.warn('[SmartCook Web] getNearbyStores error:', err.message);
      throw err;
    }
  },

  getAllStores: async (): Promise<StoreItem[]> => {
    try {
      const res = await apiClient.get<ApiResponse<StoreItem[]>>('/stores');
      return res.data.data || [];
    } catch (err: any) {
      console.warn('[SmartCook Web] getAllStores error:', err.message);
      return [];
    }
  },

  getStoreById: async (id: string): Promise<StoreItem | null> => {
    try {
      const res = await apiClient.get<ApiResponse<StoreItem>>(`/stores/${id}`);
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] getStoreById error:', err.message);
      return null;
    }
  },

  createStore: async (data: {
    name: string;
    brand: string;
    address: string;
    latitude: number;
    longitude: number;
    openHours?: string;
    phone?: string;
    logo?: string;
  }): Promise<StoreItem | null> => {
    try {
      const res = await apiClient.post<ApiResponse<StoreItem>>('/stores', data);
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] createStore error:', err.message);
      return null;
    }
  },

  updateStore: async (id: string, data: Partial<StoreItem>): Promise<StoreItem | null> => {
    try {
      const res = await apiClient.put<ApiResponse<StoreItem>>(`/stores/${id}`, data);
      return res.data.data;
    } catch (err: any) {
      console.warn('[SmartCook Web] updateStore error:', err.message);
      return null;
    }
  },

  deleteStore: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/stores/${id}`);
      return true;
    } catch (err: any) {
      console.warn('[SmartCook Web] deleteStore error:', err.message);
      return false;
    }
  },
};
