'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { fetchAllRestaurants } from '@/services/restoService';
import { RestaurantListItem } from '@/types';
// import { getErrorMessage } from '@/libs/api';

import { fetchAllRestaurants } from '@/lib/api/resto';
import { getErrorMessage } from '@/lib/api/axios';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<RestaurantListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  if (isLoading)
    return <div className='text-center p-6'>Memuat daftar restoran...</div>;
  if (error)
    return (
      <div className='text-red-500 bg-red-50 p-4 rounded m-4'>{error}</div>
    );

  return (
    <div className='p-6 max-w-6xl m-auto'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>Daftar Restoran</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {restaurants.map((resto) => (
          <div
            key={resto.id}
            className='border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between'
          >
            <div>
              {/* Wadah Gambar Banner Utama Menggunakan Next.js Image */}
              {resto.images && resto.images.length > 0 && (
                <div className='relative w-full h-44 mb-3 rounded-lg overflow-hidden bg-gray-50'>
                  <Image
                    src={resto.images[0]} // Mengambil gambar pertama dari array
                    alt={resto.name}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                </div>
              )}

              <div className='flex items-center gap-2 mb-1'>
                {/* Menampilkan Kategori */}
                <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium'>
                  {resto.category}
                </span>
              </div>

              <h2 className='font-bold text-xl text-gray-900 line-clamp-1'>
                {resto.name}
              </h2>

              {/* PEMBARUAN: Menampilkan properti 'place' dari API Anda */}
              <p className='text-gray-500 text-sm mt-1 flex items-center gap-1'>
                📍 {resto.place}
              </p>
            </div>

            <div className='mt-4 flex items-center justify-between pt-3 border-t border-gray-50'>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-gray-800'>
                  ⭐ {resto.star}
                </span>
                <span className='text-xs text-gray-400'>
                  {resto.reviewCount} ulasan
                </span>
              </div>

              {/* Tombol Navigasi Dinamis Link Next.js */}
              <Link
                href={`/resto/${resto.id}`}
                className='bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600 transition inline-block text-center font-medium'
              >
                Lihat Menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
