import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal terdiri dari 2 karakter'),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .trim()
      .email('Format email tidak valid')
      .toLowerCase(), // Safe formatting sanitization
    phone: z
      .string()
      .min(10, 'Nomor telepon minimal 10 digit')
      .max(15, 'Nomor telepon maksimal 15 digit')
      .regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka'),
    password: z.string().min(6, 'Password minimal terdiri dari 6 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
