import { MapPin } from 'lucide-react';
import { UserHeader } from '../../components/user/UserHeader';
import { NearbyStoresPanel } from '../../components/supermarket/NearbyStoresPanel';

export function NearbySupermarketsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] pb-12">
      <UserHeader />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
        <div className="mb-7"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-100/70 border border-orange-200 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5" />ĐI CHỢ CÙNG SMARTCOOK</span><h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900">Siêu thị gần bạn</h1><p className="mt-2 text-sm text-slate-500 leading-relaxed">Tìm nơi mua nguyên liệu, xem bản đồ và chỉ đường bằng Google Maps ngay trên web.</p></div>
        <NearbyStoresPanel />
      </main>
    </div>
  );
}
