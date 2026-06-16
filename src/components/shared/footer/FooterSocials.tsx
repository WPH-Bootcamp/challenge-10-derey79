'use client';

import Image from 'next/image';
import { SocialItem } from '@/types';

export function FooterSocials() {
  const socials: SocialItem[] = [
    {
      name: 'Facebook',
      href: 'https://facebook.com',
      iconSrc: '/facebook.png',
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com',
      iconSrc: '/instagram.png',
    },
    {
      name: 'Linkedin',
      href: 'https://linkedin.com',
      iconSrc: '/linkedin.png',
    },
    { name: 'TikTok', href: 'https://tiktok.com', iconSrc: '/toktok.png' },
  ];

  return (
    <div className='flex flex-col space-y-4 pt-2'>
      <span className='text-sm font-bold tracking-wide text-zinc-200 select-none'>
        Follow on Social Media
      </span>
      <div className='flex items-center gap-3'>
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target='_blank'
            rel='noreferrer'
            className='w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 hover:border-white flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-sm group'
          >
            <Image
              src={social.iconSrc}
              alt={social.name}
              width={16}
              height={16}
              className='object-contain opacity-80 group-hover:opacity-100 transition-opacity'
            />
          </a>
        ))}
      </div>
    </div>
  );
}
