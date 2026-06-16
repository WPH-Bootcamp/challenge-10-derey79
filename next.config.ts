import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Gunakan remotePatterns untuk konfigurasi host eksternal yang jauh lebih aman
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // 1. Tetap mengizinkan Cloudinary Anda
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net', // 2. Menambahkan domain baru McDonald's
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '://unsplash.com', // 3. Jaga-jaga jika ada fallback gambar dari Unsplash
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
