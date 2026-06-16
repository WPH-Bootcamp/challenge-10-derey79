'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getErrorMessage } from '@/lib/api/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/lib/api/authService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AuthHeader } from '@/components/shared/auth/AuthHeader';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email tidak boleh kosong.' })
    .email({ message: 'Format email tidak valid.' }),
  password: z
    .string()
    .min(1, { message: 'Password tidak boleh kosong.' })
    .min(6, { message: 'Password minimal harus terdiri dari 6 karakter.' }),

  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Status Trackers
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const callbackUrl = searchParams.get('callback');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // submit
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      const targetPayload = response?.data;

      const token = targetPayload?.token;
      const userProfile = targetPayload?.user;

      if (token && userProfile) {
        setAuth(token, {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          avatar: userProfile.avatar,
        });

        const destination = callbackUrl ? decodeURIComponent(callbackUrl) : '/';

        router.push(destination);
        return;
      } else {
        setServerError(
          'Login Gagal: Parameter token atau profil pengguna tidak ditemukan.'
        );
      }
    } catch (err: unknown) {
      setServerError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full mx-auto select-none'>
      {/* Brand Logo & Header */}
      <AuthHeader
        title='Welcome Back'
        description="Good to see you again! Let's eat."
      />

      <div className='grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl mb-8'>
        <button
          type='button'
          className='py-2 text-sm font-bold rounded-lg bg-white text-slate-900 shadow-sm transition-all cursor-default'
        >
          Sign in
        </button>
        <Link
          href='/register'
          className='py-2 text-sm font-medium rounded-lg text-slate-500 hover:text-slate-900 text-center transition-all cursor-pointer flex items-center justify-center'
        >
          Sign up
        </Link>
      </div>

      {/* error Alert */}
      {serverError && (
        <div className='mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium animate-in fade-in duration-200'>
          {serverError}
        </div>
      )}

      {/* Form Fields */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
        autoComplete='off'
      >
        {/* email */}
        <div className='space-y-1'>
          <Input
            id='email'
            type='email'
            placeholder='Email Address'
            disabled={isLoading}
            className={`w-full px-4 py-3 h-11 rounded-xl ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            {...register('email')}
          />
          {errors.email && (
            <p className='text-xs font-semibold text-red-600 pl-1 animate-in fade-in duration-150'>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* password */}
        <div className='space-y-1'>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              disabled={isLoading}
              className={`w-full px-4 py-3 h-11 rounded-xl pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register('password')}
            />

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setShowPassword((prev) => !prev)}
              className='absolute right-1.5 top-1.5 h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-transparent transition-colors cursor-pointer'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          {errors.password && (
            <p className='text-xs font-semibold text-red-600 pl-1 animate-in fade-in duration-150'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me Option */}
        <div className='flex items-center pt-0.5'>
          <label className='flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-600'>
            <input
              type='checkbox'
              className='w-4 h-4 rounded border-slate-300 text-[#C92118] focus:ring-[#C92118] accent-[#C92118] cursor-pointer'
              {...register('rememberMe')}
            />
            Remember Me
          </label>
        </div>

        {/* Action Submit Button */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full mt-2 h-12 bg-[#C92118] hover:bg-[#B01C14] text-white font-bold rounded-full text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:bg-slate-300 flex items-center justify-center gap-2'
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className='animate-spin' />
              Processing Sesi...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </div>
  );
}
