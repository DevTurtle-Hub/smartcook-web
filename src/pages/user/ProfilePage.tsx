import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import {
  Award,
  Flame,
  Heart,
  Sparkles,
  CheckCircle2,
  User as UserIcon,
  Mail,
  ShieldCheck,
  ArrowRight,
  Utensils,
  History,
  Clock,
  Edit3,
  Camera,
  Save,
  Upload,
  Sliders,
  Check,
  AlertCircle,
  ChefHat,
  Target,
  Users,
  Timer,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { UserHeader } from '../../components/user/UserHeader';
import { getUserAvatarUrl } from '../../utils/avatar';
import { authApi } from '../../api/auth.api';
import { cookingHistoryApi, type CookingRecordDTO } from '../../api/cookingHistory.api';

// Curated avatar presets for culinary enthusiasts
const AVATAR_PRESETS = [
  {
    id: 'chef-master',
    label: 'Bếp Trưởng Đẳng Cấp',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'chef-nutrition',
    label: 'Chuyên Gia Dinh Dưỡng',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'chef-home',
    label: 'Đầu Bếp Gia Đình',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'chef-healthy',
    label: 'Healthy Foodie',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'chef-baker',
    label: 'Bếp Bánh Ngọt',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'chef-asian',
    label: 'Nghệ Nhân Ẩm Thực Á',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'chef-dicebear-1',
    label: 'Chef Phong Cách Hoạt Hình',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chef-gourmet',
  },
  {
    id: 'chef-dicebear-2',
    label: 'Robot Đầu Bếp AI',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=smartcook-master',
  },
];

type ProfileTab = 'overview' | 'edit_profile' | 'preferences' | 'history';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [cookingHistory, setCookingHistory] = useState<CookingRecordDTO[]>([]);
  const safeHistory = Array.isArray(cookingHistory) ? cookingHistory : [];

  // Edit Profile Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Culinary Preferences Form State
  const [portion, setPortion] = useState<'1' | '2' | '3-4' | '5+'>('3-4');
  const [healthGoal, setHealthGoal] = useState<'healthy' | 'loss' | 'muscle' | 'budget'>('healthy');
  const [cookingTime, setCookingTime] = useState<'quick' | 'medium' | 'standard' | 'slow'>('medium');
  const [cuisines, setCuisines] = useState<string[]>(['vietnamese', 'healthy']);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [tasteProfile, setTasteProfile] = useState<string[]>(['dam-da']);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferenceSuccessMsg, setPreferenceSuccessMsg] = useState('');
  const [preferenceErrorMsg, setPreferenceErrorMsg] = useState('');

  // Initial populate from user store
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setAvatarPreview(user.avatar || '');

      if (user.preferences) {
        if (user.preferences.portion) {
          setPortion(user.preferences.portion as any);
        }
        if (user.preferences.healthGoal) {
          setHealthGoal(user.preferences.healthGoal as any);
        }
        if (user.preferences.cookingTime) {
          setCookingTime(user.preferences.cookingTime as any);
        }
        if (Array.isArray(user.preferences.cuisines)) {
          setCuisines(user.preferences.cuisines);
        }
        if (Array.isArray(user.preferences.restrictions)) {
          setRestrictions(user.preferences.restrictions);
        }
        if (Array.isArray(user.preferences.tasteProfile)) {
          setTasteProfile(user.preferences.tasteProfile);
        }
      }
    }
  }, [user]);

  // Fetch fresh data
  useEffect(() => {
    if (isAuthenticated) {
      authApi.getMe().then((freshUser) => {
        if (freshUser) {
          updateUser(freshUser);
        }
      }).catch(() => {});

      cookingHistoryApi.getMyCookingHistory().then((history: any) => {
        if (Array.isArray(history)) {
          setCookingHistory(history);
        } else if (history && Array.isArray(history.items)) {
          setCookingHistory(history.items);
        } else {
          setCookingHistory([]);
        }
      }).catch(() => {
        setCookingHistory([]);
      });
    }
  }, [isAuthenticated, updateUser]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Chef Progression Levels
  const levels = [
    { name: 'Tập sự', minXp: 0, nextXp: 100, color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', badge: '🥉' },
    { name: 'Bếp gia đình', minXp: 100, nextXp: 300, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', badge: '🥈' },
    { name: 'Đầu bếp tài ba', minXp: 300, nextXp: 600, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', badge: '🥇' },
    { name: 'Bếp trưởng SmartCook', minXp: 600, nextXp: 1000, color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', badge: '👑' },
  ];

  const currentChefXp = user.chefExp ?? 0;
  const currentLevelIndex = levels.reduce((acc, lvl, idx) => (currentChefXp >= lvl.minXp ? idx : acc), 0);
  const currentLevel = levels[currentLevelIndex] || levels[0];
  const nextLevel = levels[currentLevelIndex + 1] || null;

  // XP Progress Calculation
  const progressPercent = nextLevel
    ? Math.min(100, Math.max(0, Math.round(((currentChefXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100)))
    : 100;
  const xpNeeded = nextLevel ? nextLevel.minXp - currentChefXp : 0;

  // Handle local avatar file pick
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProfileErrorMsg('Kích thước ảnh tối đa là 5MB. Vui lòng chọn ảnh nhẹ hơn.');
        return;
      }
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setProfileErrorMsg('');
    }
  };

  // Handle preset avatar selection
  const handleSelectPresetAvatar = (url: string) => {
    setAvatarFile(null);
    setAvatarPreview(url);
  };

  // Handle saving Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setProfileErrorMsg('Họ và tên không được để trống.');
      return;
    }

    setIsSavingProfile(true);
    try {
      let updatedUser;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('firstName', firstName.trim());
        formData.append('lastName', lastName.trim());
        formData.append('avatar', avatarFile);
        updatedUser = await authApi.updateProfile(formData);
      } else {
        updatedUser = await authApi.updateProfile({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          avatar: avatarPreview,
        });
      }

      updateUser(updatedUser);
      setProfileSuccessMsg('Cập nhật hồ sơ cá nhân thành công!');
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Không thể cập nhật hồ sơ. Vui lòng thử lại sau.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Toggle multi-select tags
  const toggleSelection = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setter(list.filter((x) => x !== item));
      }
    } else {
      setter([...list, item]);
    }
  };

  // Handle saving Culinary Preferences
  const handleSavePreferences = async () => {
    setPreferenceSuccessMsg('');
    setPreferenceErrorMsg('');
    setIsSavingPreferences(true);

    try {
      const payload = {
        portion,
        healthGoal,
        cookingTime,
        cuisines,
        restrictions,
        tasteProfile,
      };

      await authApi.updateSurvey(payload);

      // Re-fetch fresh user profile to ensure state consistency
      const freshUser = await authApi.getMe();
      updateUser(freshUser);

      setPreferenceSuccessMsg('Đã lưu khẩu vị & mục tiêu dinh dưỡng AI thành công!');
      setTimeout(() => setPreferenceSuccessMsg(''), 4000);
    } catch (err: any) {
      setPreferenceErrorMsg(err.message || 'Không thể lưu khẩu vị. Vui lòng thử lại sau.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  // Preference translation dictionaries
  const portionLabels: Record<string, string> = {
    '1': '1 người (Độc thân)',
    '2': '2 người (Cặp đôi)',
    '3-4': '3 - 4 người (Gia đình)',
    '5+': '5+ người (Đại gia đình)',
  };

  const healthGoalLabels: Record<string, { title: string; desc: string; icon: string }> = {
    healthy: { title: 'Eat Clean & Cân Bằng', desc: 'Dinh dưỡng toàn diện, thanh lọc cơ thể', icon: '🥗' },
    loss: { title: 'Giảm Cân Lành Mạnh', desc: 'Kiểm soát calo, hạn chế tinh bột xấu', icon: '⚖️' },
    muscle: { title: 'Tăng Cơ Săn Chắc', desc: 'Giàu đạm chất lượng cao, phục hồi cơ', icon: '💪' },
    budget: { title: 'Tiết Kiệm & Tối Ưu', desc: 'Tận dụng nguyên liệu sẵn có, kinh tế', icon: '💰' },
  };

  const cookingTimeLabels: Record<string, { title: string; desc: string; icon: string }> = {
    quick: { title: 'Nhanh dưới 20p', desc: 'Gọn gàng cho người bận rộn', icon: '⚡' },
    medium: { title: 'Khoảng 20 - 35p', desc: 'Chuẩn bữa ăn gia đình', icon: '🍲' },
    standard: { title: 'Khoảng 35 - 50p', desc: 'Mâm cơm đầy đủ canh xào kho', icon: '🍳' },
    slow: { title: 'Cầu kỳ trên 50p', desc: 'Món hầm, kho niêu, nướng chuẩn tiệc', icon: '🥘' },
  };

  const cuisineOptions = [
    { id: 'vietnamese', name: 'Món Việt Truyền Thống', flag: '🇻🇳' },
    { id: 'healthy', name: 'Thực Dưỡng / Eat Clean', flag: '🥑' },
    { id: 'korean', name: 'Món Hàn Quốc', flag: '🇰🇷' },
    { id: 'japanese', name: 'Món Nhật Bản', flag: '🇯🇵' },
    { id: 'western', name: 'Món Âu - Mỹ', flag: '🍝' },
  ];

  const restrictionOptions = [
    { id: 'none', label: 'Không kiêng gì', icon: '🍽️' },
    { id: 'vegetarian', label: 'Ăn chay / Thuần thực vật', icon: '🌱' },
    { id: 'no-pork', label: 'Không ăn thịt heo', icon: '🚫' },
    { id: 'no-beef', label: 'Không ăn thịt bò', icon: '🥩' },
    { id: 'seafood-allergy', label: 'Dị ứng hải sản', icon: '🦐' },
  ];

  const tasteOptions = [
    { id: 'dam-da', label: 'Đậm đà chuẩn vị', desc: 'Nêm nếm thơm ngon, dậy vị' },
    { id: 'thanh-dam', label: 'Thanh đạm, ít muối', desc: 'Giữ vị ngọt tự nhiên của rau củ' },
    { id: 'cay', label: 'Thích cay nồng', desc: 'Ớt cay ấm bụng kích thích vị giác' },
    { id: 'chua-cay', label: 'Chua cay kiểu Thái / miền Tây', desc: 'Hài hòa kích thích tuyến nước bọt' },
    { id: 'ngot', label: 'Thiên ngọt Nam Bộ', desc: 'Vị ngọt thanh dịu trong các món kho/canh' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      <UserHeader />

      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[8%] w-[550px] h-[550px] bg-orange-200/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. HERO PROFILE CARD */}
        {/* ========================================================================= */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100/90 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-orange-400/10 to-amber-300/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
            
            {/* Avatar with Live Badge & Quick Camera Trigger */}
            <div className="relative group shrink-0">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-orange-500/10 bg-orange-50">
                <img
                  src={getUserAvatarUrl(user)}
                  alt="Chef Avatar"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/facebook-default-avatar.svg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-[#E4E6EB]"
                />
              </div>

              {/* Online indicator */}
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>

              {/* Quick switch to Edit Avatar */}
              <button
                type="button"
                onClick={() => setActiveTab('edit_profile')}
                className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="text-center md:text-left space-y-3 flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                      {user.fullName || `${user.lastName || ''} ${user.firstName || 'Smart Chef'}`.trim()}
                    </h1>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${currentLevel.bg} ${currentLevel.color} border ${currentLevel.border} shadow-2xs`}>
                      <span>{currentLevel.badge}</span>
                      <span>{currentLevel.name}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center md:justify-start gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Đã xác thực
                    </span>
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center justify-center md:justify-end gap-2.5 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit_profile')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      activeTab === 'edit_profile'
                        ? 'bg-orange-500 text-white shadow-orange-500/20'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh Sửa Hồ Sơ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('preferences')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      activeTab === 'preferences'
                        ? 'bg-orange-500 text-white shadow-orange-500/20'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Khẩu Vị AI</span>
                  </button>
                </div>
              </div>

              {/* XP Progress & Cooking Milestones */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-orange-600">
                    <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                    <span>{currentChefXp} XP Điểm Đầu Bếp</span>
                  </div>
                  {nextLevel ? (
                    <span className="text-slate-500">
                      Còn <strong className="text-orange-600">{xpNeeded} XP</strong> để lên <span className="text-slate-800">{nextLevel.name}</span>
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-bold">Cấp bậc Bếp Trưởng Tối Đa 👑</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Badges preview row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-[11px] font-bold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/70">
                    🍳 {safeHistory.length} món đã nấu
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Khẩu vị AI: {user.preferences?.hasCompletedSurvey ? 'Đã kích hoạt' : 'Chưa hoàn tất'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/70">
                    ✨ Khẩu phần: {portionLabels[user.preferences?.portion || '3-4'] || '3 - 4 người'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TAB NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-orange-200/60 pb-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Tổng Quan Hồ Sơ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit_profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'edit_profile'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Chỉnh Sửa Thông Tin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'preferences'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Khẩu Vị & Dinh Dưỡng AI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Lịch Sử Nấu Bếp ({safeHistory.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Điểm Đầu Bếp</span>
                <div className="flex items-center gap-1.5 text-2xl font-black text-orange-600">
                  <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
                  <span>{currentChefXp}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Tích luỹ sau các món nấu</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cấp Độ Hiện Tại</span>
                <div className="text-xl font-black text-slate-800 flex items-center gap-1">
                  <span>{currentLevel.badge}</span>
                  <span className="truncate">{currentLevel.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Bậc danh hiệu nhà bếp</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Món Đã Nấu</span>
                <div className="text-2xl font-black text-slate-800">
                  {safeHistory.length} <span className="text-xs font-normal text-slate-400">món</span>
                </div>
                <p className="text-[11px] text-emerald-600 font-bold">Thực đơn phong phú</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-orange-100 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cá Nhân Hoá AI</span>
                <div className="text-2xl font-black text-amber-600">
                  98%
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Phù hợp thể trạng bạn</p>
              </div>
            </div>

            {/* AI Preferences Snapshot */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg font-heading">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h2>Khẩu Vị Cá Nhân Hoá Cho Đề Xuất AI</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('preferences')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
                >
                  <span>Chỉnh sửa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Thuật toán SmartCook sử dụng hồ sơ này để lọc công thức và kết nối tủ lạnh thông minh chính xác nhất:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wide">
                    <Users className="w-3.5 h-3.5 text-orange-500" />
                    <span>Khẩu phần nấu chuẩn</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-800">
                    {portionLabels[user.preferences?.portion || '3-4'] || '3 - 4 người'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wide">
                    <Target className="w-3.5 h-3.5 text-orange-500" />
                    <span>Mục tiêu dinh dưỡng</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-800">
                    {healthGoalLabels[user.preferences?.healthGoal || 'healthy']?.title || 'Ăn uống cân bằng & Eat Clean'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold uppercase tracking-wide">
                    <Timer className="w-3.5 h-3.5 text-orange-500" />
                    <span>Thời gian chuẩn bị</span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-800">
                    {cookingTimeLabels[user.preferences?.cookingTime || 'medium']?.title || 'Khoảng 20 - 35 phút'}
                  </div>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                {user.preferences?.cuisines?.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 font-semibold">
                    🥢 {c === 'vietnamese' ? 'Món Việt' : c === 'healthy' ? 'Eat Clean' : c === 'korean' ? 'Món Hàn' : c === 'japanese' ? 'Món Nhật' : c}
                  </span>
                ))}
                {user.preferences?.tasteProfile?.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 font-semibold border border-amber-200/50">
                    🍯 Gu: {t === 'dam-da' ? 'Đậm đà' : t === 'thanh-dam' ? 'Thanh đạm' : t === 'cay' ? 'Cay nồng' : t === 'chua-cay' ? 'Chua cay' : t}
                  </span>
                ))}
                {user.preferences?.restrictions?.map((r) => (
                  <span key={r} className="px-3 py-1 rounded-xl bg-red-50 text-red-700 font-semibold border border-red-200/50">
                    ⚠️ {r === 'vegetarian' ? 'Ăn chay' : r === 'no-pork' ? 'Không thịt heo' : r === 'no-beef' ? 'Không thịt bò' : r === 'seafood-allergy' ? 'Dị ứng hải sản' : r}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Cooked Dishes */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg font-heading">
                  <History className="w-5 h-5 text-orange-500" />
                  <h2>Món Nấu Gần Đây</h2>
                </div>
                {safeHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline"
                  >
                    <span>Xem tất cả ({safeHistory.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {safeHistory.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-orange-50/30 border border-dashed border-orange-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center text-xl">
                    🍳
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">Chưa có lịch sử nấu nướng</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Khám phá kho món ngon của SmartCook và bấm &quot;Bắt đầu nấu&quot; để tích luỹ XP và thăng hạng Bếp Trưởng!
                  </p>
                  <Link
                    to="/recipes"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-sm hover:bg-orange-600 transition-all"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Khám Phá Món Ngon Ngay</span>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {safeHistory.slice(0, 4).map((record) => (
                    <div key={record._id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center font-bold text-base shadow-2xs">
                          🥘
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                            {record.recipeId?.title || 'Món ăn gia đình SmartCook'}
                          </h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{new Date(record.cookedAt).toLocaleDateString('vi-VN')}</span>
                            {record.notes && <span>• {record.notes}</span>}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl">
                        +50 XP
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Favorite Recipes Banner */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-bold text-base font-heading flex items-center justify-center sm:justify-start gap-2">
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Kho Món Ăn Yêu Thích Của Bạn</span>
                </h3>
                <p className="text-xs text-orange-100 leading-relaxed max-w-xl">
                  Truy cập nhanh danh sách các món ăn đã lưu để lên thực đơn hàng ngày, ghép nguyên liệu từ tủ lạnh và nhận đề xuất AI thông minh.
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
        )}

        {/* ========================================================================= */}
        {/* TAB 2: EDIT PROFILE */}
        {/* ========================================================================= */}
        {activeTab === 'edit_profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-8">
            <div>
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xl font-heading">
                <Edit3 className="w-5 h-5 text-orange-500" />
                <h2>Chỉnh Sửa Thông Tin Cá Nhân</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 pt-1">
                Cập nhật thông tin hiển thị trên cộng đồng SmartCook và ảnh đại diện phong cách ẩm thực của bạn.
              </p>
            </div>

            {/* Alert Messages */}
            {profileSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            {profileErrorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-8">
              
              {/* Avatar Selection Section */}
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ảnh Đại Diện Đầu Bếp
                </label>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
                  {/* Current Preview */}
                  <div className="relative shrink-0">
                    <img
                      src={avatarPreview || (user ? getUserAvatarUrl(user) : '/facebook-default-avatar.svg')}
                      alt="Avatar Preview"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/facebook-default-avatar.svg';
                      }}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-[#E4E6EB]"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all hover:scale-105"
                      title="Tải ảnh mới"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <h4 className="text-sm font-bold text-slate-800">Tải ảnh từ máy tính hoặc chọn bộ sưu tập</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa 5MB. Ảnh sẽ được tự động đồng bộ lên máy chủ Cloudinary.
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-all active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-orange-500" />
                        <span>Chọn tệp ảnh từ máy</span>
                      </button>

                      {avatarFile && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
                          ✓ Đã chọn: {avatarFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preset Avatars Gallery */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-600">Hoặc chọn nhanh avatar mẫu có sẵn:</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-1">
                    {AVATAR_PRESETS.map((preset) => {
                      const isSelected = avatarPreview === preset.url && !avatarFile;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectPresetAvatar(preset.url)}
                          className={`group relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-0.5 ${
                            isSelected
                              ? 'border-orange-500 ring-2 ring-orange-400/40 scale-105 shadow-sm'
                              : 'border-slate-200 hover:border-orange-300 opacity-80 hover:opacity-100 hover:scale-102'
                          }`}
                          title={preset.label}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          {isSelected && (
                            <span className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white drop-shadow-md stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Personal Info Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Họ và tên đệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Tên đầu bếp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ví dụ: Quang"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Địa chỉ Email liên kết (Không thể đổi)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-sm font-medium cursor-not-allowed select-none"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <span className="absolute right-3.5 top-3 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Đã xác thực
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-0.5">
                    Email dùng để đăng nhập và nhận thông báo kế hoạch dinh dưỡng SmartCook.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-all active:scale-95"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingProfile ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu Thay Đổi Hồ Sơ</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CULINARY PREFERENCES (AI SURVEY) */}
        {/* ========================================================================= */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xl font-heading">
                  <Sliders className="w-5 h-5 text-orange-500" />
                  <h2>Thiết Lập Khẩu Vị & Mục Tiêu Dinh Dưỡng AI</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 pt-1">
                  Tuỳ chỉnh gu ẩm thực để SmartCook AI gợi ý món chuẩn xác từ nguyên liệu trong tủ lạnh của bạn.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={isSavingPreferences}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {isSavingPreferences ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Cấu Hình AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Alert Messages */}
            {preferenceSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{preferenceSuccessMsg}</span>
              </div>
            )}

            {preferenceErrorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{preferenceErrorMsg}</span>
              </div>
            )}

            <div className="space-y-8">
              
              {/* 1. Portion Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">1. Số lượng khẩu phần ăn thường nấu</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['1', '2', '3-4', '5+'] as const).map((p) => {
                    const isSelected = portion === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPortion(p)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-400/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="text-lg font-black text-slate-800">{p} phần</div>
                        <div className="text-xs text-slate-500 font-medium pt-0.5">{portionLabels[p]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Health Goal */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">2. Mục tiêu dinh dưỡng ưu tiên</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['healthy', 'loss', 'muscle', 'budget'] as const).map((key) => {
                    const item = healthGoalLabels[key];
                    const isSelected = healthGoal === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setHealthGoal(key)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-400/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{item.title}</div>
                          <div className="text-[11px] text-slate-500 font-medium pt-1 leading-snug">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Cooking Time */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">3. Thời gian nấu ăn mong muốn</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['quick', 'medium', 'standard', 'slow'] as const).map((key) => {
                    const item = cookingTimeLabels[key];
                    const isSelected = cookingTime === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCookingTime(key)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-orange-50/80 border-orange-500 ring-2 ring-orange-400/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-orange-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{item.title}</div>
                          <div className="text-[11px] text-slate-500 font-medium pt-1 leading-snug">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Preferred Cuisines */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">4. Phong cách ẩm thực yêu thích (chọn nhiều)</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {cuisineOptions.map((c) => {
                    const isSelected = cuisines.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleSelection(cuisines, c.id, setCuisines)}
                        className={`px-4 py-2.5 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-orange-200'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Dietary Restrictions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">5. Dị ứng & Hạn chế ăn uống</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {restrictionOptions.map((r) => {
                    const isSelected = restrictions.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          if (r.id === 'none') {
                            setRestrictions(['none']);
                          } else {
                            const withoutNone = restrictions.filter((x) => x !== 'none');
                            toggleSelection(withoutNone, r.id, setRestrictions);
                          }
                        }}
                        className={`px-4 py-2.5 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Taste Profile */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-800">6. Gu nêm nếm & vị giác yêu thích</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tasteOptions.map((t) => {
                    const isSelected = tasteProfile.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleSelection(tasteProfile, t.id, setTasteProfile)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{t.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium pt-1">{t.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  disabled={isSavingPreferences}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
                >
                  {isSavingPreferences ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang lưu khẩu vị...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Cập Nhật Khẩu Vị AI Ngay</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COOKING HISTORY */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xl font-heading">
                  <History className="w-5 h-5 text-orange-500" />
                  <h2>Lịch Sử Bếp & Thành Tích ({safeHistory.length})</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 pt-1">
                  Mỗi lần nấu hoàn thành giúp bạn tích luỹ điểm XP để thăng cấp danh hiệu Đầu Bếp SmartCook.
                </p>
              </div>

              <Link
                to="/recipes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold text-xs border border-orange-200/80 transition-all hover:scale-105 active:scale-95"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Nấu Món Mới</span>
              </Link>
            </div>

            {safeHistory.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-orange-50/30 border border-dashed border-orange-200 space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center text-2xl shadow-xs">
                  🍳
                </div>
                <h4 className="font-bold text-base text-slate-800">Chưa có lịch sử nấu nướng nào</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Hãy chọn một món ăn yêu thích, chuẩn bị nguyên liệu và bắt đầu vào bếp. Sau khi hoàn thành, SmartCook sẽ ghi nhận lịch sử và cộng điểm XP cho bạn!
                </p>
                <Link
                  to="/recipes"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:bg-orange-600 transition-all"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Xem Danh Sách Món Ăn</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {safeHistory.map((record) => (
                  <div key={record._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">
                        👨‍🍳
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          {record.recipeId?.title || 'Món ăn gia đình SmartCook'}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(record.cookedAt).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {record.notes && (
                            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium">
                              {record.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-xl">
                        +50 XP Điểm Bếp
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
