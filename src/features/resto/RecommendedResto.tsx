'use client';

import { useRecommendedRestaurants } from '@/lib/query/useRecommendedRestaurants';
import { RestoCard } from './RestoCard';

export function RecommendedResto() {
  const { data: restaurants, isLoading, isError } = useRecommendedRestaurants();

  // 1. TAMPILAN SKELETON LOADING (Mencegah UI Berkedip)
  if (isLoading) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-8 select-none'>
        <div className='h-8 bg-slate-100 rounded-md w-64 mb-6 animate-pulse' />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='animate-pulse bg-slate-100 h-64 rounded-2xl border border-slate-200/40'
            />
          ))}
        </div>
      </div>
    );
  }

  // 2. FALLBACK KETIKA API EROR
  if (isError || !restaurants) {
    return (
      <div className='text-center py-12 text-sm text-red-500 font-medium'>
        Gagal memuat rekomendasi restoran. Silakan segarkan halaman.
      </div>
    );
  }

  // 3. FALLBACK KETIKA DATA KOSONG
  // if (restaurants.length === 0) {
  //   return (
  //     <div className='text-center py-12 text-sm text-slate-500'>
  //       Tidak ada rekomendasi restoran untuk saat ini.
  //     </div>
  //   );
  // }

  // 4. RENDERING DATA REKOMENDASI RESTORAN
  return (
    <div className='max-w-6xl mx-auto px-4 py-8 select-none'>
      <h3 className='text-2xl font-black tracking-tight text-slate-900 mb-6'>
        Recommended
      </h3>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {restaurants.map((resto) => (
          <RestoCard key={resto.id} resto={resto} />
        ))}
      </div>
    </div>
  );
}
