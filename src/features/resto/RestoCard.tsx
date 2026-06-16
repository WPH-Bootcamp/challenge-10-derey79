'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { RecommendedRestaurantItem } from '@/lib/api/resto';

// =========================================================================
// RUMUS HAVERSINE: Menghitung jarak lurus akurat antara dua titik koordinat
// =========================================================================
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const R = 6371; // Radius bumi dalam kilometer
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance.toFixed(1); // Mengembalikan string dengan 1 angka di belakang koma (misal: "2.4")
}

interface RestoCardProps {
  resto: RecommendedRestaurantItem;
}

export function RestoCard({ resto }: RestoCardProps) {
  // State untuk menyimpan koordinat lokasi terkini pengguna (browser Geolocation)
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const hasValidImage =
    Array.isArray(resto.images) &&
    resto.images.length > 0 &&
    typeof resto.images[0] === 'string' &&
    resto.images[0].trim() !== '';
  const restoImageSrc = hasValidImage
    ? (resto.images?.[0] ?? '/burger-king-logo.png')
    : '/burger-king-logo.png';

  // Mengambil lokasi GPS pengguna secara berkala saat komponen dimuat
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) =>
          console.warn('Akses lokasi GPS ditolak/gagal:', error.message),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Hitung jarak dinamis jika koordinat user dan resto tersedia
  const distanceDisplay =
    userCoords && resto.lat && resto.lng
      ? `${calculateDistance(userCoords.lat, userCoords.lng, resto.lat, resto.lng)} km`
      : '2.4 km'; // Fallback statis sesuai gambar Anda jika GPS dinonaktifkan

  return (
    <Link
      href={`/resto/${resto.id}`}
      className='w-full max-w-105 h-33.75 bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow select-none cursor-pointer group'
    >
      {/* BOX KIRI: GAMBAR LOGO RESTORAN */}
      <div className='relative w-25.75 h-25.75 bg-[#FFF5EA] rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-amber-100/50'>
        <Image
          // KUNCI AMAN: Pastikan datanya bertipe string DAN tidak kosong sebelum dimasukkan ke Next.js Image
          src={restoImageSrc}
          alt={resto.name || 'Resto Logo'}
          fill
          priority
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          sizes='103px'
        />
      </div>

      {/* BOX KANAN: DETAIL INFORMASI */}
      <div className='flex flex-col justify-center min-w-0 flex-1 h-full py-0.5'>
        {/* Nama Restoran */}
        <h4 className='font-extrabold text-[17px] text-slate-900 tracking-tight line-clamp-1 group-hover:text-orange-600 transition-colors'>
          {resto.name}
        </h4>

        {/* Skor Ulasan Bintang */}
        <div className='flex items-center gap-1.5 mt-1.5'>
          <Star className='w-3.75 h-3.75 fill-amber-400 stroke-amber-400' />
          <span className='text-[14px] font-bold text-slate-700 leading-none pt-0.5'>
            {resto.star ? Number(resto.star).toFixed(1) : '4.9'}
          </span>
        </div>

        {/* Alamat Wilayah & Jarak Dinamis */}
        <p className='text-[13px] font-medium text-slate-500 mt-3 truncate'>
          <span>{resto.place || 'Jakarta Selatan'}</span>
          <span className='mx-1.5 text-slate-300 font-light'>•</span>
          <span className='text-slate-700 font-semibold'>
            {distanceDisplay}
          </span>
        </p>
      </div>
    </Link>
  );
}
