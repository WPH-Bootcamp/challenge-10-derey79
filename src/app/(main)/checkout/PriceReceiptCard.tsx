'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/lib/utils';
import { PriceReceiptCardProps } from '@/types';

export function PriceReceiptCard({
  itemCount = 0,
  itemTotal,
  deliveryFee,
  platformFee,
  grandTotal,
  isDisable,
  isSubmitting,
  onPayConfirm,
}: PriceReceiptCardProps) {
  return (
    <div className='sticky top-28 rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-left select-none space-y-7'>
      {/* JUDUL: PAYMENT SUMMARY */}
      <h2 className='text-base font-bold text-slate-900 tracking-tight'>
        Payment Summary
      </h2>

      {/* RINCIAN BIAYA (Menggunakan spasi longgar tanpa garis pembatas tengah) */}
      <div className='space-y-5 text-sm font-medium text-slate-800'>
        {/* HARGA ITEM + JUMLAH DINAMIS */}
        <div className='flex justify-between items-center gap-4'>
          <span className='text-slate-800'>Price ({itemCount} items)</span>
          <span className='font-bold text-slate-900'>
            {formatRupiah(itemTotal)}
          </span>
        </div>

        {/* ONGKOS KIRIM */}
        <div className='flex justify-between items-center gap-4'>
          <span className='text-slate-800'>Delivery Fee</span>
          <span className='font-bold text-slate-900'>
            {formatRupiah(deliveryFee)}
          </span>
        </div>

        {/* BIAYA LAYANAN */}
        <div className='flex justify-between items-center gap-4'>
          <span className='text-slate-800'>Service Fee</span>
          <span className='font-bold text-slate-900'>
            {formatRupiah(platformFee)}
          </span>
        </div>

        {/* TOTAL AKHIR (Ada jarak pemisah vertikal di atasnya) */}
        <div className='flex justify-between items-center gap-4 pt-2 text-slate-800'>
          <span>Total</span>
          <span className='text-base font-bold text-slate-900'>
            {formatRupiah(grandTotal)}
          </span>
        </div>
      </div>

      {/* TOMBOL KAPSUL MERAH UTAMA */}
      <div className='pt-1'>
        <Button
          onClick={onPayConfirm}
          disabled={isDisable || isSubmitting}
          className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-semibold h-12 rounded-full transition-all cursor-pointer text-sm shadow-sm active:scale-[0.99]'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Processing...
            </>
          ) : (
            'Buy'
          )}
        </Button>
      </div>
    </div>
  );
}
