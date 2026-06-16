import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface PaymentMethodProps {
  balance: number;
  onMethodChange?: () => void;
}

export function PaymentMethod({ balance, onMethodChange }: PaymentMethodProps) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-4 mb-4'>
        <CreditCard className='text-orange-500 h-5 w-5' />
        <h2 className='text-lg font-bold text-slate-900'>Metode Pembayaran</h2>
      </div>
      <div className='flex items-center justify-between rounded-xl border border-orange-200 bg-orange-50/50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='rounded-lg bg-orange-500 p-2 text-white'>
            <Wallet size={18} />
          </div>
          <div>
            <p className='text-sm font-bold text-slate-900'>
              Dompet Digital (E-Wallet)
            </p>
            <p className='text-xs text-orange-700 font-medium mt-0.5'>
              Saldo: {formatRupiah(balance)}
            </p>
          </div>
        </div>
        <span
          onClick={onMethodChange}
          className='text-xs font-bold text-orange-600 cursor-pointer hover:underline select-none'
        >
          Ubah
        </span>
      </div>
    </div>
  );
}
