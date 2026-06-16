import { api } from './axios';
import type { CartResponse, BackendCartDataResponse } from '@/types/cart';

export interface ApiCartItem {
  id: number;
  userId: number;
  restoId: number;
  menuId: number;
  quantity: number;
  Menu: {
    foodName: string;
    price: number;
    image: string;
  };
}

// export interface CartResponse {
//   success: boolean;
//   message: string;
//   data: ApiCartItem[];
// }

export const cartService = {
  // 1. GET /api/cart
  getCart: async (): Promise<BackendCartDataResponse> => {
    const response = await api.get<CartResponse>('/api/cart');
    return (
      response.data.data || {
        cart: [],
        summary: { totalItems: 0, totalPrice: 0, restaurantCount: 0 },
      }
    );
  },

  // 2. POST /api/cart (Hanya untuk menambahkan menu BARU yang belum ada di keranjang)
  addToCart: async (payload: {
    restaurantId: number;
    menuId: number;
    quantity: number;
  }) => {
    const response = await api.post('/api/cart', payload);
    return response.data;
  },

  // 3. PUT /api/cart/{id} (Gunakan ini untuk menambah/mengurangi item yang SUDAH ADA)
  updateQuantity: async (cartItemId: number, quantity: number) => {
    const response = await api.put(`/api/cart/${cartItemId}`, { quantity });
    return response.data;
  },

  // 4. DELETE /api/cart/{id} (Murni menghapus item dari keranjang)
  removeItem: async (cartItemId: number) => {
    const response = await api.delete(`/api/cart/${cartItemId}`);
    return response.data;
  },

  // 5. DELETE /api/cart (Mengosongkan seluruh isi keranjang belanja)
  clearCart: async () => {
    const response = await api.delete('/api/cart');
    return response.data;
  },
};
