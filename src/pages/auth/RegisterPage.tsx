import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, AlertCircle, ArrowRight, ChefHat, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
              navigate('/', { replace: true });
            } catch (authErr: any) {
              setError(authErr.message || 'Xác thực Google thất bại');
            } finally {
              setLoading(false);
            }
          },
        });

        const btnContainer = document.getElementById('googleSignUpContainer');
        if (btnContainer) {
          btnContainer.innerHTML = '';
          (window as any).google.accounts.id.renderButton(btnContainer, {
            theme: 'outline',
            size: 'large',
            width: 360,
            text: 'signup_with',
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const isConfigured = googleClientId && !googleClientId.includes('your_google_client_id');

      if ((window as any).google?.accounts?.id && isConfigured) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            try {
              setLoading(true);
              const data = await authApi.googleLogin(response.credential);
              const accessToken = data.tokens?.accessToken || data.accessToken || '';
              const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
              setAuth(data.user, accessToken, refreshToken);
              navigate('/', { replace: true });
            } catch (authErr: any) {
              setError(authErr.message || 'Xác thực Google thất bại');
            } finally {
              setLoading(false);
            }
          },
        });
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification?.isNotDisplayed?.()) {
            authApi.googleLogin('dev_mock_google_id_token').then((data) => {
              const accessToken = data.tokens?.accessToken || data.accessToken || '';
              const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
              setAuth(data.user, accessToken, refreshToken);
              navigate('/', { replace: true });
            }).catch((err) => setError(err.message));
          }
        });
      } else {
        // Fallback for development / when Google Client ID is not configured
        const data = await authApi.googleLogin('dev_mock_google_id_token');
        const accessToken = data.tokens?.accessToken || data.accessToken || '';
        const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
        setAuth(data.user, accessToken, refreshToken);
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký với Google không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại.');
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      const accessToken = data.tokens?.accessToken || data.accessToken || '';
      const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
      setAuth(data.user, accessToken, refreshToken);
      navigate('/');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-left space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Tạo Tài Khoản Mới</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-heading">
          Đăng Ký SmartCook
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Gia nhập cộng đồng nấu ăn thông minh và cá nhân hóa thực đơn gia đình
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Họ & Tên đệm</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nguyễn"
                className="w-full pl-10 pr-3 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tên</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Văn An"
              className="w-full px-4 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs"
            />
          </div>
        </div>

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

        {/* Mật khẩu */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full pl-11 pr-11 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className={`w-full pl-11 pr-11 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${
                confirmPassword && password !== confirmPassword
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/30'
                  : confirmPassword && password === confirmPassword
                  ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/30'
                  : 'border-slate-200/90 focus:border-orange-500 focus:ring-orange-500/30'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[11px] font-semibold text-rose-500 mt-1 pl-1">
              Mật khẩu xác nhận chưa khớp
            </p>
          )}
          {confirmPassword && password === confirmPassword && (
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 pl-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mật khẩu xác nhận trùng khớp
            </p>
          )}
        </div>

        {/* Nút Đăng Ký bo tròn cam có mũi tên */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Đang tạo tài khoản...</span>
            ) : (
              <>
                <span>Tạo Tài Khoản Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Social Register divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300/60" />
        </div>
        <span className="relative px-3 bg-[#faf8f5] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Hoặc đăng ký nhanh bằng
        </span>
      </div>

      {/* Google Sign-up Button */}
      <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:border-orange-300 hover:shadow-sm transition-all text-xs sm:text-sm font-bold text-slate-700 active:scale-98 cursor-pointer group"
          title="Đăng ký tài khoản nhanh qua Google"
        >
          <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Đăng ký với Google</span>
        </button>
        <div id="googleSignUpContainer" className="hidden"></div>
      </div>

      {/* Dòng link text chuyển đổi xuống cuối cùng */}
      <div className="text-center pt-2 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Đã có tài khoản?{' '}
          <Link to="/auth/login" className="font-extrabold text-orange-600 hover:text-orange-700 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
