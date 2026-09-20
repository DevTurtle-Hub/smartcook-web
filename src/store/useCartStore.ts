import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [
        {
          id: 'sample-chicken',
          recipeId: 'seed-chicken-rice',
          recipeTitle: 'Cơm Đùi Gà Trứng Ốp',
          recipeImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
          name: 'Đùi gà góc tư (phi lê)',
          amount: 250,
          unit: 'g',
          price: 32000,
          checked: true,
          notes: 'Khía nhẹ để ngấm sốt',
        },
        {
          id: 'sample-egg',
          recipeId: 'seed-chicken-rice',
          recipeTitle: 'Cơm Đùi Gà Trứng Ốp',
          recipeImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
          name: 'Trứng gà tươi',
          amount: 1,
          unit: 'quả',
          price: 4000,
          checked: true,
          notes: 'Ốp la lòng đào',
        },
      ],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      addItem: (item) => {
        const id = `${item.recipeId || 'misc'}-${item.name.toLowerCase().trim()}`;
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === id);
          if (existingIndex > -1) {
            // Đã có thì tăng số lượng
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              amount: updated[existingIndex].amount + item.amount,
            };
            return { items: updated, isCartOpen: true };
          }
          return {
            items: [{ ...item, id, checked: true }, ...state.items],
            isCartOpen: true,
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItemCheck: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items
          .filter((item) => item.checked)
          .reduce((sum, item) => sum + item.price, 0);
      },

      getTotalItemsCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'smartcook-grocery-cart',
    }
  )
);
