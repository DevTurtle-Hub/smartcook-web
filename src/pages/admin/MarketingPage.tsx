import React, { useState } from 'react';
import {
  Bell,
  Send,
  Sparkles,
  DollarSign,
  Clock,
  Crown,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Plus,
  TrendingUp,
  Flame,
  Smartphone,
  Tag,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  AlertTriangle,
  FileEdit,
  Check,
  X,
  Target,
  BarChart3,
  Percent,
  CheckCircle,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  ChevronRight,
  Radio,
  Share2,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { PushNotificationSchedule } from '../../types/admin';

export const MarketingPage: React.FC = () => {
  const { notifications, addNotification } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'campaign_studio' | 'subscriptions' | 'promotions'>('campaign_studio');

  // Interactive Live Campaign Studio State (Thiết kế phòng điều khiển gửi Push trực tiếp)
  const [notifTitle, setNotifTitle] = useState('🍲 Gợi ý bữa trưa: Bạn có sẵn thịt bò & khoai tây nấu canh!');
  const [notifBody, setNotifBody] = useState('SmartCook gợi ý món Canh bò hầm cà rốt thanh mát chỉ 25 phút. Chạm để vào chế độ Cook With Me ngay...');
  const [notifAudience, setNotifAudience] = useState<'all' | 'vip_only' | 'inactive_3days'>('all');
  const [notifCategory, setNotifCategory] = useState<'lunch_meal' | 'dinner_meal' | 'promo' | 'weekly_digest'>('lunch_meal');
  const [sendOption, setSendOption] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledTime, setScheduledTime] = useState('11:00 Hôm nay');
  const [targetOS, setTargetOS] = useState<'all' | 'ios' | 'android'>('all');
  const [actionRoute, setActionRoute] = useState('/recipe/dish-1');
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Modal Chỉnh sửa cấu hình gói VIP
  const [editingTier, setEditingTier] = useState<any | null>(null);
  const [tierPriceInput, setTierPriceInput] = useState('');
  const [tierDiscountInput, setTierDiscountInput] = useState('');

  // 3 Gói VIP Subscriptions (SRS Module 15: Monetization)
  const [subscriptionTiers, setSubscriptionTiers] = useState([
    {
      id: 'tier-1',
      name: 'Gói VIP Tháng',
      period: '30 ngày',
      price: '49,000 đ',
      badge: 'Cơ Bản',
      activeUsers: 840,
      monthlyRevenue: '41,160,000 đ',
      highlightColor: 'from-blue-500/10 to-indigo-50 border-indigo-200',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      features: [
        'Không quảng cáo banner và video toàn app',
        'Quét nhận diện tủ lạnh Vision AI không giới hạn',
        'Trợ lý Chat Chef AI gợi ý món ăn theo nguyên liệu 24/7',
      ],
    },
    {
      id: 'tier-2',
      name: 'Gói VIP Quý (90 Ngày)',
      period: '3 tháng',
      price: '119,000 đ',
      badge: 'Được Mua Nhiều Nhất ⭐',
      isPopular: true,
      activeUsers: 1950,
      monthlyRevenue: '77,350,000 đ',
      highlightColor: 'from-amber-500/15 via-orange-50/50 to-white border-amber-300 ring-2 ring-amber-400/30',
      badgeColor: 'bg-amber-500 text-white shadow-xs',
      features: [
        'Tất cả quyền lợi của gói VIP tháng',
        'Thực đơn cá nhân hóa chuyên sâu (Keto, Eat Clean, Low Carb)',
        'Huy hiệu VIP Pro màu vàng kim trên bảng tin cộng đồng',
        'Đồng bộ tủ lạnh thông minh đa thiết bị gia đình',
      ],
    },
    {
      id: 'tier-3',
      name: 'Gói VIP Năm (Yearly Master)',
      period: '12 tháng',
      price: '399,000 đ',
      badge: 'Tiết Kiệm 35%',
      activeUsers: 620,
      monthlyRevenue: '20,615,000 đ',
      highlightColor: 'from-purple-500/10 to-indigo-50 border-purple-200',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      features: [
        'Mở khóa toàn bộ tính năng cao cấp nhất của SmartCook',
        'Truy cập kho công thức MasterChef sao vàng độc quyền',
        'Chế độ nấu Cook With Me hẹn giờ đa luồng thông minh',
        'Tư vấn trực tiếp 1-1 với Chuyên gia dinh dưỡng hàng tuần',
      ],
    },
  ]);

  // Danh sách Voucher & Mã giảm giá
  const [promoCodes, setPromoCodes] = useState([
    {
      code: 'SMARTCOOKVIP50',
      discount: 'Giảm 50%',
      target: 'Gói VIP Quý & Năm',
      expires: '31/12/2026',
      usedCount: 428,
      status: 'active',
    },
    {
      code: 'BEPVIET2026',
      discount: 'Giảm 30,000 đ',
      target: 'Tất cả gói VIP',
      expires: '15/10/2026',
      usedCount: 890,
      status: 'active',
    },
    {
      code: 'WELCOMECHEF',
      discount: '7 ngày trải nghiệm VIP Free',
      target: 'Tân thủ Mobile',
      expires: 'Vô thời hạn',
      usedCount: 1420,
      status: 'active',
    },
  ]);

  // Gửi phát lệnh thông báo trực tiếp
  const handleDispatchPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) return;

    addNotification({
      title: notifTitle.trim(),
      body: notifBody.trim(),
      scheduledTime: sendOption === 'instant' ? 'Gửi ngay bây giờ' : scheduledTime,
      targetAudience: notifAudience,
      category: notifCategory,
      status: sendOption === 'instant' ? 'sent' : 'scheduled',
      clicksCount: 12,
    });

    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 4000);
  };

  // Mẫu thông báo mẫu tạo nhanh
  const quickTemplates = [
    {
      label: 'Bữa Trưa 11h',
      title: '🍲 Gợi ý bữa trưa: Bạn có sẵn thịt bò & khoai tây nấu canh!',
      body: 'SmartCook gợi ý món Canh bò hầm cà rốt thanh mát chỉ 25 phút. Chạm để xem công thức...',
      cat: 'lunch_meal' as const,
    },
    {
      label: 'Bữa Tối 17h30',
      title: '🥗 Bữa tối Eat Clean nhẹ bụng: Ức gà sốt bơ tỏi 15 phút!',
      body: 'Nguyên liệu trong tủ lạnh vẫn tươi ngon. Hãy bắt đầu nấu bữa tối healthy ngay hôm nay...',
      cat: 'dinner_meal' as const,
    },
    {
      label: 'Khuyến Mãi VIP',
      title: '⭐ Ưu đãi cuối tuần: Nâng cấp VIP giảm ngay 50%!',
      body: 'Mở khóa toàn bộ công thức MasterChef và tính năng Quét tủ lạnh không giới hạn với mã SMARTCOOKVIP50...',
      cat: 'promo' as const,
    },
  ];

  return (
    <div className="space-y-4">
      {/* ================= THANH ĐIỀU HƯỚNG TÍNH NĂNG CHÍNH ================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('campaign_studio')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'campaign_studio'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Phòng Điều Khiển Push & Live Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'subscriptions'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Bảng Giá & Gói Hội Viên VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'promotions'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Voucher & Mã Khuyến Mãi</span>
          </button>
        </div>

        {/* Thông số tổng quan hệ thống VIP */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-200/80 rounded-lg text-amber-800 font-medium">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            <span>Hội viên VIP đang hoạt động:</span>
            <strong className="font-extrabold font-['Outfit'] text-amber-900">3,410</strong>
          </div>
        </div>
      </div>

      {/* Thông báo đẩy thành công Toast */}
      {isSuccessToast && (
        <div className="p-3.5 bg-emerald-500 text-white rounded-xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Đã phát lệnh Push Notification thành công tới toàn bộ thiết bị ứng dụng SmartCook!</span>
          </div>
          <button onClick={() => setIsSuccessToast(false)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          TAB 1: PHÒNG ĐIỀU KHIỂN CHIẾN DỊCH PUSH & LIVE SIMULATOR (ĐỘC ĐÁO & HIỆN ĐẠI)
      ========================================================================== */}
      {activeTab === 'campaign_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CỘT TRÁI (7 phần): Bảng điều khiển cấu hình & gửi Push Notification */}
          <div className="lg:col-span-7 space-y-4">
            {/* Thẻ soạn thảo chiến dịch */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                      Soạn Thảo Thông Báo Đẩy Thời Gian Thực
                    </h3>
                    <span className="text-[11px] text-slate-400">Xem trước trực tiếp trên điện thoại bên phải</span>
                  </div>
                </div>

                {/* Mẫu nhanh */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Mẫu:</span>
                  {quickTemplates.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNotifTitle(tpl.title);
                        setNotifBody(tpl.body);
                        setNotifCategory(tpl.cat);
                      }}
                      className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 transition-colors"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleDispatchPush} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Tiêu Đề Thông Báo (Tối đa 60 ký tự)
                  </label>
                  <input
                    type="text"
                    required
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    placeholder="VD: 🍲 Gợi ý bữa trưa..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                    Nội Dung Tin Nhắn Đẩy (Push Message)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    placeholder="Nhập nội dung ngắn gọn, kích thích người dùng mở app nấu ăn..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Phân Phối Đối Tượng (Audience)
                    </label>
                    <select
                      value={notifAudience}
                      onChange={(e) => setNotifAudience(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="all">Toàn bộ người dùng (14,250 thiết bị)</option>
                      <option value="vip_only">Chỉ hội viên VIP (3,410 tài khoản)</option>
                      <option value="inactive_3days">Người dùng chưa mở app 3 ngày (890 thiết bị)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Hệ Điều Hành Mục Tiêu
                    </label>
                    <div className="w-full px-3.5 py-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Chuyên Biệt Hệ Điều Hành Android</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold">
                        Mặc Định
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Phân Loại Mục Đích (Category)
                    </label>
                    <select
                      value={notifCategory}
                      onChange={(e) => setNotifCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="lunch_meal">Gợi ý Bữa Trưa (11:00)</option>
                      <option value="dinner_meal">Gợi ý Bữa Tối (17:30)</option>
                      <option value="promo">Khuyến Mãi & Voucher VIP</option>
                      <option value="weekly_digest">Tổng kết ẩm thực tuần</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Deep-link Mở Màn Hình Trên App
                    </label>
                    <input
                      type="text"
                      value={actionRoute}
                      onChange={(e) => setActionRoute(e.target.value)}
                      placeholder="/recipe/dish-1"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700"
                    />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="radio"
                        name="sendOpt"
                        checked={sendOption === 'instant'}
                        onChange={() => setSendOption('instant')}
                      />
                      <span>Phát lệnh ngay lập tức</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                      <input
                        type="radio"
                        name="sendOpt"
                        checked={sendOption === 'scheduled'}
                        onChange={() => setSendOption('scheduled')}
                      />
                      <span>Hẹn giờ gửi tự động</span>
                    </label>
                  </div>

                  {sendOption === 'scheduled' && (
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder="11:00 Hôm nay"
                      className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-700"
                    />
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {sendOption === 'instant' ? 'Phát Lệnh Push Toàn Hệ Thống Ngay' : 'Lưu Lịch Phát Thông Báo'}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Bảng theo dõi lịch sử thông báo gần đây */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center justify-between">
                <span>Lịch Sử Phát Lệnh Push Gần Nhất</span>
                <span className="text-[11px] text-slate-400 lowercase font-normal">
                  {notifications.length} chiến dịch đã ghi nhận
                </span>
              </h4>

              <div className="divide-y divide-slate-100">
                {notifications.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate">{item.title}</span>
                      <span className="text-[10.5px] text-slate-400 block mt-0.5">
                        {item.scheduledTime} • Đối tượng: {item.targetAudience === 'all' ? 'Tất cả' : 'VIP'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.clicksCount !== undefined && item.clicksCount > 0 ? (
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {item.clicksCount} lượt mở
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Đang theo dõi</span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {item.status === 'sent' ? 'Đã phát' : 'Hẹn giờ'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (5 phần): Chiếc điện thoại Android Live Simulator chân thực, màn hình sáng */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center space-y-4">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Mô Phỏng Android Phone (Live Preview Màn Hình Sáng)</span>
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold border border-emerald-200">
                Android 15 • Realtime
              </span>
            </div>

            {/* Chiếc điện thoại Android chân thực viền kim loại bạc, màn hình sáng rực rỡ */}
            <div className="relative w-[290px] sm:w-[320px] h-[610px] bg-slate-900 rounded-[38px] p-2.5 shadow-2xl border-4 border-slate-300 ring-1 ring-slate-400/50 flex flex-col justify-between select-none">
              {/* Vỏ màn hình bên trong với hình nền sáng hiện đại */}
              <div className="w-full h-full bg-gradient-to-b from-sky-50 via-indigo-50/40 to-slate-100 rounded-[30px] overflow-hidden flex flex-col justify-between relative border border-slate-200 shadow-inner">
                {/* 1. Android Status Bar trên cùng */}
                <div className="px-5 pt-3 pb-1 flex items-center justify-between text-slate-800 text-[11px] font-bold shrink-0 z-10">
                  {/* Đồng hồ góc trái Android */}
                  <span className="font-['Outfit'] tracking-tight">11:30</span>

                  {/* Nốt ruồi camera đục lỗ chính giữa (Punch hole camera) */}
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700 shadow-xs" />

                  {/* Icon sóng, wifi, pin góc phải */}
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="text-[10px] font-mono">5G</span>
                    {/* Wifi icon */}
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.78 0 7.21 1.54 9.69 4.02L12 19.33 2.31 11.52C4.79 9.04 8.22 7.5 12 7.5z" />
                    </svg>
                    {/* Battery icon */}
                    <div className="w-5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
                      <div className="w-full h-full bg-slate-800 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* 2. Đồng hồ số lớn màn hình khóa Android */}
                <div className="text-center pt-5 space-y-1">
                  <div className="text-5xl font-black text-slate-900 tracking-tight font-['Outfit']">
                    11:30
                  </div>
                  <div className="text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5">
                    <span>Thứ Bảy, 19 Tháng 9</span>
                    <span>•</span>
                    <span className="text-amber-700">28°C Nắng Đẹp ☀️</span>
                  </div>
                </div>

                {/* 3. Khung Thông Báo Chuẩn Android Material You (Trắng sáng, nổi bật, font chữ rõ nét) */}
                <div className="px-3.5 my-auto space-y-2.5 z-10">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-indigo-100/80 shadow-md shadow-slate-200/80 space-y-2 transition-all hover:scale-[1.01]">
                    {/* Header thông báo app Android */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                          SC
                        </div>
                        <span className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1">
                          SmartCook
                          <span className="w-1 h-1 rounded-full bg-slate-400" />
                          <span className="text-[10px] text-indigo-600 font-semibold">Trợ Lý Bếp</span>
                        </span>
                      </div>
                      <span className="text-[10.5px] text-slate-400 font-medium">Vừa xong</span>
                    </div>

                    {/* Nội dung thông báo hiển thị rõ ràng */}
                    <div className="space-y-1 pt-0.5">
                      <h5 className="text-xs font-extrabold text-slate-900 leading-snug">
                        {notifTitle || 'Tiêu đề thông báo đẩy xuất hiện ở đây...'}
                      </h5>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {notifBody || 'Nội dung thông báo ngắn gọn kích thích người dùng mở ứng dụng nấu ăn...'}
                      </p>
                    </div>

                    {/* Nút hành động nhanh trên thông báo Android (Action Buttons) */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10.5px] font-bold text-slate-700 transition-colors"
                      >
                        Bỏ qua
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-[10.5px] font-bold text-white shadow-2xs flex items-center gap-1"
                      >
                        <span>Mở Nấu Ngay</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Hướng dẫn người dùng */}
                  <div className="text-center">
                    <span className="text-[10.5px] text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200/60 font-semibold shadow-2xs inline-block">
                      Chạm để mở công thức nấu ăn trực tiếp
                    </span>
                  </div>
                </div>

                {/* 4. Đáy màn hình Android: Shortcut máy ảnh / cuộc gọi & Thanh gạch cử chỉ (Gesture bar) */}
                <div className="pb-3 px-6 flex flex-col items-center gap-2">
                  <div className="w-full flex items-center justify-between text-slate-500 text-xs">
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-xs text-slate-700">
                      📞
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center shadow-xs text-slate-700">
                      📷
                    </div>
                  </div>

                  {/* Thanh cử chỉ Android (Navigation Gesture Bar) */}
                  <div className="w-32 h-1 bg-slate-400 rounded-full mt-1" />
                </div>
              </div>
            </div>

            <p className="text-[11.5px] text-slate-500 text-center max-w-xs font-medium">
              Mô phỏng chân thực hiển thị trên màn hình khóa Android theo tiêu chuẩn Material You & Google Play Notification Services.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GÓI HỘI VIÊN VIP & QUẢN TRỊ DOANH THU (SRS MODULE 15)
      ========================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between relative shadow-xs transition-all hover:shadow-md ${tier.highlightColor}`}
              >
                {tier.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-amber-500 text-white text-[10.5px] font-extrabold shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-white" />
                    Được Yêu Thích Nhất
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between pt-1">
                    <h4 className="font-extrabold text-base text-slate-900 font-['Outfit']">{tier.name}</h4>
                    <span className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-md border ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-3xl font-black text-slate-900 font-['Outfit']">
                      {tier.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium"> / {tier.period}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      Đặc quyền cao cấp (SRS Module 15):
                    </span>
                    {tier.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Người dùng kích hoạt:</span>
                    <strong className="text-indigo-900 font-bold font-['Outfit'] text-sm">
                      {tier.activeUsers} tài khoản
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Doanh thu định kỳ:</span>
                    <strong className="text-amber-800 font-bold font-['Outfit'] text-sm">
                      {tier.monthlyRevenue}
                    </strong>
                  </div>

                  <button
                    onClick={() => {
                      setEditingTier(tier);
                      setTierPriceInput(tier.price);
                      setTierDiscountInput(tier.badge);
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Cấu Hình Bảng Giá & Ưu Đãi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VOUCHER & MÃ KHUYẾN MÃI
      ========================================================================== */}
      {activeTab === 'promotions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  <span>Danh Sách Mã Khuyến Mãi Kích Hoạt VIP</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Người dùng có thể nhập các mã này trên màn hình Nâng cấp tài khoản ứng dụng Mobile.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Mã Khuyến Mãi (Voucher)</th>
                    <th className="py-3 px-4">Giá Trị Giảm</th>
                    <th className="py-3 px-4">Phạm Vi Áp Dụng</th>
                    <th className="py-3 px-4">Hạn Sử Dụng</th>
                    <th className="py-3 px-4">Lượt Đã Dùng</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {promoCodes.map((promo, idx) => (
                    <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-extrabold text-indigo-700 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg">
                          {promo.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-800 whitespace-nowrap">
                        {promo.discount}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {promo.target}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono whitespace-nowrap text-[11px]">
                        {promo.expires}
                      </td>
                      <td className="py-3.5 px-4 font-['Outfit'] font-bold text-slate-900 whitespace-nowrap">
                        {promo.usedCount.toLocaleString()} lượt
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10.5px] border border-emerald-200/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Đang hoạt động
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CẤU HÌNH BẢNG GIÁ */}
      {editingTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Cấu Hình Gói {editingTier.name}</span>
              </h3>
              <button onClick={() => setEditingTier(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscriptionTiers(
                  subscriptionTiers.map((t) =>
                    t.id === editingTier.id
                      ? {
                          ...t,
                          price: tierPriceInput.trim() || t.price,
                          badge: tierDiscountInput.trim() || t.badge,
                        }
                      : t
                  )
                );
                setEditingTier(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Giá Niêm Yết Mới
                </label>
                <input
                  type="text"
                  required
                  value={tierPriceInput}
                  onChange={(e) => setTierPriceInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                  Huy Hiệu Khuyến Mãi / Nhãn Nổi Bật
                </label>
                <input
                  type="text"
                  required
                  value={tierDiscountInput}
                  onChange={(e) => setTierDiscountInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-amber-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 rounded-xl shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
                >
                  Lưu Cấu Hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingPage;
