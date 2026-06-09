import React from 'react';
import { Link } from '@tanstack/react-router';

export function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f7f7f7] p-4 sm:p-8">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-[#ff385c]">Priceyless</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-[#222222]">{title}</h2>
          {subtitle && <p className="mt-2 text-[#6a6a6a]">{subtitle}</p>}
        </div>
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-[#dddddd]">
          {children}
        </div>
      </div>
    </div>
  );
}
