'use client';

import dynamic from 'next/dynamic';

const CartContainer = dynamic(() => import('@/features/cart/CartContainer'), {
  ssr: false,
  loading: () => (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-lg font-medium'>
      Memuat Keranjang...
    </div>
  ),
});

export default function CartPage() {
  return <CartContainer />;
}
