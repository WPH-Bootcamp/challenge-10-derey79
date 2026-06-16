'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import { NavAuthButtons } from './NavAuthButtons';
import { NavUserControl } from './NavbarUser';

export interface AuthUser {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

interface NavMobileMenuProps {
  isOpen: boolean;
  pathname: string;
  user: AuthUser | null; // User bisa bernilai AuthUser atau null saat belum login
  initials: string;
  cartItemsCount: number;
  isScrolled: boolean;
  onLogout: () => void;
  onClose: () => void;
}

export function NavMobileMenu({
  isOpen,
  pathname,
  user,
  initials,
  cartItemsCount,
  isScrolled,
  onLogout,
  onClose,
}: NavMobileMenuProps) {
  if (!isOpen) return null;

  const links = [
    { name: 'Cart', href: '/cart', icon: ShoppingBag, private: true },
  ];
  const visibleLinks = links.filter((link) => !link.private || user);

  return (
    <div className='md:hidden bg-white border-t border-slate-100 shadow-xl px-4 pt-2 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-200'>
      <div className='space-y-1'>
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-base font-medium transition-colors',
              pathname === link.href
                ? 'bg-orange-50 text-orange-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
            onClick={onClose}
          >
            {link.icon && <link.icon size={18} />}
            {link.name}
          </Link>
        ))}
      </div>

      <div className='pt-4 border-t border-slate-100 px-1'>
        {user ? (
          <NavUserControl
            user={user}
            initials={initials}
            cartItemsCount={cartItemsCount}
            isScrolled={isScrolled}
            onLogout={onLogout}
            isMobile
          />
        ) : (
          <NavAuthButtons isScrolled={true} onActionClick={onClose} />
        )}
      </div>
    </div>
  );
}
