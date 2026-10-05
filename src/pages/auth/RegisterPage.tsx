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

      {/* Google Official GIS Button */}
      <div className="flex flex-col items-center justify-center w-full min-h-[44px]">
        <div id="googleSignUpContainer" className="w-full flex justify-center"></div>
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
