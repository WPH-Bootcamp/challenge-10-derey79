'use client';

import { useState, useEffect, ChangeEvent, useMemo } from 'react';
import { CategoryList } from '@/features/resto/category';
import { RecommendedResto } from '@/features/resto/RecommendedResto';
import { useSearchRestaurants } from '@/lib/query/useSearchRestaurants';
import { useAuthStore } from '@/store/useAuthStore';

import { HomeHero } from './HomeHero';
import { HomeSearchResults } from './HomeSearchResults';
import { SearchRestaurantResult, ExtractedMenuWithContext } from '@/types';

export function HomeContainer() {
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');

  // Efek Debounce 500ms menghemat bandwidth request
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(handler);
  }, [keyword]);

  // Eksekusi API via TanStack Query tunggal
  const { data: unifiedResults, isLoading: isSearching } =
    useSearchRestaurants(debouncedKeyword);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const isSearchingActive = debouncedKeyword.trim().length >= 2;

  // Memisahkan kategori Restoran dan Menu secara terisolasi di sisi Client
  const { matchedRestaurants, matchedMenus } = useMemo(() => {
    if (!unifiedResults || unifiedResults.length === 0) {
      return { matchedRestaurants: [], matchedMenus: [] };
    }

    const searchLower = debouncedKeyword.toLowerCase();
    const safeResults = unifiedResults as SearchRestaurantResult[];

    const restaurants = safeResults.filter((resto) =>
      resto.name?.toLowerCase().includes(searchLower)
    );

    const menus: ExtractedMenuWithContext[] = [];
    safeResults.forEach((resto) => {
      const restoMenus = resto.menus || resto.Menu || [];
      restoMenus.forEach((menu) => {
        if (menu.foodName?.toLowerCase().includes(searchLower)) {
          menus.push({
            ...menu,
            restaurantId: resto.id,
            restaurantName: resto.name,
          });
        }
      });
    });

    return { matchedRestaurants: restaurants, matchedMenus: menus };
  }, [unifiedResults, debouncedKeyword]);

  // Loading state gate untuk hidrasi Zustand localStorage
  if (!hasHydrated) {
    return (
      <div className='h-screen w-full bg-[#0c0c0c] flex items-center justify-center text-white'>
        <div className='animate-pulse font-medium text-sm'>
          session loading...
        </div>
      </div>
    );
  }

  return (
    <div className='w-full overflow-hidden animate-in fade-in duration-300'>
      <HomeHero
        keyword={keyword}
        isSearching={isSearching}
        onSearchChange={handleSearchChange}
        isBlur={keyword.trim().length >= 1}
      />

      {/* 2. AREA KONDISIONAL UTAMA */}
      {isSearchingActive ? (
        <HomeSearchResults
          debouncedKeyword={debouncedKeyword}
          isSearching={isSearching}
          matchedRestaurants={matchedRestaurants}
          matchedMenus={matchedMenus}
        />
      ) : (
        <>
          <div className='max-w-7xl mx-auto px-6 py-8 w-full'>
            <CategoryList />
          </div>
          <div className='max-w-7xl mx-auto px-4 py-8'>
            <RecommendedResto />
          </div>
        </>
      )}
    </div>
  );
}
