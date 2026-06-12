'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { RestaurantList } from '@/features/resto/restaurant-list';

export default function HomePage() {
  const { user, isInitializing } = useAuth();

  // 1. Keep layout stable during boot hydration checks
  if (isInitializing) {
    return (
      <div className='h-screen w-full bg-slate-950 flex items-center justify-center text-white text-lg'>
        Loading Foody...
      </div>
    );
  }

  // 2. VIEW B: SHOW USER NAME AND PHONE ON HOME PAGE ONCE LOGGED IN
  if (user) {
    return (
      <div className='min-h-screen bg-slate-50 text-slate-900 pt-24 px-6 max-w-7xl mx-auto w-full'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6 mb-8'>
          <div>
            {/* Show User Name (fallback to email if name string isn't populated yet) */}
            <h1 className='text-3xl font-extrabold tracking-tight text-slate-900'>
              Welcome, {user.name || user.email.split('@')[0]}!
            </h1>

            {/* Display User Phone Number metadata metadata field row */}
            <p className='text-sm text-slate-500 mt-1.5 font-medium'>
              Phone Number:{' '}
              <span className='text-slate-800 font-semibold'>
                {user.phone || 'Not Provided'}
              </span>
            </p>
          </div>

          <div className='relative w-full sm:max-w-xs'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4' />
            <Input
              type='text'
              placeholder='Cari restoran...'
              className='w-full h-10 pl-10 pr-4 rounded-full bg-white border border-slate-200'
            />
          </div>
        </div>

        {/* Restaurants Content Body Grid */}
        <main className='w-full pb-12'>
          <h2 className='text-xl font-bold text-slate-800 mb-6'>
            Daftar Restoran
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white border rounded-2xl p-6 text-center text-slate-400 border-dashed'>
              Restaurant data list elements loading loop goes here.
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. VIEW A: STATIC GUEST BACKGROUND BANNER
  return (
    <div className='w-full overflow-hidden'>
      <div
        className='h-screen w-full bg-cover bg-no-repeat bg-center text-white flex flex-col justify-between pt-16'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/home-image.png')`,
        }}
      >
        <main className='flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto w-full'>
          <h1 className='text-4xl md:text-6xl font-bold mb-4 tracking-tight'>
            Explore Culinary Experiences
          </h1>
          <p className='text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl font-light'>
            Search and refine your choice to discover the perfect restaurant.
          </p>

          <div className='relative w-full max-w-2xl'>
            <Search className='absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5' />
            <Input
              type='text'
              placeholder='Search restaurants, food and drink'
              className='w-full h-14 pl-14 pr-6 rounded-full bg-white text-black text-lg focus-visible:ring-2 focus-visible:ring-offset-0 border-none shadow-xl'
            />
          </div>
        </main>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Rekomendasi Restoran</h1>
        <RestaurantList />
      </div>
    </div>
  );
}
