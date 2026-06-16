'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';

export function Footer() {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith('/login') || pathname.startsWith('/register');
  if (isAuthPage) return null;

  const exploreLinks = [
    { name: 'All Food', href: '/all-food' },
    { name: 'Nearby', href: '/nearby' },
    { name: 'Discount', href: '/discount' },
    { name: 'Best Seller', href: '/best-seller' },
    { name: 'Delivery', href: '/delivery' },
    { name: 'Lunch', href: '/lunch' },
  ];

  const helpLinks = [
    { name: 'How to Order', href: '/how-to-order' },
    { name: 'Payment Methods', href: '/payment-methods' },
    { name: 'Track My Order', href: '/track-order' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <footer className='w-full bg-[#0a0c10] text-white py-16 px-6 md:px-12 select-none border-t border-zinc-900'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6'>
        <FooterBrand />

        <FooterLinks title='Explore' links={exploreLinks} />
        <FooterLinks title='Help' links={helpLinks} />
      </div>
    </footer>
  );
}
