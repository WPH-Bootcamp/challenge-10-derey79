'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { AuthHeader } from '@/components/shared/auth/AuthHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api/axios';
import { getErrorMessage } from '@/lib/api/axios';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();

  // Status internal form
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  // submit
  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        latitude: -6.2088, // Koordinat default Jakarta/Depok (Tipe: Number)
        longitude: 106.8456, // Koordinat default Jakarta/Depok (Tipe: Number)
      };

      console.log('Sending structured payload to backend:', payload);
      // console.log('berhasilkah?');
      const response = await api.post('/api/auth/register', payload);

      // Deteksi kesuksesan berdasarkan skema JSON "success: true" dari server Anda
      if (response.data?.success === true || response.status === 201) {
        alert('Pendaftaran Berhasil! Mengalihkan ke halaman login...');
        router.push('/login');
      } else {
        setError(response.data?.message || 'Gagal mendaftarkan akun.');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className='w-full flex flex-col select-none animate-in fade-in duration-300'>
      {/* Brand Logo & Header */}
      <AuthHeader
        title='Welcome Back'
        description="Good to see you again! Let's eat."
      />

      {/* Tab Control Bar */}
      <div className='relative w-full bg-gray-100 p-1 rounded-xl flex items-center mb-6 border border-gray-200/50'>
        <div className='absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white shadow-sm rounded-lg border border-black/5 left-[calc(50%+2px)]' />
        <Link
          href='/login'
          className='relative z-10 flex-1 py-2.5 text-sm text-center font-semibold text-gray-400 hover:text-gray-600 cursor-pointer'
        >
          Sign in
        </Link>
        <Link
          href='/register'
          className='relative z-10 flex-1 py-2.5 text-sm text-center font-bold text-gray-900 cursor-default'
        >
          Sign up
        </Link>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium'>
          {error}
        </div>
      )}

      {/* FULL REGISTRATION FORM FIELDS */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full flex flex-col gap-4'
        autoComplete='off'
      >
        {/* Input Name */}
        <div>
          <Input
            type='text'
            placeholder='Name'
            disabled={isSubmitting}
            {...register('name')}
            className='w-full px-4 py-3.5 h-11 rounded-xl font-medium text-sm'
          />
          {errors.name && (
            <p className='text-xs font-bold text-red-600 mt-1 pl-1'>
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Input Email */}
        <div>
          <Input
            type='email'
            placeholder='Email'
            disabled={isSubmitting}
            {...register('email')}
            className='w-full px-4 py-3.5 h-11 rounded-xl font-medium text-sm'
          />
          {errors.email && (
            <p className='text-xs font-bold text-red-600 mt-1 pl-1'>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Input Phone */}
        <div>
          <Input
            type='tel'
            placeholder='Number Phone'
            disabled={isSubmitting}
            {...register('phone')}
            className='w-full px-4 py-3.5 h-11 rounded-xl font-medium text-sm'
          />
          {errors.phone && (
            <p className='text-xs font-bold text-red-600 mt-1 pl-1'>
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Input Password */}
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            disabled={isSubmitting}
            {...register('password')}
            className='w-full pl-4 pr-10 py-3.5 h-11 rounded-xl font-medium text-sm'
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-2 top-1.5 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent transition-colors cursor-pointer'
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          {errors.password && (
            <p className='text-xs font-bold text-red-600 mt-1 pl-1'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Input Confirm Password */}
        <div className='relative'>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            disabled={isSubmitting}
            {...register('confirmPassword')}
            className='w-full pl-4 pr-10 py-3.5 h-11 rounded-xl font-medium text-sm'
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className='absolute right-2 top-1.5 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent transition-colors cursor-pointer'
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          {errors.confirmPassword && (
            <p className='text-xs font-bold text-red-600 mt-1 pl-1'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Register Submit Button */}
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-full mt-2 bg-[#be1e1e] hover:bg-[#a31818] text-white h-12 rounded-full font-bold text-sm tracking-wide transition-all cursor-pointer active:scale-[0.99] disabled:bg-slate-300'
        >
          {isSubmitting ? (
            <span className='flex items-center gap-2'>
              <Loader2 className='w-4 h-4 animate-spin' />
              Mendaftarkan Akun...
            </span>
          ) : (
            'Register'
          )}
        </Button>
      </form>
    </div>
  );
}
