import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Tag,
  Trash2,
  Edit,
  Eye,
  X,
  Check,
  Package,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Clock,
  Filter,
  ArrowUpDown,
  BookOpen,
  ChevronRight,
  Flame,
  Utensils,
  Smartphone,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { SystemIngredient } from '../../types/admin';

// Dữ liệu món ăn liên quan với từng nguyên liệu để xem chi tiết
interface RelatedDish {
  id: string;
  name: string;
  category: string;
  cookingTime: string;
  calories: string;
  image: string;
  author: string;
}

const SAMPLE_RELATED_DISHES: Record<string, RelatedDish[]> = {
  'ing-1': [
    {
      id: 'd-1',
      name: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
      category: 'Eat Clean / Healthy',
      cookingTime: '15 phút',
      calories: '290 kcal',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
    },
    {
      id: 'd-2',
      name: 'Gà Hấp Lá Chanh Truyền Thống',
      category: 'Món Việt',
      cookingTime: '30 phút',
      calories: '340 kcal',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80',
      author: 'Đầu Bếp Minh Tuấn',
    },
    {
      id: 'd-3',
      name: 'Cơm Đùi Gà Nướng Mật Ong Xốt Cay',
      category: 'Món Nhanh',
      cookingTime: '25 phút',
      calories: '510 kcal',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      author: 'Chef Linh Đan',
    },
  ],
  'ing-2': [
    {
      id: 'd-4',
      name: 'Bò Bít Tết Sốt Tiêu Đen & Măng Tây Áp Chảo',
      category: 'Món Âu',
      cookingTime: '25 phút',
      calories: '540 kcal',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
      author: 'MasterChef Quốc Tế',
    },
    {
      id: 'd-5',
      name: 'Phở Bò Tái Lăn Hà Nội',
      category: 'Món Việt',
      cookingTime: '45 phút',
      calories: '480 kcal',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80',
      author: 'SmartCook Kitchen',
    },
  ],
  'ing-3': [
    {
      id: 'd-6',
      name: 'Canh Thịt Bò Hầm Rau Củ Cà Rốt',
      category: 'Món Canh Gia Đình',
      cookingTime: '35 phút',
      calories: '280 kcal',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=80',
      author: 'SmartCook Chef',
    },
    {
      id: 'd-7',
      name: 'Salad Cà Rốt Bắp Cải Tím Sốt Mè',
      category: 'Healthy',
      cookingTime: '10 phút',
      calories: '160 kcal',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
      author: 'Trần Thảo Linh',
    },
  ],
  'ing-4': [
    {
      id: 'd-8',
      name: 'Tôm Sú Hấp Nước Dừa Xiêm',
      category: 'Món Việt',
      cookingTime: '15 phút',
      calories: '210 kcal',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
    },
  ],
  'ing-5': [
    {
      id: 'd-9',
      name: 'Thịt Kho Tàu Nước Dừa Trứng Cút & Trứng Gà',
      category: 'Món Việt',
      cookingTime: '45 phút',
      calories: '520 kcal',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
    },
    {
      id: 'd-10',
      name: 'Salad Bơ Trứng Eat Clean Giảm Mỡ',
      category: 'Healthy / Eat Clean',
      cookingTime: '12 phút',
      calories: '270 kcal',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
      author: 'Trần Thảo Linh',
    },
  ],
};

export const IngredientManagementPage: React.FC = () => {
  const {
    ingredientGroups,
    ingredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addIngredientSynonym,
    removeIngredientSynonym,
  } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'inStock' | 'shelfLife'>('inStock');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Inline alias text entry
  const [activeIngredientForSynonym, setActiveIngredientForSynonym] = useState<string | null>(null);
  const [newSynonymText, setNewSynonymText] = useState('');

  // Modal Thêm / Chỉnh sửa nguyên liệu (CRUD)
  const [showModal, setShowModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<SystemIngredient | null>(null);
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🥗');
  const [formGroupId, setFormGroupId] = useState('grp-1');
  const [formUnit, setFormUnit] = useState('gram');
  const [formShelfLife, setFormShelfLife] = useState(7);
  const [formSynonyms, setFormSynonyms] = useState('');

  // Modal Xem chi tiết nguyên liệu & các món ăn liên quan
  const [viewingDetail, setViewingDetail] = useState<SystemIngredient | null>(null);

  // Modal xác nhận xóa
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);

  // Thống kê nhanh theo phong cách Dashboard
  const stats = useMemo(() => {
    const totalIngredients = ingredients.length;
    const totalInStock = ingredients.reduce((sum, item) => sum + item.inStockUsersCount, 0);
    const avgShelfLife = Math.round(
      ingredients.reduce((sum, item) => sum + item.shelfLifeDays, 0) / (totalIngredients || 1)
    );
    const totalSynonyms = ingredients.reduce((sum, item) => sum + item.synonyms.length, 0);

    return { totalIngredients, totalInStock, avgShelfLife, totalSynonyms };
  }, [ingredients]);

  // Bộ lọc & sắp xếp danh sách
  const filteredIngredients = useMemo(() => {
    return ingredients
      .filter((ing) => {
        const query = searchQuery.toLowerCase().trim();
        const matchSearch =
          !query ||
          ing.name.toLowerCase().includes(query) ||
          ing.synonyms.some((s) => s.toLowerCase().includes(query));
        const matchGroup = selectedGroupId === 'all' || ing.groupId === selectedGroupId;
        return matchSearch && matchGroup;
      })
      .sort((a, b) => {
        let valA = a.name as string | number;
        let valB = b.name as string | number;

        if (sortBy === 'inStock') {
          valA = a.inStockUsersCount;
          valB = b.inStockUsersCount;
        } else if (sortBy === 'shelfLife') {
          valA = a.shelfLifeDays;
          valB = b.shelfLifeDays;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [ingredients, searchQuery, selectedGroupId, sortBy, sortOrder]);

  const handleOpenCreateModal = () => {
    setEditingIngredient(null);
    setFormName('');
    setFormIcon('🥦');
    setFormGroupId(ingredientGroups[0]?.id || 'grp-1');
    setFormUnit('gram');
    setFormShelfLife(5);
    setFormSynonyms('');
    setShowModal(true);
  };

  const handleOpenEditModal = (item: SystemIngredient) => {
    setEditingIngredient(item);
    setFormName(item.name);
    setFormIcon(item.icon);
    setFormGroupId(item.groupId);
    setFormUnit(item.unit);
    setFormShelfLife(item.shelfLifeDays);
    setFormSynonyms(item.synonyms.join(', '));
    setShowModal(true);
  };

  const handleSaveIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const synList = formSynonyms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingIngredient) {
      updateIngredient(editingIngredient.id, {
        name: formName.trim(),
        icon: formIcon.trim() || '🥗',
        groupId: formGroupId,
        unit: formUnit.trim() || 'gram',
        shelfLifeDays: Number(formShelfLife) || 1,
        synonyms: synList.length > 0 ? synList : editingIngredient.synonyms,
      });
    } else {
      addIngredient({
        name: formName.trim(),
        icon: formIcon.trim() || '🥗',
        groupId: formGroupId,
        unit: formUnit.trim() || 'gram',
        shelfLifeDays: Number(formShelfLife) || 1,
        synonyms: synList.length > 0 ? synList : [formName.trim().toLowerCase()],
      });
    }
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (deleteModalId) {
      deleteIngredient(deleteModalId);
      setDeleteModalId(null);
    }
  };

  const handleAddSynonymInline = (ingredientId: string) => {
    if (!newSynonymText.trim()) return;
    addIngredientSynonym(ingredientId, newSynonymText.trim());
    setNewSynonymText('');
  };

  const getGroupName = (gid: string) => {
    return ingredientGroups.find((g) => g.id === gid)?.name || 'Khác';
  };

  return (
    <div className="space-y-4">


      {/* ================= THANH ĐIỀU KHIỂN & LỌC THEO NHÓM (KHUNG CHỮ NHẬT GỌN GÀNG) ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Row 1: Search + Thêm mới + Sắp xếp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm tên nguyên liệu, alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Nhóm nút Action & Sort */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
              <span className="text-[11px] text-slate-400 px-1">Sắp xếp:</span>
              <button
                onClick={() => setSortBy('inStock')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sortBy === 'inStock' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Lưu tủ
              </button>
              <button
                onClick={() => setSortBy('shelfLife')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sortBy === 'shelfLife' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Hạn dùng
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sortBy === 'name' ? 'bg-white text-indigo-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Tên A-Z
              </button>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-slate-400 hover:text-indigo-600"
                title="Đảo chiều sắp xếp"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Nút Thêm Nguyên Liệu */}
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Nguyên Liệu</span>
            </button>
          </div>
        </div>

        {/* Row 2: Pills Chọn Nhóm Nguyên Liệu */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-1 border-t border-slate-100">
          <button
            onClick={() => setSelectedGroupId('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedGroupId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <span>Tất cả</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-current">
              {ingredients.length}
            </span>
          </button>

          {ingredientGroups.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSelectedGroupId(grp.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedGroupId === grp.id
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{grp.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedGroupId === grp.id ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {grp.itemCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ================= BẢNG DỮ LIỆU TỐI GIẢN & CHUYÊN NGHIỆP ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Tên Nguyên Liệu</th>
                <th className="py-3 px-4">Nhóm Thực Phẩm</th>
                <th className="py-3 px-4">Đơn Vị Chuẩn</th>
                <th className="py-3 px-4">Hạn Bảo Quản Gợi Ý</th>
                <th className="py-3 px-5 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Không tìm thấy nguyên liệu nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredIngredients.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Cột 1: Tên Nguyên Liệu (không còn icon) */}
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm block">
                        {item.name}
                      </span>
                    </td>

                    {/* Cột 2: Nhóm Thực Phẩm */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {getGroupName(item.groupId)}
                      </span>
                    </td>

                    {/* Cột 3: Đơn Vị */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                      {item.unit}
                    </td>

                    {/* Cột 4: Hạn Bảo Quản Gợi Ý */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50/80 border border-emerald-200/50 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-600" />
                        ~{item.shelfLifeDays} ngày
                      </span>
                    </td>

                    {/* Cột 5: Thao Tác (Nút Xem Chi Tiết + Sửa + Xóa) */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút Xem Chi Tiết */}
                        <button
                          onClick={() => setViewingDetail(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white font-semibold text-xs transition-all active:scale-95"
                          title="Xem thông tin chi tiết & món ăn"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem chi tiết</span>
                        </button>

                        {/* Nút Sửa */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Nút Xóa */}
                        <button
                          onClick={() => setDeleteModalId(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa"
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
        <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
          <span>
            Đang hiển thị <strong>{filteredIngredients.length}</strong> / <strong>{ingredients.length}</strong> nguyên liệu
          </span>
          <span className="text-[11px] text-slate-400">
            SmartCook Taxonomy System
          </span>
        </div>
      </div>

      {/* ================= MODAL: XEM CHI TIẾT NGUYÊN LIỆU & CÁC MÓN ĂN LIÊN QUAN ================= */}
      {viewingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs text-2xl flex items-center justify-center">
                  {viewingDetail.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                      {viewingDetail.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {getGroupName(viewingDetail.groupId)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    HSD gợi ý: ~{viewingDetail.shelfLifeDays} ngày • Đang có trong tủ lạnh của{' '}
                    <strong className="text-slate-700 font-bold">{viewingDetail.inStockUsersCount.toLocaleString()}</strong> người dùng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Danh sách từ khóa alias */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Từ khóa nhận dạng (AI Synonyms):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingDetail.synonyms.map((syn, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      #{syn}
                    </span>
                  ))}
                </div>
              </div>

              {/* Danh sách các món ăn nấu từ nguyên liệu này */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-indigo-600" />
                    Các Món Ăn Tiêu Biểu Chế Biến Từ Nguyên Liệu Này
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {(SAMPLE_RELATED_DISHES[viewingDetail.id] || []).length} công thức sẵn có
                  </span>
                </div>

                <div className="space-y-2.5">
                  {(SAMPLE_RELATED_DISHES[viewingDetail.id] || []).length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                      Chưa liên kết công thức cụ thể với nguyên liệu này. Bạn có thể thêm vào từ mục Quản Lý Công Thức.
                    </div>
                  ) : (
                    (SAMPLE_RELATED_DISHES[viewingDetail.id] || []).map((dish) => (
                      <div
                        key={dish.id}
                        className="p-3 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-2xs"
                          />
                          <div>
                            <h5 className="font-bold text-xs text-slate-900 leading-snug">{dish.name}</h5>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                              <span className="text-indigo-600 font-semibold">{dish.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {dish.cookingTime}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-600">
                                <Flame className="w-3 h-3" /> {dish.calories}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">{dish.author}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM / SỬA NGUYÊN LIỆU (CRUD) ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                  {editingIngredient ? 'Chỉnh Sửa Nguyên Liệu' : 'Thêm Nguyên Liệu Mới'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIngredient} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Icon Emoji
                  </label>
                  <input
                    type="text"
                    required
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full text-center text-xl py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Tên nguyên liệu chuẩn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Thịt Heo Xay, Tôm Thẻ..."
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nhóm thực phẩm
                  </label>
                  <select
                    value={formGroupId}
                    onChange={(e) => setFormGroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium"
                  >
                    {ingredientGroups.map((grp) => (
                      <option key={grp.id} value={grp.id}>
                        {grp.icon} {grp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Đơn vị đo lường
                  </label>
                  <input
                    type="text"
                    placeholder="VD: gram, kg, quả, củ..."
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Hạn bảo quản trung bình trong tủ lạnh (Ngày)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formShelfLife}
                  onChange={(e) => setFormShelfLife(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Từ điển đồng nghĩa (Cách nhau bằng dấu phẩy)
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: thịt ba rọi, thịt ba chỉ, heo xay, nạc vai..."
                  value={formSynonyms}
                  onChange={(e) => setFormSynonyms(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
                />
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Thuật toán AI sẽ dùng các từ này để so khớp khi người dùng quét tủ lạnh hoặc gõ tìm kiếm.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  {editingIngredient ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: XÁC NHẬN XÓA ================= */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-slate-200 shadow-xl p-5 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 font-['Outfit']">Xóa nguyên liệu này?</h4>
              <p className="text-xs text-slate-400 mt-1">
                Nguyên liệu sẽ bị xóa khỏi taxonomy và thuật toán so khớp tủ lạnh. Thao tác này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-xs transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
