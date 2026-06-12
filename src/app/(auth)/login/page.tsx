'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Replaced useNavigate
import { api, getErrorMessage } from '@/lib/api/axios';
import { LoginResponse } from '@/types';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  // Form State
  const router = useRouter(); //

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Endpoint mapped from Swagger: POST /api/auth/login
      const response = await api.post<LoginResponse>('/api/auth/login', {
        email: email,
        password: password,
      });

      console.log('Isi Response API:', response.data);

      // Grab the response authentication details based on your Swagger UI spec
      const { token, user } = response.data;

      // Persist the login data
      // localStorage.setItem('token', token);
      // Persist token based on rememberMe preference
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      localStorage.setItem('user', JSON.stringify(user));

      // Set global Axios authorization headers for subsequent requests (e.g. Best Sellers endpoint)
      // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      router.push('/');
      router.refresh();
      console.log(user);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full mx-auto'>
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

      {/* Segmented Auth Toggle Switch */}
      <div className=' grid grid-cols-2 p-2 bg-slate-100 rounded-xl mb-8'>
        <button className='py-2 text-sm font-medium rounded-lg bg-white text-slate-900 shadow-sm transition-all'>
          Sign in
        </button>
        <Link
          href='/register'
          className='py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 text-center transition-all'
        >
          Sign up
        </Link>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-100 text-red-700 rounded text-sm'>
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Email Input */}
        <div>
          <Input
            id='email'
            type='email'
            placeholder='Email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-3 '
          />
        </div>

        {/* Password Input */}
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className='w-full px-4 py-3 '
          />

          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-2 top-1 h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-transparent transition-colors'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className='h-4.5 w-4.5' />
            ) : (
              <Eye className='h-4.5 w-4.5' />
            )}
          </Button>
        </div>

        {/* Remember Me Checkbox */}
        <div className='flex items-center pt-1'>
          <label className='flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600'>
            <input
              type='checkbox'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='w-4 h-4 rounded border-slate-300 text-[#C92118] focus:ring-[#C92118] accent-[#C92118]'
            />
            Remember Me
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full mt-2 py-3 px-4 bg-[#C92118] hover:bg-[#B01C14] text-white font-bold rounded-full text-sm shadow-md shadow-red-900/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C92118] focus:ring-offset-2'
        >
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
      </form>
    </div>
  );
}
