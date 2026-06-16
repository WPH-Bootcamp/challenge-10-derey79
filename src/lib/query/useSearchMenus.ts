import { useQuery } from '@tanstack/react-query';
// import { searchMenus } from '@/lib/api/resto';
import { searchMenusGlobal } from '@/lib/api/resto';

export function useSearchMenus(searchQuery: string) {
  return useQuery({
    queryKey: ['menus', 'search-global', searchQuery],
    queryFn: () => searchMenusGlobal(searchQuery),
    enabled: searchQuery.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
  });
}
