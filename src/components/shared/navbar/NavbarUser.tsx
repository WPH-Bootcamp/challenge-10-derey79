'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MapPin, FileText, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthUser } from './NavMobileMenu';

interface NavUserControlProps {
  user: AuthUser;
  initials: string;
  cartItemsCount: number;
  isScrolled: boolean;
  onLogout: () => void;
  isMobile?: boolean;
}

export function NavUserControl({
  user,
  initials,
  cartItemsCount,
  isScrolled,
  onLogout,
  isMobile = false,
}: NavUserControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fungsi menutup popup otomatis ketika klik di luar area komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // RENDER UNTUK MOBILE PANEL (Tetap sesuai bawaan kode Anda)
  if (isMobile) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='w-11 h-11 border border-slate-200 shadow-sm'>
            <AvatarImage
              src={user.avatar || undefined}
              alt={user.name || 'User'}
            />
            <AvatarFallback className='bg-slate-900 text-white font-bold text-sm'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col min-w-0'>
            <span className='font-bold text-sm text-slate-900 truncate'>
              {user.name || 'User'}
            </span>
            <span className='text-xs text-slate-500 truncate'>
              {user.email || ''}
            </span>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant='destructive'
          className='w-full rounded-full flex items-center justify-center gap-2 h-11 font-semibold shadow-sm cursor-pointer'
        >
          <LogOut size={16} />
          Logout Sesi
        </Button>
      </div>
    );
  }

  // RENDER UNTUK DESKTOP PANEL DENGAN POPUP DROPDOWN
  return (
    <div className='flex items-center gap-5 relative' ref={dropdownRef}>
      {/* 1. ICON KERANJANG BELANJA */}
      <Link
        href='/cart'
        className={cn(
          'relative p-1.5 rounded-full transition-colors cursor-pointer',
          isScrolled
            ? 'text-slate-700 hover:bg-slate-100'
            : 'text-white hover:bg-white/10'
        )}
      >
        <ShoppingBag size={22} />
        {cartItemsCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-600 text-[10px] font-bold text-white w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm'>
            {cartItemsCount}
          </span>
        )}
      </Link>

      {/* 2. AREA PEMICU POPUP (AVATAR & NAMA BISA DIKLIK) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2.5 max-w-37.5 min-w-0 focus:outline-none cursor-pointer group text-left'
      >
        <Avatar className='w-9 h-9 border border-orange-500/50 shadow-sm transition-transform group-hover:scale-105 shrink-0'>
          <AvatarImage
            src={user.avatar || undefined}
            alt={user.name || 'User'}
          />
          <AvatarFallback className='bg-slate-900 text-white font-bold text-xs'>
            {initials}
          </AvatarFallback>
        </Avatar>

        <span
          className={cn(
            'text-sm font-semibold truncate select-none transition-colors group-hover:text-orange-500',
            isScrolled ? 'text-slate-700' : 'text-white'
          )}
          title={user.name || 'User'}
        >
          {user.name || 'User'}
        </span>
      </button>

      {/* 3. FLOATING POPUP DROPDOWN BOX (Sesuai Referensi Gambar) */}
      {isOpen && (
        <div className='absolute right-0 top-full mt-3 w-72 rounded-3xl bg-white p-5 border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 animate-in fade-in slide-in-from-top-2 duration-200'>
          {/* USER HEADER IDENTITY */}
          <div className='flex items-center gap-3 pb-4 mb-4 border-b border-slate-100/80'>
            <Avatar className='w-11 h-11 border border-slate-100 shadow-sm shrink-0'>
              <AvatarImage
                src={user.avatar || undefined}
                alt={user.name || 'User'}
              />
              <AvatarFallback className='bg-slate-900 text-white font-bold text-sm'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className='flex flex-col min-w-0'>
              <span className='font-bold text-slate-900 text-sm tracking-tight truncate'>
                {user.name || 'User'}
              </span>
              {user.email && (
                <span className='text-xs text-slate-400 truncate mt-0.5'>
                  {user.email}
                </span>
              )}
            </div>
          </div>

          {/* MENU LINK LIST ACTIONS */}
          <div className='space-y-0.5'>
            <Link
              href='/profile/address'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3.5 w-full px-3 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm group cursor-pointer'
            >
              <MapPin
                size={18}
                className='text-slate-900 group-hover:text-orange-500 transition-colors shrink-0'
              />
              <span className='group-hover:translate-x-0.5 transition-transform'>
                Delivery Address
              </span>
            </Link>

            <Link
              href='/profile/orders'
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-3.5 w-full px-3 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm group cursor-pointer'
            >
              <FileText
                size={18}
                className='text-slate-900 group-hover:text-orange-500 transition-colors shrink-0'
              />
              <span className='group-hover:translate-x-0.5 transition-transform'>
                My Orders
              </span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className='flex items-center gap-3.5 w-full px-3 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm group text-left cursor-pointer'
            >
              <LogOut
                size={18}
                className='text-slate-900 group-hover:text-red-500 transition-colors shrink-0'
              />
              <span className='group-hover:translate-x-0.5 transition-transform'>
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
