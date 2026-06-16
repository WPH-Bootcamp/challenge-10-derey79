'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NavLogoProps {
  isScrolled: boolean;
}

export function NavLogo({ isScrolled }: NavLogoProps) {
  return (
    <Link href='/' className='flex items-center gap-2 group cursor-pointer'>
      <Image
        src={isScrolled ? '/foody-logo-red.png' : '/foody-home-logo.png'}
        alt='Foody Logo'
        width={36}
        height={36}
        priority
        className='group-hover:scale-105 transition-transform duration-200'
      />
      <span
        className={cn(
          'text-3xl font-bold tracking-wide transition-colors',
          isScrolled ? 'text-slate-900' : 'text-white'
        )}
      >
        Foody
      </span>
    </Link>
  );
}
