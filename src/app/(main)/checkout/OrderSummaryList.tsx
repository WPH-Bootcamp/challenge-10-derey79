'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import type { BackendCartDataResponse } from '@/types/cart';

interface OrderSummaryListProps {
  cartGroups: BackendCartDataResponse['cart'];
  onUpdateQuantity?: (
    restaurantId: number,
    menuId: number,
    cartItemId: number,
    currentQty: number,
    delta: number
  ) => void;
}

export function OrderSummaryList({
  cartGroups,
  onUpdateQuantity,
}: OrderSummaryListProps) {
  if (cartGroups.length === 0) {
    return (
      <div className='rounded-2xl border border-slate-100 bg-white p-6 shadow-sm py-6 text-center select-none'>
        <p className='text-sm text-slate-500 mb-4'>
          Keranjang belanja Anda kosong.
        </p>
        <Button
          asChild
          className='bg-red-600 hover:bg-red-700 rounded-full text-xs font-semibold'
        >
          <Link href='/'>Cari Makanan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4 select-none'>
      {cartGroups.map((group) => (
        <div
          key={group.restaurant.id}
          className='bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6'
        >
          {/* HEADER RESTORAN: IKON FOOD-STALL + NAMA + TOMBOL ADD ITEM */}
          <div className='flex items-center justify-between gap-4 pb-1'>
            <div className='flex items-center gap-2'>
              <div className='relative w-5 h-5 shrink-0 flex items-center justify-center'>
                <Image
                  src='/food-stall.png' // Memanggil ikon dari public/food-stall.png
                  alt='Food Stall Icon'
                  width={20}
                  height={20}
                  className='object-contain'
                />
              </div>
              <h2 className='font-bold text-slate-900 text-sm tracking-tight'>
                {group.restaurant.name}
              </h2>
            </div>

            {/* TOMBOL ADD ITEM BENTUK KAPSUL */}
            <Link href={`/resto/${group.restaurant.id}`}>
              <button className='px-5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98] cursor-pointer'>
                Add item
              </button>
            </Link>
          </div>

          {/* DAFTAR ITEM MAKANAN DENGAN KONTROL KUANTITAS SESUAI GAMBAR */}
          <div className='space-y-5'>
            {(group.items || []).map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between gap-4'
              >
                {/* Sisi Kiri: Gambar, Nama, Harga */}
                <div className='flex items-center gap-4 min-w-0'>
                  <div className='relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100'>
                    <Image
                      src={item.menu.image || '/placeholder-food.jpg'}
                      alt={item.menu.foodName}
                      fill
                      className='object-cover'
                      sizes='64px'
                    />
                  </div>
                  <div className='min-w-0'>
                    <h3 className='font-medium text-slate-500 text-xs sm:text-sm truncate'>
                      {item.menu.foodName}
                    </h3>
                    <p className='text-sm sm:text-base font-bold text-slate-900 mt-1'>
                      {formatRupiah(item.menu.price)}
                    </p>
                  </div>
                </div>

                {/* Sisi Kanan: Kontrol Bulat Kuantitas Merah-Putih */}
                <div className='flex items-center gap-3 shrink-0'>
                  <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer'
                    onClick={() =>
                      onUpdateQuantity?.(
                        group.restaurant.id,
                        item.menu.id,
                        item.id,
                        item.quantity,
                        -1
                      )
                    }
                    disabled={!onUpdateQuantity}
                  >
                    <MinusIcon size={12} className='stroke-[2.5]' />
                  </Button>

                  <span className='w-4 text-center font-bold text-sm text-slate-900'>
                    {item.quantity}
                  </span>

                  <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8 rounded-full border-0 bg-red-600 hover:bg-red-700 text-white transition-colors shadow-sm cursor-pointer'
                    onClick={() =>
                      onUpdateQuantity?.(
                        group.restaurant.id,
                        item.menu.id,
                        item.id,
                        item.quantity,
                        1
                      )
                    }
                    disabled={!onUpdateQuantity}
                  >
                    <PlusIcon size={12} className='stroke-[2.5]' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
