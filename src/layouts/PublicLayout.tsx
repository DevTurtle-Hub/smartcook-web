import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChefHat, Smartphone, LogOut, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const PublicLayout: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Khám phá công thức', path: '/recipes' },
    { name: 'Cộng đồng', path: '/community' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Banner App Promotion */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs sm:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>Trải nghiệm tính năng Quét AI tủ lạnh & Nấu ăn rảnh tay trên ứng dụng SmartCook Mobile!</span>
        <a href="#download-app" className="underline font-bold hover:text-orange-100 ml-1">Tải app ngay</a>
      </div>

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 font-['Outfit']">Smart<span className="text-orange-500">Cook</span></span>
              <span className="text-[10px] text-slate-400 -mt-1 font-medium">Bếp thông minh mọi nhà</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-orange-600 font-semibold' : 'text-slate-600 hover:text-orange-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Trang Quản Trị</span>
              </Link>
            )}

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.fullName || user.firstName}
                    className="w-8 h-8 rounded-full object-cover border border-orange-200"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-slate-700">
                    {user.firstName || 'Bếp trưởng'}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all active:scale-95"
                >
                  Bắt đầu ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                  <ChefHat className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg text-white font-['Outfit']">SmartCook</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Giải pháp nấu ăn thông minh hàng đầu với sự kết hợp của trí tuệ nhân tạo Gemini AI và quản lý tủ lạnh thời gian thực.
              </p>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Tính Năng Cốt Lõi</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/recipes" className="hover:text-white transition-colors">Kho công thức chuẩn Việt</Link></li>
                <li><span className="text-slate-500">Quét AI Tủ Lạnh (Mobile)</span></li>
                <li><span className="text-slate-500">Nấu ăn rảnh tay giọng nói</span></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Cộng đồng Yêu Bếp</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-3">Dành Cho Nhà Phát Triển</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Swagger REST API</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
                <li><span className="text-slate-500">Đồ Án Tốt Nghiệp FPTU Term 07</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold mb-3" id="download-app">Ứng Dụng Di Động</h4>
              <p className="text-xs text-slate-400 mb-3">Tải ứng dụng để trải nghiệm camera quét AI và định vị siêu thị GPS lân cận.</p>
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition-colors">
                  <Smartphone className="w-4 h-4 text-orange-400" />
                  <span>Tải cho iOS & Android (Expo)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-xs text-center text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 SmartCook Platform. Xây dựng với React 19, TypeScript & Tailwind CSS.</p>
            <p className="flex items-center gap-1">Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for culinary lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
