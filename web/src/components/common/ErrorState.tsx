import React from 'react';
import { Card, CardContent } from '../ui/Card';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[300px] border-[#ffd1da] bg-[#fff8f9]">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-lg font-bold text-[#c13515] mb-2">Something went wrong</h3>
        <p className="text-[#222222] mb-6 max-w-md">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="text-sm font-semibold text-[#c13515] underline hover:text-[#b32505]"
          >
            Try again
          </button>
        )}
      </CardContent>
    </Card>
  );
}
