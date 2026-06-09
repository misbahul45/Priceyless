import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div 
        className={cn(
          'relative w-full max-w-lg rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-[#dddddd] p-6">
          <h2 className="text-xl font-bold text-[#222222]">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-[#222222] hover:bg-[#f7f7f7] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
