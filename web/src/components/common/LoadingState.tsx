import React from 'react';

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] w-full">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#dddddd] border-t-[#ff385c]" />
      {message && <p className="mt-4 text-sm text-[#6a6a6a]">{message}</p>}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-12 bg-[#f2f2f2] rounded-lg w-full" />
      <div className="h-12 bg-[#f2f2f2] rounded-lg w-full" />
      <div className="h-12 bg-[#f2f2f2] rounded-lg w-full" />
      <div className="h-12 bg-[#f2f2f2] rounded-lg w-full" />
    </div>
  );
}
