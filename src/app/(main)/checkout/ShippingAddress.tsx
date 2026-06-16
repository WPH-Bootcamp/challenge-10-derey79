'use client';

import React from 'react';
import Image from 'next/image';

interface ShippingAddressProps {
  address?: string;
  phone?: string;
  onChangeAddressClick: () => void;
}

export function ShippingAddress({
  address = 'Jl. Sudirman No. 25, Jakarta Pusat, 10220',
  phone = '0812-3456-7890',
  onChangeAddressClick,
}: ShippingAddressProps) {
  return (
    <div className='w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-left space-y-3.5 select-none'>
      {/* HEADER: EMOJI PIN + JUDUL */}
      <div className='flex items-center gap-2'>
        <Image
          src='/address.png' // Mengambil gambar otomatis dari folder /public/address.png
          alt='Address Icon'
          width={20} // Ukuran piksel yang disesuaikan dengan teks (20px)
          height={20}
          className='object-contain'
        />
        <h2 className='text-sm font-bold text-slate-900 tracking-tight'>
          Delivery Address
        </h2>
      </div>

      {/* DETAIL ALAMAT & NOMOR TELEPON */}
      <div className='space-y-2 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed max-w-2xl'>
        <p className='truncate-2-lines'>{address}</p>
        <p className='tracking-wide text-slate-700'>{phone}</p>
      </div>

      {/* TOMBOL AKSI BENTUK KAPSUL (PILIH/UBAH) */}
      <div className='pt-0.5'>
        <button
          onClick={onChangeAddressClick}
          className='px-6 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98] cursor-pointer'
        >
          Change
        </button>
      </div>
    </div>
  );
}
