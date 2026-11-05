import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, Check, Clock, Copy, ExternalLink, LocateFixed, MapPin, Navigation, Phone, RefreshCw, Search, ShoppingCart, Store } from 'lucide-react';
import { storeApi, type StoreItem } from '../../api/store.api';
import { useCartStore } from '../../store/useCartStore';
import { toast } from '../../context/ToastContext';
import { storeDirectionsUrl, storeSearchUrl, validMapCoordinates, type MapCoordinates } from '../../utils/storeMaps';

import { getCurrentLocation } from '../../utils/currentLocation';
import { FPT_QUY_NHON, quyNhonStoresNear } from '../../utils/quyNhonStores';

export interface ShoppingIngredient { name: string; amount?: string | number; unit?: string }
const AREAS = [
  FPT_QUY_NHON,
  { name: 'TP. Hồ Chí Minh', lat: 10.7769, lng: 106.7009 },
  { name: 'Hà Nội', lat: 21.0285, lng: 105.8542 },
  { name: 'Đà Nẵng', lat: 16.0544, lng: 108.2022 },
  { name: 'Nha Trang', lat: 12.2471, lng: 109.1842 },
  { name: 'Cần Thơ', lat: 10.0452, lng: 105.7725 },
];
const SAVED_AREA = 'smartcook-supermarket-area';
function readSavedArea() {
  try { return AREAS.findIndex(item => item.name === localStorage.getItem(SAVED_AREA)); } catch { return -1; }
}
const searchable = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

export function NearbyStoresPanel({ neededIngredients }: { neededIngredients?: ShoppingIngredient[] }) {
  const cartItems = useCartStore(state => state.items);
  const shoppingList = useMemo(() => neededIngredients?.length ? neededIngredients : cartItems.filter(item => item.checked), [neededIngredients, cartItems]);
  const [area, setArea] = useState(readSavedArea);
  const [center, setCenter] = useState<MapCoordinates>(() => AREAS[readSavedArea()]);
  const [gps, setGps] = useState<MapCoordinates>();
  const [isLocating, setIsLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number>();
  const [mapViewMode, setMapViewMode] = useState<'user' | 'store'>('user');
  const [locationError, setLocationError] = useState('');
  const [radius, setRadius] = useState(10);
  const [search, setSearch] = useState('');
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [storeError, setStoreError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'two-wheeler'>('driving');
  const [copied, setCopied] = useState(false);
  const locationRequest = useRef(0);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => { ++locationRequest.current; clearTimeout(copyTimeout.current); };
  }, []);

  useEffect(() => {
    let active = true;
    setStores([]); setSelectedId(''); setStoreError('');
    if (!center) { setLoading(false); return; }
    if (area === 0) { setStores(quyNhonStoresNear(center, radius)); setLoading(false); return; }
    setLoading(true);
    storeApi.getNearbyStores(center.lat, center.lng, radius, 30)
      .then(data => { if (active) setStores(data.filter(store => validMapCoordinates(store.latitude, store.longitude))); })
      .catch(() => { if (active) setStoreError('Chưa tải được danh sách cửa hàng. Bạn có thể thử lại hoặc tìm trực tiếp trên Google Maps.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [center?.lat, center?.lng, area, radius, refresh]);

  const visibleStores = useMemo(() => (center ? stores : []).filter(store => searchable(`${store.name} ${store.brand} ${store.address}`).includes(searchable(search.trim())))
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)), [stores, search, center]);
  const selected = visibleStores.find(store => store.id === selectedId) || visibleStores[0];
  const mapCenter = mapViewMode === 'store' && selected ? { lat: selected.latitude, lng: selected.longitude } : center;
  const mapsSearch = storeSearchUrl(gps ? `${search.trim() || 'Siêu thị'} gần ${gps.lat},${gps.lng}` : area >= 0 ? `${search.trim() || 'Siêu thị'} gần ${AREAS[area].name}` : 'Siêu thị gần tôi');

  async function locate() {
    const requestId = ++locationRequest.current;
    setIsLocating(true); setLocationError(''); setMapViewMode('user');
    try {
      const position = await getCurrentLocation();
      if (requestId !== locationRequest.current) return;
      const coords = { lat: position.lat, lng: position.lng };
      setArea(-1); setGps(coords); setCenter(coords); setLocationAccuracy(position.accuracy); setSearch('');
    } catch (error) {
      if (requestId === locationRequest.current) setLocationError(error instanceof Error ? error.message : 'Chưa lấy được vị trí hiện tại. Hãy định vị lại.');
    } finally {
      if (requestId === locationRequest.current) setIsLocating(false);
    }
  }

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(shoppingList.map((item, index) => `${index + 1}. ${item.name}${item.amount ? ` — ${item.amount}${item.unit ? ` ${item.unit}` : ''}` : ''}`).join('\n'));
      setCopied(true); clearTimeout(copyTimeout.current); copyTimeout.current = setTimeout(() => setCopied(false), 2000);
      toast.success('Đã sao chép danh sách nguyên liệu cần mua.');
    } catch { toast.error('Không sao chép được danh sách. Vui lòng cho phép quyền sao chép hoặc chọn lại.'); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><p className="text-sm font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-600" />{gps ? 'Vị trí hiện tại của bạn' : area >= 0 ? `Địa điểm đã chọn: ${AREAS[area].name}` : isLocating ? 'Đang xác định vị trí hiện tại của bạn…' : 'Chưa xác định được vị trí hiện tại'}</p><p className="text-xs text-slate-500 mt-1">{gps ? `Định vị mới từ thiết bị · sai số khoảng ${Math.round(locationAccuracy ?? 0).toLocaleString('vi-VN')} m. Khoảng cách và chỉ đường tính từ vị trí này.` : area >= 0 ? area === 0 ? 'Dùng địa chỉ trường bạn đã chọn · Không cần bật định vị. Khoảng cách tính từ trường.' : 'Đang xem khu vực đã chọn.' : 'Chọn địa chỉ bên dưới để xem bản đồ ngay, không cần bật định vị.'}</p></div>
        <button onClick={locate} disabled={isLocating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-60 shrink-0"><LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-pulse' : ''}`} />{isLocating ? 'Đang định vị…' : gps ? 'Cập nhật vị trí của tôi' : 'Dùng vị trí thiết bị'}</button>
      </div>
      {locationError && <p role="status" className="text-xs text-amber-800 flex items-start gap-2 rounded-xl bg-amber-50 p-3"><AlertCircle className="w-4 h-4 shrink-0" />{locationError}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] gap-3">
        <label className="text-xs font-semibold text-slate-600">Vị trí tìm kiếm<select value={area >= 0 ? String(area) : gps ? 'gps' : ''} onChange={event => {
          if (event.target.value === 'gps') { void locate(); return; }
          ++locationRequest.current; setIsLocating(false); setLocationError(''); setGps(undefined); setLocationAccuracy(undefined);
          const index = Number(event.target.value); setArea(index); setCenter(AREAS[index]); try { localStorage.setItem(SAVED_AREA, AREAS[index].name); } catch { /* Storage may be unavailable. */ } setSearch(''); setMapViewMode('user');
        }} className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800"><option value="" disabled>Chọn địa chỉ — không cần định vị</option><option value="gps">Vị trí hiện tại của tôi</option>{AREAS.map((item, index) => <option key={item.name} value={index}>{item.name}</option>)}</select></label>
        <label className="text-xs font-semibold text-slate-600">Bán kính<select value={radius} onChange={event => setRadius(Number(event.target.value))} className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white p-2.5 text-sm text-slate-800">{[1, 5, 10, 20, 35].map(km => <option key={km} value={km}>Trong {km} km</option>)}</select></label>
        <label className="text-xs font-semibold text-slate-600">Tìm cửa hàng<div className="relative mt-1.5"><Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tên siêu thị hoặc địa chỉ…" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pl-9 text-sm text-slate-800" /></div></label>
        <button aria-label="Tải lại cửa hàng" onClick={() => setRefresh(value => value + 1)} disabled={loading || !center} className="self-end rounded-xl border border-slate-200 p-3 hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} /></button>
      </div>
      {shoppingList.length > 0 && <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"><div className="flex items-center justify-between gap-3"><h3 className="text-xs font-bold text-emerald-900 flex items-center gap-2"><ShoppingCart className="w-4 h-4" />Cần mua ({shoppingList.length})</h3><button onClick={copyList} className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Đã sao chép' : 'Sao chép'}</button></div><div className="flex flex-wrap gap-2 mt-3">{shoppingList.map((item, index) => <span key={index} className="rounded-lg bg-white border border-emerald-100 px-2.5 py-1 text-xs text-slate-700">{item.name}{item.amount ? ` · ${item.amount} ${item.unit || ''}` : ''}</span>)}</div><p className="text-[11px] text-emerald-800/70 mt-2">Mang theo danh sách khi đi chợ. Sản phẩm có sẵn cần kiểm tra với cửa hàng.</p></div>}
      <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-4 items-start">
        <section aria-label="Danh sách siêu thị" className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold text-sm text-slate-900">Siêu thị & cửa hàng</h3><span className="text-xs text-slate-500" aria-live="polite">{!center ? 'Chờ vị trí' : loading ? 'Đang tìm…' : `${visibleStores.length} địa điểm`}</span></div>
          <div className="max-h-[440px] overflow-y-auto p-2 space-y-2">
            {!center ? <p role="status" className="p-6 text-xs text-slate-500 leading-relaxed">{isLocating ? 'Đang chờ quyền truy cập vị trí và xác định tọa độ hiện tại…' : 'Chọn Đại học FPT Quy Nhơn hoặc một khu vực ở phía trên để xem cửa hàng, không cần bật vị trí.'}</p> : loading ? <p role="status" className="p-8 text-center text-xs text-slate-500">Đang tìm cửa hàng trong khu vực…</p> : storeError ? <p role="alert" className="p-4 text-xs text-rose-700 leading-relaxed">{storeError}</p> : !visibleStores.length ? <div className="p-6 text-center"><Store className="w-8 h-8 text-slate-300 mx-auto mb-3" /><p className="text-xs text-slate-600 leading-relaxed">{search ? 'Không có cửa hàng khớp tìm kiếm.' : 'Chưa có cửa hàng trong dữ liệu SmartCook ở bán kính này. Hãy tăng bán kính hoặc tìm trên Google Maps.'}</p><a href={mapsSearch} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1.5 items-center text-xs text-orange-600 font-bold mt-3">Tìm trên Google Maps <ExternalLink className="w-3 h-3" /></a></div> : visibleStores.map((store, index) => <button key={store.id} onClick={() => { setSelectedId(store.id); setMapViewMode('store'); }} aria-pressed={selected?.id === store.id} className={`w-full text-left rounded-xl p-3 border transition-colors ${selected?.id === store.id ? 'bg-orange-50 border-orange-400' : 'border-transparent hover:bg-slate-50'}`}><div className="flex items-start gap-3"><span className="w-7 h-7 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0">{index + 1}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900 break-words">{store.name}</p><p className="text-xs text-slate-500 mt-1 leading-relaxed">{store.address}</p><div className="flex flex-wrap items-center gap-2 mt-2">{Number.isFinite(store.distanceKm) && <span className="text-[11px] font-bold text-orange-700">~{store.distanceKm!.toLocaleString('vi-VN')} km</span>}{store.brand && <span className="text-[10px] text-slate-500 bg-white rounded-md px-1.5 py-0.5 border border-slate-100">{store.brand}</span>}</div></div></div></button>)}
          </div>
        </section>
        <section aria-label="Bản đồ siêu thị" className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
          <div className="bg-slate-100 h-[300px] sm:h-[400px] relative">{mapCenter ? <iframe title={mapViewMode === 'store' && selected ? `Google Maps — ${selected.name}` : gps ? 'Google Maps — vị trí hiện tại của bạn' : 'Google Maps — khu vực bạn chọn'} src={`https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s${mapCenter.lat},${mapCenter.lng}!6i15!3m1!1svi!5m1!1svi`} className="w-full h-full border-0" loading="eager" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <div className="h-full flex flex-col items-center justify-center text-center p-6 gap-3"><LocateFixed className="w-9 h-9 text-orange-400" /><p className="font-bold text-sm text-slate-700">{isLocating ? 'Đang lấy vị trí của bạn…' : 'Chọn địa chỉ để xem bản đồ'}</p><p className="text-xs text-slate-500 max-w-xs">Chọn Đại học FPT Quy Nhơn trong mục Vị trí tìm kiếm. Định vị thiết bị là tùy chọn.</p></div>}<a href={mapsSearch} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-md inline-flex gap-2 items-center"><ExternalLink className="w-3.5 h-3.5" />Tìm trên Google Maps</a></div>
          <div className="p-4 sm:p-5 space-y-3">
            {center && <div className="flex gap-2 flex-wrap"><button type="button" aria-pressed={mapViewMode === 'user'} onClick={() => setMapViewMode('user')} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mapViewMode === 'user' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>{gps ? 'Vị trí của tôi' : area === 0 ? 'Đại học FPT Quy Nhơn' : 'Khu vực đã chọn'}</button>{selected && <button type="button" aria-pressed={mapViewMode === 'store'} onClick={() => setMapViewMode('store')} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${mapViewMode === 'store' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'}`}>Cửa hàng đang chọn</button>}</div>}
            {selected ? <><div><h3 className="font-bold text-slate-900 text-sm">{selected.name}</h3><p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />{selected.address}</p></div><div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">{selected.openHours && <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Giờ tham khảo: {selected.openHours}</span>}{selected.phone && <a href={`tel:${selected.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-1.5 text-orange-700"><Phone className="w-3.5 h-3.5" />{selected.phone}</a>}</div><div className="flex flex-col sm:flex-row gap-2"><select aria-label="Phương tiện chỉ đường" value={travelMode} onChange={event => setTravelMode(event.target.value as typeof travelMode)} className="rounded-xl border border-slate-200 p-2.5 text-xs bg-white"><option value="driving">Ô tô</option><option value="two-wheeler">Xe máy</option><option value="walking">Đi bộ</option></select><a href={storeDirectionsUrl({ lat: selected.latitude, lng: selected.longitude }, gps || (area === 0 ? center : undefined), travelMode)} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-orange-500 text-white py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600"><Navigation className="w-4 h-4" />Chỉ đường Google Maps <ExternalLink className="w-3 h-3" /></a></div></> : <p className="text-xs text-slate-500">Chọn một cửa hàng trong danh sách để xem địa chỉ và chỉ đường.</p>}
            <p className="text-[10px] text-slate-400 leading-relaxed">{area === 0 ? 'Địa điểm đối chiếu Google Maps ngày 04/11/2026; danh sách không bao gồm tất cả cửa hàng. Khoảng cách tính từ Đại học FPT Quy Nhơn theo đường chim bay;' : 'Danh sách cửa hàng từ SmartCook. Khoảng cách hiển thị theo đường chim bay;'} tuyến đường và giờ hoạt động cập nhật xem trên Google Maps.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
