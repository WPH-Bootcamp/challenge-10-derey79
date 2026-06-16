import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-[#C92118] focus:ring-1 focus:ring-[#C92118] pr-12 transition-all',
        className
      )}
      {...props}
    />
  );
}

export { Input };
