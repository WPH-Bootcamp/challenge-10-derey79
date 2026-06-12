'use client'; // Required for using React hooks/state in Next.js App Router

import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className='w-full flex flex-col  animate-fadeIn'>
      {/* Brand Logo & Header */}
      <div className='flex flex-col items-left text-left mb-8'>
        <div className='flex items-center gap-2 mb-3'>
          {/* Custom SVG stylized to mimic the Foody red sunburst logo */}
          <Image
            src='/Logo.png' // Pastikan file ini ada di folder public/main_image.png
            alt='Resto Name'
            priority // Ditambahkan karena ini adalah elemen visual utama di atas lipatan (above-the-fold)
            width={43} // Sets native aspect ratio width
            height={43} // Sets native aspect ratio height // Karena menggunakan grid lg:grid-cols-2, ukurannya selalu 50% lebar layar PC
            className='object-cover z-10'
            // className='object-cover z-10 group-hover:scale-105 transition-transform duration-300'
          />

          <span className='text-3xl font-extrabold text-slate-900 tracking-tight'>
            Foody
          </span>
        </div>
        <h1 className='items-left text-2xl font-extrabold text-slate-900 mb-1'>
          Welcome Back
        </h1>
        <p className='text-sm font-medium text-neutral-950'>
          Good to see you again! Lets eat.
        </p>
      </div>

      {/* Tab Control Bar sliding to the right side */}
      <div className='relative w-full bg-gray-100 p-1 rounded-xl flex items-center mb-6 border border-gray-200/50'>
        <div className='absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-xs rounded-lg border border-black/5 left-[calc(50%+2px)]' />
        <Link
          href='/login'
          className='relative z-10 flex-1 py-2.5 text-sm text-center font-semibold text-gray-400 hover:text-gray-600 cursor-pointer'
        >
          Sign in
        </Link>
        <Link
          href='/register'
          className='relative z-10 flex-1 py-2.5 text-sm text-center font-bold text-gray-900 cursor-pointer'
        >
          Sign up
        </Link>
      </div>

      {/* Full Registration Form Fields */}
      <form className='w-full flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Name'
          className='w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium'
        />
        <input
          type='email'
          placeholder='Email'
          className='w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium'
        />
        <input
          type='tel'
          placeholder='Number Phone'
          className='w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium'
        />
        <div className='relative'>
          <input
            type='password'
            placeholder='Password'
            className='w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium'
          />
          <button
            type='button'
            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            👁️
          </button>
        </div>
        <div className='relative'>
          <input
            type='password'
            placeholder='Confirm Password'
            className='w-full pl-4 pr-10 py-3.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 font-medium'
          />
          <button
            type='button'
            className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            👁️
          </button>
        </div>
        <button
          type='submit'
          className='w-full mt-2 bg-[#be1e1e] hover:bg-[#a31818] text-white py-3.5 rounded-full font-bold text-sm tracking-wide transition-all cursor-pointer'
        >
          Register
        </button>
      </form>
    </div>
  );
}
