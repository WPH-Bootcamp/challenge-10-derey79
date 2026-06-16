import { useQuery } from '@tanstack/react-query';
import { fetchRecomendedResto } from '@/lib/api/resto';
import axios from 'axios'; // 1. Impor axios untuk pengecekan status error

export function useRecommendedRestaurants() {
  return useQuery({
    queryKey: ['restaurants', 'recommended'],
    queryFn: async () => {
      try {
        return await fetchRecomendedResto();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.warn(
            'User menduduki status Guest anonim, menyajikan rekomendasi fallback default.'
          );
          return [];
        }

        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
    retry: false, // Matikan fungsi hit ulang otomatis jika statusnya adalah guest anonim
  });
}
