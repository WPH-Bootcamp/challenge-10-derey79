'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { NavBreadcrumb } from '@/components/shared/NavBreadcrumb';

// Silakan sesuaikan alias import ini dengan folder tempat Anda meletakkan file di atas
import { useRestaurantCart } from '@/lib/query/use-restaurant-cart';
import { MenuItemCard } from '@/components/shared/menu-item-card';
import { getErrorMessage } from '@/lib/api/axios';

type MenuTab = 'all' | 'food' | 'drink';

export default function RestaurantDetailPage() {
  const params = useParams();
  const restoId = params?.id as string;

  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const { restaurant, isLoading, isError, error, cartData, updateQuantity } =
    useRestaurantCart(restoId);

  const filteredMenus = useMemo(() => {
    const menus = restaurant?.menus || [];
    if (activeTab === 'all') return menus;
    return menus.filter((item) => item.type?.toLowerCase() === activeTab);
  }, [restaurant?.menus, activeTab]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-24 bg-slate-50'>
        <p className='text-sm font-medium text-slate-500 animate-pulse'>
          Memuat informasi restoran...
        </p>
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className='flex items-center justify-center min-h-screen pt-24 bg-slate-50 text-red-500 font-medium'>
        <p>⚠️ {error ? getErrorMessage(error) : 'Restoran tidak ditemukan.'}</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl m-auto p-4 pt-24'>
      <NavBreadcrumb currentPathName='Resto' />
      {/* Banner Restoran */}
      <div className='grid grid-cols-3 gap-2 mb-4'>
        <div className='col-span-2 relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden shadow-sm'>
          {restaurant.images?.[0] && (
            <Image
              src={restaurant.images[0]}
              alt='Main Banner'
              fill
              priority
              className='object-cover'
              sizes='(max-width: 768px) 100vw, 66vw'
            />
          )}
        </div>

        <div className='grid grid-rows-2 gap-2'>
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className='relative w-full h-full min-h-31 bg-slate-100 rounded-xl overflow-hidden shadow-sm'
            >
              {restaurant.images?.[idx] && (
                <Image
                  src={restaurant.images[idx]}
                  alt={`Sub Banner ${idx}`}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 50vw, 33vw'
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Identitas Restoran */}
      <div className='flex items-center gap-4 mb-6'>
        <div className='relative w-16 h-16 shrink-0 bg-slate-100 rounded-full overflow-hidden border shadow-sm'>
          {restaurant.logo && (
            <Image
              src={restaurant.logo}
              alt={`${restaurant.name} Logo`}
              fill
              className='object-cover'
              sizes='64px'
            />
          )}
        </div>
        <div>
          <h1 className='text-2xl font-bold text-slate-900'>
            {restaurant.name}
          </h1>
          <p className='text-sm text-slate-500 mt-0.5'>
            ⭐ {restaurant.star} • {restaurant.place}
          </p>
        </div>
      </div>

      {/* Tab Filter Menu Kategori */}
      <div className='flex gap-2 mb-6'>
        {(['all', 'food', 'drink'] as const).map((tab) => (
          <button
            key={tab}
            type='button'
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm border capitalize transition cursor-pointer font-medium ${
              activeTab === tab
                ? 'bg-red-50 text-red-600 border-red-500 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:text-orange-500'
            }`}
          >
            {tab === 'all' ? 'All Menu' : tab}
          </button>
        ))}
      </div>

      {/* Grid Menu Hidangan */}
      {filteredMenus.length === 0 ? (
        <div className='bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 shadow-sm'>
          <p>Tidak ada hidangan dalam kategori ini saat ini.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {filteredMenus.map((item) => {
            const restoGroups = cartData?.cart || [];

            const currentRestoGroup = restoGroups.find(
              (group) => String(group.restaurant?.id) === String(restoId)
            );

            const cartItem = currentRestoGroup?.items?.find(
              (cartItemDetail) =>
                String(cartItemDetail.menu?.id) === String(item.id)
            );

            const currentQuantity = cartItem ? cartItem.quantity : 0;

            return (
              <MenuItemCard
                key={item.id}
                item={item}
                currentQuantity={currentQuantity}
                onUpdateQuantity={updateQuantity}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
