import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface PreviewModeBannerProps {
  featureName: string;
  onOpenAuthModal?: () => void;
  redirectPath?: string;
}

export const PreviewModeBanner: React.FC<PreviewModeBannerProps> = ({
  featureName,
  onOpenAuthModal,
  redirectPath = window.location.pathname,
}) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return null;

  const encodedRedirect = encodeURIComponent(redirectPath);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 shadow-md border-b border-orange-500/30 sticky top-20 z-30 animate-in slide-in-from-top-2 duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/40">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <p className="font-medium text-slate-200">
            <span>Bạn đang trải nghiệm giao diện xem trước của </span>
            <strong className="text-orange-400 font-extrabold">{featureName}</strong>.
            <span className="hidden sm:inline text-slate-400"> Hãy đăng nhập để lưu trữ dữ liệu vào tài khoản cá nhân!</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenAuthModal ? (
            <button
              onClick={onOpenAuthModal}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập ngay</span>
            </button>
          ) : (
            <Link
              to={`/auth/login?redirect=${encodedRedirect}`}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập ngay</span>
            </Link>
          )}

          <Link
            to={`/auth/register?redirect=${encodedRedirect}`}
            className="hidden md:inline-flex px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
          >
            <span>Đăng ký</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
