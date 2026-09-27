import React, { useState, useEffect, useMemo } from 'react';
import {
  Store,
  MapPin,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Clock,
  Phone,
  RotateCw,
  CheckCircle,
  Building2,
  Navigation,
  X,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { storeApi, type StoreItem } from '../../api/store.api';

const POPULAR_BRANDS = [
  'Tất cả',
  'WinMart',
  'Co.opmart',
  'Bách Hóa Xanh',
  'Lotte Mart',
  'Aeon Mall',
  'Tops Market',
  'Annam Gourmet',
];

export const SupermarketManagementPage: React.FC = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('Tất cả');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Thêm / Chỉnh Sửa
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingStore, setEditingStore] = useState<StoreItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'WinMart',
    address: '',
    latitude: 10.7769,
    longitude: 106.7009,
    openHours: '06:30 - 22:00',
    phone: '1900 1908',
    logo: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Tải danh sách siêu thị
  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const data = await storeApi.getAllStores();
      setStores(data);
    } catch (err: any) {
      console.warn('Lỗi lấy danh sách siêu thị:', err);
      showToast('Không thể tải danh sách siêu thị từ hệ thống.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Mở modal thêm mới
  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      brand: 'WinMart',
      address: '',
      latitude: 10.7769,
      longitude: 106.7009,
      openHours: '06:30 - 22:00',
      phone: '1900 1908',
      logo: '',
    });
    setShowModal(true);
  };

  // Mở modal sửa
  const handleOpenEdit = (store: StoreItem) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      brand: store.brand,
      address: store.address,
      latitude: store.latitude,
      longitude: store.longitude,
      openHours: store.openHours || '06:30 - 22:00',
      phone: store.phone || '1900 1908',
      logo: store.logo || '',
    });
    setShowModal(true);
  };

  // Submit form thêm hoặc sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      alert('Vui lòng điền đầy đủ tên và địa chỉ siêu thị.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingStore) {
        // Cập nhật
        const updated = await storeApi.updateStore(editingStore.id, formData);
        if (updated) {
          setStores((prev) => prev.map((s) => (s.id === editingStore.id ? updated : s)));
          showToast(`Đã cập nhật siêu thị "${formData.name}" thành công.`);
        }
      } else {
        // Thêm mới
        const created = await storeApi.createStore(formData);
        if (created) {
          setStores((prev) => [created, ...prev]);
          showToast(`Đã thêm mới siêu thị "${formData.name}".`);
        }
      }
      setShowModal(false);
    } catch (err: any) {
      console.error('Lỗi lưu siêu thị:', err);
      alert('Không thể lưu siêu thị. Vui lòng kiểm tra lại kết nối!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa siêu thị
  const handleDelete = async (store: StoreItem) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa điểm bán "${store.name}" khỏi hệ thống?`)) return;
    try {
      await storeApi.deleteStore(store.id);
      setStores((prev) => prev.filter((s) => s.id !== store.id));
      showToast(`Đã xóa điểm bán "${store.name}".`);
    } catch (err) {
      console.error('Lỗi xóa siêu thị:', err);
      alert('Không thể xóa siêu thị lúc này.');
    }
  };

  // Lọc và tìm kiếm
  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      const matchBrand =
        selectedBrand === 'Tất cả' ||
        s.brand?.toLowerCase().includes(selectedBrand.toLowerCase()) ||
        s.name.toLowerCase().includes(selectedBrand.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.brand?.toLowerCase().includes(q);

      return matchBrand && matchQuery;
    });
  }, [stores, selectedBrand, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER QUẢN TRỊ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
            <Store className="w-6 h-6 text-indigo-600" />
            <span>Quản Lý Chuỗi Siêu Thị & Điểm Bán GPS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị vị trí địa lý GeoJSON 2dsphere, phục vụ thuật toán tìm kiếm siêu thị gần nhất cho người dùng ứng dụng.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStores}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Làm mới dữ liệu"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Siêu Thị Mới</span>
          </button>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Điểm Bán</span>
          <div className="text-2xl font-black text-slate-900 font-['Outfit']">{stores.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Phủ sóng toàn quốc
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chuỗi Thương Hiệu</span>
          <div className="text-2xl font-black text-indigo-600 font-['Outfit']">7+ Chuỗi</div>
          <p className="text-[11px] text-slate-500">WinMart, Co.op, Bách Hóa Xanh...</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tọa Độ Định Vị GPS</span>
          <div className="text-2xl font-black text-amber-600 font-['Outfit']">GeoJSON 2dsphere</div>
          <p className="text-[11px] text-slate-500">Độ trễ tính khoảng cách &lt; 5ms</p>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tích Hợp Người Dùng</span>
          <div className="text-2xl font-black text-rose-600 font-['Outfit']">1-Click Chỉ Đường</div>
          <p className="text-[11px] text-slate-500">Đồng bộ giỏ hàng & Google Maps</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên chi nhánh, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Brand filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {POPULAR_BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedBrand === brand
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STORES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">STT</th>
                <th className="py-3.5 px-4">Tên Siêu Thị & Thương Hiệu</th>
                <th className="py-3.5 px-4">Địa Chỉ Chi Nhánh</th>
                <th className="py-3.5 px-4">Tọa Độ GPS</th>
                <th className="py-3.5 px-4">Giờ Hoạt Động & Hotline</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RotateCw className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <span>Đang tải danh sách điểm bán siêu thị...</span>
                  </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 space-y-1">
                    <Store className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-600">Không tìm thấy siêu thị phù hợp</p>
                    <p className="text-[11px]">Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Thêm Siêu Thị Mới".</p>
                  </td>
                </tr>
              ) : (
                filteredStores.map((store, index) => (
                  <tr key={store.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 font-bold">{index + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0 border border-indigo-100">
                          {store.brand?.slice(0, 2).toUpperCase() || 'ST'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{store.name}</h4>
                          <span className="text-[10px] px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 font-semibold inline-block mt-0.5">
                            {store.brand}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-start gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{store.address}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <div>Lat: {store.latitude}</div>
                      <div>Lng: {store.longitude}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{store.openHours || '06:30 - 22:00'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{store.phone || '1900 1908'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Chỉ đường Google Maps */}
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Mở Google Maps dẫn đường"
                        >
                          <Navigation className="w-4 h-4" />
                        </a>
                        {/* Sửa */}
                        <button
                          onClick={() => handleOpenEdit(store)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* Xóa */}
                        <button
                          onClick={() => handleDelete(store)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa siêu thị này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / CHỈNH SỬA SIÊU THỊ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <span>{editingStore ? 'Chỉnh Sửa Điểm Bán Siêu Thị' : 'Thêm Mới Điểm Bán Siêu Thị'}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tên Chi Nhánh Siêu Thị *</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: WinMart+ Nguyễn Thị Minh Khai"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Chuỗi Thương Hiệu</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="WinMart">WinMart</option>
                    <option value="Co.opmart">Co.opmart</option>
                    <option value="Bách Hóa Xanh">Bách Hóa Xanh</option>
                    <option value="Lotte Mart">Lotte Mart</option>
                    <option value="Aeon Mall">Aeon Mall</option>
                    <option value="Tops Market">Tops Market</option>
                    <option value="Annam Gourmet">Annam Gourmet</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hotline / Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="1900 1908"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Địa Chỉ Chi Tiết *</label>
                <input
                  type="text"
                  required
                  placeholder="Vd: 123 Nguyễn Thị Minh Khai, P. Bến Thành, Quận 1, TP.HCM"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vĩ Độ (Latitude) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="10.7769"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kinh Độ (Longitude) *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="106.6909"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Giờ Hoạt Động</label>
                <input
                  type="text"
                  placeholder="06:30 - 22:00"
                  value={formData.openHours}
                  onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  {isSubmitting ? 'Đang lưu...' : editingStore ? 'Cập Nhật' : 'Thêm Siêu Thị'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
