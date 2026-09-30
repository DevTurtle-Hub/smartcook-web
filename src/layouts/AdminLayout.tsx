import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Apple,
  MessageSquare,
  Users,
  Bot,
  BellRing,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Plus,
  Bell,
  Search,
  SlidersHorizontal,
  Check,
  X,
  Filter,
  UtensilsCrossed,
  Store,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Bộ lọc nâng cao state
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterScope, setFilterScope] = useState('all'); // all, recipes, ingredients, users
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, pending, reported
  const [filterTime, setFilterTime] = useState('7d'); // today, 7d, 30d, all

  // Bảo vệ nghiêm ngặt: Phải đăng nhập và phải là admin
  if (!isAuthenticated || !user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentUser = user;

  const menuItems = [
    {
      name: 'Tổng Quan',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Quản Lý Món Ăn & Bếp',
      path: '/admin/dishes',
      icon: UtensilsCrossed,
    },
    {
      name: 'Kiểm Duyệt Cộng Đồng',
      path: '/admin/community',
      icon: MessageSquare,
    },
    {
      name: 'Cấu Hình Trí Tuệ AI',
      path: '/admin/ai-engine',
      icon: Bot,
    },
    {
      name: 'Người Dùng & Phân Quyền',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Thông Báo & Marketing',
      path: '/admin/marketing',
      icon: BellRing,
    },
    {
      name: 'Chuỗi Siêu Thị GPS',
      path: '/admin/supermarkets',
      icon: Store,
    },
    {
      name: 'Cài Đặt Hệ Thống',
      path: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8F9FD] text-slate-800 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* SIDEBAR DÍNH LIỀN MÀN HÌNH (FIXED / SÁT MÉP TRÁI) + TO RA THOÁNG ĐÃNG */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-72'
        } bg-white border-r border-slate-200/80 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-screen sticky top-0`}
      >
        {/* Brand Header: Logo + Nút thu hẹp icon <<< hoặc >>> to đẹp nằm ngay cạnh Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 font-black text-base font-['Outfit'] shrink-0 tracking-tight">
              SC
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-slate-900 tracking-tight text-base font-['Outfit'] truncate flex items-center gap-1.5">
                  SmartCook
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded">
                    Admin
                  </span>
                </span>
                <span className="text-xs text-slate-400 font-medium tracking-tight truncate">
                  Quản Trị Ẩm Thực
                </span>
              </div>
            )}
          </div>

          {/* NÚT THU HẸP/MỞ RỘNG <<< HOẶC >>> TO ĐẸP GẦN LOGO KHÔNG CẦN TEXT */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-2xs shrink-0"
            title={collapsed ? 'Mở rộng sidebar (>>>)' : 'Thu gọn sidebar (<<<)'}
          >
            {collapsed ? (
              <ChevronsRight className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ChevronsLeft className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Navigation items: To ra, rõ ràng, dễ nhìn */}
        <div className="flex-1 px-3.5 py-4 overflow-y-auto space-y-1.5">
          {!collapsed && (
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DANH MỤC QUẢN TRỊ
            </div>
          )}

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  collapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div
                  className={`flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {!collapsed && (
                  <span className="truncate leading-tight text-[13.5px]">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 shrink-0">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt="Admin"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                    {currentUser.fullName || 'SmartCook Admin'}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {currentUser.email || 'admin@gmail.com'}
                  </span>
                  <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wide mt-0.5">
                    ● Quản Trị Viên Cấp Cao
                  </span>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0 shadow-2xs"
                title="Đăng xuất tài khoản"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT DÍNH LIỀN VÀ TRẢI DÀI TOÀN BỘ KHÔNG GIAN BÊN PHẢI */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">
        {/* TOPBAR (Cố định ở trên) */}
        <header className="h-18 bg-white border-b border-slate-200/80 px-8 lg:px-10 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            {/* Khung tìm kiếm chuyên nghiệp, sang trọng */}
            <div className="relative group w-72 md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm công thức, nguyên liệu, người dùng..."
                className="w-full pl-10 pr-4 py-2 text-xs font-medium text-slate-700 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Nút Bộ Lọc Nâng Cao nằm bên ngoài cạnh thanh tìm kiếm */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shadow-2xs ${
                  showFilterDropdown || filterScope !== 'all' || filterStatus !== 'all' || filterTime !== '7d'
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 ring-2 ring-indigo-500/20'
                    : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title="Mở bộ lọc nâng cao"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bộ lọc</span>
                {(filterScope !== 'all' || filterStatus !== 'all' || filterTime !== '7d') && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </button>

              {/* POPUP BỘ LỌC TÍCH HỢP ĐẦY ĐỦ TÍNH NĂNG */}
              {showFilterDropdown && (
                <>
                  {/* Backdrop click outside */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowFilterDropdown(false)}
                  />

                  {/* Dropdown Panel */}
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-40 p-4 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Bộ Lọc Hệ Thống</h4>
                      </div>
                      <button
                        onClick={() => setShowFilterDropdown(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4 py-3 text-xs">
                      {/* Phạm vi tìm kiếm */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Phạm vi dữ liệu
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'all', label: 'Tất cả module' },
                            { id: 'recipes', label: 'Công thức nấu' },
                            { id: 'ingredients', label: 'Nguyên liệu' },
                            { id: 'users', label: 'Người dùng' },
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setFilterScope(item.id)}
                              className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium border transition-colors flex items-center justify-between ${
                                filterScope === item.id
                                  ? 'bg-indigo-50/80 text-indigo-700 border-indigo-300 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100'
                              }`}
                            >
                              <span>{item.label}</span>
                              {filterScope === item.id && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Trạng thái xét duyệt */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Trạng thái duyệt
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'all', label: 'Tất cả' },
                            { id: 'active', label: 'Đã xuất bản' },
                            { id: 'pending', label: 'Chờ duyệt' },
                            { id: 'reported', label: 'Bị báo cáo' },
                          ].map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setFilterStatus(st.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                filterStatus === st.id
                                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Khoảng thời gian */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Mốc thời gian
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {[
                            { id: 'today', label: 'Hôm nay' },
                            { id: '7d', label: '7 ngày' },
                            { id: '30d', label: '30 ngày' },
                            { id: 'all', label: 'Toàn bộ' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setFilterTime(t.id)}
                              className={`py-1 text-center rounded-lg text-xs font-medium border transition-colors ${
                                filterTime === t.id
                                  ? 'bg-slate-800 text-white border-slate-800 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200/70 hover:bg-slate-100'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setFilterScope('all');
                          setFilterStatus('all');
                          setFilterTime('7d');
                        }}
                        className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        Đặt lại mặc định
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowFilterDropdown(false)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Áp dụng lọc
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Notification Bell with red dot */}
            <div className="relative">
              <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </div>

            {/* Primary Action Button */}
            <Link
              to="/admin/recipes?action=new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Công Thức</span>
            </Link>
          </div>
        </header>

        {/* CONTENT SCROLL KHÔNG GIAN RỘNG TO LỚN */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-[#F8F9FD]">
          <div className="w-full max-w-[1720px] mx-auto space-y-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
