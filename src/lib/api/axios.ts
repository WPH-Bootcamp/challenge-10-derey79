import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout! Server terlalu lama merespons.');
    }

    // 1. Cek status 401 Unauthorized
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || '';

      // 2. Deteksi apakah endpoint yang diakses bersifat Publik (Bisa diakses tanpa login)
      // Tambahkan rute publik lainnya jika ada ke dalam kondisi OR (||) di bawah ini
      const isPublicEndpoint =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/api/resto/recommended') || // <-- IJINKAN GUEST MELIHAT REKOMENDASI
        requestUrl.includes('/api/resto'); // <-- IJINKAN GUEST MELIHAT DAFTAR RESTO

      // 3. JIKA error terjadi di rute publik, JANGAN tendang user ke login
      if (isPublicEndpoint) {
        console.warn(`Request 401 diabaikan untuk rute publik: ${requestUrl}`);
        return Promise.reject(error); // Biarkan frontend menangani error secara lokal (menampilkan Guest View)
      }

      // 4. JIKA terjadi di rute privat (Token kedaluwarsa riil, misal di /api/cart), jalankan pembersihan otomatis
      console.error(
        'Token tidak valid atau kedaluwarsa pada rute privat. Mengalihkan ke halaman login...'
      );

      useAuthStore.getState().clearAuth();

      // Amankan agar window object hanya dipanggil di sisi client (browser)
      if (typeof window !== 'undefined') {
        window.location.href = `/login?callback=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      if ('message' in data && typeof data.message === 'string') {
        return data.message;
      }
      if (
        'error' in data &&
        data.error &&
        typeof data.error === 'object' &&
        'message' in data.error
      ) {
        if (typeof data.error.message === 'string') return data.error.message;
      }
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Terjadi kesalahan sistem';
}
