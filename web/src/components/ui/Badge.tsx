import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-[#f2f2f2] text-[#222222]',
    success: 'bg-[#e6f4ea] text-[#008a05]',
    outline: 'border border-[#dddddd] text-[#222222]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#222222] focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
