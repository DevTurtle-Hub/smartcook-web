import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface CartItem {
  id: string; // unique key (ví dụ: recipeId-ingredientName)
  recipeId?: string;
  recipeTitle?: string;
  recipeImage?: string;
  name: string;
  amount: number;
  unit: string;
  price: number; // Đơn giá ước tính (VNĐ)
  checked: boolean;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'checked'>) => void;
  removeItem: (id: string) => void;
  toggleItemCheck: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItemsCount: () => number;
  syncUserCart: (userId: string | null) => void;
}

const getCartStorageKey = (userId?: string | null) => {
  return userId ? `smartcook_cart_${userId}` : null;
};

const loadItemsForUser = (userId?: string | null): CartItem[] => {
  // Clear legacy hardcoded cart if exists
  if (typeof window !== 'undefined') {
    localStorage.removeItem('smartcook-grocery-cart');
  }

  const key = getCartStorageKey(userId);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveItemsForUser = (userId: string | null | undefined, items: CartItem[]) => {
  const key = getCartStorageKey(userId);
  if (key) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // ignore
    }
  }
};

const initialUserId = useAuthStore.getState().user?._id || null;

export const useCartStore = create<CartState>((set, get) => ({
  items: loadItemsForUser(initialUserId),
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  
  addItem: (item) => {
    const userId = useAuthStore.getState().user?._id || null;
    const id = `${item.recipeId || 'misc'}-${item.name.toLowerCase().trim()}`;
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === id);
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount: updated[existingIndex].amount + item.amount,
        };
      } else {
        updated = [{ ...item, id, checked: true }, ...state.items];
      }
      saveItemsForUser(userId, updated);
      return { items: updated, isCartOpen: true };
    });
  },

  removeItem: (id) => {
    const userId = useAuthStore.getState().user?._id || null;
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id);
      saveItemsForUser(userId, updated);
      return { items: updated };
    });
  },

  toggleItemCheck: (id) => {
    const userId = useAuthStore.getState().user?._id || null;
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      saveItemsForUser(userId, updated);
      return { items: updated };
    });
  },

  clearCart: () => {
    const userId = useAuthStore.getState().user?._id || null;
    saveItemsForUser(userId, []);
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items
      .filter((item) => item.checked)
      .reduce((sum, item) => sum + item.price, 0);
  },

  getTotalItemsCount: () => {
    return get().items.length;
  },

  syncUserCart: (userId) => {
    set({ items: loadItemsForUser(userId) });
  },
}));

// Automatically sync cart whenever user logs in or out
useAuthStore.subscribe((state) => {
  const currentId = state.isAuthenticated && state.user ? state.user._id : null;
  useCartStore.getState().syncUserCart(currentId);
});
