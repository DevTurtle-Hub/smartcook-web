import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, ChefHat, User, Sparkles } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) return;

    const setupGoogle = () => {
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          auto_select: false,
          cancel_on_tap_outside: true,
          callback: async (response: any) => {
            try {
              setLoading(true);
              const data = await authApi.googleLogin(response.credential);
              const accessToken = data.tokens?.accessToken || data.accessToken || '';
              const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
              setAuth(data.user, accessToken, refreshToken);
              if (data.user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            } catch (authErr: any) {
              setError(authErr.message || 'Xác thực Google thất bại');
            } finally {
              setLoading(false);
            }
          },
        });

        const btnContainer = document.getElementById('googleSignInContainer');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 360,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      setupGoogle();
    } else {
      const timer = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(timer);
          setupGoogle();
        }
      }, 300);
      return () => clearInterval(timer);
    }
  }, [navigate, setAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    try {
      const data = await authApi.login({ email: trimmedEmail, password });
      const accessToken = data.tokens?.accessToken || data.accessToken || '';
      const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
      setAuth(data.user, accessToken, refreshToken);

      if (data.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(
        err.message ||
        err.response?.data?.message ||
        'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  const [rememberMe, setRememberMe] = useState(true);

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black">
          <ChefHat className="w-3.5 h-3.5" />
          <span>SmartCook Account</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading">
          Đăng Nhập
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Chào mừng bạn quay trở lại với trợ lý nấu ăn thông minh!
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Remember me & Forget password row */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded-lg border-slate-300 text-orange-600 focus:ring-orange-500 accent-orange-500"
            />
            <span className="text-xs font-medium text-slate-600">Ghi nhớ đăng nhập</span>
          </label>

          <a href="#" onClick={(e) => { e.preventDefault(); alert("Vui lòng liên hệ quản trị viên hoặc sử dụng tài khoản mẫu để đăng nhập."); }} className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors">
            Quên mật khẩu?
          </a>
        </div>

        {/* Login Button with Arrow */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                <span>Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Social login divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300/60" />
        </div>
        <span className="relative px-3 bg-[#faf8f5] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Hoặc đăng nhập nhanh bằng
        </span>
      </div>

      {/* Google Official GIS Button */}
      <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
        <div id="googleSignInContainer" className="w-full flex justify-center"></div>
      </div>

      {/* Dòng link text chuyển đổi xuống cuối cùng */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Chưa có tài khoản?{' '}
          <Link to="/auth/register" className="font-extrabold text-orange-600 hover:text-orange-700 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
