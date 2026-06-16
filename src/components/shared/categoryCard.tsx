'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  name: string;
  iconPath: string; // Menerima tipe string untuk alamat file gambar
  isActive: boolean;
  onClick: () => void;
}

export function CategoryCard({
  name,
  iconPath,
  isActive,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className='flex flex-col items-center gap-3 group focus:outline-none'
    >
      {/* Box Putih Pembungkus Ikon */}
      <div
        className={cn(
          'w-20 h-20 md:w-40.25 md:h-25 rounded-2xl bg-white flex items-center justify-center border transition-all duration-200 relative overflow-hidden',
          'shadow-[0_4px_12px_rgba(0,0,0,0.03)]',
          isActive
            ? 'border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/10 scale-105'
            : 'border-slate-100 hover:border-slate-200 hover:scale-102'
        )}
      >
        {/* Pembungkus Gambar dengan Kontrol Ukuran */}
        <div className='relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-200 group-hover:scale-110'>
          <Image
            src={iconPath}
            alt={`${name} icon`}
            fill
            sizes='(max-w-768px) 40px, 48px'
            className={cn(
              'object-contain transition-all duration-200',
              // Memberikan sedikit efek transparansi/grayscale jika tidak aktif (opsional)
              !isActive && 'opacity-80 saturate-75'
            )}
          />
        </div>
      </div>

      {/* Label Teks Kategori */}
      <span
        className={cn(
          'text-xs md:text-sm font-semibold tracking-tight transition-colors duration-200 text-center max-w-20 md:max-w-25 block',
          isActive
            ? 'text-orange-600 font-bold'
            : 'text-slate-500 group-hover:text-slate-800'
        )}
      >
        {name}
      </span>
    </button>
  );
}
