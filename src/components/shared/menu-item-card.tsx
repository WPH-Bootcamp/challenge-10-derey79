'use client';

import React from 'react';
import Image from 'next/image';
import { formatRupiah } from '@/lib/utils';
import type { ApiMenuItem } from '@/types';

interface MenuItemCardProps {
  item: ApiMenuItem;
  currentQuantity: number;
  onUpdateQuantity: (menuId: number, delta: number) => void;
  isActionPending?: boolean; // 1. Tambahkan prop baru untuk mendeteksi loading API
}

export const MenuItemCard = React.memo(function MenuItemCard({
  item,
  currentQuantity,
  onUpdateQuantity,
  isActionPending = false, // Beri nilai default false jika tidak dikirim
}: MenuItemCardProps) {
  // Pastikan menuId murni berupa angka untuk dikirim ke fungsi updateQuantity
  const menuId = Number(item.id);

  // KUNCI PROTEKSI: Pastikan displayQuantity HANYA mengambil data dari props kuantitas
  const displayQuantity =
    typeof currentQuantity === 'number' && !isNaN(currentQuantity)
      ? currentQuantity
      : 0;

  return (
    <div className='border border-slate-100 p-3 rounded-xl bg-white shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow'>
      {/* Gambar Menu */}
      <div className='relative w-full h-32 mb-3 bg-slate-50 rounded-lg overflow-hidden border border-slate-100/50'>
        <Image
          src={item.image || 'https://unsplash.com'}
          alt={item.foodName || 'Food Image'}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          sizes='(max-width: 768px) 50vw, 25vw'
        />
      </div>

      {/* Informasi Nama & Harga Menu */}
      <div className='flex justify-between items-end mt-auto'>
        <div className='min-w-0 flex-1 pr-2'>
          <h4 className='font-bold text-sm text-slate-900 line-clamp-1'>
            {item.foodName}
          </h4>
          <p className='text-xs font-bold text-orange-600 mt-0.5 whitespace-nowrap'>
            {formatRupiah(item.price)}
          </p>
        </div>

        {/* Gunakan displayQuantity hasil proteksi ketat untuk saklar UI */}
        {displayQuantity > 0 ? (
          <div
            className={`flex items-center gap-2.5 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full text-xs font-bold text-red-600 shadow-sm transition-opacity ${isActionPending ? 'opacity-50' : ''}`}
          >
            <button
              type='button'
              onClick={() => onUpdateQuantity(menuId, -1)}
              disabled={isActionPending} // 2. KUNCI DI SINI: Mencegah spam klik tombol minus
              className='hover:text-red-800 font-extrabold cursor-pointer px-1 text-sm select-none disabled:cursor-not-allowed disabled:opacity-40'
            >
              -
            </button>
            {/* Tampilkan kuantitas asli keranjang */}
            <span className='min-w-3 text-center'>{displayQuantity}</span>
            <button
              type='button'
              onClick={() => onUpdateQuantity(menuId, 1)}
              disabled={isActionPending} // 3. KUNCI DI SINI: Mencegah spam klik tombol plus
              className='hover:text-red-800 font-extrabold cursor-pointer px-1 text-sm select-none disabled:cursor-not-allowed disabled:opacity-40'
            >
              +
            </button>
          </div>
        ) : (
          <button
            type='button'
            onClick={() => onUpdateQuantity(menuId, 1)}
            disabled={isActionPending} // 4. KUNCI DI SINI: Mencegah klik ganda saat menu baru dibuat
            className='bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full font-semibold transition cursor-pointer active:scale-95 shrink-0 shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed'
          >
            {isActionPending ? 'Loading...' : 'Add'}
          </button>
        )}
      </div>
    </div>
  );
});
