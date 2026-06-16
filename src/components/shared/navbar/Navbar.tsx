'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query'; // 1. Import useQuery
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cartService } from '@/lib/api/cart'; // 2. Import your API cart handler
import { CART_QUERY_KEYS } from '@/lib/query/queries'; // 3. Import your global query keys

import { NavLogo } from './NavbarLogo';
import { NavAuthButtons } from './NavAuthButtons';
import { NavUserControl } from './NavbarUser';
import { NavMobileMenu } from './NavMobileMenu';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isRestoPage = pathname === '/resto' || pathname.startsWith('/resto/');
  const isCartOrCheckoutPage = pathname === '/cart' || pathname === '/checkout';

  const isDarkNavbarNeeded = isScrolled || isRestoPage || isCartOrCheckoutPage;

  // This automatically synchronizes whenever any component invalidates 'cartKey'
  const { data: cartData } = useQuery({
    queryKey: CART_QUERY_KEYS.list(),
    queryFn: cartService.getCart,
    enabled: isLoggedIn, // Only run network queries if the user profile is active
  });

  // 5. EXTRACT COALESCED ITEM TOTALS REACTIVELY
  const liveCartItemsCount = useMemo(() => {
    return cartData?.summary?.totalItems ?? 0;
  }, [cartData]);

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register');

  const userInitials = (() => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  })();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    router.push('/');
  };

  if (isAuthPage) return null;

  return (
    // <nav
    //   className={cn(
    //     'fixed top-0 left-0 w-full h-16 z-50 transition-all duration-300 select-none',
    //     isScrolled
    //       ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
    //       : 'bg-transparent border-b border-transparent'
    //   )}
    // >
    <nav
      className={cn(
        'fixed top-0 left-0 w-full h-16 z-50 transition-all duration-300 select-none',
        // Jika di halaman resto, buat background putih transparan agar menyatu dengan konten banner Solaria Anda
        isDarkNavbarNeeded
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between'>
        {/* <NavLogo isScrolled={isScrolled} /> */}
        <NavLogo isScrolled={isDarkNavbarNeeded} />

        {/* DESKTOP CONTROLS */}
        <div className='hidden md:flex items-center gap-6'>
          {user ? (
            <NavUserControl
              user={user}
              initials={userInitials}
              cartItemsCount={liveCartItemsCount}
              isScrolled={isDarkNavbarNeeded} // Nama user ikut berubah gelap agar tidak samar
              onLogout={handleLogout}
            />
          ) : (
            <NavAuthButtons isScrolled={isDarkNavbarNeeded} />
          )}
        </div>

        {/* MOBILE HAMBURGER TRIGGER */}
        <div className='md:hidden flex items-center'>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'p-2 rounded-md focus:outline-none transition-colors cursor-pointer',
              isDarkNavbarNeeded
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-200 hover:text-white hover:bg-white/10'
            )}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE BREAKOUT PANEL */}
      <NavMobileMenu
        isOpen={isOpen}
        pathname={pathname}
        user={user}
        initials={userInitials}
        cartItemsCount={liveCartItemsCount}
        isScrolled={isDarkNavbarNeeded}
        onLogout={handleLogout}
        onClose={() => setIsOpen(false)}
      />
    </nav>
  );
}
