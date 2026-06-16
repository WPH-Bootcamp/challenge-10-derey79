// src/lib/api/resto.ts
import { api } from './axios';
import type { Restaurant } from '@/types';
import { RestaurantDetail } from '@/types';

import {
  ApiResponse,
  RestaurantListResponse,
  RestaurantListItem,
} from '@/types';

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T; // Di sinilah array aslinya berada
// }

// interface BackendMenuResponse {
//   success: boolean;
//   message: string;
//   data: Menu[];
// }

export interface RecommendedRestaurantItem {
  id: number;
  name: string;
  star: number;
  place: string;
  lat: number;
  lng: number;
  images?: string;
  category?: string;
}

// export interface MenuItemSearchResponse {
//   id: number;
//   foodName: string;
//   price: number;
//   image: string;
//   description?: string;
//   restaurantId: number;
//   Restaurant?: {
//     id: number;
//     name: string;
//   };
// }

export interface MenuItemSearchResponse {
  id: number;
  foodName: string;
  price: number;
  image: string;
  restaurantId: number;
  Restaurant?: {
    id: number;
    name: string;
  };
}

// interface SearchMenuParams {
//   query: string; // Kata kunci wajib, misal: "Matcha"
//   restoId?: number; // Filter opsional, misal: 6 (Kopi Kenangan)
// }

// Perbarui tipe data response utama dari server
export interface RecRestaurantListResponse {
  message: string;
  recommendations?: RecommendedRestaurantItem[]; // Opsional karena hanya ada di endpoint recommended
  restaurants?: RestaurantListItem[]; // Menggunakan tipe resmi proyek Anda, bukan 'any'
}

// Fungsi untuk mengambil semua daftar restoran
export async function getRestaurants(): Promise<Restaurant[]> {
  const response = await api.get<ApiResponse<Restaurant[]>>('/api/resto');

  // 2. PERBAIKAN: Ambil properti '.data' dari dalam objek 'response.data'
  return response.data.data;
}

// Fungsi untuk mengambil detail satu restoran berdasarkan ID
export async function getRestaurantById(id: string): Promise<Restaurant> {
  const response = await api.get<Restaurant>(`/api/resto/${id}`);
  return response.data;
}

// export async function fetchRestaurantDetail(restoId: string): Promise<Menu[]> {
//   const response = await api.get<BackendMenuResponse>(
//     `/api/resto/${restoId}?limitMenu=10&limitReview=6`
//   );
//   return response.data.data;
// }

export async function fetchRestaurantDetail(
  id: number | string
): Promise<RestaurantDetail> {
  // Menembak URL lengkap beserta query parameter batas menu dan review
  const response = await api.get<ApiResponse<RestaurantDetail>>(
    `/api/resto/${id}?limitMenu=10&limitReview=6`
  );

  // Mengembalikan objek data internal utama
  return response.data.data;
}

export async function fetchAllRestaurants(): Promise<RestaurantListItem[]> {
  const response =
    await api.get<ApiResponse<RestaurantListResponse>>('/api/resto');
  // Ambil array restaurants yang ada di dalam data objek utama
  return response.data.data.restaurants;
}

export async function fetchRecomendedResto(): Promise<
  RecommendedRestaurantItem[]
> {
  const response = await api.get<ApiResponse<RecRestaurantListResponse>>(
    '/api/resto/recommended'
  );

  // Membaca properti recommendations hasil ekstraksi skema baru dengan aman
  return response.data.data.recommendations || [];
}

export async function searchRestaurants(
  query: string
): Promise<RestaurantListItem[]> {
  // Jika query kosong, kembalikan array kosong agar tidak membebani server
  if (!query.trim()) return [];

  const response = await api.get<
    ApiResponse<{ restaurants: RestaurantListItem[] }>
  >(`/api/resto?search=${encodeURIComponent(query)}`);

  return response.data.data.restaurants || [];
}

export async function searchRestaurantsByName(
  name: string
): Promise<RecommendedRestaurantItem[]> {
  // Jika input kurang dari 2 karakter, jangan tembak server demi efisiensi
  if (!name.trim() || name.trim().length < 2) return [];

  // Sesuaikan dengan path /api/resto/search dari Swagger Anda
  const response = await api.get<
    ApiResponse<{ restaurants: RecommendedRestaurantItem[] }>
  >(`/api/resto/search?q=${encodeURIComponent(name)}&page=1&limit=20`);

  console.log('RESPONS API PENCARIAN:', response.data);

  // Ambil array restaurants atau sesuaikan dengan payload .recommendations jika tipenya sama
  return response.data.data.restaurants || [];
}

export async function searchMenusGlobal(
  query: string
): Promise<MenuItemSearchResponse[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  // Menembak endpoint pencarian menu bawaan backend Anda
  const response = await api.get<
    ApiResponse<{ menus: MenuItemSearchResponse[] }>
  >(`/api/resto/search-menu?q=${encodeURIComponent(query)}&page=1&limit=20`);

  return response.data.data.menus || [];
}
