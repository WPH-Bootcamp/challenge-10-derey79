'use client';

import dynamic from 'next/dynamic';

const HomeContainer = dynamic(
  () =>
    import('@/components/shared/home/HomeContainer').then(
      (mod) => mod.HomeContainer
    ),
  {
    ssr: false,
    loading: () => (
      <div className='h-screen w-full bg-slate-950 flex items-center justify-center text-white text-lg font-medium select-none'>
        Loading Foody...
      </div>
    ),
  }
);

export default function HomePage() {
  return <HomeContainer />;
}
