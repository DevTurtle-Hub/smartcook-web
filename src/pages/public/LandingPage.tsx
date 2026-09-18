import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ScanLine,
  Mic,
  Refrigerator,
  Flame,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Star,
  Users,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Interactive Fridge Demo State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Thịt bò', 'Cà chua']);

  const demoIngredients = [
    { name: 'Thịt bò', icon: '🥩' },
    { name: 'Cà chua', icon: '🍅' },
    { name: 'Trứng gà', icon: '🥚' },
    { name: 'Hành tây', icon: '🧅' },
    { name: 'Đậu phụ', icon: '🧈' },
  ];

  const toggleIngredient = (name: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs sm:text-sm font-semibold border border-orange-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Nền tảng ẩm thực thế hệ mới ứng dụng Trí Tuệ Nhân Tạo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-['Outfit']">
              Bật Tủ Lạnh Nhìn Quanh <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-red-500">
                AI Gợi Ý Món Ăn Trong 3 Giây
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              SmartCook giải phóng bạn khỏi câu hỏi muôn thuở <i>"Hôm nay ăn gì?"</i>. Quản lý tủ lạnh thông minh, quét nhận diện nguyên liệu tức thì, và trợ lý giọng nói đọc từng bước nấu ăn rảnh tay.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/recipes"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Khám Phá Công Thức</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#download-app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
              >
                <Smartphone className="w-5 h-5 text-orange-500" />
                <span>Tải App Cho Mobile</span>
              </a>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-slate-500 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-slate-800">10,000+</span> đầu bếp gia đình
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold text-slate-800">4.9/5</span> đánh giá yêu thích
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" />
                <span>100% công thức chuẩn Việt</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-full blur-3xl opacity-20 -z-10 scale-90"></div>

            {/* 3D Phone Shell */}
            <div className="relative w-72 sm:w-80 rounded-[44px] bg-slate-900 p-3 shadow-2xl shadow-slate-900/30 border-4 border-slate-800">
              {/* Camera Dynamic Island */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-end px-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
              </div>

              {/* Screen Content */}
              <div className="w-full h-[540px] bg-slate-50 rounded-[36px] overflow-hidden flex flex-col relative">
                {/* Header */}
                <div className="pt-8 pb-3 px-4 bg-white border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">SmartCook Mobile</span>
                    <h3 className="font-bold text-sm text-slate-900">Tủ Lạnh Của Bạn</h3>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">5 món có thể nấu</span>
                </div>

                {/* Simulated App Card */}
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80"
                      alt="Salad"
                      className="w-full h-28 object-cover rounded-xl mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-800">Bò Xào Cà Chua</h4>
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">100% Khớp</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> 15 phút</span>
                      <span className="flex items-center gap-0.5"><Flame className="w-3 h-3" /> 280 kcal</span>
                    </div>
                  </div>

                  <div className="bg-orange-500 text-white p-3 rounded-2xl shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScanLine className="w-5 h-5 text-white" />
                      <div>
                        <div className="text-xs font-bold">Chế Độ Quét AI</div>
                        <div className="text-[10px] text-orange-100">Chụp ảnh bàn bếp để nhận diện</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-orange-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Highlight Badges */}
            <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Tránh Lãng Phí</div>
                <div className="text-[11px] text-slate-500">Giảm 40% đồ thừa trong tủ</div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Rảnh Tay 100%</div>
                <div className="text-[11px] text-slate-500">Ra lệnh giọng nói khi nấu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE FRIDGE DEMO WIDGET */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden border border-slate-700">
          <div className="max-w-2xl mb-8">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">Trải nghiệm tương tác nhanh</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] mt-1">
              Thử Chọn Nguyên Liệu Trong Tủ Lạnh Của Bạn
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Bấm chọn những gì bạn đang có sẵn. Thuật toán của SmartCook sẽ tính toán % khớp công thức ngay lập tức!
            </p>
          </div>

          {/* Ingredient Pills */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            {demoIngredients.map((item) => {
              const isSelected = selectedIngredients.includes(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleIngredient(item.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Result Card */}
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl">
                🍲
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-white">Bò Xào Cà Chua Hành Tây</h4>
                  <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                    {selectedIngredients.includes('Thịt bò') && selectedIngredients.includes('Cà chua') ? '100% Khớp' : '65% Khớp'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Đã có: {selectedIngredients.join(', ')} • Cần mua thêm: {selectedIngredients.includes('Hành tây') ? 'Không cần' : 'Hành tây (1 củ)'}
                </p>
              </div>
            </div>

            <Link
              to="/recipes"
              className="px-5 py-2.5 bg-white text-slate-900 hover:bg-orange-50 rounded-xl font-bold text-xs shrink-0 transition-colors shadow-sm"
            >
              Xem Công Thức Chi Tiết
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-bold text-xs uppercase tracking-wider">Hệ Sinh Thái Toàn Diện</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit'] mt-1">
            Mọi Thứ Bạn Cần Cho Gian Bếp Thông Minh
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ScanLine className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">AI Vision Scanner</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nhận diện tức thì nhiều nguyên liệu cùng lúc qua camera điện thoại nhờ mô hình thị giác Google Gemini Vision.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Refrigerator className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tủ Lạnh Thông Minh</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Quản lý hạn sử dụng, tự động cảnh báo nguyên liệu sắp hết hạn và xếp hạng món ăn theo tỉ lệ phần trăm trùng khớp.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Chế Độ Nấu Rảnh Tay</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trợ lý giọng nói tiếng Việt đọc từng bước hướng dẫn, hẹn giờ thông minh giúp hai tay bạn hoàn toàn tập trung nấu nướng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
