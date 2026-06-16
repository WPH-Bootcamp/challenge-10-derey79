'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FooterSocials } from './FooterSocials';

export function FooterBrand() {
  return (
    <div className='md:col-span-6 flex flex-col space-y-6'>
      <Link
        href='/'
        className='flex items-center gap-2 group w-fit cursor-pointer z-10'
      >
        <Image
          src='/Logo.png'
          alt='Foody Logo'
          width={32}
          height={32}
          priority
          className='object-contain group-hover:scale-105 transition-transform duration-200'
        />
        <span className='font-black text-2xl tracking-tight font-sans text-white'>
          Foody
        </span>
      </Link>

      <p className='text-zinc-400 text-sm font-medium leading-relaxed max-w-sm'>
        Enjoy homemade flavors & chef&apos;s signature dishes, freshly prepared
        every day. Order online or visit our nearest branch.
      </p>

      <FooterSocials />
    </div>
  );
}
