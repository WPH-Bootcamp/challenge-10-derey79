'use client';

import React from 'react';
import Image from 'next/image';

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className='flex flex-col text-left mb-8 select-none'>
      {/* Brand Logo & Name */}
      <div className='flex items-center gap-2 mb-3'>
        <Image
          src='/Logo.png'
          alt='Foody Logo'
          priority
          width={43}
          height={43}
          className='object-cover'
        />
        <span className='text-3xl font-extrabold text-slate-900 tracking-tight font-sans'>
          Foody
        </span>
      </div>

      {/* Dynamic Header Texts */}
      <h1 className='text-2xl font-extrabold text-slate-900 mb-1 tracking-tight'>
        {title}
      </h1>
      <p className='text-sm font-medium text-slate-500'>{description}</p>
    </div>
  );
}
