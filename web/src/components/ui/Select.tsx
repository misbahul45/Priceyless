import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-14 w-full rounded-lg border bg-white px-4 py-2 text-base text-[#222222]',
          'focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#222222] focus-visible:-m-[1px]',
          'disabled:cursor-not-allowed disabled:bg-[#f7f7f7]',
          error ? 'border-[#c13515] focus-visible:border-[#c13515]' : 'border-[#dddddd]',
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }
);
Select.displayName = 'Select';
