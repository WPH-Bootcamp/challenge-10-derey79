import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the cart item model matching your restaurant product structure
export interface CartItem {
  id: number;
  foodName: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (newItem: Omit<CartItem, 'quantity'>) => void;
  decrementQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      // Action: Adds a new product or increments quantity if it exists
      addToCart: (newItem) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === newItem.id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return { cart: [...state.cart, { ...newItem, quantity: 1 }] };
        }),

      // Action: Decrements product quantity or drops it if quantity hits zero
      decrementQuantity: (id) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === id);

          if (existingItem && existingItem.quantity > 1) {
            return {
              cart: state.cart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
              ),
            };
          }

          // Remove item completely if reducing past 1
          return { cart: state.cart.filter((item) => item.id !== id) };
        }),

      // Action: Removes a product line entirely
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      // Action: Clear whole selection (ideal post-checkout orders processing)
      clearCart: () => set({ cart: [] }),

      // Selector: Calculate the grand final pricing sum
      getCartTotal: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'restaurant-cart-storage', // Persistent key in browser localStorage
    }
  )
);
