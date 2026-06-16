'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// 1. UPDATE THIS INTERFACE TO INCLUDE THE MISSING PROPS
interface NavBreadcrumbProps {
  currentPathName?: string;
  restoId?: number | string; // Added missing field
  isCheckoutPage?: boolean; // Added missing field
}

export function NavBreadcrumb({
  currentPathName = 'Name Resto',
  restoId, // Destructure here
  isCheckoutPage = false, // Destructure here
}: NavBreadcrumbProps) {
  return (
    <div className='w-full max-w-7xl mx-auto px-6 pt-24 pb-2 select-none'>
      <Breadcrumb>
        <BreadcrumbList className='text-sm font-medium text-slate-500'>
          {/* HOME LINK */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href='/'
                className='flex items-center gap-1.5 hover:text-orange-600 transition-colors cursor-pointer text-slate-500 font-semibold'
              >
                <Home size={14} className='mb-0.5' />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator>
            <ChevronRight size={14} className='text-slate-400' />
          </BreadcrumbSeparator>

          {/* DYNAMIC RESTO NAME LINK */}
          <BreadcrumbItem>
            {isCheckoutPage ? (
              <BreadcrumbLink asChild>
                <Link
                  href={`/resto/${restoId || ''}`}
                  className='hover:text-orange-600 transition-colors cursor-pointer text-slate-500 font-semibold'
                >
                  {currentPathName}
                </Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage className='text-slate-900 font-extrabold tracking-tight'>
                {currentPathName}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>

          {/* CONDITIONAL CHECKOUT PAGE TRAILING BREADCRUMB */}
          {isCheckoutPage && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight size={14} className='text-slate-400' />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className='text-slate-900 font-extrabold tracking-tight'>
                  Checkout
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
