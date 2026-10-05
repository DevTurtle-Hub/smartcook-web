import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  LogIn, 
  UserPlus, 
  Eye,
  Camera,
  Refrigerator,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';

export type FeatureType = 'fridge' | 'camera' | 'community' | 'chat' | 'general';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureType?: FeatureType;
  redirectPath?: string;
  allowPreview?: boolean;
}

const FEATURE_CONFIGS: Record<FeatureType, {
  title: string;
  badge: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  benefits: string[];
}> = {
  chat: {
    title: 'Đăng nhập để vào Phòng Chat Giao Lưu Bếp',
    badge: 'Culinary Chat Lounge',
    subtitle: 'Nhắn tin trực tiếp 1-1 với các đầu bếp tài năng, trao đổi bí quyết nêm nếm và kết bạn ẩm thực.',
    icon: MessageCircle,
    benefits: [
      'Trò chuyện thời gian thực (Real-time Socket) cùng cộng đồng bếp',
      'Hỏi đáp trực tiếp bí quyết nêm nếm & xử lý món ăn ngay khi nấu',
      'Gửi hình ảnh mâm cơm và chia sẻ công thức trực tiếp trong tin nhắn',
      'Nhận thông báo tức thì khi có đầu bếp hoặc bạn bè phản hồi'
    ],
  },
  fridge: {
    title: 'Đăng nhập để dùng Tủ Lạnh Thông Minh',
    badge: 'Tủ Lạnh Cá Nhân Hóa',
    subtitle: 'Quản lý toàn bộ thực phẩm trong gia đình, theo dõi hạn dùng và nhận gợi ý món nấu tức thì.',
    icon: Refrigerator,
    benefits: [
      'Lưu và đồng bộ thực phẩm tủ lạnh trên cả Web & Mobile',
      'Tự động tính % nguyên liệu sẵn có để gợi ý món nấu ngay',
      'Cảnh báo thông minh khi thực phẩm sắp hết hạn',
      'Tự động trích xuất nguyên liệu còn thiếu vào giỏ đi chợ'
    ],
  },
  camera: {
    title: 'Đăng nhập để sử dụng AI Camera Scan',
    badge: 'Gemini Vision AI Engine',
    subtitle: 'Công nghệ AI quét nhận diện tức thì hàng trăm loại thực phẩm từ ảnh chụp camera.',
    icon: Camera,
    benefits: [
      'Nhận diện nguyên liệu chính xác 98% từ ảnh thực tế',
      'Tự động bóc tách và thêm ngay vào tủ lạnh thông minh',
      'Gợi ý công thức phù hợp ngay sau khi quét',
      'Lưu vết lịch sử quét ảnh để bạn xem lại bất cứ lúc nào'
    ],
  },
  community: {
    title: 'Đăng nhập để tham gia Cộng Đồng Ẩm Thực',
    badge: 'Mạng Xã Hội SmartCook',
    subtitle: 'Giao lưu cùng hàng ngàn người yêu nấu nướng, chia sẻ công thức và chat realtime.',
    icon: MessageCircle,
    benefits: [
      'Đăng bài khoe món ngon tự nấu với album ảnh sắc nét',
      'Thả tim cảm xúc, bình luận trao đổi kinh nghiệm bếp núc',
      'Nhắn tin 1-1 và tham gia phòng chat trực tiếp',
      'Tích lũy điểm XP để thăng hạng danh hiệu Đầu Bếp'
    ],
  },
  general: {
    title: 'Yêu cầu đăng nhập tài khoản',
    badge: 'SmartCook Member',
    subtitle: 'Đăng nhập để mở khóa trọn bộ tính năng thông minh của SmartCook.',
    icon: Lock,
    benefits: [
      'Đồng bộ dữ liệu thời gian thực giữa Web và Mobile App',
      'Trợ lý ảo AI Chef tư vấn thực đơn cá nhân hóa',
      'Lập kế hoạch bữa ăn 7 ngày và danh sách mua sắm',
      'Lưu trữ công thức yêu thích và lịch sử nấu nướng'
    ],
  },
};

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  featureType = 'general',
  redirectPath = window.location.pathname,
  allowPreview = true,
}) => {
  const navigate = useNavigate();

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = FEATURE_CONFIGS[featureType] || FEATURE_CONFIGS.general;
  const IconComponent = config.icon;
  const encodedRedirect = encodeURIComponent(redirectPath);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Lớp nền mờ Glassmorphism cao cấp - bấm ra ngoài để đóng */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(234,88,12,0.3)] border border-orange-200/80 animate-in fade-in zoom-in-95 duration-300 z-10 overflow-hidden">
        
        {/* Họa tiết trang trí nền */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-amber-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-amber-400/20 to-rose-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Nút đóng (X) luôn hiển thị rõ ràng ở góc trên bên phải */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100/90 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-20 cursor-pointer shadow-xs border border-slate-200/70"
          title="Đóng (Esc)"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Icon & Badge nổi bật */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Lock className="w-3 h-3 text-amber-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100/80 border border-orange-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{config.badge}</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading leading-tight pt-1">
              {config.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              {config.subtitle}
            </p>
          </div>

          {/* Danh sách quyền lợi hấp dẫn */}
          <div className="w-full bg-orange-50/60 rounded-2xl p-4 border border-orange-100/90 text-left space-y-2.5 my-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-700 block">
              Đặc quyền khi có tài khoản SmartCook:
            </span>
            <ul className="space-y-2">
              {config.benefits.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nút hành động chính */}
          <div className="w-full space-y-2.5 pt-2">
            <button
              onClick={() => navigate(`/auth/login?redirect=${encodedRedirect}`)}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng Nhập Ngay</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate(`/auth/register?redirect=${encodedRedirect}`)}
              className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-orange-50/80 border border-slate-200 hover:border-orange-300 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-orange-500" />
              <span>Tạo Tài Khoản Miễn Phí (30 giây)</span>
            </button>

            {allowPreview && (
              <button
                onClick={onClose}
                className="w-full pt-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tôi muốn xem trước giao diện</span>
              </button>
            )}
          </div>

          {/* Dòng bảo mật */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Miễn phí 100% • Bảo mật an toàn thông tin cá nhân</span>
          </div>
        </div>
      </div>
    </div>
  );
};
