import React from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  ChevronRight,
  Plus,
  Utensils,
  MapPin,
  Quote,
  SlidersHorizontal,
  Layers,
  ChefHat,
  ScanLine,
  Apple,
  Smartphone,
  Eye,
  ArrowUpRight,
  Activity,
  Server,
  Wifi,
  Cpu,
  Gauge,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Globe,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { Link } from 'react-router-dom';

const weeklyAnalyticsData = [
  { month: 'T2', scans: 140, height: '35%' },
  { month: 'T3', scans: 310, height: '65%' },
  { month: 'T4', scans: 560, height: '90%', isPeak: true, value: '4,120 lượt' },
  { month: 'T5', scans: 390, height: '60%' },
  { month: 'T6', scans: 450, height: '75%' },
  { month: 'T7', scans: 520, height: '85%' },
  { month: 'CN', scans: 490, height: '80%' },
];

export const DashboardPage: React.FC = () => {
  const { kpi, heroBanner, tasks, toggleTask } = useAdminStore();

  const recentRecipes = [
    {
      id: 'rec-1',
      title: 'Bò Bít Tết Sốt Tiêu Đen',
      category: 'Ẩm Thực Âu - Cao Cấp',
      calories: '540 kcal',
      cookingTime: '25 phút',
      status: 'Đã Duyệt',
      statusColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200/60',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec-2',
      title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi',
      category: 'Eat Clean / Healthy',
      calories: '290 kcal',
      cookingTime: '15 phút',
      status: 'Đã Duyệt',
      statusColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200/60',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'rec-3',
      title: 'Canh Chua Cá Hồi Nam Bộ',
      category: 'Món Việt Truyền Thống',
      calories: '320 kcal',
      cookingTime: '30 phút',
      status: 'Chờ Duyệt',
      statusColor: 'text-amber-600 bg-amber-50 border border-amber-200/60',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-5">
      {/* ================= TOP SECTION: SMARTCOOK LIVE MOBILE APP SHOWCASE + 4 METRICS ================= */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        {/* HIỂN THỊ THUẦN TÚY CHIẾC ĐIỆN THOẠI HÒA VÀO NỀN WEB - CĂN THẲNG HÀNG TRÁI */}
        <div className="shrink-0 flex items-center justify-center py-1">
          <img
            src="/app-mockup.png"
            alt="SmartCook Mobile App"
            className="w-[260px] h-auto object-contain hover:scale-[1.01] transition-transform duration-300 drop-shadow-xl"
          />
        </div>

        {/* RIGHT: 4 METRIC CARDS + TOP SUMMARY - TỰ ĐỘNG MỞ RỘNG TOÀN BỘ KHÔNG GIAN BÊN PHẢI */}
        <div className="flex-1 flex flex-col justify-between gap-4 min-w-0">
          {/* 4 Health & Performance Metric Cards - HIỆN ĐẠI & SANG TRỌNG VỚI 2 MÀU PHA BÊN DƯỚI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Card 1: App Mobile Uptime (Emerald -> Teal) */}
            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-200/80 transition-all duration-300 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Đang Chạy
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">99.98%</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Uptime Mobile App</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium flex items-center justify-between">
                <span>Trạng thái:</span>
                <span className="text-emerald-600 font-bold">Tốt</span>
              </div>

              {/* Dải 2 màu pha bên dưới khung (Emerald -> Cyan/Teal) */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-b-2xl opacity-90 group-hover:h-1.5 transition-all duration-300" />
            </div>

            {/* Card 2: Web Portal Uptime (Indigo -> Purple) */}
            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200/80 transition-all duration-300 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Đang Chạy
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">100%</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Uptime Web Portal</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium flex items-center justify-between">
                <span>Tải trang:</span>
                <span className="text-indigo-600 font-bold">0.38s</span>
              </div>

              {/* Dải 2 màu pha bên dưới khung (Indigo -> Purple/Violet) */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 rounded-b-2xl opacity-90 group-hover:h-1.5 transition-all duration-300" />
            </div>

            {/* Card 3: Backend API Latency (Blue -> Cyan) */}
            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200/80 transition-all duration-300 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Server className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs">
                    Nhanh
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">48 ms</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Độ Trễ API Backend</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium flex items-center justify-between">
                <span>Tải đồng thời:</span>
                <span className="text-slate-700 font-bold">1,840 req/s</span>
              </div>

              {/* Dải 2 màu pha bên dưới khung (Blue -> Sky/Cyan) */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 rounded-b-2xl opacity-90 group-hover:h-1.5 transition-all duration-300" />
            </div>

            {/* Card 4: AI Engine Vision Load (Amber -> Rose/Orange) */}
            <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-200/80 transition-all duration-300 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70 shadow-2xs">
                    GPU 32%
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight">0.82s</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Thời Gian Quét AI</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[10.5px] text-slate-400 font-medium flex items-center justify-between">
                <span>Độ chính xác:</span>
                <span className="text-emerald-600 font-bold">99.4%</span>
              </div>

              {/* Dải 2 màu pha bên dưới khung (Amber -> Orange/Rose) */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-b-2xl opacity-90 group-hover:h-1.5 transition-all duration-300" />
            </div>
          </div>

          {/* ================= ROW 1 CỦA KHỐI PHÂN TÍCH: 2 BIỂU ĐỒ DONUT (VẬN HÀNH & HẠ TẦNG) ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            {/* Donut Card 1: Khối Vận Hành & Khách Hàng */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-slate-800 font-['Outfit']">Khối Vận Hành & Khách Hàng</h4>
                <span className="text-[10px] text-slate-400">Theo module</span>
              </div>

              <div className="flex items-center justify-between gap-5 my-auto py-1">
                {/* Donut Chart SVG 1 */}
                <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                    {/* Segment 1: Cyan / Light Blue (35%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#06B6D4"
                      strokeWidth="14"
                      strokeDasharray="83 239"
                      strokeDashoffset="0"
                    />
                    {/* Segment 2: Purple / Indigo (30%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#7C3AED"
                      strokeWidth="14"
                      strokeDasharray="71 239"
                      strokeDashoffset="-83"
                    />
                    {/* Segment 3: Deep Blue (20%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#2563EB"
                      strokeWidth="14"
                      strokeDasharray="48 239"
                      strokeDashoffset="-154"
                    />
                    {/* Segment 4: Sky Blue (15%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#38BDF8"
                      strokeWidth="14"
                      strokeDasharray="37 239"
                      strokeDashoffset="-202"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800 font-['Outfit'] tracking-tight">53</span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tổng tác vụ</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
                      Công Thức Nấu
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">18</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                      Quét AI Tủ Lạnh
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">14</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      Cộng Đồng Feed
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">11</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                      Thực Đơn Tuần
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Donut Card 2: Khối Hạ Tầng & Dịch Vụ */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-slate-800 font-['Outfit']">Khối Hạ Tầng & Dịch Vụ</h4>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                  <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 shadow-2xs">2024</span>
                  <span className="px-2 py-0.5 text-slate-500">2025</span>
                  <span className="px-2 py-0.5 text-slate-500">2026</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-5 my-auto py-1">
                {/* Donut Chart SVG 2 */}
                <div className="relative w-52 h-52 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                    {/* Production / Main backend: Purple (65%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#6366F1"
                      strokeWidth="14"
                      strokeDasharray="155 239"
                      strokeDashoffset="0"
                    />
                    {/* AI Cluster: Cyan (15%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#06B6D4"
                      strokeWidth="14"
                      strokeDasharray="36 239"
                      strokeDashoffset="-155"
                    />
                    {/* Database & Storage: Dark Navy (12%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#1E1B4B"
                      strokeWidth="14"
                      strokeDasharray="29 239"
                      strokeDashoffset="-191"
                    />
                    {/* CDN & Media: Blue (8%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="14"
                      strokeDasharray="19 239"
                      strokeDashoffset="-220"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800 font-['Outfit'] tracking-tight">315</span>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Node / Micro</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                      API Cluster
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">213</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                      Vision AI Nodes
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">44</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1E1B4B]" />
                      Database Replica
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">38</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                      Media Storage
                    </span>
                    <span className="font-bold text-slate-900 font-['Outfit']">20</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ROW 2 CỦA KHỐI PHÂN TÍCH: BIỂU ĐỒ SÓNG LIÊN TỤC + ĐỒ THỊ BÁN NGUYỆT GAUGE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* LEFT 8 COLS: BIỂU ĐỒ SÓNG THEO DÕI TĂNG TRƯỞNG & ĐỘ TRỄ (TƯƠNG TỰ HÌNH ẢNH MẪU) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-sm text-slate-900 font-['Outfit']">Tình Hình Tăng Trưởng App</h3>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="text-slate-500">Mục tiêu: <strong className="text-slate-800">24,000</strong></span>
                <span className="text-slate-500">Đạt được: <strong className="text-indigo-600">18,520</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                Tăng trưởng +18.4%
              </span>
            </div>
          </div>

          {/* SVG Multi-wave chart with cyan & violet shaded areas */}
          <div className="relative pt-6 pb-2">
            <div className="w-full h-40 sm:h-44">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
                <defs>
                  {/* Gradient cho vùng sóng thứ nhất (Cyan) */}
                  <linearGradient id="areaCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Gradient cho vùng sóng thứ hai (Violet) */}
                  <linearGradient id="areaViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Shaded Area Cyan */}
                <path
                  d="M 0,130 C 60,130 90,80 150,75 C 210,70 240,115 300,105 C 360,95 390,40 450,45 C 510,50 540,120 600,100 C 640,85 670,95 700,90 L 700,150 L 0,150 Z"
                  fill="url(#areaCyan)"
                />

                {/* Line 1: Cyan Curve */}
                <path
                  d="M 0,130 C 60,130 90,80 150,75 C 210,70 240,115 300,105 C 360,95 390,40 450,45 C 510,50 540,120 600,100 C 640,85 670,95 700,90"
                  fill="none"
                  stroke="#0891B2"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Line 2: Purple / Indigo Solid Curve */}
                <path
                  d="M 0,115 C 60,115 90,65 150,60 C 210,55 240,95 300,85 C 360,75 390,60 450,55 C 510,50 540,90 600,75 C 640,65 670,68 700,60"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Dashed Target line in the right section */}
                <path
                  d="M 450,45 C 510,35 540,55 600,65 C 640,70 670,65 700,50"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Callout Indicator Dot */}
                <circle cx="450" cy="45" r="4.5" fill="#0891B2" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="600" cy="100" r="4.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
            </div>

            {/* Months Label Bar - With Active October Badge */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-2 px-1">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">OCT</span>
              <span>NOV</span>
              <span>DEC</span>
            </div>
          </div>
        </div>

        {/* RIGHT 4 COLS: GAUGE BÁN NGUYỆT CHI PHÍ / HIỆU SUẤT TRÊN MỖI NGƯỜI DÙNG */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 font-['Outfit']">Chi Phí Vận Hành / User</h4>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Tiết kiệm 22%
            </span>
          </div>

          {/* Semi-Circle Gauge Arc SVG */}
          <div className="relative py-2 flex flex-col items-center justify-center my-auto">
            <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
              <svg className="w-44 h-44" viewBox="0 0 100 100">
                {/* Background Half Arc */}
                <path
                  d="M 12 50 A 38 38 0 0 1 88 50"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                {/* Active Purple/Pink Gradient Arc */}
                <path
                  d="M 12 50 A 38 38 0 0 1 88 50"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="13"
                  strokeDasharray="119"
                  strokeDashoffset="38"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="60%" stopColor="#9333EA" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="text-center mt-1">
              <span className="text-lg font-extrabold text-slate-900 font-['Outfit'] block">
                0.38 nghìn / user
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Chi phí máy chủ & AI / ngày</span>
            </div>

            {/* Min / Max Labels */}
            <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 px-4 mt-2">
              <span>0 đ</span>
              <span>1.5k đ</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Hiệu quả phân bổ:</span>
            <span className="font-bold text-emerald-600">Rất tối ưu (94%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
