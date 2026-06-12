'use client';

import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getRestaurantById } from '@/lib/api/resto';
import { ArrowLeft, ShoppingBag, Star } from 'lucide-react';

export default function RestaurantDetail() {
  const params = useParams();
  const router = useRouter();

  // 1. Menangkap parameter ID dari URL aman dalam bentuk string
  const restoId = typeof params?.id === 'string' ? params.id : '';

  // 2. Fetch data restoran berdasarkan ID menggunakan React Query
  const {
    data: resto,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['restaurant', restoId],
    queryFn: () => getRestaurantById(restoId),
    enabled: !!restoId, // Hanya fetch jika restoId sudah tersedia
  });

  // 3. State Loading / Skeleton
  if (isLoading) {
    return (
      <div className='min-h-screen bg-slate-50 pt-24 px-6 max-w-4xl mx-auto w-full animate-pulse'>
        <div className='h-8 w-32 bg-gray-200 rounded mb-6' />
        <div className='h-[40vh] w-full bg-gray-200 rounded-2xl mb-8' />
        <div className='h-10 w-2/3 bg-gray-200 rounded mb-4' />
        <div className='h-6 w-full bg-gray-200 rounded mb-2' />
        <div className='h-6 w-4/5 bg-gray-200 rounded' />
      </div>
    );
  }

  // 4. State Error
  if (isError || !resto) {
    return (
      <div className='min-h-screen pt-24 px-6 max-w-xl mx-auto text-center'>
        <div className='p-6 bg-red-50 text-red-700 rounded-2xl border border-red-100'>
          <h2 className='text-lg font-bold mb-2'>Gagal Memuat Restoran</h2>
          <p className='text-sm mb-4'>
            {error instanceof Error
              ? error.message
              : 'Restoran tidak ditemukan'}
          </p>
          <button
            onClick={() => router.push('/')}
            className='inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors'
          >
            <ArrowLeft className='w-4 h-4' /> Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // 5. State Berhasil (Render Detail Halaman Restoran)
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 pt-24 pb-16 px-6'>
      <div className='max-w-4xl mx-auto w-full'>
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className='inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-500 mb-6 transition-colors group'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          Kembali
        </button>

        {/* Gambar Banner Restoran */}
        <div className='relative w-full h-[40vh] min-h-75 rounded-3xl overflow-hidden shadow-md mb-8 bg-slate-200'>
          {resto.image ? (
            // Only render Next.js Image if resto.image is provided by the API
            <Image
              src={resto.image}
              alt={resto.name}
              fill
              priority
              sizes='(max-w-1200px) 100vw, 896px'
              className='object-cover'
            />
          ) : (
            // Elegant UI Fallback if the restaurant doesn't have an image in the DB
            <div className='flex flex-col items-center justify-center text-slate-400 gap-2'>
              <ShoppingBag className='w-12 h-12 stroke-[1.5]' />
              <span className='text-sm font-medium'>No Image Available</span>
            </div>
          )}
        </div>

        {/* Informasi Utama Restoran */}
        <div className='bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8'>
          <div className='flex flex-wrap items-start justify-between gap-4 mb-4'>
            <div>
              <h1 className='text-3xl font-black tracking-tight text-slate-900 mb-2'>
                {resto.name}
              </h1>
              <div className='flex items-center gap-2 text-sm font-semibold text-slate-600'>
                <div className='flex items-center gap-1 text-amber-500'>
                  <Star className='w-4 h-4 fill-current' />
                  <span>4.8</span>
                </div>
                <span>•</span>
                <span>Id Restoran: {restoId}</span>
              </div>
            </div>

            <button className='inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all active:scale-95'>
              <ShoppingBag className='w-4 h-4' /> Pesan Sekarang
            </button>
          </div>

          <hr className='border-slate-100 my-4' />

          <div>
            <h3 className='font-bold text-slate-800 mb-2 text-lg'>
              Deskripsi Restoran
            </h3>
            <p className='text-slate-600 leading-relaxed font-light'>
              {resto.description ||
                'Tidak ada deskripsi yang tersedia untuk restoran ini.'}
            </p>
          </div>
        </div>

        {/* Slot Menu List */}
        <div>
          <h2 className='text-2xl font-extrabold tracking-tight text-slate-900 mb-6'>
            Menu Hidangan
          </h2>
          {/* PERBAIKAN: Semua tag penutup div sekarang berpasangan dengan benar */}
          <div className='bg-white border rounded-2xl p-8 text-center text-slate-400 border-dashed'>
            <p>
              Daftar menu makanan dari restoran ini akan diletakkan di sini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
