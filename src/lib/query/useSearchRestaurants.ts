import { useQuery } from '@tanstack/react-query';
import { searchRestaurantsByName } from '@/lib/api/resto';

// export function useSearchRestaurants(searchQuery: string) {
//   return useQuery({
//     // Masukkan searchQuery ke dalam queryKey agar cache otomatis ter-update saat query berubah
//     queryKey: ['restaurants', 'search', searchQuery],
//     queryFn: () => searchRestaurantsByName(searchQuery),
//     // Query hanya akan berjalan jika user mengetik minimal 2 karakter
//     enabled: searchQuery.trim().length >= 2,
//     staleTime: 1000 * 60 * 2, // Cache bertahan selama 2 menit
//   });
// }

export function useSearchRestaurants(searchQuery: string) {
  return useQuery({
    queryKey: ['restaurants', 'search-unified', searchQuery],
    queryFn: () => searchRestaurantsByName(searchQuery),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 2, // Cache for 2 minutes
  });
}
