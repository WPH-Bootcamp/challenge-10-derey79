import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Mengubah min-h-screen menjadi h-screen untuk layout split-screen yang stabil
    <div className='min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background text-foreground select-none'>
      <div className='hidden lg:block relative h-full w-full overflow-hidden group'>
        <Image
          src='/login-image.png'
          alt='Resto Name'
          fill
          priority
          sizes='50vw'
          className='object-cover z-10'
        />
      </div>

      {/* Form (Login / Register) */}
      <div className='flex flex-col justify-center px-4 py-8 sm:px-4 lg:px-20 xl:px-24  overflow-y-auto'>
        <div className='mx-auto w-full max-w-sm'>{children}</div>
      </div>
    </div>
  );
}
