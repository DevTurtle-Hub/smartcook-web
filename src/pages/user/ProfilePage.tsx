import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Award, Flame, Heart, Sparkles, CheckCircle2, User as UserIcon, Mail, ShieldCheck, ArrowRight, Utensils, History, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserHeader } from '../../components/user/UserHeader';
import { authApi } from '../../api/auth.api';
import { cookingHistoryApi, type CookingRecordDTO } from '../../api/cookingHistory.api';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isAdmin, updateUser } = useAuthStore();
  const [cookingHistory, setCookingHistory] = useState<CookingRecordDTO[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      authApi.getMe().then((freshUser) => {
        if (freshUser) {
          updateUser(freshUser);
        }
      }).catch(() => {});

      cookingHistoryApi.getMyCookingHistory().then((history) => {
        if (history) {
          setCookingHistory(history);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, updateUser]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  const levels = [
    { name: 'Tập sự', minXp: 0, color: 'text-slate-600', bg: 'bg-slate-100' },
    { name: 'Bếp gia đình', minXp: 100, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Đầu bếp tài ba', minXp: 300, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Bếp trưởng', minXp: 600, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const currentLevel = levels.find((l) => (user.chefExp || 0) >= l.minXp) || levels[0];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      <UserHeader />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="Profile"
              className="w-24 h-24 rounded-2xl object-cover border-4 border-orange-200 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 font-heading">
                {user.fullName || `${user.lastName || ''} ${user.firstName || 'Bếp Trưởng'}`.trim()}
              </h1>
              <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold ${currentLevel.bg} ${currentLevel.color} w-fit mx-auto sm:mx-0 shadow-2xs`}>
                <Award className="w-3.5 h-3.5" />
                {currentLevel.name}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3.5 py-1.5 rounded-xl border border-orange-200/80">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{user.chefExp || 120} Điểm Kinh Nghiệm (XP)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Đã thiết lập khẩu vị cá nhân</span>
              </div>
            </div>
          </div>
        </div>

        {/* Culinary Preferences Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg font-heading">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2>Khẩu Vị & Mục Tiêu Ẩm Thực Cá Nhân</h2>
          </div>
          <p className="text-xs text-slate-500">
            Dữ liệu này được thuật toán AI dùng để cá nhân hoá các công thức phù hợp nhất với thể trạng của bạn:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Khẩu phần chuẩn</span>
              <div className="font-extrabold text-sm text-slate-800">
                {user.preferences?.portion || '3 - 4 người'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Mục tiêu dinh dưỡng</span>
              <div className="font-extrabold text-sm text-slate-800">
                {user.preferences?.healthGoal === 'loss' ? 'Giảm cân lành mạnh' : 'Ăn uống cân bằng healthy'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Thời gian ưu tiên</span>
              <div className="font-extrabold text-sm text-slate-800">
                {user.preferences?.cookingTime === 'quick' ? 'Nhanh dưới 20 phút' : 'Chuẩn vị 30 - 45 phút'}
              </div>
            </div>
          </div>
        </div>

        {/* Cooking History Card */}
        {cookingHistory.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg font-heading">
              <History className="w-5 h-5 text-orange-500" />
              <h2>Lịch Sử Món Đã Nấu Gần Đây ({cookingHistory.length})</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {cookingHistory.slice(0, 5).map((record) => (
                <div key={record._id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                      🍳
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {record.recipeId?.title || 'Món ăn gia đình'}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(record.cookedAt).toLocaleDateString('vi-VN')}</span>
                        {record.notes && <span>• {record.notes}</span>}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    +50 XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Favorite Recipes shortcut */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-base font-heading flex items-center justify-center sm:justify-start gap-2">
              <Heart className="w-5 h-5 fill-white" />
              <span>Món Ăn Yêu Thích Của Bạn</span>
            </h3>
            <p className="text-xs text-orange-100 leading-relaxed">
              Truy cập nhanh danh sách các món ăn bạn đã lưu để lên thực đơn nấu ăn tiện lợi trong tuần.
            </p>
          </div>

          <Link
            to="/recipes"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Utensils className="w-4 h-4" />
            <span>Xem Kho Món Ăn</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
