import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Navigation } from 'lucide-react';

export function NearbyStoresCard({ onOpen }: { onOpen?: () => void }) {
  return (
    <Link to="/supermarkets" onClick={onOpen} className="block rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 hover:border-orange-400 transition-colors">
      <div className="flex gap-3"><span className="h-10 w-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-orange-500" /></span><div className="min-w-0"><h3 className="text-sm font-bold text-slate-900">Siêu thị gần bạn</h3><p className="text-xs text-slate-500 mt-1 leading-relaxed">Tìm cửa hàng, xem bản đồ và mang theo danh sách nguyên liệu cần mua.</p><span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-orange-700"><Navigation className="w-3.5 h-3.5" />Xem bản đồ Google Maps <ArrowRight className="w-3.5 h-3.5" /></span></div></div>
    </Link>
  );
}
