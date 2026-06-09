import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222222] disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-[#ff385c] text-white hover:bg-[#e00b41] active:bg-[#e00b41]',
      secondary: 'bg-[#222222] text-white hover:bg-[#222222]/90',
      outline: 'border border-[#dddddd] bg-white text-[#222222] hover:bg-[#f7f7f7]',
      ghost: 'hover:bg-[#f7f7f7] text-[#222222]',
      danger: 'bg-[#c13515] text-white hover:bg-[#b32505]',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
