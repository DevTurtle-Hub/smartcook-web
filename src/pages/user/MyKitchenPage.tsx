import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Refrigerator,
  Sparkles,
  Search,
  Plus,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  Flame,
  Clock,
  ChevronRight,
  Filter,
  Layers,
  RotateCcw,
  ChefHat,
  MapPin
} from 'lucide-react';
import { UserHeader } from '../../components/user/UserHeader';
import { richFallbackRecipes, type ExtendedRecipe } from '../public/RecipeListPage';
import { NearbySupermarketsModal } from '../../components/supermarket/NearbySupermarketsModal';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { fridgeApi, type FridgeItemDTO } from '../../api/fridge.api';
import { resolveRecipeImage, handleImageError } from '../../utils/imageFallback';
import { toast } from '../../context/ToastContext';
import { AuthRequiredModal } from '../../components/common/AuthRequiredModal';
import { PreviewModeBanner } from '../../components/common/PreviewModeBanner';

// Danh sách các danh mục nguyên liệu thông dụng trong căn bếp Việt
const INGREDIENT_CATEGORIES = [
  {
    name: 'Thịt & Hải sản',
    icon: '🥩',
    items: ['Thịt gà', 'Ức gà', 'Đùi gà', 'Thịt heo', 'Thịt bò', 'Sườn non', 'Tôm tươi', 'Cá hồi', 'Trứng gà', 'Trứng cút']
  },
  {
    name: 'Rau củ & Quả',
    icon: '🥦',
    items: ['Cà chua', 'Cà chua bi', 'Quả bơ sáp', 'Cà rốt', 'Hành tây', 'Hành lá', 'Tỏi', 'Gừng', 'Ớt', 'Măng tây', 'Nấm kim châm', 'Xà lách']
  },
  {
    name: 'Gia vị & Tinh bột',
    icon: '🧂',
    items: ['Cơm trắng', 'Gạo thơm', 'Bún tươi', 'Nước dừa', 'Mật ong', 'Bơ lạt', 'Nước mắm', 'Xì dầu', 'Tiêu đen', 'Sốt teriyaki']
  }
];

// Bản đồ ánh xạ nguyên liệu cho các món trong richFallbackRecipes
const RECIPE_INGREDIENT_DATABASE: Record<string, string[]> = {
  'seed-chicken-rice': ['thịt gà', 'đùi gà', 'trứng gà', 'trứng', 'cơm trắng', 'bơ sáp', 'cà chua bi', 'cà chua', 'mật ong', 'tỏi'],
  'seed-1': ['thịt heo', 'thịt ba chỉ', 'trứng cút', 'trứng', 'nước dừa', 'hành tím', 'nước mắm', 'tiêu đen'],
  'seed-2': ['cá hồi', 'cà chua', 'dứa', 'dọc mùng', 'giá đỗ', 'me', 'hành lá', 'ớt'],
  'seed-3': ['ức gà', 'thịt gà', 'bơ lạt', 'tỏi', 'mật ong', 'tiêu đen', 'rau xà lách'],
  'seed-4': ['thịt bò', 'măng tây', 'tiêu đen', 'bơ lạt', 'tỏi', 'rượu vang'],
  'seed-5': ['sườn non', 'thịt heo', 'cà chua', 'hành tây', 'tỏi', 'giấm bỗng', 'ớt'],
  'seed-6': ['cá hồi', 'bơ sáp', 'rau xà lách', 'cà chua bi', 'cà chua', 'dầu giấm', 'hành tây'],
  'seed-7': ['thịt bò', 'bánh phở', 'hành lá', 'gừng', 'hành tây', 'quế hồi', 'ớt'],
  'seed-8': ['tôm tươi', 'bơ lạt', 'tỏi', 'chanh vàng', 'tiêu đen', 'hành lá']
};

export const MyKitchenPage: React.FC = () => {
  // Nguyên liệu người dùng đã chọn / có trong tủ
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Thịt gà',
    'Trứng gà',
    'Cà chua bi',
    'Cơm trắng'
  ]);
  const [fridgeItems, setFridgeItems] = useState<FridgeItemDTO[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'missing1_2'>('all');
  const [isSupermarketModalOpen, setIsSupermarketModalOpen] = useState(false);
  const [modalMissingIngredients, setModalMissingIngredients] = useState<{ name: string }[]>([]);

  const { addItem, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState<boolean>(!isAuthenticated);

  // Nạp dữ liệu tủ lạnh từ Backend MongoDB (nếu đã đăng nhập)
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    const fetchFridge = async () => {
      try {
        const items = await fridgeApi.getMyFridge();
        if (isMounted && items && items.length > 0) {
          setFridgeItems(items);
          setSelectedIngredients(items.map((it) => it.name));
        }
      } catch (err) {
        console.warn('[SmartCook Web] Failed to fetch fridge items:', err);
      }
    };
    fetchFridge();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Chuẩn hóa chuỗi nguyên liệu
  const normalize = (str: string) =>
    str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Thêm nguyên liệu từ input
  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedIngredients.some((ing) => normalize(ing) === normalize(trimmed))) {
      setSelectedIngredients((prev) => [...prev, trimmed]);
      setCustomInput('');
      toast.success(`Đã thêm "${trimmed}" vào tủ lạnh!`);
      try {
        const updatedList = await fridgeApi.addItem({ name: trimmed, storageLocation: 'chilled' });
        setFridgeItems(updatedList);
      } catch (err) {
        console.warn('Failed to sync added fridge item:', err);
      }
    } else {
      setCustomInput('');
      toast.info(`"${trimmed}" đã có trong danh sách nguyên liệu.`);
    }
  };

  // Toggle chọn nguyên liệu
  const toggleIngredient = async (name: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (selectedIngredients.some((ing) => normalize(ing) === normalize(name))) {
      setSelectedIngredients((prev) => prev.filter((ing) => normalize(ing) !== normalize(name)));
      toast.info(`Đã gỡ "${name}" khỏi tủ lạnh.`);
      const found = fridgeItems.find((it) => normalize(it.name) === normalize(name));
      const itemId = found?._id || found?.id;
      if (itemId) {
        try {
          const updatedList = await fridgeApi.removeItem(itemId);
          setFridgeItems(updatedList);
        } catch (err) {
          console.warn('Failed to remove fridge item from backend:', err);
        }
      }
    } else {
      setSelectedIngredients((prev) => [...prev, name]);
      toast.success(`Đã thêm "${name}" vào tủ lạnh!`);
      try {
        const updatedList = await fridgeApi.addItem({ name, storageLocation: 'chilled' });
        setFridgeItems(updatedList);
      } catch (err) {
        console.warn('Failed to sync added fridge item:', err);
      }
    }
  };

  // Xóa toàn bộ
  const handleClearAll = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (selectedIngredients.length === 0) return;
    setSelectedIngredients([]);
    setFridgeItems([]);
    toast.warning('Đã làm trống danh sách nguyên liệu trong tủ lạnh.');
    try {
      await fridgeApi.clearFridge();
    } catch (err) {
      console.warn('Failed to clear fridge in backend:', err);
    }
  };

  // Tính toán kết quả so khớp món ăn với nguyên liệu người dùng đang có
  const matchedRecipes = useMemo(() => {
    const userIngNormalized = selectedIngredients.map((i) => normalize(i));

    return richFallbackRecipes.map((recipe) => {
      const requiredList = RECIPE_INGREDIENT_DATABASE[recipe._id] || [];
      const totalRequired = requiredList.length;

      if (totalRequired === 0) {
        return {
          recipe,
          matchCount: 0,
          totalCount: 0,
          matchPercent: 0,
          missingList: [],
          matchedList: [],
          isReadyToCook: false,
          missingCount: 0
        };
      }

      const matchedList: string[] = [];
      const missingList: string[] = [];

      requiredList.forEach((req) => {
        const isMatched = userIngNormalized.some((userIng) =>
          userIng.includes(req) || req.includes(userIng)
        );
        if (isMatched) {
          matchedList.push(req);
        } else {
          missingList.push(req);
        }
      });

      const matchPercent = Math.round((matchedList.length / totalRequired) * 100);
      const missingCount = missingList.length;
      const isReadyToCook = missingCount === 0;

      return {
        recipe,
        matchCount: matchedList.length,
        totalCount: totalRequired,
        matchPercent,
        missingList,
        matchedList,
        isReadyToCook,
        missingCount
      };
    }).sort((a, b) => {
      // Ưu tiên món 100% trước, sau đó là món thiếu ít nguyên liệu nhất
      if (a.isReadyToCook && !b.isReadyToCook) return -1;
      if (!a.isReadyToCook && b.isReadyToCook) return 1;
      return a.missingCount - b.missingCount;
    });
  }, [selectedIngredients]);

  // Bộ lọc theo tab
  const displayedRecipes = useMemo(() => {
    if (filterTab === 'ready') {
      return matchedRecipes.filter((r) => r.isReadyToCook);
    }
    if (filterTab === 'missing1_2') {
      return matchedRecipes.filter((r) => !r.isReadyToCook && r.missingCount <= 2);
    }
    return matchedRecipes;
  }, [matchedRecipes, filterTab]);

  // Thêm các nguyên liệu thiếu vào giỏ đi chợ
  const handleAddMissingToCart = (recipe: ExtendedRecipe, missing: string[]) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    missing.forEach((item) => {
      addItem({
        recipeId: recipe._id,
        recipeTitle: recipe.title,
        recipeImage: recipe.image,
        name: item.charAt(0).toUpperCase() + item.slice(1),
        amount: 1,
        unit: 'phần',
        price: 15000
      });
    });
    toast.success(`Đã thêm ${missing.length} món thiếu vào Giỏ Đi Chợ!`, {
      title: 'Giỏ Hàng',
      action: {
        label: 'Xem giỏ hàng',
        onClick: () => openCart()
      }
    });
    openCart();
  };

  // Mở modal siêu thị với các nguyên liệu thiếu
  const handleFindSupermarket = (missing: string[]) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setModalMissingIngredients(missing.map((m) => ({ name: m.charAt(0).toUpperCase() + m.slice(1) })));
    setIsSupermarketModalOpen(true);
  };

  const readyCount = matchedRecipes.filter((r) => r.isReadyToCook).length;
  const missingFewCount = matchedRecipes.filter((r) => !r.isReadyToCook && r.missingCount <= 2).length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      <UserHeader />

      {/* Banner xem trước nếu chưa đăng nhập */}
      <PreviewModeBanner
        featureName="Tủ Lạnh Thông Minh"
        onOpenAuthModal={() => setShowAuthModal(true)}
        redirectPath="/my-kitchen"
      />

      {/* AMBIENT BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[8%] left-[10%] w-[550px] h-[550px] bg-orange-300/15 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] right-[5%] w-[600px] h-[600px] bg-amber-200/15 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 sm:pt-8 space-y-8">
        
        {/* 1. HERO SECTION MỞ THOÁNG ĐÃNG - HÒA QUYỆN HOÀN TOÀN CÙNG NỀN TRANG WEB */}
        <section className="relative pt-2 pb-4 lg:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* CỘT TRÁI (7 cols): TYPOGRAPHY & GIỚI THIỆU PHONG CÁCH TRANG CHỦ */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/90 text-orange-700 text-xs font-black tracking-wide uppercase shadow-2xs">
                <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
                <span>Module 06 • Trợ Lý Tủ Lạnh & Bếp Của Tôi</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-heading text-slate-900 leading-[1.14]">
                Tôi Có Gì Trong Tủ Lạnh? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  AI Gợi Ý Bữa Cơm Ngay Lập Tức
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Tick chọn hoặc nhập các nguyên liệu bạn đang có sẵn tại nhà. SmartCook tự động phân tích và xếp hạng các món nấu được <strong>100%</strong> hoặc chỉ thiếu 1-2 gia vị nhỏ để bạn nhanh chóng đi chợ.
              </p>

              {/* Chỉ số nhanh nổi bật */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-bold text-slate-600">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-emerald-200 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Nấu được ngay: <strong className="text-emerald-700 font-black">{readyCount}</strong> món</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-amber-200 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Chỉ thiếu 1-2 món: <strong className="text-amber-700 font-black">{missingFewCount}</strong> món</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-orange-200 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span>Đã chọn: <strong className="text-orange-600 font-black">{selectedIngredients.length}</strong> nguyên liệu</span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (5 cols): ẢNH MÓN ĂN VÀ CÁC NGUYÊN LIỆU GIA VỊ BAY ĐẸP MẮT TRONG SUỐT HÒA VÀO NỀN */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg group">
                
                {/* Glow nền mờ nhẹ nhàng ấm áp */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-300/30 via-amber-200/30 to-orange-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

                {/* Ảnh món ăn có gia vị bay lơ lửng, trong suốt 100%, hòa tan tự nhiên vào trang web */}
                <div className="relative overflow-visible flex items-center justify-center">
                  <img
                    src="/culinary_dish_transparent.png"
                    alt="Món ăn ngon và các loại gia vị bay lơ lửng nghệ thuật"
                    className="w-full max-h-[520px] object-contain scale-100 group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_20px_35px_rgba(0,0,0,0.08)] select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. KHU VỰC TƯƠNG TÁC: CHỌN NGUYÊN LIỆU (PANEL ĐIỀU KHIỂN BẾP) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* CỘT TRÁI: BỘ CHỌN & NHẬP NGUYÊN LIỆU (5/12 CỘT) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-orange-200/80 p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Header của tủ lạnh */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
                    <Refrigerator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading">
                      Nguyên Liệu Trong Bếp
                    </h2>
                    <p className="text-xs text-slate-500">
                      Đang chọn <strong className="text-orange-600 font-bold">{selectedIngredients.length}</strong> nguyên liệu
                    </p>
                  </div>
                </div>

                {selectedIngredients.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm mới</span>
                  </button>
                )}
              </div>

              {/* Ô nhập nguyên liệu tự do */}
              <form onSubmit={handleAddCustom} className="relative">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                    }
                  }}
                  readOnly={!isAuthenticated}
                  placeholder={isAuthenticated ? "Nhập tên nguyên liệu (vd: thịt bò, nấm, ớt chuông...)" : "Đăng nhập để thêm nguyên liệu vào tủ lạnh..."}
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-inner cursor-pointer"
                />
                <button
                  type="submit"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                      setShowAuthModal(true);
                    }
                  }}
                  disabled={isAuthenticated && !customInput.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
                  title="Thêm nguyên liệu"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </form>

              {/* Danh sách các nguyên liệu ĐANG CHỌN (Tags) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Nguyên liệu bạn đã có:</span>
                  <span className="text-orange-600">{selectedIngredients.length} món</span>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[46px] p-3 rounded-2xl bg-orange-50/50 border border-orange-100/80">
                  {selectedIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-orange-200/80 text-orange-800 text-xs font-bold shadow-2xs group animate-in zoom-in-95 duration-150"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => toggleIngredient(ing)}
                        className="p-0.5 rounded-md hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </span>
                  ))}

                  {selectedIngredients.length === 0 && (
                    <div className="w-full py-2 text-center text-xs text-slate-400 italic">
                      Chưa chọn nguyên liệu nào. Nhấp vào các gợi ý bên dưới hoặc tự nhập thêm.
                    </div>
                  )}
                </div>
              </div>

              {/* Các danh mục gợi ý chọn nhanh theo nhóm */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block">
                  Chọn nhanh các nguyên liệu phổ biến:
                </span>

                <div className="space-y-3">
                  {INGREDIENT_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item) => {
                          const isSelected = selectedIngredients.some(
                            (i) => normalize(i) === normalize(item)
                          );
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleIngredient(item)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border ${
                                isSelected
                                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs scale-102'
                                  : 'bg-white hover:bg-orange-50/60 text-slate-700 border-slate-200/80 hover:border-orange-300'
                              }`}
                            >
                              {isSelected ? `✓ ${item}` : `+ ${item}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ GỢI Ý MÓN ĂN (7/12 CỘT) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Thanh Tab Chuyển Đổi & Lọc */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-orange-200/80 p-2 sm:p-2.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                    filterTab === 'all'
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'text-slate-600 hover:bg-orange-50'
                  }`}
                >
                  Tất cả gợi ý ({matchedRecipes.length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterTab('ready')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    filterTab === 'ready'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Nấu được ngay ({readyCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterTab('missing1_2')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                    filterTab === 'missing1_2'
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Chỉ thiếu 1-2 món ({missingFewCount})</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-semibold px-2">
                Sắp xếp theo <span className="text-orange-600 font-bold">% Khớp</span>
              </div>
            </div>

            {/* DANH SÁCH MÓN ĂN GỢI Ý */}
            <div className="space-y-4">
              {displayedRecipes.map(({ recipe, matchPercent, isReadyToCook, missingList, matchedList, missingCount }) => {
                return (
                  <div
                    key={recipe._id}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-md ${
                      isReadyToCook
                        ? 'border-emerald-300 ring-1 ring-emerald-500/20'
                        : missingCount <= 2
                        ? 'border-orange-200 hover:border-orange-300'
                        : 'border-slate-200/80 opacity-90'
                    }`}
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start">
                      
                      {/* Ảnh món ăn */}
                      <div className="relative w-full sm:w-36 h-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 shadow-inner group">
                        <img
                          src={resolveRecipeImage(recipe.image, recipe.title || recipe.category)}
                          alt={recipe.title}
                          onError={(e) => handleImageError(e, resolveRecipeImage(null, recipe.title || recipe.category))}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        {/* % Match Badge */}
                        <div
                          className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl text-[11px] font-black shadow-md flex items-center gap-1 ${
                            isReadyToCook
                              ? 'bg-emerald-500 text-white'
                              : matchPercent >= 60
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-800/80 text-white'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{matchPercent}% Khớp</span>
                        </div>
                      </div>

                      {/* Thông tin chi tiết */}
                      <div className="flex-1 min-w-0 space-y-2.5 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-orange-100/70 text-orange-700 tracking-wider">
                              {recipe.category} • {recipe.cookingTimeMinutes} phút
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900 hover:text-orange-600 transition-colors mt-1 font-heading">
                              <Link to={`/recipes/${recipe._id}`}>{recipe.title}</Link>
                            </h3>
                          </div>

                          {/* Trạng thái nấu */}
                          {isReadyToCook ? (
                            <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>100% Đủ nguyên liệu</span>
                            </span>
                          ) : (
                            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Thiếu {missingCount} món</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {recipe.description}
                        </p>

                        {/* Breakdown nguyên liệu có và thiếu */}
                        <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                          {matchedList.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-emerald-700 font-bold">Đã có:</span>
                              {matchedList.map((m, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                                  ✓ {m}
                                </span>
                              ))}
                            </div>
                          )}

                          {missingList.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap mt-1">
                              <span className="text-rose-600 font-bold">Cần mua:</span>
                              {missingList.map((m, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold">
                                  + {m}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Hàng hành động */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                          <Link
                            to={`/recipes/${recipe._id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            <span>Xem cách nấu chi tiết</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="flex items-center gap-2">
                            {/* Nếu thiếu nguyên liệu: Có nút Thêm vào giỏ & Tìm siêu thị gần nhất */}
                            {missingList.length > 0 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleAddMissingToCart(recipe, missingList)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 transition-colors"
                                  title="Thêm các món còn thiếu vào giỏ đi chợ"
                                >
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                  <span>Thêm món thiếu ({missingCount})</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleFindSupermarket(missingList)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                                  title="Tìm siêu thị gần nhất có bán món này"
                                >
                                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                                  <span>Tìm siêu thị</span>
                                </button>
                              </>
                            )}

                            {isReadyToCook && (
                              <Link
                                to={`/recipes/${recipe._id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                              >
                                <ChefHat className="w-3.5 h-3.5" />
                                <span>Vào Bếp Nấu Ngay</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

              {displayedRecipes.length === 0 && (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <Refrigerator className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800">
                    Không tìm thấy món ăn phù hợp với bộ lọc hiện tại
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Hãy thử thêm các nguyên liệu phổ biến như thịt gà, trứng gà, cơm trắng, cà chua để hệ thống gợi ý nhiều món hơn.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* MODAL BẢN ĐỒ TÌM SIÊU THỊ NẾU USER CẦN ĐI MUA NGUYÊN LIỆU THIẾU */}
      <NearbySupermarketsModal
        isOpen={isSupermarketModalOpen}
        onClose={() => setIsSupermarketModalOpen(false)}
        neededIngredients={modalMissingIngredients}
      />

      {/* Modal yêu cầu đăng nhập khi khách thao tác tính năng tủ lạnh */}
      <AuthRequiredModal
        isOpen={showAuthModal && !isAuthenticated}
        onClose={() => setShowAuthModal(false)}
        featureType="fridge"
        redirectPath="/my-kitchen"
      />
    </div>
  );
};
