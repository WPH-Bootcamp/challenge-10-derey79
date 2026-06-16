'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus as PlusIcon,
  Minus as MinusIcon,
  ChevronRight,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/lib/api/cart';
import { CART_QUERY_KEYS } from '@/lib/query/queries';
import { getErrorMessage } from '@/lib/api/axios';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BackendCartDataResponse } from '@/types/cart';

export default function CartContainer() {
  const queryClient = useQueryClient();
  const cartKey = CART_QUERY_KEYS.list();

  // READ DATA DARI SERVER (MENGGUNAKAN useQuery)
  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery<BackendCartDataResponse>({
    queryKey: cartKey,
    queryFn: async () => {
      const response = (await cartService.getCart()) as unknown;

      if (response && typeof response === 'object') {
        if ('data' in response) {
          const axiosResponse = response as {
            data: { cart?: unknown; summary?: unknown };
          };
          if (
            axiosResponse.data &&
            typeof axiosResponse.data === 'object' &&
            'cart' in axiosResponse.data
          ) {
            return axiosResponse.data as unknown as BackendCartDataResponse;
          }
        }
        if ('cart' in response) {
          return response as unknown as BackendCartDataResponse;
        }
      }
      return {
        cart: [],
        summary: { totalItems: 0, totalPrice: 0, restaurantCount: 0 },
      } as BackendCartDataResponse;
    },
  });

  // MUTASI TAMBAH / UPDATE QUANTITY
  const cartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
    onError: (err) => {
      alert(`Gagal memperbarui keranjang: ${getErrorMessage(err)}`);
    },
  });

  // MUTASI HAPUS ITEM (JIKA QTY MENJADI 0)
  const deleteMutation = useMutation({
    mutationFn: (cartItemId: number) => cartService.removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
    onError: (err) => {
      alert(`Gagal menghapus item: ${getErrorMessage(err)}`);
    },
  });

  const handleUpdateQuantity = (
    restaurantId: number,
    menuId: number,
    cartItemId: number,
    currentQty: number,
    delta: number
  ) => {
    if (currentQty === 1 && delta === -1) {
      deleteMutation.mutate(cartItemId);
      return;
    }

    if (delta === -1) {
      const targetQty = currentQty - 1;
      cartMutation.mutate({ restaurantId, menuId, quantity: targetQty });
      return;
    }

    cartMutation.mutate({
      restaurantId,
      menuId,
      quantity: currentQty + 1,
    });
  };

  const cartGroups = cartData?.cart || [];
  const summary = cartData?.summary || {
    totalItems: 0,
    totalPrice: 0,
    restaurantCount: 0,
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center pt-20'>
        <p className='text-sm font-medium text-slate-500 animate-pulse'>
          Memuat isi keranjang...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center pt-20 text-red-500 font-medium'>
        <p>
          ⚠️ Gagal memuat keranjang:{' '}
          {error ? getErrorMessage(error) : 'Terjadi kesalahan'}
        </p>
      </div>
    );
  }

  if (cartGroups.length === 0) {
    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-20 px-4 text-center'>
        <div className='text-6xl mb-4'>🛒</div>
        <h1 className='text-2xl font-bold text-slate-900 mb-2'>
          Keranjang Belanja Kosong
        </h1>
        <p className='text-slate-500 mb-6 max-w-sm'>
          Anda belum menambahkan menu apa pun.
        </p>
        <Button
          asChild
          className='bg-red-600 hover:bg-red-700 rounded-full px-6'
        >
          <Link href='/'>Cari Makanan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#FDFDFD] pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full select-none'>
      {/* JUDUL UTAMA */}
      <h1 className='text-2xl font-bold text-slate-900 mb-6 tracking-tight'>
        My Cart
      </h1>

      {/* BOX CONTAINER UNTUK KELOMPOK KERANJANG */}
      <div className='bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6'>
        {cartGroups.map((group) => (
          <div key={group.restaurant.id} className='space-y-5'>
            {/* Header Nama Restoran + Icon Panah */}
            <div className='flex items-center gap-2 pb-1'>
              <span className='text-base'>🍔</span>
              <h2 className='font-bold text-slate-900 text-sm flex items-center gap-1 cursor-pointer hover:text-red-600 transition-colors'>
                {group.restaurant.name}
                <ChevronRight size={16} className='text-slate-600 mt-0.5' />
              </h2>
            </div>

            {/* Daftar Item Makanan */}
            <div className='space-y-5'>
              {(group.items || []).map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between gap-4'
                >
                  {/* Bagian Kiri: Gambar, Nama, Harga */}
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

                  {/* Bagian Kanan: Kontrol Kuantitas Bulat Sesuai Gambar */}
                  <div className='flex items-center gap-3 shrink-0'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm cursor-pointer'
                      disabled={
                        cartMutation.isPending || deleteMutation.isPending
                      }
                      onClick={() =>
                        handleUpdateQuantity(
                          group.restaurant.id,
                          item.menu.id,
                          item.id,
                          item.quantity,
                          -1
                        )
                      }
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
                      disabled={
                        cartMutation.isPending || deleteMutation.isPending
                      }
                      onClick={() =>
                        handleUpdateQuantity(
                          group.restaurant.id,
                          item.menu.id,
                          item.id,
                          item.quantity,
                          1
                        )
                      }
                    >
                      <PlusIcon size={12} className='stroke-[2.5]' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* GARIS PEMBATAS PUTUS-PUTUS (DOTTED LINE) */}
        <div className='border-t border-dashed border-slate-200/80 pt-5 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          {/* Sisi Kiri Bawah: Total Label dan Harga Acuan */}
          <div className='text-left'>
            <span className='text-xs font-medium text-slate-500'>Total</span>
            <p className='text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5'>
              {formatRupiah(summary.totalPrice)}
            </p>
          </div>

          {/* Sisi Kanan Bawah: Tombol Aksi Menuju Checkout */}
          <Button
            asChild
            className='bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full h-11 px-10 transition-all text-sm shadow-sm active:scale-[0.99] cursor-pointer w-full sm:w-auto'
          >
            <Link href='/checkout'>Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
