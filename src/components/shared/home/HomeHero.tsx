'use client';

import { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeHeroProps {
  keyword: string;
  isSearching: boolean;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isBlur: boolean;
}

export function HomeHero({
  keyword,
  isSearching,
  onSearchChange,
  isBlur,
}: HomeHeroProps) {
  return (
    // Kontainer Utama (Tetap Jernih)
    <div className='relative h-screen w-full text-white flex flex-col justify-between pt-16 select-none overflow-hidden'>
      {/* 🛠️ LAPISAN BACKGROUND YANG TERISOLASI (Hanya Bagian Ini yang Mengalami Blur & Scale) */}
      <div
        className={cn(
          'absolute inset-0 bg-cover bg-no-repeat bg-center transition-all duration-500 ease-in-out -z-10',
          isBlur ? 'blur-sm scale-[1.03]' : 'blur-none scale-100'
        )}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/home-image.png')`,
        }}
      />

      <main className='flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full z-10'>
        <div className='w-full max-w-5xl'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-in fade-in slide-in-from-top-3 duration-500'>
            Explore Culinary Experiences
          </h1>
          <p className='text-lg md:text-2xl font-bold space-y-6 text-neutral-300 mb-8 animate-in fade-in slide-in-from-top-3 duration-700'>
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>
        {/* search here... */}
        <div className='relative w-full max-w-2xl group animate-in fade-in zoom-in-95 duration-500'>
          {isSearching ? (
            <Loader2 className='absolute left-6 top-1/2 -translate-y-1/2 text-[#C92118] w-5 h-5 animate-spin' />
          ) : (
            <Search className='absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-[#C92118]' />
          )}
          <Input
            type='text'
            value={keyword}
            onChange={onSearchChange}
            placeholder='Search restaurants, food and drink'
            className='w-full h-14.5 pl-15 pr-6 rounded-full bg-white text-slate-900 text-base placeholder:text-slate-400 border border-slate-200/80 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] focus-visible:ring-2 focus-visible:ring-[#C92118] transition-all font-normal'
          />
        </div>
      </main>
    </div>
  );
}
