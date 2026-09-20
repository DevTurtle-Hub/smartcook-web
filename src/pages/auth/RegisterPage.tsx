import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, AlertCircle, ArrowRight, ChefHat } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.register({
        firstName,
        lastName,
        email,
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

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if ((window as any).google?.accounts?.id && googleClientId) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            try {
              const data = await authApi.googleLogin(response.credential);
              const accessToken = data.tokens?.accessToken || data.accessToken || '';
              const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
              setAuth(data.user, accessToken, refreshToken);
              navigate('/');
            } catch (authErr: any) {
              setError(authErr.message || 'Xác thực Google thất bại');
            }
          },
        });
        (window as any).google.accounts.id.prompt();
      } else {
        const mockGoogleToken = 'google_id_token_demo_' + Date.now();
        const data = await authApi.googleLogin(mockGoogleToken);
        const accessToken = data.tokens?.accessToken || data.accessToken || '';
        const refreshToken = data.tokens?.refreshToken || data.refreshToken || '';
        setAuth(data.user, accessToken, refreshToken);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký Google không thành công.');
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

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Mật khẩu</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-orange-50/20 focus:bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium text-slate-900 placeholder-slate-400 shadow-2xs"
            />
          </div>
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

      {/* Social Buttons */}
      <div className="flex items-center justify-center gap-6 pt-1">
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/90 shadow-2xs group-hover:border-orange-300 group-hover:scale-105 transition-all flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>
          <span className="text-[11px] font-bold text-slate-500 group-hover:text-orange-600 transition-colors">Google</span>
        </button>

        <button
          type="button"
          onClick={() => { setEmail('user@smartcook.vn'); setPassword('123456'); setFirstName('An'); setLastName('Nguyễn'); }}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#1877F2] shadow-2xs group-hover:scale-105 transition-all flex items-center justify-center text-white">
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Facebook</span>
        </button>
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
