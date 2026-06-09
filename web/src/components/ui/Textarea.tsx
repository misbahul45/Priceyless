import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-base text-[#222222] placeholder:text-[#6a6a6a]',
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
Textarea.displayName = 'Textarea';
