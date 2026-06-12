import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Mengubah min-h-screen menjadi h-screen untuk layout split-screen yang stabil
    <div className='min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground select-none'>
      {/* Ditambahkan h-full agar kontainer memiliki tinggi penuh untuk properti fill */}
      <div className='hidden lg:block relative h-full w-full overflow-hidden group'>
        {/* Overlay teks dinaikkan z-index-nya agar selalu berada di atas gambar */}

        <Image
          src='/login-image.png' // Pastikan file ini ada di folder public/main_image.png
          alt='Resto Name'
          fill // Diaktifkan kembali untuk memenuhi seluruh area kanan
          priority // Ditambahkan karena ini adalah elemen visual utama di atas lipatan (above-the-fold)
          sizes='50vw' // Karena menggunakan grid lg:grid-cols-2, ukurannya selalu 50% lebar layar PC
          className='object-cover z-10'
          // className='object-cover z-10 group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* 1. Bagian Kiri: Area Form (Login / Register) */}
      <div className='flex flex-col justify-center px-4 py-8 sm:px-4 lg:px-20 xl:px-24  overflow-y-auto'>
        <div className='mx-auto w-full max-w-sm'>{children}</div>
      </div>
    </div>
  );
}
