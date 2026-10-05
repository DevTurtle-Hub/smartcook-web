import React, { useState } from 'react';
import {
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Flame,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  Filter,
  Eye,
  Check,
  X,
  Sparkles,
  Smartphone,
  Info,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';

export const RecipeManagementPage: React.FC = () => {
  const {
    pendingContributions,
    approveContribution,
    rejectContribution,
    heroBanner,
    updateHeroBanner,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'banner'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // System master recipes
  const [systemRecipes, setSystemRecipes] = useState([
    {
      id: 'rec-1',
      title: 'Bò Bít Tết Sốt Tiêu Đen & Măng Tây Áp Chảo',
      category: 'Món Âu',
      cookingTimeMinutes: 25,
      calories: 540,
      difficulty: 'Trung bình',
      servings: 2,
      rating: 4.9,
      ratingsCount: 142,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      macro: { p: 45, c: 12, f: 34 },
    },
    {
      id: 'rec-2',
      title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
      category: 'Eat Clean / Healthy',
      cookingTimeMinutes: 15,
      calories: 290,
      difficulty: 'Dễ',
      servings: 2,
      rating: 4.8,
      ratingsCount: 89,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=500&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      macro: { p: 42, c: 8, f: 10 },
    },
    {
      id: 'rec-3',
      title: 'Canh Chua Cá Hồi Miền Tây Nam Bộ',
      category: 'Món Việt',
      cookingTimeMinutes: 30,
      calories: 320,
      difficulty: 'Dễ',
      servings: 4,
      rating: 4.9,
      ratingsCount: 65,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      macro: { p: 28, c: 15, f: 16 },
    },
    {
      id: 'rec-4',
      title: 'Thịt Kho Tàu Nước Dừa Trứng Cút',
      category: 'Món Việt',
      cookingTimeMinutes: 45,
      calories: 520,
      difficulty: 'Trung bình',
      servings: 4,
      rating: 4.7,
      ratingsCount: 110,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
      author: 'SmartCook MasterChef',
      macro: { p: 32, c: 12, f: 38 },
    },
  ]);

  // Form State for new Recipe
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [newRecipeCategory, setNewRecipeCategory] = useState('Món Việt');
  const [newRecipeTime, setNewRecipeTime] = useState(20);
  const [newRecipeCalo, setNewRecipeCalo] = useState(350);
  const [newRecipeProtein, setNewRecipeProtein] = useState(30);
  const [newRecipeCarbs, setNewRecipeCarbs] = useState(25);
  const [newRecipeFat, setNewRecipeFat] = useState(15);
  const [newRecipeImage, setNewRecipeImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500');

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeTitle) return;

    const newObj = {
      id: `rec-${Date.now()}`,
      title: newRecipeTitle,
      category: newRecipeCategory,
      cookingTimeMinutes: Number(newRecipeTime),
      calories: Number(newRecipeCalo),
      difficulty: 'Dễ' as const,
      servings: 2,
      rating: 5.0,
      ratingsCount: 1,
      status: 'published',
      image: newRecipeImage,
      author: 'SmartCook MasterChef (System)',
      macro: { p: Number(newRecipeProtein), c: Number(newRecipeCarbs), f: Number(newRecipeFat) },
    };

    setSystemRecipes([newObj, ...systemRecipes]);
    setShowCreateModal(false);
    setNewRecipeTitle('');
    alert('Đã thêm công thức chuẩn hệ thống thành công!');
  };

  const filteredRecipes = systemRecipes.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Tất cả' || r.category.includes(selectedCategory);
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">Quản Lý Công Thức Nấu Ăn</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cơ sở dữ liệu công thức chuẩn, duyệt đóng góp từ cộng đồng và cấu hình banner ứng dụng di động.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-md shadow-indigo-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Công Thức Chuẩn MasterChef</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tất cả công thức ({systemRecipes.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Duyệt người dùng đóng góp</span>
          {pendingContributions.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingContributions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'banner'
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Cấu hình Banner Mobile</span>
        </button>
      </div>

      {/* ================= TAB 1: ALL RECIPES ================= */}
      {activeTab === 'all' && (
        <div className="space-y-5">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo tên món, nguyên liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Categories filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {['Tất cả', 'Món Việt', 'Món Âu', 'Eat Clean / Healthy'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Compact Grid bo nhẹ rounded-2xl, đẹp mắt */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRecipes.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-[11px] font-bold text-white">
                      {item.category}
                    </div>
                    <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-xl bg-white/95 text-[11px] font-bold text-amber-600 flex items-center gap-1 shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-base text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Tác giả: {item.author}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-xs text-slate-600 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{item.cookingTimeMinutes} phút</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>{item.calories} kcal</span>
                      </div>
                    </div>

                    {/* Macro nutrition bar */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>P: <strong className="text-slate-800">{item.macro.p}g</strong></span>
                      <span>C: <strong className="text-slate-800">{item.macro.c}g</strong></span>
                      <span>F: <strong className="text-slate-800">{item.macro.f}g</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Đã xuất bản
                  </span>
                  <button
                    onClick={() => {
                      updateHeroBanner({
                        title: item.title,
                        imageUrl: item.image,
                        prepTime: `${item.cookingTimeMinutes} phút`,
                        calories: `${item.calories} kcal`,
                        locationTag: item.category,
                      });
                      alert(`Đã ghim "${item.title}" lên Banner Mobile thành công!`);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Ghim lên Banner Mobile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: DUYỆT ĐÓNG GÓP NGƯỜI DÙNG ================= */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-3xl flex items-center gap-3 text-xs text-amber-800">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Công thức do người dùng tạo từ tính năng <strong>Wizard Creator</strong> trên Mobile App sẽ được xếp vào hàng đợi kiểm duyệt chất lượng trước khi phát hành công khai.
            </span>
          </div>

          {pendingContributions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200/80">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Không có công thức nào chờ duyệt!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tất cả bài đóng góp từ người dùng đã được xử lý hoàn tất.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {pendingContributions.map((contrib) => (
                <div
                  key={contrib.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full">
                      <img
                        src={contrib.image}
                        alt={contrib.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                        Chờ duyệt
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[10px] text-white">
                        {contrib.submittedAt}
                      </span>
                    </div>

                    <div className="p-4 space-y-2.5">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                        {contrib.title}
                      </h4>
                      <div className="text-[11px] text-slate-500">
                        Đăng bởi:{' '}
                        <strong className="text-slate-800">{contrib.authorName}</strong> ({contrib.authorEmail})
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold pt-1">
                        <span>⏱ {contrib.cookingTimeMinutes} phút</span>
                        <span>🔥 {contrib.calories} kcal</span>
                        <span>🥗 {contrib.ingredientsCount} nguyên liệu</span>
                      </div>

                      {contrib.status === 'rejected' && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700">
                          <strong>Lý do từ chối:</strong> {contrib.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {contrib.status === 'pending' && (
                    <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          approveContribution(contrib.id);
                          alert(`Đã duyệt công thức "${contrib.title}" thành công!`);
                        }}
                        className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Phê Duyệt</span>
                      </button>
                      <button
                        onClick={() => setRejectModalId(contrib.id)}
                        className="py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Từ Chối</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: CẤU HÌNH BANNER HERO MOBILE ================= */}
      {activeTab === 'banner' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                Cấu Hình Banner Hero Slider Trên Mobile
              </h3>
              <p className="text-xs text-slate-400">
                Món ăn này sẽ tự động chạy ở vị trí đắc địa nhất trang chủ Mobile App SmartCook.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
              Đang hoạt động trên App
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Live Preview Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
              <img
                src={heroBanner.imageUrl}
                alt={heroBanner.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800">
                {heroBanner.badge}
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-orange-300 font-bold">{heroBanner.locationTag}</span>
                <h4 className="text-lg font-bold font-['Outfit'] mt-1">{heroBanner.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">{heroBanner.subtitle}</p>
                <div className="flex items-center gap-3 mt-3 text-xs font-bold">
                  <span className="px-2.5 py-1 bg-white/20 rounded-lg backdrop-blur-md">{heroBanner.prepTime}</span>
                  <span className="px-2.5 py-1 bg-white/20 rounded-lg backdrop-blur-md">{heroBanner.calories}</span>
                  <span className="px-2.5 py-1 bg-white/20 rounded-lg backdrop-blur-md">{heroBanner.servings}</span>
                </div>
              </div>
            </div>

            {/* Edit Banner Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề Hero Banner</label>
                <input
                  type="text"
                  value={heroBanner.title}
                  onChange={(e) => updateHeroBanner({ title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả ngắn gọn</label>
                <input
                  type="text"
                  value={heroBanner.subtitle}
                  onChange={(e) => updateHeroBanner({ subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thời gian nấu</label>
                  <input
                    type="text"
                    value={heroBanner.prepTime}
                    onChange={(e) => updateHeroBanner({ prepTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mức Calo</label>
                  <input
                    type="text"
                    value={heroBanner.calories}
                    onChange={(e) => updateHeroBanner({ calories: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Link Ảnh Bìa (URL)</label>
                <input
                  type="text"
                  value={heroBanner.imageUrl}
                  onChange={(e) => updateHeroBanner({ imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                onClick={() => alert('Đã lưu và đồng bộ Hero Banner sang Mobile App thành công!')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Lưu Thay Đổi & Đồng Bộ Mobile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TỪ CHỐI CÔNG THỨC ================= */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Từ Chối Công Thức Đóng Góp</h3>
            <p className="text-xs text-slate-500">
              Nhập lý do từ chối để gửi thông báo phản hồi lại cho tác giả công thức trên ứng dụng.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="VD: Hình ảnh mờ, thiếu định lượng gia vị cụ thể, vi phạm bản quyền..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setRejectModalId(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (rejectionReason.trim()) {
                    rejectContribution(rejectModalId, rejectionReason);
                    setRejectModalId(null);
                    setRejectionReason('');
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM CÔNG THỨC CHUẨN ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Thêm Công Thức Chuẩn MasterChef
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecipe} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên Món Ăn</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cá Hồi Áp Chảo Sốt Chanh Dây..."
                  value={newRecipeTitle}
                  onChange={(e) => setNewRecipeTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Danh Mục</label>
                  <select
                    value={newRecipeCategory}
                    onChange={(e) => setNewRecipeCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Món Việt">Món Việt</option>
                    <option value="Món Âu">Món Âu</option>
                    <option value="Eat Clean / Healthy">Eat Clean / Healthy</option>
                    <option value="Món Chay">Món Chay</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Thời Gian Nấu (phút)</label>
                  <input
                    type="number"
                    value={newRecipeTime}
                    onChange={(e) => setNewRecipeTime(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Nutrition Macros */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Bảng Dinh Dưỡng Chi Tiết</span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block">Calo (kcal)</label>
                    <input
                      type="number"
                      value={newRecipeCalo}
                      onChange={(e) => setNewRecipeCalo(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block">Protein (g)</label>
                    <input
                      type="number"
                      value={newRecipeProtein}
                      onChange={(e) => setNewRecipeProtein(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block">Carbs (g)</label>
                    <input
                      type="number"
                      value={newRecipeCarbs}
                      onChange={(e) => setNewRecipeCarbs(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold block">Fat (g)</label>
                    <input
                      type="number"
                      value={newRecipeFat}
                      onChange={(e) => setNewRecipeFat(Number(e.target.value))}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ảnh Món Ăn (URL)</label>
                <input
                  type="text"
                  value={newRecipeImage}
                  onChange={(e) => setNewRecipeImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Tạo Công Thức
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
