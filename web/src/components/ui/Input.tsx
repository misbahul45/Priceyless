import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          'flex h-14 w-full rounded-lg border bg-white px-4 py-2 text-base text-[#222222] placeholder:text-[#6a6a6a]',
          'focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#222222] focus-visible:-m-[1px]',
          'disabled:cursor-not-allowed disabled:bg-[#f7f7f7]',
          error ? 'border-[#c13515] focus-visible:border-[#c13515]' : 'border-[#dddddd]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
