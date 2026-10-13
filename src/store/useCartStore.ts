import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { plannerApi, ShoppingItemData } from '../api/planner.api';
import { socketService } from '../services/socket.service';

export interface CartItem {
  id: string; // unique key (hoặc Mongo _id)
  recipeId?: string;
  recipeTitle?: string;
  recipeImage?: string;
  name: string;
  amount: number | string;
  unit?: string;
  price: number; // Đơn giá ước tính (VNĐ)
  checked: boolean;
  notes?: string;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  fetchServerCart: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id' | 'checked'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItemCheck: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItemsCount: () => number;
  syncUserCart: (userId: string | null) => void;
}

const getCartStorageKey = (userId?: string | null) => {
  return userId ? `smartcook_cart_${userId}` : 'smartcook_cart_guest';
};

const loadItemsForUser = (userId?: string | null): CartItem[] => {
  const key = getCartStorageKey(userId);
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveItemsForUser = (userId: string | null | undefined, items: CartItem[]) => {
  const key = getCartStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // ignore
  }
};

const mapServerItemToCart = (item: ShoppingItemData): CartItem => {
  return {
    id: item._id || item.id || `cart-${Date.now()}`,
    name: item.name,
    amount: item.amount || '1',
    unit: '',
    price: item.price || 0,
    category: item.category || 'Rau củ',
    recipeTitle: item.recipeTitle,
    recipeId: item.recipeId,
    checked: !item.bought, // Chưa mua = checked để đi chợ mua
  };
};

const initialUserId = useAuthStore.getState().user?._id || null;

export const useCartStore = create<CartState>((set, get) => ({
  items: loadItemsForUser(initialUserId),
  isCartOpen: false,
  isLoading: false,

  openCart: () => {
    set({ isCartOpen: true });
    // Đồng bộ lại dữ liệu từ Server mỗi khi mở Drawer
    const userId = useAuthStore.getState().user?._id;
    if (userId) {
      get().fetchServerCart();
    }
  },

  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  fetchServerCart: async () => {
    const userId = useAuthStore.getState().user?._id;
    if (!userId) return;

    try {
      set({ isLoading: true });
      const res = await plannerApi.getShoppingList();
      if (res && Array.isArray(res.items)) {
        const mapped = res.items.map(mapServerItemToCart);
        saveItemsForUser(userId, mapped);
        set({ items: mapped });
      }
    } catch (e) {
      console.warn('[useCartStore] fetchServerCart error:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const userId = useAuthStore.getState().user?._id || null;
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newItem: CartItem = {
      ...item,
      id: tempId,
      checked: true,
    };

    // 1. Optimistic Update
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.name.toLowerCase().trim() === item.name.toLowerCase().trim()
      );
      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...state.items];
        const prevAmount = typeof updated[existingIndex].amount === 'number'
          ? updated[existingIndex].amount
          : parseInt(String(updated[existingIndex].amount), 10) || 1;
        const addAmount = typeof item.amount === 'number'
          ? item.amount
          : parseInt(String(item.amount), 10) || 1;
        updated[existingIndex] = {
          ...updated[existingIndex],
          amount: prevAmount + addAmount,
          checked: true,
        };
      } else {
        updated = [newItem, ...state.items];
      }
      saveItemsForUser(userId, updated);
      return { items: updated, isCartOpen: true };
    });

    // 2. Server Sync
    if (userId) {
      try {
        const serverItem = await plannerApi.addCartItem({
          name: item.name,
          amount: String(item.amount || '1'),
          price: item.price || 0,
          category: item.category || 'Rau củ',
          recipeTitle: item.recipeTitle,
          recipeId: item.recipeId,
        });

        if (serverItem && serverItem._id) {
          set((state) => {
            const updated = state.items.map((i) =>
              i.id === tempId ? { ...i, id: serverItem._id } : i
            );
            saveItemsForUser(userId, updated);
            return { items: updated };
          });
        }
      } catch (err) {
        console.warn('[useCartStore] addItem server sync failed:', err);
      }
    }
  },

  removeItem: async (id) => {
    const userId = useAuthStore.getState().user?._id || null;

    // 1. Optimistic Update
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id);
      saveItemsForUser(userId, updated);
      return { items: updated };
    });

    // 2. Server Sync
    if (userId && !id.startsWith('temp-')) {
      await plannerApi.removeCartItem(id);
    }
  },

  toggleItemCheck: async (id) => {
    const userId = useAuthStore.getState().user?._id || null;
    let newChecked = false;

    // 1. Optimistic Update
    set((state) => {
      const updated = state.items.map((item) => {
        if (item.id === id) {
          newChecked = !item.checked;
          return { ...item, checked: newChecked };
        }
        return item;
      });
      saveItemsForUser(userId, updated);
      return { items: updated };
    });

    // 2. Server Sync: checked = true nghĩa là chưa mua (bought: false)
    if (userId && !id.startsWith('temp-')) {
      await plannerApi.toggleBought(id, !newChecked);
    }
  },

  clearCart: async () => {
    const userId = useAuthStore.getState().user?._id || null;
    saveItemsForUser(userId, []);
    set({ items: [] });

    if (userId) {
      await plannerApi.clearAllCartItems();
    }
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
    if (userId) {
      get().fetchServerCart();
    } else {
      set({ items: loadItemsForUser(null) });
    }
  },
}));

// Automatically sync cart and connect socket whenever user logs in or out
useAuthStore.subscribe((state) => {
  const currentId = state.isAuthenticated && state.user ? state.user._id : null;
  useCartStore.getState().syncUserCart(currentId);
  if (state.isAuthenticated && state.accessToken) {
    socketService.connect(state.accessToken);
  } else {
    socketService.disconnect();
  }
});

// Real-time 2-way cart synchronization via WebSocket
socketService.onCartUpdated((data) => {
  console.log('🛒 [Web CartStore] Received cart_updated from socket:', data);
  const currentId = useAuthStore.getState().user?._id;
  if (currentId) {
    useCartStore.getState().fetchServerCart();
  }
});

// Auto-refresh when browser tab gains focus
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    const currentId = useAuthStore.getState().user?._id;
    if (currentId) {
      useCartStore.getState().fetchServerCart();
    }
  });
}

// Initial fetch & socket connect on app start if user is already logged in
if (initialUserId) {
  setTimeout(() => {
    socketService.connect();
    useCartStore.getState().fetchServerCart();
  }, 200);
}

