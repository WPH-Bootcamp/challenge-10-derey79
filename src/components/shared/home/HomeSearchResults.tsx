'use client';

import { Store, Utensils } from 'lucide-react';
import { RestoCard } from '@/features/resto/RestoCard';

import { SearchRestaurantResult, ExtractedMenuWithContext } from '@/types';

interface HomeSearchResultsProps {
  debouncedKeyword: string;
  isSearching: boolean;
  matchedRestaurants: SearchRestaurantResult[];
  matchedMenus: ExtractedMenuWithContext[];
}

export function HomeSearchResults({
  debouncedKeyword,
  isSearching,
  matchedRestaurants,
  matchedMenus,
}: HomeSearchResultsProps) {
  const hasAnyResults =
    matchedRestaurants.length > 0 || matchedMenus.length > 0;

  if (!hasAnyResults && !isSearching) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-16 text-center text-slate-500 font-medium text-xl bg-slate-50 border border-dashed rounded-2xl animate-in fade-in duration-200'>
        We couldn&apos;t find any restaurants or menu items matching your search
        &ldquo;{debouncedKeyword}&rdquo;.
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12 space-y-12 select-none'>
      <h2 className='text-2xl font-black text-slate-900 tracking-tight'>
        Search result for &ldquo;{debouncedKeyword}&rdquo;
      </h2>

      {/* SEKSI A: RESTORAN YANG COCOK */}
      {matchedRestaurants.length > 0 && (
        <div className='animate-in fade-in slide-in-from-bottom-2 duration-300'>
          <div className='flex items-center gap-2 mb-4 text-slate-800 border-b border-slate-100 pb-2'>
            <Store size={20} className='text-[#C92118]' />
            <h3 className='text-lg font-bold'>Restaurants Matching</h3>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {matchedRestaurants.map((resto) => (
              <RestoCard key={resto.id} resto={resto} />
            ))}
          </div>
        </div>
      )}

      {/* SEKSI B: MENU MAKANAN YANG COCOK */}
      {matchedMenus.length > 0 && (
        <div className='animate-in fade-in slide-in-from-bottom-2 duration-400 pt-4'>
          <div className='flex items-center gap-2 mb-4 text-slate-800 border-b border-slate-100 pb-2'>
            <Utensils size={20} className='text-[#C92118]' />
            <h3 className='text-lg font-bold'>Foods & Drinks Matching</h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {/* Silakan buka komentar ini jika MenuItemCard sudah siap digunakan */}
            {/* {matchedMenus.map((menu) => (
              <MenuItemCard 
                key={menu.id} 
                item={menu} 
                currentQuantity={0} 
                onUpdateQuantity={() => {}} 
              />
            ))} */}
          </div>
        </div>
      )}
    </div>
  );
}
