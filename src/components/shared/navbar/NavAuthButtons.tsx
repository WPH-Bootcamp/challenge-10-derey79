'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavAuthButtonsProps {
  isScrolled: boolean;
  onActionClick?: () => void;
}

export function NavAuthButtons({
  isScrolled,
  onActionClick,
}: NavAuthButtonsProps) {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
      <Button
        asChild
        variant='outline'
        onClick={onActionClick}
        className={cn(
          'w-40.75 h-12 rounded-[100px] bg-transparent text-sm font-medium tracking-wide transition-all active:scale-95 cursor-pointer',
          isScrolled
            ? 'border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-50'
            : 'border-zinc-500 text-white hover:border-white hover:bg-zinc-900/40'
        )}
      >
        <Link href='/login'>Sign In</Link>
      </Button>

      <Button
        asChild
        variant='secondary'
        onClick={onActionClick}
        className={cn(
          'w-40.75 h-12 rounded-[100px] bg-transparent text-sm font-medium tracking-wide transition-all active:scale-95 cursor-pointer',
          isScrolled
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : 'bg-white text-black hover:bg-zinc-200'
        )}
      >
        <Link href='/register'>Sign Up</Link>
      </Button>
    </div>
  );
}
