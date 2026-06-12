'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  // Menggunakan useState agar QueryClient tidak terbuat ulang saat re-render di Next.js Client Component
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Menghindari fetch ulang otomatis saat pindah tab browser
            retry: 1, // Mencoba ulang 1 kali jika request gagal
            staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
