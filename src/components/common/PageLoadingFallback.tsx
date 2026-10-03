import React from 'react';
import { Sparkles, Utensils } from 'lucide-react';

interface PageLoadingFallbackProps {
  message?: string;
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  message = 'Đang tải dữ liệu trang...'
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[60vh] w-full flex flex-col items-center justify-center p-8 select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient pulsing ring */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-orange-400/20 via-amber-300/20 to-orange-500/10 blur-xl animate-pulse" />
        
        {/* Spinning decorative ring */}
        <div className="w-16 h-16 rounded-full border-3 border-orange-100 border-t-orange-500 animate-spin" />

        {/* Center Chef Utensils Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Utensils className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="mt-6 text-center space-y-1">
        <p className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-1.5 font-heading">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>SmartCook AI</span>
        </p>
        <p className="text-xs text-slate-500 font-medium">{message}</p>
      </div>
    </div>
  );
};
