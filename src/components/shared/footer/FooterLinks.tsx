'use client';

import Link from 'next/link';
import { FooterLinksColProps } from '@/types';

export function FooterLinks({ title, links }: FooterLinksColProps) {
  return (
    <div className='md:col-span-3 flex flex-col space-y-4'>
      <h4 className='text-sm font-black tracking-wider uppercase text-zinc-100 select-none'>
        {title}
      </h4>
      <ul className='flex flex-col space-y-3.5 pt-1'>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className='text-zinc-400 hover:text-white text-sm font-medium transition-colors cursor-pointer block w-fit'
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
