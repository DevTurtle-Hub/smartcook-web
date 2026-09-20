import React, { useState, useMemo } from 'react';
import {
  Search,
  Check,
  X,
  Eye,
  ShieldCheck,
  Lock,
  Unlock,
  Ban,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Sparkles,
  Award,
  Crown,
  Heart,
  BookOpen,
  Filter,
  ArrowUpDown,
  Plus,
  Phone,
  Shield,
  ChefHat,
  Smartphone,
  SlidersHorizontal,
  Flame,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Trash2,
  Edit,
  AlertTriangle,
  FileEdit,
  Refrigerator,
  Scan,
  UtensilsCrossed,
  Activity,
  History,
  Tag,
  Target,
  Layers,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { AppUserAdmin, AdminStaff } from '../../types/admin';

export const UserManagementPage: React.FC = () => {
  const {
    users,
    staff,
    toggleUserStatus,
    updateUserBadge,
    updateUserProfile,
    deleteUser,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'users' | 'rbac'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | 'Free' | 'VIP Premium'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'posts' | 'saved' | 'name'>('newest');

  // Modal Xem chi tiết hồ sơ người dùng
  const [viewingUser, setViewingUser] = useState<AppUserAdmin | null>(null);

  // Modal Chỉnh sửa thông tin thành viên (Edit User Modal)
  const [editingUser, setEditingUser] = useState<AppUserAdmin | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDiet, setEditDiet] = useState('');
  const [editTier, setEditTier] = useState<'Free' | 'VIP Premium'>('Free');
  const [editBadge, setEditBadge] = useState<AppUserAdmin['badge']>('Thành Viên Mới');
  const [editStatus, setEditStatus] = useState<AppUserAdmin['status']>('active');

  // Popup Xác nhận hành động bảo mật (Confirm Action: Khóa, Chặn/Cấm, Xóa tài khoản)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'suspend' | 'ban' | 'activate' | 'delete';
    user: AppUserAdmin | null;
    reason?: string;
  }>({
    isOpen: false,
    type: 'suspend',
    user: null,
    reason: '',
  });

  // Modal Phân quyền nhân viên mới (RBAC)
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<AdminStaff['role']>('Content Editor');

  // Mở modal chỉnh sửa thông tin người dùng
  const handleOpenEditModal = (u: AppUserAdmin) => {
    setEditingUser(u);
    setEditFullName(u.fullName);
    setEditEmail(u.email);
    setEditDiet(u.dietPreference);
    setEditTier(u.tier);
    setEditBadge(u.badge);
    setEditStatus(u.status);
  };

  // Lưu chỉnh sửa thông tin người dùng
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserProfile(editingUser.id, {
      fullName: editFullName.trim(),
      email: editEmail.trim(),
      dietPreference: editDiet.trim() || 'Ăn uống đa dạng',
      tier: editTier,
      badge: editBadge,
      status: editStatus,
    });
    // Nếu đang mở modal chi tiết thì cập nhật luôn
    if (viewingUser && viewingUser.id === editingUser.id) {
      setViewingUser({
        ...viewingUser,
        fullName: editFullName.trim(),
        email: editEmail.trim(),
        dietPreference: editDiet.trim() || 'Ăn uống đa dạng',
        tier: editTier,
        badge: editBadge,
        status: editStatus,
      });
    }
    setEditingUser(null);
  };

  // Thực thi hành động từ Confirm Modal (Khóa, Mở khóa, Cấm, Xóa)
  const handleExecuteConfirmAction = () => {
    if (!confirmModal.user) return;
    const { user, type } = confirmModal;

    if (type === 'activate') {
      toggleUserStatus(user.id, 'active');
      if (viewingUser && viewingUser.id === user.id) {
        setViewingUser({ ...viewingUser, status: 'active' });
      }
    } else if (type === 'suspend') {
      toggleUserStatus(user.id, 'suspended');
      if (viewingUser && viewingUser.id === user.id) {
        setViewingUser({ ...viewingUser, status: 'suspended' });
      }
    } else if (type === 'ban') {
      toggleUserStatus(user.id, 'banned');
      if (viewingUser && viewingUser.id === user.id) {
        setViewingUser({ ...viewingUser, status: 'banned' });
      }
    } else if (type === 'delete') {
      deleteUser(user.id);
      if (viewingUser && viewingUser.id === user.id) {
        setViewingUser(null);
      }
    }

    setConfirmModal({ isOpen: false, type: 'suspend', user: null, reason: '' });
  };

  // Filter & Sort Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.dietPreference.toLowerCase().includes(q);

        const matchTier = tierFilter === 'all' || u.tier === tierFilter;
        const matchStatus = statusFilter === 'all' || u.status === statusFilter;
        const matchBadge = badgeFilter === 'all' || u.badge === badgeFilter;

        return matchSearch && matchTier && matchStatus && matchBadge;
      })
      .sort((a, b) => {
        if (sortBy === 'posts') return b.postsCount - a.postsCount;
        if (sortBy === 'saved') return b.savedRecipesCount - a.savedRecipesCount;
        if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
        return 0; // newest/default
      });
  }, [users, searchQuery, tierFilter, statusFilter, badgeFilter, sortBy]);

  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const suspendedUsersCount = users.filter((u) => u.status === 'suspended').length;
  const bannedUsersCount = users.filter((u) => u.status === 'banned').length;
  const vipUsersCount = users.filter((u) => u.tier === 'VIP Premium').length;

  return (
    <div className="space-y-4">
      {/* ================= THANH ĐIỀU HƯỚNG TAB CHÍNH + THẺ CHỈ SỐ BẮT MẮT ================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Thành Viên Mobile App</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'users' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'rbac'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Phân Quyền Nhân Sự & Admin (RBAC)</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'rbac' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {staff.length}
            </span>
          </button>
        </div>

        {/* Tóm tắt nhanh số liệu (Indigo & Amber & Trạng thái bảo mật) */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/70 border border-indigo-100 rounded-lg text-indigo-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span>Hoạt động:</span>
            <strong className="font-extrabold font-['Outfit']">{activeUsersCount}</strong>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/80 border border-amber-200/70 rounded-lg text-amber-800 font-medium">
            <Crown className="w-3 h-3 text-amber-500" />
            <span>Hội viên VIP:</span>
            <strong className="font-extrabold font-['Outfit']">{vipUsersCount}</strong>
          </div>

          {(suspendedUsersCount > 0 || bannedUsersCount > 0) && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-bold">
              <Lock className="w-3 h-3 text-rose-500" />
              <span>Khóa/Cấm:</span>
              <strong className="font-['Outfit']">{suspendedUsersCount + bannedUsersCount}</strong>
            </div>
          )}

          {activeTab === 'rbac' && (
            <button
              onClick={() => setShowStaffModal(true)}
              className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Nhân Sự</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: QUẢN LÝ THÀNH VIÊN MOBILE (TABLE DÀI CHUYÊN NGHIỆP, NÚT RÕ RÀNG)
      ========================================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Thanh công cụ tìm kiếm & bộ lọc */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Ô tìm kiếm */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, khẩu vị..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Lọc Gói Hội Viên */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1">
                  Gói VIP:
                </span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'Free', label: 'Bản Free' },
                  { id: 'VIP Premium', label: 'VIP Premium' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setTierFilter(tier.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      tierFilter === tier.id
                        ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              {/* Lọc Trạng Thái Tài Khoản */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1">
                  Trạng thái:
                </span>
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'active', label: 'Hoạt động' },
                  { id: 'suspended', label: 'Tạm khóa' },
                  { id: 'banned', label: 'Cấm' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      statusFilter === st.id
                        ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500">
                <span className="text-[10.5px] text-slate-400 font-bold uppercase">Xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="posts">Nhiều bài đăng</option>
                  <option value="saved">Lưu nhiều món</option>
                  <option value="name">Tên A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU TABLE CHỮ NHẬT DÀI */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Thành Viên</th>
                    <th className="py-3 px-4">Khẩu Vị / Ăn Uống</th>
                    <th className="py-3 px-4">Huy Hiệu Đầu Bếp</th>
                    <th className="py-3 px-4">Gói Tài Khoản</th>
                    <th className="py-3 px-4">Tương Tác</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-5 text-right">Thao Tác Bảo Mật & Quản Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy người dùng nào phù hợp với bộ lọc.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors group">
                        {/* Cột 1: Thông tin thành viên */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={u.avatar}
                                alt={u.fullName}
                                className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-2xs group-hover:border-indigo-300 transition-colors"
                              />
                              {u.tier === 'VIP Premium' && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-xs">
                                  <Crown className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block leading-tight">
                                {u.fullName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Khẩu vị & Chế độ ăn (SRS Module 2: Personalization) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[11px] border border-indigo-100/60">
                            {u.dietPreference}
                          </span>
                        </td>

                        {/* Cột 3: Cấp độ huy hiệu đầu bếp */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                            <select
                              value={u.badge}
                              onChange={(e) =>
                                updateUserBadge(u.id, e.target.value as AppUserAdmin['badge'])
                              }
                              className="bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 font-bold border border-amber-200/70 text-[11px] rounded-lg px-2 py-1 outline-none cursor-pointer transition-colors"
                            >
                              <option value="Thành Viên Mới">Thành Viên Mới</option>
                              <option value="Đầu Bếp Nghiệp Dư">Đầu Bếp Nghiệp Dư</option>
                              <option value="Bếp Trưởng Bạc">Bếp Trưởng Bạc</option>
                              <option value="Master Chef">Master Chef ⭐</option>
                            </select>
                          </div>
                        </td>

                        {/* Cột 4: Gói Dịch Vụ */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                              u.tier === 'VIP Premium'
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs shadow-amber-500/20'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {u.tier === 'VIP Premium' && <Crown className="w-3 h-3" />}
                            <span>{u.tier}</span>
                          </span>
                        </td>

                        {/* Cột 5: Hoạt động */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                          <div>
                            <strong className="text-indigo-600 font-['Outfit'] font-bold">{u.postsCount}</strong> bài đăng
                          </div>
                          <div className="text-slate-400">
                            <strong className="text-slate-700 font-['Outfit'] font-bold">{u.savedRecipesCount}</strong> món đã lưu
                          </div>
                        </td>

                        {/* Cột 6: Trạng thái tài khoản */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.status === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Hoạt động
                            </span>
                          )}
                          {u.status === 'suspended' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold text-amber-700 bg-amber-50 border border-amber-200/70">
                              <Lock className="w-3 h-3 text-amber-600" />
                              Tạm khóa
                            </span>
                          )}
                          {u.status === 'banned' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold text-rose-700 bg-rose-50 border border-rose-200/70">
                              <Ban className="w-3 h-3 text-rose-600" />
                              Bị cấm
                            </span>
                          )}
                        </td>

                        {/* Cột 7: Thao tác có nút rõ ràng, popup confirm */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Xem Hồ Sơ */}
                            <button
                              onClick={() => setViewingUser(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-2xs"
                              title="Xem toàn bộ hồ sơ thành viên"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Hồ sơ</span>
                            </button>

                            {/* Nút Sửa Thông Tin */}
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-900 hover:text-white font-bold text-xs transition-all active:scale-95"
                              title="Chỉnh sửa thông tin thành viên"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>

                            {/* Nút Khóa / Mở Khóa (Kèm Popup Confirm) */}
                            {u.status === 'active' ? (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'suspend',
                                    user: u,
                                    reason: '',
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-600 hover:text-white border border-amber-200/80 font-bold text-xs transition-all active:scale-95"
                                title="Tạm khóa tài khoản thành viên"
                              >
                                <Lock className="w-3.5 h-3.5" />
                                <span>Khóa</span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'activate',
                                    user: u,
                                    reason: '',
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 font-bold text-xs transition-all active:scale-95"
                                title="Mở khóa tài khoản"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                                <span>Mở Khóa</span>
                              </button>
                            )}

                            {/* Nút Cấm Vĩnh Viễn (Kèm Popup Confirm) */}
                            {u.status !== 'banned' && (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'ban',
                                    user: u,
                                    reason: '',
                                  })
                                }
                                className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200/80 transition-all active:scale-95"
                                title="Chặn cấm tài khoản vĩnh viễn"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Nút Xóa Tài Khoản (Kèm Popup Confirm) */}
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  type: 'delete',
                                  user: u,
                                  reason: '',
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Xóa tài khoản khỏi hệ thống"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer tóm tắt */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
              <span>
                Đang hiển thị <strong className="text-slate-900 font-bold">{filteredUsers.length}</strong> / <strong>{users.length}</strong> tài khoản thành viên
              </span>
              <span className="text-[11px] text-slate-400">SmartCook Account & Security Directory</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PHÂN QUYỀN NHÂN SỰ & QUẢN TRỊ VIÊN (RBAC HIỆN ĐẠI BẮT MẮT)
      ========================================================================== */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          {/* Bảng phân cấp vai trò hệ thống */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                role: 'Super Admin',
                desc: 'Toàn quyền cấu hình máy chủ, API keys, quản lý thanh toán VIP.',
                count: staff.filter((s) => s.role === 'Super Admin').length,
                theme: 'from-indigo-500/10 to-indigo-50 border-indigo-200/80 text-indigo-700',
                badgeBg: 'bg-indigo-600 text-white',
              },
              {
                role: 'Content Editor',
                desc: 'Thêm/sửa công thức MasterChef, cấu hình banner mobile, từ điển nguyên liệu.',
                count: staff.filter((s) => s.role === 'Content Editor').length,
                theme: 'from-amber-500/10 to-amber-50 border-amber-200/80 text-amber-800',
                badgeBg: 'bg-amber-500 text-white',
              },
              {
                role: 'Community Moderator',
                desc: 'Duyệt bài đăng, kiểm duyệt báo cáo vi phạm, quản lý hashtag xu hướng.',
                count: staff.filter((s) => s.role === 'Community Moderator').length,
                theme: 'from-indigo-500/10 to-indigo-50 border-indigo-200/80 text-indigo-700',
                badgeBg: 'bg-indigo-600 text-white',
              },
              {
                role: 'Support Staff',
                desc: 'Hỗ trợ giải đáp thắc mắc người dùng, tra cứu lịch sử nấu ăn.',
                count: staff.filter((s) => s.role === 'Support Staff').length,
                theme: 'from-amber-500/10 to-amber-50 border-amber-200/80 text-amber-800',
                badgeBg: 'bg-amber-500 text-white',
              },
            ].map((r, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl bg-gradient-to-b ${r.theme} border shadow-xs space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold font-['Outfit']">{r.role}</span>
                  <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs ${r.badgeBg}`}>
                    {r.count} người
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* Table danh sách nhân sự quản trị */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Danh Sách Nhân Sự Đang Được Trao Quyền Hệ Thống</span>
              </h3>
              <span className="text-xs text-slate-400">Phân quyền theo vai trò (RBAC)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Nhân Sự</th>
                    <th className="py-3 px-4">Vai Trò Phân Bổ</th>
                    <th className="py-3 px-4">Đăng Nhập Gần Nhất</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-5 text-right">Tác Vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {staff.map((st) => (
                    <tr key={st.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs font-['Outfit'] border border-indigo-200">
                            {st.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{st.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono block">{st.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            st.role === 'Super Admin'
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                              : st.role === 'Content Editor'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {st.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {st.lastLogin}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10.5px] border border-emerald-200/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Đang hoạt động
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => alert(`Chỉnh sửa phân quyền cho ${st.name}`)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold rounded-lg transition-all active:scale-95 shadow-2xs"
                        >
                          Đổi Quyền
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: XEM CHI TIẾT HỒ SƠ THÀNH VIÊN (LAYOUT RỘNG GẦN FULL MÀN HÌNH)
      {/* =========================================================================
          MODAL: XEM CHI TIẾT HỒ SƠ THÀNH VIÊN (THÔNG TIN TÀI KHOẢN & TRÊN APP ĐẦY ĐỦ)
      ========================================================================== */}
      {viewingUser && (() => {
        const currentUserData = users.find((u) => u.id === viewingUser.id) || viewingUser;
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-slate-800">
            {/* Topbar Header */}
            <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 shrink-0">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-extrabold text-indigo-900 uppercase font-['Outfit'] tracking-wider flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>Hồ Sơ Toàn Diện Thành Viên #{viewingUser.id}</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600">
                  Phân hạng VIP:{' '}
                  <strong
                    className={
                      viewingUser.tier === 'VIP Premium' ? 'text-amber-600 font-extrabold' : 'text-slate-800 font-bold'
                    }
                  >
                    {viewingUser.tier}
                  </strong>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  Ngày tham gia: <strong className="text-slate-700">{viewingUser.joinDate}</strong>
                </span>
              </div>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Khung 2 Cột Rộng Chuyên Nghiệp */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* CỘT TRÁI (5/12): THÔNG TIN TÀI KHOẢN & ĐẶC TÍNH SỨC KHỎE TRÊN APP */}
              <div className="lg:col-span-5 border-r border-slate-200 p-6 overflow-y-auto space-y-4 bg-slate-50/50 text-xs">
                {/* 1. Header Card Cá Nhân */}
                <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={viewingUser.avatar}
                        alt={viewingUser.fullName}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-100 shadow-sm"
                      />
                      {viewingUser.tier === 'VIP Premium' && (
                        <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-[9px] font-extrabold shadow-2xs flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-base font-extrabold text-slate-900 font-['Outfit'] truncate">
                        {viewingUser.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono truncate">{viewingUser.email}</span>
                      </div>
                      {viewingUser.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="font-mono">{viewingUser.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-extrabold text-[10.5px] flex items-center gap-1">
                        <ChefHat className="w-3 h-3 text-amber-600" />
                        <span>{viewingUser.badge}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          viewingUser.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : viewingUser.status === 'suspended'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {viewingUser.status === 'active' ? 'Đang Hoạt Động' : viewingUser.status === 'suspended' ? 'Tạm Khóa' : 'Bị Cấm'}
                      </span>
                    </div>

                    <span className="text-[10.5px] text-slate-400">
                      Online: <strong className="text-slate-700">{viewingUser.lastActive}</strong>
                    </span>
                  </div>
                </div>

                {/* 2. Thông tin tài khoản chi tiết */}
                <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
                  <span className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dữ Liệu Đăng Ký Tài Khoản</span>
                  </span>
                  <div className="space-y-1.5 divide-y divide-slate-100 text-xs">
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="text-slate-400">Mã định danh User:</span>
                      <span className="font-mono font-bold text-slate-800">UID: #{viewingUser.id}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="text-slate-400">Gói thành viên:</span>
                      <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {viewingUser.tier}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="text-slate-400">Ngày tạo tài khoản:</span>
                      <span className="font-semibold text-slate-800">{viewingUser.joinDate}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5">
                      <span className="text-slate-400">Thiết bị truy cập:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Android App (SmartCook Mobile)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Dữ liệu cá nhân hóa ăn uống & sức khỏe trên App (SRS Module 2) */}
                <div className="p-4 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
                  <span className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                    <Target className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Hồ Sơ Dinh Dưỡng & Khẩu Vị Trên App</span>
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Chế độ ăn ưa thích:</span>
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-extrabold text-[11px]">
                        {viewingUser.dietPreference}
                      </span>
                    </div>
                    {viewingUser.healthGoal && (
                      <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Mục tiêu thể chất:</span>
                        <span className="font-bold text-amber-900">{viewingUser.healthGoal}</span>
                      </div>
                    )}

                    {/* Dị ứng thực phẩm */}
                    {viewingUser.allergies && viewingUser.allergies.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-slate-400 text-[10.5px] font-bold uppercase block">
                          Cảnh báo dị ứng (Allergies):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {viewingUser.allergies.map((alg, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                            >
                              ⚠️ {alg}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nguyên liệu yêu thích */}
                    {viewingUser.favoriteIngredients && (
                      <div className="space-y-1 pt-1">
                        <span className="text-slate-400 text-[10.5px] font-bold uppercase block">
                          Nguyên liệu thường dùng:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {viewingUser.favoriteIngredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nút chỉnh sửa hồ sơ */}
                <button
                  onClick={() => handleOpenEditModal(viewingUser)}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
                >
                  <Edit className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Chỉnh Sửa Thông Tin Thành Viên</span>
                </button>
              </div>

              {/* CỘT PHẢI (7/12): THỐNG KÊ VẬN HÀNH & CÔNG CỤ QUẢN TRỊ CHUYÊN NGHIỆP */}
              <div className="lg:col-span-7 p-6 overflow-y-auto space-y-4 bg-white text-xs">
                {/* 1. BẢNG DỮ LIỆU SỬ DỤNG TÍNH NĂNG TRÊN APP MOBILE (THIẾT KẾ CHUẨN DATA TABLE QUẢN LÝ) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Thông Số Sử Dụng Trên App Mobile</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Dữ liệu đồng bộ Real-time</span>
                  </div>

                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-100 text-xs">
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-700 w-1/3">
                          Tủ Lạnh Thông Minh
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 font-['Outfit']">
                          {currentUserData.smartFridgeItemsCount ?? 15} <span className="font-normal text-slate-500 text-[11px]">nguyên liệu tồn kho</span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[10.5px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                            Ngăn mát & đông
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          Phiên Nấu Cook With Me
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 font-['Outfit']">
                          {currentUserData.completedCookSessions ?? 32} <span className="font-normal text-slate-500 text-[11px]">lần hoàn thành</span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                            Có hẹn giờ timer
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          Smart Vision AI Scan
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 font-['Outfit']">
                          {currentUserData.aiScansCount ?? 20} <span className="font-normal text-slate-500 text-[11px]">lượt quét camera</span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[10.5px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                            Độ chính xác 95%
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          Món Ăn Yêu Thích
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 font-['Outfit']">
                          {currentUserData.savedRecipesCount} <span className="font-normal text-slate-500 text-[11px]">công thức đã lưu</span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                            Bộ sưu tập cá nhân
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 2. KHUNG QUẢN TRỊ TÀI KHOẢN & PHÂN QUYỀN HỆ THỐNG */}
                <div className="border border-slate-200 rounded-xl p-4 space-y-3.5 bg-slate-50/40">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Thao Tác Quản Trị & Trạng Thái Tài Khoản</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Quyền Admin Cấp Cao</span>
                  </div>

                  {/* Nhóm nút trạng thái tài khoản */}
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] font-semibold text-slate-600 block">
                      Thiết lập trạng thái đăng nhập:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            type: 'activate',
                            user: currentUserData,
                            reason: '',
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                          currentUserData.status === 'active'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Kích Hoạt Bình Thường</span>
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            type: 'suspend',
                            user: currentUserData,
                            reason: '',
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                          currentUserData.status === 'suspended'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Tạm Khóa</span>
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            type: 'ban',
                            user: currentUserData,
                            reason: '',
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                          currentUserData.status === 'banned'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cấm Vĩnh Viễn</span>
                      </button>

                      <button
                        onClick={() =>
                          setConfirmModal({
                            isOpen: true,
                            type: 'delete',
                            user: currentUserData,
                            reason: '',
                          })
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa User</span>
                      </button>
                    </div>
                  </div>

                  {/* Cấp bậc danh hiệu Gamification */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <span className="text-[10.5px] font-semibold text-slate-600 block">
                      Cấp bậc danh hiệu đầu bếp (Gamification):
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        'Thành Viên Mới',
                        'Đầu Bếp Nghiệp Dư',
                        'Bếp Trưởng Bạc',
                        'Master Chef',
                      ].map((badge) => (
                        <button
                          key={badge}
                          onClick={() => updateUserBadge(currentUserData.id, badge as any)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                            currentUserData.badge === badge
                              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {badge}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. LỊCH SỬ HOẠT ĐỘNG TRÊN ỨNG DỤNG MOBILE */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Nhật Ký Tương Tác Gần Đây</span>
                    </span>
                    <span className="text-[10.5px] text-slate-500">
                      {currentUserData.recentAppActivities?.length || 0} hoạt động được ghi nhận
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto">
                    {currentUserData.recentAppActivities && currentUserData.recentAppActivities.length > 0 ? (
                      currentUserData.recentAppActivities.map((act, idx) => (
                        <div
                          key={idx}
                          className="px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                act.type === 'cook'
                                  ? 'bg-emerald-500'
                                  : act.type === 'ai_scan'
                                  ? 'bg-amber-500'
                                  : act.type === 'fridge'
                                  ? 'bg-indigo-500'
                                  : 'bg-rose-500'
                              }`}
                            />
                            <div>
                              <span className="font-semibold text-slate-800 block text-xs">
                                {act.action}: <span className="font-normal text-slate-600">{act.description}</span>
                              </span>
                            </div>
                          </div>
                          <span className="text-[10.5px] text-slate-400 font-mono whitespace-nowrap pl-3">
                            {act.timestamp}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        Chưa ghi nhận hoạt động tương tác mới nào gần đây.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                Nhấn Esc hoặc dấu X góc phải để thoát khung xem hồ sơ
              </span>
              <button
                onClick={() => setViewingUser(null)}
                className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
              >
                Đóng Hồ Sơ
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* =========================================================================
          POPUP MODAL 1: CHỈNH SỬA THÔNG TIN THÀNH VIÊN (EDIT USER PROFILE POPUP)
      ========================================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Header popup */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                    Chỉnh Sửa Hồ Sơ Thành Viên
                  </h3>
                  <span className="text-[11px] text-slate-400">Mã UID: #{editingUser.id}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body form */}
            <form onSubmit={handleSaveUserEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Email Tài Khoản
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Khẩu vị & Chế độ ăn (SRS Module 2)
                </label>
                <input
                  type="text"
                  placeholder="VD: Eat Clean / Giảm cân, Ăn chay, Healthy..."
                  value={editDiet}
                  onChange={(e) => setEditDiet(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Gói Hội Viên
                  </label>
                  <select
                    value={editTier}
                    onChange={(e) => setEditTier(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="Free">Bản Free</option>
                    <option value="VIP Premium">VIP Premium ⭐</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Cấp Bậc Đầu Bếp
                  </label>
                  <select
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-amber-800"
                  >
                    <option value="Thành Viên Mới">Thành Viên Mới</option>
                    <option value="Đầu Bếp Nghiệp Dư">Đầu Bếp Nghiệp Dư</option>
                    <option value="Bếp Trưởng Bạc">Bếp Trưởng Bạc</option>
                    <option value="Master Chef">Master Chef ⭐</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Trạng Thái
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
                    <option value="banned">Cấm vĩnh viễn</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-xl shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          POPUP MODAL 2: CONFIRM HÀNH ĐỘNG BẢO MẬT (XÁC NHẬN KHÓA / CHẶN / CẤM / XÓA)
      ========================================================================== */}
      {confirmModal.isOpen && confirmModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 text-slate-800">
            {/* Header theo loại hành động */}
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmModal.type === 'delete' || confirmModal.type === 'ban'
                    ? 'bg-rose-100 text-rose-600'
                    : confirmModal.type === 'suspend'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {confirmModal.type === 'delete' && <Trash2 className="w-5 h-5" />}
                {confirmModal.type === 'ban' && <Ban className="w-5 h-5" />}
                {confirmModal.type === 'suspend' && <Lock className="w-5 h-5" />}
                {confirmModal.type === 'activate' && <Unlock className="w-5 h-5" />}
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                  {confirmModal.type === 'delete' && 'Xác Nhận Xóa Vĩnh Viễn Tài Khoản'}
                  {confirmModal.type === 'ban' && 'Xác Nhận Cấm / Chặn Tài Khoản Vĩnh Viễn'}
                  {confirmModal.type === 'suspend' && 'Xác Nhận Tạm Khóa Tài Khoản'}
                  {confirmModal.type === 'activate' && 'Xác Nhận Kích Hoạt Lại Tài Khoản'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Bạn có chắc chắn muốn thực hiện hành động này đối với tài khoản{' '}
                  <strong className="text-slate-800 font-bold">{confirmModal.user.fullName}</strong> (
                  <span className="font-mono text-[11px]">{confirmModal.user.email}</span>)?
                </p>
              </div>
            </div>

            {/* Cảnh báo hậu quả */}
            <div
              className={`p-3.5 rounded-xl text-xs space-y-1 ${
                confirmModal.type === 'delete'
                  ? 'bg-rose-50 border border-rose-200/80 text-rose-800'
                  : confirmModal.type === 'ban'
                  ? 'bg-rose-50 border border-rose-200/80 text-rose-800'
                  : confirmModal.type === 'suspend'
                  ? 'bg-amber-50 border border-amber-200/80 text-amber-800'
                  : 'bg-emerald-50 border border-emerald-200/80 text-emerald-800'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {confirmModal.type === 'delete' && 'Hành động này không thể hoàn tác!'}
                  {confirmModal.type === 'ban' && 'Người dùng sẽ bị chặn truy cập app vĩnh viễn!'}
                  {confirmModal.type === 'suspend' && 'Người dùng sẽ tạm thời không thể đăng nhập.'}
                  {confirmModal.type === 'activate' && 'Tài khoản sẽ được khôi phục quyền truy cập đầy đủ.'}
                </span>
              </div>
              <p className="text-[11px] pl-5 opacity-90">
                {confirmModal.type === 'delete' &&
                  'Mọi dữ liệu cá nhân, món ăn đã lưu và bài viết của người này sẽ bị xóa khỏi cơ sở dữ liệu.'}
                {confirmModal.type === 'ban' &&
                  'Thiết bị di động của người dùng sẽ bị từ chối xác thực cho đến khi có can thiệp thủ công từ Super Admin.'}
                {confirmModal.type === 'suspend' &&
                  'Bạn có thể mở khóa tài khoản này bất cứ lúc nào từ trang quản trị.'}
                {confirmModal.type === 'activate' &&
                  'Người dùng có thể đăng nhập lại ngay lập tức trên ứng dụng điện thoại.'}
              </p>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: 'suspend', user: null, reason: '' })}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmAction}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-all active:scale-95 ${
                  confirmModal.type === 'delete' || confirmModal.type === 'ban'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                    : confirmModal.type === 'suspend'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                }`}
              >
                {confirmModal.type === 'delete' && 'Xác Nhận Xóa'}
                {confirmModal.type === 'ban' && 'Xác Nhận Cấm'}
                {confirmModal.type === 'suspend' && 'Xác Nhận Khóa'}
                {confirmModal.type === 'activate' && 'Xác Nhận Mở Khóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM NHÂN SỰ PHÂN QUYỀN MỚI (RBAC) ================= */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Thêm Nhân Sự Quản Trị Hệ Thống</span>
              </h3>
              <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Đã cấp quyền quản trị ${staffRole} cho email ${staffEmail}!`);
                setShowStaffModal(false);
                setStaffName('');
                setStaffEmail('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Họ Và Tên Nhân Sự
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn A"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Email Công Vụ
                </label>
                <input
                  type="email"
                  required
                  placeholder="nhansu@smartcook.vn"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Vai Trò Phân Quyền (RBAC)
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="Super Admin">Super Admin (Toàn quyền)</option>
                  <option value="Content Editor">Content Editor (Biên tập nội dung)</option>
                  <option value="Community Moderator">Community Moderator (Kiểm duyệt)</option>
                  <option value="Support Staff">Support Staff (Hỗ trợ người dùng)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-lg shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Xác Nhận Cấp Quyền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
