// src/features/resto/components/menu-list.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantMenu } from '@/lib/api/resto';
import { Plus, Coffee, UtensilsCrossed } from 'lucide-react';
import { Menu } from '@/types';
import { formatRupiah } from '@/lib/utils';

interface MenuListProps {
  restoId: string;
}

export function MenuList({ restoId }: MenuListProps) {
  const {
    data: menuData,
    isLoading,
    isError,
  } = useQuery<Menu[]>({
    queryKey: ['restaurant-menu', restoId],
    queryFn: () => getRestaurantMenu(restoId),
    enabled: !!restoId,
  });

  const menuItems = menuData ?? [];

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-28 bg-gray-200 rounded-2xl' />
        ))}
      </div>
    );
  }

  if (isError || menuItems.length === 0) {
    return (
      <div className='bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400'>
        <p>Tidak ada menu hidangan yang tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {menuItems.map((item) => {
        // Detect item type to display appropriate placeholder icon
        const isDrink =
          item.type?.toLowerCase().includes('minum') ||
          item.type?.toLowerCase().includes('drink');

        return (
          <div
            key={item.id}
            className='bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200'
          >
            {/* Menu Details using your exact database fields */}
            <div className='flex-1 min-w-0'>
              <span className='inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mb-1.5'>
                {item.type || 'Menu'}
              </span>
              <h3 className='font-bold text-slate-900 text-lg mb-2 truncate'>
                {item.food_name}
              </h3>
              <span className='text-orange-500 font-extrabold text-base'>
                {formatRupiah(item.price)}
              </span>
            </div>

            {/* Visual Type Indicator & Add Button Container */}
            <div className='relative w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center text-slate-400 shadow-inner'>
              {isDrink ? (
                <Coffee className='w-8 h-8 stroke-[1.25]' />
              ) : (
                <UtensilsCrossed className='w-8 h-8 stroke-[1.25]' />
              )}

              {/* Add Action Button */}
              <button
                className='absolute bottom-1 right-1 bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-lg shadow transition-all active:scale-90'
                title='Tambah ke keranjang'
              >
                <Plus className='w-3 h-3 stroke-3' />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
