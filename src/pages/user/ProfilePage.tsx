import React from 'react';
import { Navigate } from 'react-router-dom';
import { Award, Flame, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const levels = [
    { name: 'Tập sự', minXp: 0, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Bếp gia đình', minXp: 100, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Đầu bếp tài ba', minXp: 300, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Bếp trưởng', minXp: 600, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const currentLevel = levels.find((l) => user.chefExp >= l.minXp) || levels[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-orange-100 shadow-md"
        />
        <div className="text-center sm:text-left space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-['Outfit']">
              {user.fullName || `${user.lastName} ${user.firstName}`}
            </h1>
            <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold ${currentLevel.bg} ${currentLevel.color} w-fit mx-auto sm:mx-0`}>
              <Award className="w-3.5 h-3.5" />
              {currentLevel.name}
            </span>
          </div>
          <p className="text-xs text-slate-400">{user.email}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-xl border border-orange-200">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{user.chefExp || 50} Điểm Kinh Nghiệm (XP)</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Đã hoàn thành khảo sát khẩu vị</span>
            </div>
          </div>
        </div>
      </div>

      {/* Culinary Preferences Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg font-['Outfit']">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2>Khẩu Vị & Mục Tiêu Ẩm Thực Cá Nhân</h2>
        </div>
        <p className="text-xs text-slate-500">
          Dữ liệu này được thuật toán AI dùng để cá nhân hoá các công thức phù hợp nhất với thể trạng của bạn:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400">Khẩu phần nấu chuẩn</span>
            <div className="font-bold text-sm text-slate-800">
              {user.preferences?.portion || '3-4 người'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400">Mục tiêu dinh dưỡng</span>
            <div className="font-bold text-sm text-slate-800">
              {user.preferences?.healthGoal === 'loss' ? 'Giảm cân lành mạnh' : 'Ăn uống cân bằng healthy'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-xs text-slate-400">Thời gian nấu ưu tiên</span>
            <div className="font-bold text-sm text-slate-800">
              {user.preferences?.cookingTime === 'quick' ? 'Nhanh dưới 20 phút' : 'Chuẩn vị 30 - 45 phút'}
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Recipes shortcut */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-base font-['Outfit'] flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            <span>Món Ăn Yêu Thích Của Bạn</span>
          </h3>
          <p className="text-xs text-orange-100">
            Truy cập nhanh danh sách các món ăn bạn đã lưu để lên lịch nấu trong tuần.
          </p>
        </div>
      </div>
    </div>
  );
};
