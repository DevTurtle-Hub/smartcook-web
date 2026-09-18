import React from 'react';
import {
  Users,
  BookOpen,
  ScanLine,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const userGrowthData = [
  { name: 'T2', users: 120 },
  { name: 'T3', users: 190 },
  { name: 'T4', users: 280 },
  { name: 'T5', users: 390 },
  { name: 'T6', users: 510 },
  { name: 'T7', users: 780 },
  { name: 'CN', users: 1040 },
];

const topRecipesData = [
  { name: 'Thịt Kho Tàu', cooks: 450 },
  { name: 'Canh Chua Cá', cooks: 380 },
  { name: 'Ức Gà Sốt Bơ', cooks: 310 },
  { name: 'Bò Bít Tết', cooks: 270 },
  { name: 'Súp Bí Đỏ', cooks: 190 },
];

export const DashboardPage: React.FC = () => {
  const kpis = [
    { title: 'Tổng Thành Viên', value: '1,248', change: '+18.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Công Thức Chuẩn', value: '58', change: '+5 mới', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Lượt Quét AI Tủ Lạnh', value: '3,842', change: '+32.4%', icon: ScanLine, color: 'text-orange-600', bg: 'bg-orange-50' },
    { title: 'Bài Viết Cộng Đồng', value: '412', change: '+12.5%', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
            Bảng Thống Kê Hoạt Động Hệ Thống
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng quan dữ liệu thời gian thực từ Mobile App và Website SmartCook.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>Gemini AI Engine: Hoạt Động Tốt</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{kpi.title}</span>
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center font-bold`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">{kpi.value}</span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Tăng Trưởng Người Dùng Tuần Qua</h3>
              <p className="text-xs text-slate-400">Số lượng tài khoản đăng ký mới</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +24%
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fb923c' }}
                />
                <Line type="monotone" dataKey="users" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Cooked Dishes Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Món Ăn Nấu Nhiều Nhất</h3>
              <p className="text-xs text-slate-400">Lượt hoàn thành món ăn qua app</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Top 5 Thịnh Hành
            </span>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRecipesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="cooks" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
