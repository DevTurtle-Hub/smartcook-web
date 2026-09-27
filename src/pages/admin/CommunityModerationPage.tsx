import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Check,
  X,
  Eye,
  Trash2,
  Pin,
  EyeOff,
  AlertTriangle,
  Heart,
  MessageCircle,
  Hash,
  ShieldCheck,
  CheckCircle,
  Flag,
  Sparkles,
  ShieldAlert,
  AlertOctagon,
  Ban,
  BellRing,
  Send,
  UserX,
  UserCheck,
  Calendar,
  Layers,
  MessageSquareWarning,
  ExternalLink,
  Shield,
  Info,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { CommunityPostAdmin, ModerationReport } from '../../types/admin';
import { communityApi } from '../../api/community.api';

export const CommunityModerationPage: React.FC = () => {
  const {
    communityPosts,
    togglePostStatus,
    deleteCommunityPost,
    setCommunityPosts,
    reports,
    resolveReport,
    users,
    toggleUserStatus,
    addNotification,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'reports' | 'hashtags'>('posts');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'flagged' | 'spam' | 'pinned' | 'hidden'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'reports' | 'likes' | 'comments'>('newest');

  // Modal Xem Chi Tiết Bài Viết (Khung to rộng 2 cột, xem người đăng, nội dung, báo cáo, kèm công cụ can thiệp)
  const [viewingPost, setViewingPost] = useState<CommunityPostAdmin | null>(null);

  // Modal Gửi Thông Báo / Cảnh Cáo Đến User
  const [notifyModal, setNotifyModal] = useState<{
    isOpen: boolean;
    recipientName: string;
    recipientId?: string;
    postTitle?: string;
    type: 'warning' | 'notice' | 'penalty';
  }>({
    isOpen: false,
    recipientName: '',
    recipientId: '',
    postTitle: '',
    type: 'warning',
  });
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyContent, setNotifyContent] = useState('');

  // Modal Xử lý Báo Cáo Khiếu Nại
  const [handlingReport, setHandlingReport] = useState<ModerationReport | null>(null);
  const [moderationNote, setModerationNote] = useState('');

  // Popup Confirm An Toàn Cho Hành Động: Xóa Bài, Đánh Dấu Spam, Chặn User
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    actionType: 'delete_post' | 'mark_spam' | 'ban_user' | 'hide_post';
    targetId: string;
    targetName: string;
    title: string;
    message: string;
    dangerLevel: 'high' | 'medium';
  }>({
    isOpen: false,
    actionType: 'delete_post',
    targetId: '',
    targetName: '',
    title: '',
    message: '',
    dangerLevel: 'medium',
  });

  // Thông báo toast phản hồi thao tác
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quản lý hashtag
  const [hashtags, setHashtags] = useState([
    { tag: 'KhoeMonNgon', count: 1840, trending: true, category: 'Món Ngon' },
    { tag: 'HoiDapBep', count: 950, trending: true, category: 'Hỏi Đáp' },
    { tag: 'HealthyEatClean', count: 1420, trending: true, category: 'Ăn Kiêng' },
    { tag: 'SmartFridge', count: 1120, trending: true, category: 'Tủ Lạnh' },
    { tag: 'BiQuyetNoiTro', count: 680, trending: false, category: 'Mẹo Bếp' },
    { tag: 'MonTet2026', count: 540, trending: false, category: 'Lễ Hội' },
  ]);
  const [newTagInput, setNewTagInput] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('Món Ngon');

  // Load real posts from backend
  useEffect(() => {
    communityApi.getPosts({ limit: 50 })
      .then((data) => {
        if (data && data.posts && data.posts.length > 0) {
          const mapped: CommunityPostAdmin[] = data.posts.map((p) => ({
            id: p._id,
            author: {
              id: p.author?._id,
              name: p.author?.fullName || `${p.author?.firstName || ''} ${p.author?.lastName || ''}`.trim() || 'Người dùng SmartCook',
              avatar: p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              badge: p.author?.role === 'admin' ? 'Quản Trị Viên' : 'Bếp Trưởng',
            },
            content: p.caption,
            image: p.images?.[0]?.url || '',
            tags: p.tags || [],
            likes: p.totalReactions || 0,
            comments: p.commentsCount || 0,
            createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong',
            status: p.isPinned ? 'pinned' : ((p as any).status || 'published'),
            reportCount: (p as any).reportCount || 0,
            reportsList: [],
          }));
          setCommunityPosts(mapped);
        }
      })
      .catch((err) => console.warn('Lỗi lấy bài viết quản trị từ backend:', err));
  }, []);

  // Thống kê phân loại bài viết
  const counts = useMemo(() => {
    return {
      all: communityPosts.length,
      published: communityPosts.filter((p) => p.status === 'published').length,
      flagged: communityPosts.filter((p) => p.status === 'flagged').length,
      spam: communityPosts.filter((p) => p.status === 'spam').length,
      pinned: communityPosts.filter((p) => p.status === 'pinned').length,
      hidden: communityPosts.filter((p) => p.status === 'hidden').length,
      pendingReports: reports.filter((r) => r.status === 'pending').length,
    };
  }, [communityPosts, reports]);

  // Lọc và sắp xếp bài đăng
  const filteredPosts = useMemo(() => {
    return communityPosts
      .filter((post) => {
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          post.content.toLowerCase().includes(q) ||
          post.author.name.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q));

        const matchStatus = statusFilter === 'all' || post.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'reports') return (b.reportCount || 0) - (a.reportCount || 0);
        if (sortBy === 'likes') return b.likes - a.likes;
        if (sortBy === 'comments') return b.comments - a.comments;
        return 0; // newest
      });
  }, [communityPosts, searchQuery, statusFilter, sortBy]);

  // Thực hiện hành động xác nhận
  const handleExecuteConfirm = async () => {
    const { actionType, targetId, targetName } = confirmModal;

    if (actionType === 'delete_post') {
      try {
        await communityApi.deletePost(targetId);
      } catch (err) {
        console.warn('Lỗi xoá bài viết qua API:', err);
      }
      deleteCommunityPost(targetId);
      if (viewingPost && viewingPost.id === targetId) {
        setViewingPost(null);
      }
      showToast(`Đã xóa vĩnh viễn bài đăng của "${targetName}".`);
    } else if (actionType === 'mark_spam') {
      try {
        await communityApi.updateStatus(targetId, 'flagged');
      } catch (err) {
        console.warn('Lỗi gắn nhãn spam bài viết qua API:', err);
      }
      togglePostStatus(targetId, 'spam');
      if (viewingPost && viewingPost.id === targetId) {
        setViewingPost({ ...viewingPost, status: 'spam' });
      }
      showToast(`Đã gắn nhãn SPAM và chặn bài đăng của "${targetName}".`);
    } else if (actionType === 'hide_post') {
      try {
        await communityApi.updateStatus(targetId, 'hidden');
      } catch (err) {
        console.warn('Lỗi ẩn bài viết qua API:', err);
      }
      togglePostStatus(targetId, 'hidden');
      if (viewingPost && viewingPost.id === targetId) {
        setViewingPost({ ...viewingPost, status: 'hidden' });
      }
      showToast(`Đã ẩn bài đăng của "${targetName}" khỏi Bảng Tin.`);
    } else if (actionType === 'ban_user') {
      if (targetId) {
        toggleUserStatus(targetId, 'banned');
      }
      showToast(`Đã khóa / chặn tài khoản "${targetName}".`);
    }

    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  // Ghim bài viết
  const handleTogglePinPost = async (postId: string) => {
    try {
      const res = await communityApi.togglePin(postId);
      const newStatus = res?.isPinned ? 'pinned' : 'published';
      togglePostStatus(postId, newStatus);
      showToast(res?.isPinned ? 'Đã ghim bài viết lên đầu Bảng Tin.' : 'Đã bỏ ghim bài viết.');
    } catch (err) {
      console.warn('Lỗi ghim bài viết:', err);
      showToast('Thao tác ghim thất bại.');
    }
  };

  // Mở popup gửi cảnh cáo
  const openNotifyModal = (authorName: string, authorId?: string, postContent?: string) => {
    setNotifyModal({
      isOpen: true,
      recipientName: authorName,
      recipientId: authorId,
      postTitle: postContent ? postContent.substring(0, 50) + '...' : '',
      type: 'warning',
    });
    setNotifyTitle('Cảnh báo vi phạm tiêu chuẩn cộng đồng SmartCook');
    setNotifyContent(
      `Chào ${authorName},\nBài viết của bạn đã bị người dùng báo cáo vi phạm chính sách cộng đồng (Spam / Nội dung không phù hợp). Vui lòng điều chỉnh hoặc bài viết sẽ bị xóa vĩnh viễn.`
    );
  };

  // Gửi thông báo đến user
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyTitle.trim() || !notifyContent.trim()) return;

    addNotification({
      title: notifyTitle,
      body: notifyContent,
      scheduledTime: 'Gửi tức thời',
      targetAudience: 'all',
      category: 'promo',
      status: 'sent',
    });

    setNotifyModal({ ...notifyModal, isOpen: false });
    showToast(`Đã gửi thông báo cảnh cáo thành công đến "${notifyModal.recipientName}".`);
  };

  const handleAddHashtag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const cleanTag = newTagInput.replace('#', '').trim();
    if (hashtags.some((h) => h.tag.toLowerCase() === cleanTag.toLowerCase())) return;
    setHashtags([...hashtags, { tag: cleanTag, count: 1, trending: true, category: newTagCategory }]);
    setNewTagInput('');
  };

  return (
    <div className="space-y-4">
      {/* Toast phản hồi nhanh */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-70 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= THANH ĐIỀU HƯỚNG TAB CHÍNH ================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Quản Lý Bài Đăng Người Dùng</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'posts' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {communityPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Danh Sách Báo Cáo Vi Phạm</span>
            {counts.pendingReports > 0 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-extrabold shadow-2xs">
                {counts.pendingReports} mới
              </span>
            ) : (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'reports' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {reports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('hashtags')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'hashtags'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Hashtags & Xu Hướng</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'hashtags' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {hashtags.length}
            </span>
          </button>
        </div>

        {/* Tóm tắt tình trạng an toàn nhanh (Indigo & Amber) */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {counts.spam > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-bold">
              <AlertOctagon className="w-3 h-3 text-rose-600" />
              {counts.spam} Bài Spam
            </span>
          )}
          {counts.flagged > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-bold">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              {counts.flagged} Bị Báo Cáo
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Kiểm soát nội dung cộng đồng: <strong>Active</strong>
          </span>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BẢNG QUẢN LÝ BÀI ĐĂNG NGƯỜI DÙNG & BÁO CÁO & SPAM (TABLE CHỮ NHẬT DÀI)
      ========================================================================== */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Thanh công cụ tìm kiếm và lọc phân loại rõ ràng: Đã Đăng, Bị Báo Cáo, Spam */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
              {/* Ô tìm kiếm */}
              <div className="relative w-full lg:w-80">
                <Search className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm nội dung, người đăng, hashtag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50/80 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Bộ lọc phân loại: Đã đăng, Bị báo cáo, Spam, Ghim, Ẩn */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
                <span className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider shrink-0 mr-1">
                  Trạng thái bài:
                </span>
                {[
                  { id: 'all', label: 'Tất Cả', count: counts.all },
                  { id: 'published', label: 'Đã Đăng (Bình Thường)', count: counts.published },
                  { id: 'flagged', label: 'Bị Báo Cáo Vi Phạm', count: counts.flagged, alert: counts.flagged > 0 },
                  { id: 'spam', label: 'Bài Spam Rác', count: counts.spam, danger: counts.spam > 0 },
                  { id: 'pinned', label: 'Đang Ghim', count: counts.pinned },
                  { id: 'hidden', label: 'Đã Ẩn', count: counts.hidden },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      statusFilter === st.id
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-xs shadow-indigo-500/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        statusFilter === st.id
                          ? 'bg-white/20 text-white'
                          : st.danger
                          ? 'bg-rose-100 text-rose-700'
                          : st.alert
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                <span className="text-[10.5px] text-slate-400 font-bold uppercase shrink-0">Xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="reports">Bị báo cáo nhiều nhất</option>
                  <option value="likes">Nhiều lượt thích</option>
                  <option value="comments">Nhiều bình luận</option>
                </select>
              </div>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU TABLE CHỮ NHẬT DÀI CHUYÊN NGHIỆP */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Người Đăng Bài</th>
                    <th className="py-3.5 px-4">Nội Dung Bài Viết & Ảnh</th>
                    <th className="py-3.5 px-4">Tình Trạng Báo Cáo</th>
                    <th className="py-3.5 px-4">Tương Tác</th>
                    <th className="py-3.5 px-4">Thời Gian Đăng</th>
                    <th className="py-3.5 px-4">Trạng Thái</th>
                    <th className="py-3.5 px-5 text-right">Thao Tác Quản Trị</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Không tìm thấy bài viết nào phù hợp với điều kiện lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-indigo-50/30 transition-colors group">
                        {/* Cột 1: Người đăng */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:border-indigo-300 transition-colors"
                            />
                            <div>
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block leading-tight">
                                {post.author.name}
                              </span>
                              <span className="text-[10.5px] text-amber-700 font-bold block mt-0.5">
                                {post.author.badge}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Nội dung & Thumbnail */}
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="flex items-start gap-3">
                            {post.image && (
                              <img
                                src={post.image}
                                alt="Post visual"
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 shadow-2xs group-hover:border-indigo-300 transition-colors"
                              />
                            )}
                            <div className="space-y-1 overflow-hidden">
                              <p className="font-medium text-slate-800 line-clamp-2 leading-relaxed">
                                {post.content}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {post.tags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/60"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Cột 3: Tình trạng báo cáo vi phạm */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {post.reportCount && post.reportCount > 0 ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                {post.reportCount} lượt báo cáo
                              </span>
                              {post.reportsList && post.reportsList.length > 0 && (
                                <span className="text-[10px] text-slate-500 block truncate max-w-[170px]">
                                  Lý do: <strong>{post.reportsList[0].reason}</strong>
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10.5px] text-emerald-700 font-medium inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Không có khiếu nại
                            </span>
                          )}
                        </td>

                        {/* Cột 4: Tương tác */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-rose-500 font-bold font-['Outfit']">
                              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                              {post.likes}
                            </span>
                            <span className="flex items-center gap-1 text-indigo-600 font-bold font-['Outfit']">
                              <MessageCircle className="w-3.5 h-3.5" />
                              {post.comments}
                            </span>
                          </div>
                        </td>

                        {/* Cột 5: Thời gian đăng */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px] font-mono">
                          {post.createdAt}
                        </td>

                        {/* Cột 6: Trạng thái hiển thị */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {post.status === 'pinned' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                              <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                              Đang Ghim
                            </span>
                          )}
                          {post.status === 'spam' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertOctagon className="w-3 h-3 text-rose-600" />
                              Khóa Spam
                            </span>
                          )}
                          {post.status === 'flagged' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Cần Kiểm Tra
                            </span>
                          )}
                          {post.status === 'hidden' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-200 text-slate-700">
                              <EyeOff className="w-3 h-3" />
                              Đã Ẩn
                            </span>
                          )}
                          {post.status === 'published' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70">
                              Công Khai
                            </span>
                          )}
                        </td>

                        {/* Cột 7: Thao tác quản trị */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Nút Xem Chi Tiết */}
                            <button
                              onClick={() => setViewingPost(post)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-2xs"
                              title="Xem chi tiết nội dung, người đăng và báo cáo"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem Chi Tiết</span>
                            </button>

                            {/* Nút Gửi Thông Báo / Cảnh Cáo */}
                            <button
                              onClick={() => openNotifyModal(post.author.name, post.author.id, post.content)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Gửi thông báo / cảnh cáo đến người đăng này"
                            >
                              <BellRing className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút Ghim / Bỏ Ghim Bài Viết */}
                            <button
                              onClick={() => handleTogglePinPost(post.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                post.status === 'pinned'
                                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                  : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              }`}
                              title={post.status === 'pinned' ? 'Bỏ ghim bài viết' : 'Ghim bài viết lên đầu'}
                            >
                              <Pin className={`w-3.5 h-3.5 ${post.status === 'pinned' ? 'fill-amber-600' : ''}`} />
                            </button>

                            {/* Nút Khóa SPAM / Bỏ SPAM */}
                            {post.status !== 'spam' ? (
                              <button
                                onClick={() =>
                                  setConfirmModal({
                                    isOpen: true,
                                    actionType: 'mark_spam',
                                    targetId: post.id,
                                    targetName: post.author.name,
                                    title: 'Khóa bài viết và gắn nhãn SPAM?',
                                    message: `Bài viết của "${post.author.name}" sẽ bị gắn nhãn SPAM và chặn xuất hiện trên Bảng Tin công khai.`,
                                    dangerLevel: 'high',
                                  })
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Đánh dấu Spam & Chặn bài"
                              >
                                <AlertOctagon className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={async () => {
                                  try {
                                    await communityApi.updateStatus(post.id, 'published');
                                  } catch (err) {
                                    console.warn('Lỗi gỡ nhãn spam:', err);
                                  }
                                  togglePostStatus(post.id, 'published');
                                  showToast(`Đã gỡ nhãn Spam cho bài viết của "${post.author.name}".`);
                                }}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Gỡ nhãn Spam (Cho phép hiển thị lại)"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Nút Chặn User */}
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  actionType: 'ban_user',
                                  targetId: post.author.id || '',
                                  targetName: post.author.name,
                                  title: `Chặn tài khoản "${post.author.name}"?`,
                                  message: `Tài khoản này sẽ bị khóa quyền đăng bài và bình luận trên toàn hệ thống cộng đồng SmartCook.`,
                                  dangerLevel: 'high',
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                              title="Chặn tài khoản người đăng này"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút Xóa Bài Viết */}
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  actionType: 'delete_post',
                                  targetId: post.id,
                                  targetName: post.author.name,
                                  title: 'Xóa bài viết này vĩnh viễn?',
                                  message: `Hành động này sẽ xóa hoàn toàn nội dung, ảnh đính kèm và dữ liệu tương tác của bài viết. Không thể hoàn tác.`,
                                  dangerLevel: 'high',
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Xóa bài viết vĩnh viễn"
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
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 px-5 gap-2">
              <span>
                Đang quản lý <strong className="text-slate-900 font-bold">{filteredPosts.length}</strong> / <strong>{communityPosts.length}</strong> bài đăng người dùng
              </span>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Hệ thống phân tích báo cáo tự động SmartCook</span>
                <span>•</span>
                <span>Bảo vệ không gian ẩm thực an toàn</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DANH SÁCH BÁO CÁO KHIẾU NẠI (TABLE CHỮ NHẬT DÀI)
      ========================================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Danh Sách Người Dùng Báo Cáo Vi Phạm Từ Ứng Dụng Mobile</span>
              </h3>
              <span className="text-xs text-slate-400">Xử lý minh bạch và công bằng</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Người Gửi Báo Cáo</th>
                    <th className="py-3 px-4">Lý Do Vi Phạm</th>
                    <th className="py-3 px-4">Mục Bị Báo Cáo</th>
                    <th className="py-3 px-4">Thời Gian</th>
                    <th className="py-3 px-4">Trạng Thái Xử Lý</th>
                    <th className="py-3 px-5 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Hiện tại không có báo cáo khiếu nại nào cần xử lý.
                      </td>
                    </tr>
                  ) : (
                    reports.map((rep) => (
                      <tr key={rep.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                          {rep.reporterName}
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-100 mr-2">
                            {rep.reason}
                          </span>
                          <span className="text-slate-600 text-xs">{rep.targetPreview}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                          {rep.targetType}: #{rep.targetId}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {rep.reportedAt}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {rep.status === 'pending' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Chờ Xử Lý
                            </span>
                          ) : rep.status === 'resolved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Đã Xử Lý (Xác nhận vi phạm)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              Đã Bác Bỏ
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          {rep.status === 'pending' ? (
                            <button
                              onClick={() => {
                                setHandlingReport(rep);
                                setModerationNote('');
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
                            >
                              Xử Lý Khiếu Nại
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Hoàn tất</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: HASHTAG & CHỦ ĐỀ XU HƯỚNG
      ========================================================================== */}
      {activeTab === 'hashtags' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-indigo-600" />
                  <span>Quản Lý Hashtag Định Hướng Bảng Tin</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Các chủ đề này sẽ được gắn nhãn ưu tiên trên thanh điều hướng bảng tin ứng dụng Mobile.
                </p>
              </div>

              {/* Form thêm hashtag mới */}
              <form onSubmit={handleAddHashtag} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="#TenHashtag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
                <select
                  value={newTagCategory}
                  onChange={(e) => setNewTagCategory(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                >
                  <option value="Món Ngon">Món Ngon</option>
                  <option value="Ăn Kiêng">Ăn Kiêng</option>
                  <option value="Hỏi Đáp">Hỏi Đáp</option>
                  <option value="Tủ Lạnh">Tủ Lạnh</option>
                  <option value="Mẹo Bếp">Mẹo Bếp</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
                >
                  + Thêm Tag
                </button>
              </form>
            </div>

            {/* Danh sách thẻ hashtag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hashtags.map((h, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition-all flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-indigo-900 font-mono">#{h.tag}</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {h.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      <strong className="text-slate-700">{h.count.toLocaleString()}</strong> bài viết tham gia
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {h.trending && (
                      <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                        Trending
                      </span>
                    )}
                    <button
                      onClick={() => setHashtags(hashtags.filter((_, i) => i !== idx))}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Gỡ bỏ tag"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: XEM CHI TIẾT BÀI ĐĂNG (KHUNG TO RỘNG 2 CỘT: NGƯỜI ĐĂNG, NỘI DUNG, BÁO CÁO, CÔNG CỤ CAN THIỆP)
      ========================================================================== */}
      {viewingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[92vh] rounded-xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-slate-800">
            {/* Header modal */}
            <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 shrink-0">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-extrabold text-indigo-900 uppercase font-['Outfit'] tracking-wider flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Chi Tiết Bài Đăng #{viewingPost.id}</span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  Thời gian đăng: <strong className="text-slate-700">{viewingPost.createdAt}</strong>
                </span>
                {viewingPost.status === 'spam' && (
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-extrabold text-[10.5px]">
                    BÀI VIẾT SPAM
                  </span>
                )}
              </div>
              <button
                onClick={() => setViewingPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Khung 2 Cột Rộng */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* CỘT TRÁI (6/12): KHUNG CARD BÀI ĐĂNG VIEW TRỰC TIẾP (GIỐNG APP MOBILE) */}
              <div className="lg:col-span-6 border-r border-slate-200/80 p-5 overflow-y-auto bg-slate-50/60 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Card Bài Đăng Hiển Thị Trực Tiếp (Mobile Feed Preview)</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    Live Feed Card
                  </span>
                </div>

                {/* CARD BÀI ĐĂNG HOÀN CHỈNH VIEW TRỰC TIẾP */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden transition-all">
                  {/* Card Header: Tác giả, avatar, badge & menu 3 chấm */}
                  <div className="p-4 flex items-center justify-between border-b border-slate-100/80 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={viewingPost.author.avatar}
                          alt={viewingPost.author.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-xs"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-[8px] text-white font-bold">
                          ✓
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                            {viewingPost.author.name}
                          </h4>
                          {viewingPost.author.badge && (
                            <span className="text-[9.5px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">
                              {viewingPost.author.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10.5px] text-slate-400 block font-medium mt-0.5">
                          {viewingPost.createdAt} • Công thức chia sẻ
                        </span>
                      </div>
                    </div>

                    {/* Huy hiệu trạng thái trên Card */}
                    <div>
                      {viewingPost.status === 'pinned' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                          <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                          Đang Ghim
                        </span>
                      )}
                      {viewingPost.status === 'spam' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          Đã Khóa Spam
                        </span>
                      )}
                      {viewingPost.status === 'flagged' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold flex items-center gap-1 shadow-2xs">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          {viewingPost.reportCount} Báo Cáo
                        </span>
                      )}
                      {viewingPost.status === 'published' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          Công khai
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content Text */}
                  <div className="px-4 py-3 text-slate-800 text-xs leading-relaxed space-y-2.5">
                    <p className="whitespace-pre-line font-medium text-slate-800 text-[13px] leading-relaxed">
                      {viewingPost.content}
                    </p>

                    {/* Hashtags */}
                    {viewingPost.tags && viewingPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {viewingPost.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Visual / Image (Tỷ lệ đẹp chuẩn mobile feed) */}
                  {viewingPost.image && (
                    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={viewingPost.image}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                      {viewingPost.status === 'spam' && (
                        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-1.5">
                          <AlertOctagon className="w-8 h-8 text-rose-400 animate-bounce" />
                          <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                            NỘI DUNG ĐÃ BỊ CÔ LẬP (SPAM RÁC)
                          </span>
                          <span className="text-[11px] text-slate-300 max-w-xs">
                            Bài viết này đã bị chặn hiển thị trên toàn ứng dụng người dùng.
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Actions & Stats (Like, Comment, Share) */}
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/40">
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        <span className="font-['Outfit'] text-[13px]">{viewingPost.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-['Outfit'] text-[13px]">{viewingPost.comments}</span>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      Post UID: #{viewingPost.id}
                    </span>
                  </div>
                </div>

                {/* Thống kê nhanh 4 thông số */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                  <div className="p-2.5 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                    <span className="text-[10px] text-indigo-500 font-extrabold uppercase block">Lượt Thích</span>
                    <span className="text-sm font-extrabold text-indigo-900 font-['Outfit'] block mt-0.5">
                      {viewingPost.likes}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-100 shadow-2xs">
                    <span className="text-[10px] text-amber-600 font-extrabold uppercase block">Bình Luận</span>
                    <span className="text-sm font-extrabold text-amber-900 font-['Outfit'] block mt-0.5">
                      {viewingPost.comments}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-rose-100 shadow-2xs">
                    <span className="text-[10px] text-rose-600 font-extrabold uppercase block">Báo Cáo</span>
                    <span className="text-sm font-extrabold text-rose-700 font-['Outfit'] block mt-0.5">
                      {viewingPost.reportCount || 0}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Trạng Thái</span>
                    <span className="text-xs font-bold text-slate-800 uppercase block mt-1 truncate">
                      {viewingPost.status}
                    </span>
                  </div>
                </div>

                {/* Ghi chú quản trị */}
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-[11px] text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Card trên mô phỏng chính xác giao diện hiển thị cho người dùng ứng dụng SmartCook. Bạn có thể can thiệp ngay ở cột bên phải.
                  </p>
                </div>
              </div>

              {/* CỘT PHẢI (6/12): Người đăng, Danh sách báo cáo vi phạm & CÔNG CỤ CAN THIỆP */}
              <div className="lg:col-span-6 p-6 overflow-y-auto space-y-5 bg-white text-xs">
                {/* 1. Ai đã đăng (Thông tin người đăng bài) */}
                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={viewingPost.author.avatar}
                      alt={viewingPost.author.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{viewingPost.author.name}</h4>
                        <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded font-bold">
                          Người Đăng Bài
                        </span>
                      </div>
                      <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
                        {viewingPost.author.badge} • Tác giả bài viết
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => openNotifyModal(viewingPost.author.name, viewingPost.author.id, viewingPost.content)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors border border-indigo-200/60 inline-flex items-center gap-1.5 shadow-2xs"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>Gửi Cảnh Cáo</span>
                    </button>
                  </div>
                </div>

                {/* 2. Bài viết này bị báo cáo gì? (Danh sách chi tiết khiếu nại) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-['Outfit']">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Bài Viết Này Bị Báo Cáo Gì?</span>
                    </label>
                    <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      {viewingPost.reportCount || 0} lượt phản ánh vi phạm
                    </span>
                  </div>

                  {viewingPost.reportsList && viewingPost.reportsList.length > 0 ? (
                    <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                      {viewingPost.reportsList.map((rep, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md text-[11px]">
                              {rep.reason}
                            </span>
                            <span className="text-[10.5px] text-slate-400 font-mono">{rep.date}</span>
                          </div>
                          <p className="text-slate-800 text-xs font-medium leading-relaxed">
                            {rep.details || 'Người dùng gửi báo cáo không để lại ghi chú chi tiết.'}
                          </p>
                          <span className="text-[10.5px] text-slate-500 block pt-0.5">
                            Người gửi báo cáo: <strong className="text-slate-700">{rep.reporter}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center text-slate-500 text-xs">
                      Không có báo cáo vi phạm nào đối với bài viết này. Nội dung đang hiển thị bình thường.
                    </div>
                  )}
                </div>

                {/* 3. CÔNG CỤ CAN THIỆP & QUYỀN HÀNH ĐỘNG (GỬI THÔNG BÁO, XÓA BÀI, CHẶN USER, GẮN SPAM) */}
                <div className="p-4.5 rounded-xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-slate-50 space-y-3.5">
                  <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider block font-['Outfit']">
                    Công Cụ Quản Trị & Xử Lý Vi Phạm
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Gửi thông báo / cảnh cáo */}
                    <button
                      type="button"
                      onClick={() => openNotifyModal(viewingPost.author.name, viewingPost.author.id, viewingPost.content)}
                      className="p-2.5 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                    >
                      <BellRing className="w-4 h-4 text-indigo-600" />
                      <span>Gửi Cảnh Cáo</span>
                    </button>

                    {/* Khóa SPAM */}
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          actionType: 'mark_spam',
                          targetId: viewingPost.id,
                          targetName: viewingPost.author.name,
                          title: 'Gắn nhãn SPAM cho bài viết?',
                          message: `Bài viết này sẽ bị cô lập và ẩn khỏi Bảng Tin công khai ngay lập tức.`,
                          dangerLevel: 'high',
                        })
                      }
                      className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
                        viewingPost.status === 'spam'
                          ? 'border-rose-300 bg-rose-100 text-rose-800'
                          : 'border-slate-200 bg-white hover:bg-rose-50 text-rose-700'
                      }`}
                    >
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      <span>{viewingPost.status === 'spam' ? 'Đã Khóa Spam' : 'Khóa Spam'}</span>
                    </button>

                    {/* Chặn User */}
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          actionType: 'ban_user',
                          targetId: viewingPost.author.id || '',
                          targetName: viewingPost.author.name,
                          title: `Chặn tài khoản "${viewingPost.author.name}"?`,
                          message: `Tài khoản sẽ bị cấm đăng bài và bình luận trên hệ thống cộng đồng.`,
                          dangerLevel: 'high',
                        })
                      }
                      className="p-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                    >
                      <UserX className="w-4 h-4 text-amber-700" />
                      <span>Chặn User Này</span>
                    </button>

                    {/* Xóa Bài Viết */}
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmModal({
                          isOpen: true,
                          actionType: 'delete_post',
                          targetId: viewingPost.id,
                          targetName: viewingPost.author.name,
                          title: 'Xóa vĩnh viễn bài đăng này?',
                          message: `Bài viết sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu và không thể phục hồi.`,
                          dangerLevel: 'high',
                        })
                      }
                      className="p-2.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs group"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600 group-hover:text-white" />
                      <span>Xóa Bài Viết</span>
                    </button>
                  </div>

                  {/* Quyết định trạng thái hiển thị */}
                  <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">Trạng thái bài:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          togglePostStatus(viewingPost.id, 'published');
                          setViewingPost({ ...viewingPost, status: 'published' });
                          showToast('Đã chuyển bài viết về trạng thái Công Khai.');
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          viewingPost.status === 'published'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Công Khai
                      </button>
                      <button
                        onClick={() => {
                          const nextStatus = viewingPost.status === 'pinned' ? 'published' : 'pinned';
                          togglePostStatus(viewingPost.id, nextStatus);
                          setViewingPost({ ...viewingPost, status: nextStatus });
                          showToast(nextStatus === 'pinned' ? 'Đã ghim bài lên đầu bảng tin.' : 'Đã hạ ghim.');
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          viewingPost.status === 'pinned'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        Ghim Feed
                      </button>
                      <button
                        onClick={() => {
                          const nextStatus = viewingPost.status === 'hidden' ? 'published' : 'hidden';
                          togglePostStatus(viewingPost.id, nextStatus);
                          setViewingPost({ ...viewingPost, status: nextStatus });
                          showToast(nextStatus === 'hidden' ? 'Đã ẩn bài viết.' : 'Đã hiển thị lại bài viết.');
                        }}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                          viewingPost.status === 'hidden'
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {viewingPost.status === 'hidden' ? 'Bỏ Ẩn' : 'Ẩn Bài'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer modal */}
            <div className="px-6 py-3 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                Nhấn Esc hoặc dấu X góc phải để đóng cửa sổ chi tiết bài viết
              </span>
              <button
                onClick={() => setViewingPost(null)}
                className="px-5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: GỬI THÔNG BÁO / CẢNH CÁO ĐẾN USER ================= */}
      {notifyModal.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-xl border border-slate-200 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-2">
                <BellRing className="w-4 h-4 text-indigo-600" />
                <span>Gửi Thông Báo / Cảnh Cáo Đến "{notifyModal.recipientName}"</span>
              </h3>
              <button onClick={() => setNotifyModal({ ...notifyModal, isOpen: false })} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Tiêu đề thông báo:
                </label>
                <input
                  type="text"
                  value={notifyTitle}
                  onChange={(e) => setNotifyTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
                  placeholder="Nhập tiêu đề cảnh cáo..."
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Nội dung thông báo chi tiết:
                </label>
                <textarea
                  rows={4}
                  value={notifyContent}
                  onChange={(e) => setNotifyContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none leading-relaxed"
                  placeholder="Nêu rõ lý do vi phạm hoặc điều cần điều chỉnh..."
                  required
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Thông báo này sẽ gửi trực tiếp đến hộp thư ứng dụng của người dùng.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNotifyModal({ ...notifyModal, isOpen: false })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/25 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi Cảnh Cáo Ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= POPUP CONFIRM CẢNH BÁO AN TOÀN (XÓA BÀI, KHÓA SPAM, CHẶN USER) ================= */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-65 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white max-w-md w-full rounded-xl border border-slate-200 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  confirmModal.actionType === 'delete_post' || confirmModal.actionType === 'mark_spam'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900 font-['Outfit']">
                  {confirmModal.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirm}
                className={`px-4 py-2 text-xs font-extrabold text-white rounded-lg shadow-sm transition-all active:scale-95 ${
                  confirmModal.actionType === 'delete_post'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : confirmModal.actionType === 'mark_spam'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : confirmModal.actionType === 'ban_user'
                    ? 'bg-amber-700 hover:bg-amber-800'
                    : 'bg-slate-800 hover:bg-slate-900'
                }`}
              >
                Xác Nhận Thực Hiện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: XỬ LÝ KHIẾU NẠI & BÁO CÁO ================= */}
      {handlingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-lg w-full rounded-xl border border-slate-200 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Xử Lý Khiếu Nại Báo Cáo #{handlingReport.id}</span>
              </h3>
              <button onClick={() => setHandlingReport(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 space-y-1">
                <div className="flex justify-between font-bold text-rose-800">
                  <span>Lý do: {handlingReport.reason}</span>
                  <span className="font-mono text-[11px] text-slate-400">Target #{handlingReport.targetId}</span>
                </div>
                <p className="text-slate-700">{handlingReport.targetPreview}</p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Người báo cáo: <strong>{handlingReport.reporterName}</strong> lúc {handlingReport.reportedAt}
                </span>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Ghi chú hành động của kiểm duyệt viên:
                </label>
                <textarea
                  rows={2}
                  placeholder="Nhập lý do hoặc biện pháp xử lý..."
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    resolveReport(handlingReport.id, 'dismissed');
                    setHandlingReport(null);
                    showToast('Đã bác bỏ khiếu nại (Nội dung hợp lệ).');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Bác Bỏ (Nội dung hợp lệ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resolveReport(handlingReport.id, 'resolved');
                    if (handlingReport.targetType === 'post') {
                      togglePostStatus(handlingReport.targetId, 'spam');
                    }
                    setHandlingReport(null);
                    showToast('Đã xác nhận vi phạm và cô lập nội dung.');
                  }}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs"
                >
                  Xác Nhận Vi Phạm & Gắn Spam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityModerationPage;
