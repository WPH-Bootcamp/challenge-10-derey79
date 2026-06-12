import Image from 'next/image';

export default function LoginPage() {
  return (
    // Container utama yang memenuhi layar dan memberikan background luar
    <div className='min-h-screen w-full bg-gray-100 flex items-center justify-center'>
      {/* Wrapper halaman dengan batas maksimal 1440px */}
      <div className='w-full max-w-360 min-h-screen bg-white flex flex-col md:flex-row shadow-2xl overflow-hidden'>
        {/* Sisi Kiri: Gambar (Sembunyi di HP, muncul di MD ke atas) */}
        <div className='hidden md:flex md:w-1/2 relative bg-blue-50'>
          <Image
            src='/login-image.jpg' // Ganti dengan path gambar Anda
            alt='Login Visual'
            fill
            priority
            className='object-cover'
          />
          {/* Overlay text opsional di atas gambar */}
          <div className='absolute inset-0 bg-black/30 flex flex-col justify-end p-12 text-white z-10'>
            <h1 className='text-4xl font-bold mb-4'>Selamat Datang Kembali</h1>
            <p className='text-sm opacity-80'>
              Silakan masuk untuk melanjutkan akses ke akun Anda.
            </p>
          </div>
        </div>

        {/* Sisi Kanan: Formulir Login */}
        <div className='w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 min-h-screen md:min-h-0'>
          <div className='w-full max-w-md space-y-8'>
            {/* Header Form */}
            <div className='text-center md:text-left'>
              <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
                Sign In
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                Belum punya akun?{' '}
                <a
                  href='#'
                  className='font-medium text-blue-600 hover:text-blue-500 transition'
                >
                  Daftar sekarang
                </a>
              </p>
            </div>

            {/* Input Form */}
            <form className='mt-8 space-y-6'>
              <div className='space-y-4'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Email Address
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    className='mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                    placeholder='nama@email.com'
                  />
                </div>

                <div>
                  <div className='flex justify-between items-center'>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Password
                    </label>
                    <a
                      href='#'
                      className='text-xs text-blue-600 hover:underline'
                    >
                      Lupa password?
                    </a>
                  </div>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    className='mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition'
                    placeholder='••••••••'
                  />
                </div>
              </div>

              {/* Tombol Submit */}
              <div>
                <button
                  type='submit'
                  className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition'
                >
                  Masuk ke Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
