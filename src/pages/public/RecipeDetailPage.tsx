import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Flame,
  Users,
  Heart,
  Share2,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Utensils,
  ChevronRight,
  Timer,
  Check,
  Plus,
  ShoppingCart,
  ShoppingBag,
  Info,
  CheckCheck,
  MapPin
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '../../api/recipe.api';
import type { Recipe } from '../../types';
import { UserHeader } from '../../components/user/UserHeader';
import { richFallbackRecipes, type ExtendedRecipe } from './RecipeListPage';
import { useCartStore } from '../../store/useCartStore';
import { resolveRecipeImage, handleImageError } from '../../utils/imageFallback';
import { useAuthStore } from '../../store/useAuthStore';
import { cookingHistoryApi } from '../../api/cookingHistory.api';
import { NearbySupermarketsModal } from '../../components/supermarket/NearbySupermarketsModal';
import { toast } from '../../context/ToastContext';

// Bản đồ giá tiền ước tính mẫu cho các nguyên liệu phổ biến tại Việt Nam
const INGREDIENT_PRICE_MAP: Record<string, number> = {
  'đùi gà góc tư (phi lê)': 32000,
  'đùi gà': 30000,
  'thịt gà': 35000,
  'ức gà': 28000,
  'trứng gà tươi': 4000,
  'trứng gà': 4000,
  'trứng': 4000,
  'cơm trắng dẻo': 5000,
  'cơm trắng': 5000,
  'bơ sáp chín': 15000,
  'bơ sáp': 15000,
  'cà chua bi & ngò': 8000,
  'cà chua bi': 8000,
  'cà chua': 6000,
  'sốt mật ong tỏi': 6000,
  'sốt mật ong': 6000,
  'thịt thăn bò': 65000,
  'thịt bò': 60000,
  'sườn non': 55000,
  'tôm sú tươi': 45000,
  'cá hồi': 70000,
  'nấm kim châm': 12000,
  'rau xà lách': 7000,
  'hành lá & mùi': 4000,
};

const getIngredientEstimatedPrice = (name?: string): number => {
  if (!name) return 12000;
  const normalized = name.toLowerCase().trim();
  for (const [key, val] of Object.entries(INGREDIENT_PRICE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return val;
    }
  }
  return 12000; // Giá ước tính trung bình mặc định
};

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [completedNotice, setCompletedNotice] = useState<string | null>(null);
  const [isSubmittingCooking, setIsSubmittingCooking] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { updateUser } = useAuthStore();

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isCookingMode, setIsCookingMode] = useState(false);
  
  const cookingStepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSec.toString().padStart(2, '0')}`;
  };

  const { data: recipeData } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => recipeApi.getRecipeById(id!),
    enabled: !!id && !id.startsWith('seed-'),
  });

  const fallbackMatch = richFallbackRecipes.find((r) => r._id === id);

  const defaultRecipe: ExtendedRecipe = {
    _id: id || 'seed-chicken-rice',
    title: 'Cơm Đùi Gà Trứng Ốp',
    description: 'Đùi gà rim sốt mật ong đậm đà ăn kèm trứng ốp la lòng đào béo ngậy, bơ sáp và cà chua bi thanh mát. Nhanh gọn, giàu protein và cân đối vi chất.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&q=80',
    category: 'Tiện lợi',
    cookingTimeMinutes: 12,
    difficulty: 'Nhanh gọn',
    servingsCount: 1,
    nutrition: {
      calories: 450,
      proteinGrams: 35,
      carbsGrams: 42,
      fatGrams: 16,
    },
    ingredients: [
      { name: 'Đùi gà góc tư (phi lê)', amount: 250, unit: 'g', notes: 'Khía nhẹ để ngấm sốt' },
      { name: 'Trứng gà tươi', amount: 1, unit: 'quả', notes: 'Ốp la lòng đào' },
      { name: 'Cơm trắng dẻo', amount: 1, unit: 'bát', notes: 'Nóng hổi' },
      { name: 'Bơ sáp chín', amount: 0.5, unit: 'quả', notes: 'Thái lát mỏng' },
      { name: 'Cà chua bi & ngò', amount: 5, unit: 'quả', notes: 'Ăn kèm thanh mát' },
      { name: 'Sốt mật ong tỏi', amount: 2, unit: 'thìa', notes: 'Gia vị vừa ăn' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Ướp đùi gà phi lê với 2 thìa sốt mật ong tỏi, một chút tiêu đen trong khoảng 5 phút cho ngấm đều.',
        timerMinutes: 5,
      },
      {
        stepNumber: 2,
        instruction: 'Làm nóng chảo chống dính với một chút dầu ăn, áp chảo đùi gà vàng ruộm hai mặt ở lửa vừa (mỗi mặt khoảng 4 - 5 phút).',
        timerMinutes: 8,
      },
      {
        stepNumber: 3,
        instruction: 'Ốp la 1 quả trứng gà sao cho lòng trắng chín giòn rìa, lòng đào sánh ngậy thơm béo.',
        timerMinutes: 2,
      },
      {
        stepNumber: 4,
        instruction: 'Xới cơm nóng ra đĩa tròn, xếp thịt gà thái lát, đặt trứng ốp la lên trên. Thêm bơ sáp thái mỏng, cà chua bi và rưới nước sốt gà óng ả lên bề mặt.',
      },
    ],
    ratingAverage: 5.0,
    ratingsCount: 528,
    createdAt: new Date().toISOString(),
    badgeType: 'hot',
    badgeLabel: 'HOT',
    quickNote: 'Nhanh gọn',
  };

  const rawRecipe = (recipeData as any) || fallbackMatch || defaultRecipe;

  const recipe: ExtendedRecipe = {
    ...defaultRecipe,
    ...rawRecipe,
    _id: rawRecipe?._id || rawRecipe?.id || defaultRecipe._id,
    title: rawRecipe?.title || defaultRecipe.title,
    description: rawRecipe?.description || defaultRecipe.description,
    image: rawRecipe?.image || defaultRecipe.image,
    category: rawRecipe?.category || rawRecipe?.categoryCode || defaultRecipe.category,
    cookingTimeMinutes: rawRecipe?.cookingTimeMinutes || rawRecipe?.minutes || defaultRecipe.cookingTimeMinutes,
    difficulty: rawRecipe?.difficulty || defaultRecipe.difficulty,
    servingsCount: rawRecipe?.servingsCount || (typeof rawRecipe?.servings === 'number' ? rawRecipe.servings : parseInt(rawRecipe?.servings) || defaultRecipe.servingsCount),
    ratingAverage: rawRecipe?.ratingAverage || rawRecipe?.rating || defaultRecipe.ratingAverage,
    ratingsCount: rawRecipe?.ratingsCount || rawRecipe?.reviewCount || defaultRecipe.ratingsCount,
    nutrition: {
      calories: rawRecipe?.nutrition?.calories ?? defaultRecipe.nutrition.calories,
      proteinGrams: rawRecipe?.nutrition?.proteinGrams ?? (parseInt(rawRecipe?.nutrition?.protein) || defaultRecipe.nutrition.proteinGrams),
      carbsGrams: rawRecipe?.nutrition?.carbsGrams ?? (parseInt(rawRecipe?.nutrition?.carbs) || defaultRecipe.nutrition.carbsGrams),
      fatGrams: rawRecipe?.nutrition?.fatGrams ?? (parseInt(rawRecipe?.nutrition?.fat) || defaultRecipe.nutrition.fatGrams),
    },
    ingredients: Array.isArray(rawRecipe?.ingredients) && rawRecipe.ingredients.length > 0
      ? rawRecipe.ingredients
      : defaultRecipe.ingredients,
    steps: Array.isArray(rawRecipe?.steps) && rawRecipe.steps.length > 0
      ? rawRecipe.steps
      : defaultRecipe.steps,
  };

  const displayIngredients = (recipe.ingredients || []).map((ing: any) => {
    const ingName = ing?.name || ing?.ingredientName || 'Nguyên liệu';
    return {
      name: ingName,
      amount: ing?.amount ?? '',
      unit: ing?.unit ?? '',
      price: getIngredientEstimatedPrice(ingName),
      notes: ing?.notes || '',
    };
  });

  const displaySteps = (recipe.steps || []).map((step: any, idx: number) => ({
    stepNumber: step?.stepNumber ?? idx + 1,
    instruction: step?.instruction || step?.description || '',
    title: step?.title || `Bước ${step?.stepNumber ?? idx + 1}`,
    timerMinutes: step?.timerMinutes || 0,
    tip: step?.tip || '',
  }));

  // Tính tổng chi phí ban đầu và chi phí còn lại sau khi tick bỏ những thứ đã có sẵn
  const totalOriginalCost = displayIngredients.reduce((sum, ing) => sum + ing.price, 0);
  const remainingCost = displayIngredients
    .filter((ing) => !checkedIngredients[ing.name])
    .reduce((sum, ing) => sum + ing.price, 0);
  const checkedItemsCount = displayIngredients.filter((ing) => checkedIngredients[ing.name]).length;

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleToggleFavorite = async () => {
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    if (nextState) {
      toast.success('Đã thêm món ăn vào danh sách yêu thích!');
    } else {
      toast.info('Đã gỡ món ăn khỏi danh sách yêu thích.');
    }
    if (recipe._id && !recipe._id.startsWith('seed-')) {
      try {
        await recipeApi.toggleFavorite(recipe._id);
      } catch (err) {
        console.warn('Failed to toggle favorite in backend:', err);
      }
    }
  };

  const handleCompleteCooking = async () => {
    setIsSubmittingCooking(true);
    try {
      const cookTime = recipe.cookingTimeMinutes || (recipe as any).cookTime || 20;
      const res = await cookingHistoryApi.completeCookingSession(recipe._id, recipe.title, cookTime);
      if (res?.user) {
        updateUser({
          chefExp: res.user.chefExp,
          level: res.user.level,
        });
      }
      toast.success('🎉 Chúc mừng! Bạn đã hoàn thành nấu món ăn và nhận được +50 XP thưởng đầu bếp!', {
        title: 'Nấu Ăn Hoàn Thành'
      });
      setCompletedNotice('🎉 Chúc mừng! Bạn đã hoàn thành nấu món ăn và nhận được +50 XP thưởng đầu bếp!');
      setTimeout(() => setCompletedNotice(null), 6000);
    } catch (err) {
      console.warn('Could not record cooking session:', err);
      toast.error('Không thể lưu lịch sử nấu ăn. Vui lòng thử lại sau.');
    } finally {
      setIsSubmittingCooking(false);
    }
  };

  const handleAddToCart = (ing: { name: string; amount: number; unit: string; price: number; notes?: string }) => {
    addItem({
      recipeId: recipe._id,
      recipeTitle: recipe.title,
      recipeImage: recipe.image,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      price: ing.price,
      notes: ing.notes,
    });
    toast.success(`Đã thêm "${ing.name}" vào giỏ đi chợ!`, {
      action: {
        label: 'Xem giỏ hàng',
        onClick: () => openCart()
      }
    });
    setAddedNotice(`Đã thêm "${ing.name}" vào giỏ đi chợ!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  const handleAddAllRemainingToCart = () => {
    const unChecked = displayIngredients.filter((ing) => !checkedIngredients[ing.name]);
    if (unChecked.length === 0) return;

    unChecked.forEach((ing) => {
      addItem({
        recipeId: recipe._id,
        recipeTitle: recipe.title,
        recipeImage: recipe.image,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        price: ing.price,
        notes: ing.notes,
      });
    });
    toast.success(`Đã thêm ${unChecked.length} nguyên liệu cần mua vào giỏ!`, {
      action: {
        label: 'Mở giỏ hàng',
        onClick: () => openCart()
      }
    });
    setAddedNotice(`Đã thêm ${unChecked.length} nguyên liệu cần mua vào giỏ!`);
    setTimeout(() => setAddedNotice(null), 3000);
    openCart();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép liên kết công thức món ăn vào khay nhớ tạm!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStartCooking = () => {
    setIsCookingMode(true);
    if (displaySteps[0]?.timerMinutes) {
      setTimerSeconds(displaySteps[0].timerMinutes * 60);
      setIsTimerRunning(true);
    }
    setActiveStepIndex(0);
    cookingStepsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      <UserHeader />

      {/* Trang trí ambient mờ nhẹ nhàng */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] right-[5%] w-[500px] h-[500px] bg-orange-300/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-amber-300/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 space-y-6">
        
        {/* Navigation bar tinh gọn */}
        <div className="flex items-center justify-between">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kho công thức</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800">{recipe.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60 shadow-2xs'
              }`}
              title="Lưu yêu thích"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60 shadow-2xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{copied ? 'Đã sao chép' : 'Chia sẻ'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BỐ CỤC 2 CỘT HIỆN ĐẠI, GỌN GÀNG, HẠN CHẾ KHUNG HỘP DÀY CỘP */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ==================== CỘT TRÁI (3.8 cols / max-w-[340px]): CARD MÓN ĂN NHỎ GỌN ==================== */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col items-center lg:items-start lg:sticky lg:top-24">
            
            {/* THẺ CARD MẪU TINH GỌN (THIẾT KẾ Y HỆT ẢNH CHỤP) */}
            <div className="w-full max-w-[320px] bg-white rounded-[26px] p-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col justify-between group">
              
              {/* Ảnh món ăn bo góc tròn mềm mại */}
              <div className="relative w-full aspect-square rounded-[20px] overflow-hidden bg-slate-100">
                <img
                  src={resolveRecipeImage(recipe.image, recipe.title || recipe.category)}
                  alt={recipe.title}
                  onError={(e) => handleImageError(e, resolveRecipeImage(null, recipe.title || recipe.category))}
                  className="w-full h-full object-cover select-none"
                />

                {/* Badge HOT / POPULAR */}
                {recipe.badgeLabel && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-md bg-gradient-to-r ${recipe.badgeGradient || (recipe.badgeType === 'popular' ? 'from-rose-500 to-orange-500' : 'from-orange-500 to-amber-500')}`}>
                      <Flame className="w-3 h-3 fill-white text-white" />
                      <span>{recipe.badgeLabel}</span>
                    </span>
                  </div>
                )}

                {/* Nút Trái tim trắng bo tròn ở góc trên phải */}
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                >
                  <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
                </button>
              </div>

              {/* Thông tin thẻ card */}
              <div className="pt-3 px-1 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  {/* Dòng 1: Icon mặt trứng 🍳 + Thời gian nấu */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                    <span className="text-sm">🍳</span>
                    <span>{recipe.cookingTimeMinutes} phút</span>
                    <span className="text-orange-400 font-normal">•</span>
                    <span>{recipe.quickNote || recipe.difficulty || 'Nhanh gọn'}</span>
                  </div>

                  {/* Dòng 2: Tên món ăn in đậm rõ ràng */}
                  <h2 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug line-clamp-1 mt-1 font-heading">
                    {recipe.title}
                  </h2>
                </div>

                {/* Dòng 3: Category & Nút Xem chi tiết */}
                <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400 truncate max-w-[85px]">
                    {recipe.category} • ...
                  </span>

                  <div className="px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold flex items-center gap-1 shadow-2xs">
                    <span>Xem chi tiết</span>
                    <span className="text-xs">→</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Stats Tối Giản Nằm Ngay Dưới Card (Không đóng khung hộp) */}
            <div className="w-full max-w-[320px] flex items-center justify-between pt-4 px-2 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <strong className="text-slate-800">{recipe.nutrition.calories}</strong> kcal
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <strong className="text-slate-800">{recipe.servingsCount}</strong> người
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <strong className="text-slate-800">{recipe.cookingTimeMinutes}</strong>p
              </span>
            </div>

          </div>

          {/* ==================== CỘT PHẢI (8.2 cols): PHẦN MÔ TẢ THOÁNG ĐÃNG, NGUYÊN LIỆU & BƯỚC NẤU ==================== */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-7">
            
            {/* 1. TIÊU ĐỀ & MÔ TẢ TỰ NHIÊN (HÒA NỀN, KHÔNG ĐÓNG KHUNG HỘP) */}
            <div className="space-y-3 pb-5 border-b border-orange-200/50">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  {recipe.category}
                </span>
                <span>•</span>
                <span className="text-slate-500">Độ khó: {recipe.difficulty}</span>
                <span>•</span>
                <span className="text-amber-500 flex items-center gap-0.5">
                  ★ {recipe.ratingAverage} <span className="text-slate-400 font-normal">({recipe.ratingsCount})</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading tracking-tight leading-snug">
                {recipe.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
                {recipe.description}
              </p>

              {/* Tỉ lệ Macro Tối Giản Nằm Liền Mạch */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Đạm (Protein)</span>
                  <span className="font-bold text-slate-800 text-sm">{recipe.nutrition.proteinGrams}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tinh bột (Carbs)</span>
                  <span className="font-bold text-slate-800 text-sm">{recipe.nutrition.carbsGrams}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Chất béo (Fat)</span>
                  <span className="font-bold text-slate-800 text-sm">{recipe.nutrition.fatGrams}g</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Năng lượng</span>
                  <span className="font-bold text-orange-600 text-sm">{recipe.nutrition.calories} kcal</span>
                </div>
              </div>
            </div>

            {/* 2. NGUYÊN LIỆU CẦN CÓ & DỰ TOÁN ĐI CHỢ LINH HOẠT */}
            <div className="space-y-3.5">
              
              {/* Header phần nguyên liệu & Thông báo realtime khi thêm vào giỏ */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading flex items-center gap-2">
                    <span>Nguyên Liệu Cần Có</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                      {displayIngredients.length} món
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tick chọn nguyên liệu bạn <strong className="text-emerald-700 font-bold">đã có sẵn ở nhà</strong> để giảm tiền ước tính đi chợ
                  </p>
                </div>

                {/* Thông báo mini khi bấm thêm vào giỏ */}
                {addedNotice && (
                  <div className="animate-in fade-in slide-in-from-top-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20">
                    <CheckCheck className="w-4 h-4" />
                    <span>{addedNotice}</span>
                  </div>
                )}
              </div>

              {/* THANH THỐNG KÊ CHI PHÍ ĐI CHỢ ƯỚC TÍNH (THAY ĐỔI THEO TICK CHỌN) */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">Ước tính chi phí đi chợ:</span>
                      {checkedItemsCount > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          Đã trừ {checkedItemsCount} món có sẵn
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-xl sm:text-2xl font-black text-orange-600 font-heading">
                        {remainingCost.toLocaleString('vi-VN')} đ
                      </span>
                      {checkedItemsCount > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          {totalOriginalCost.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nhóm các nút hành động: Thêm vào giỏ & Tìm siêu thị */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-orange-700 text-xs font-extrabold shadow-2xs hover:shadow-xs transition-all active:scale-95 shrink-0"
                    title="Tìm 5 siêu thị hoặc cửa hàng thực phẩm gần nhất"
                  >
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>Tìm 5 siêu thị gần nhất</span>
                  </button>

                  {/* Nút thêm nhanh tất cả nguyên liệu còn thiếu vào giỏ */}
                  <button
                    type="button"
                    onClick={handleAddAllRemainingToCart}
                    disabled={displayIngredients.every((ing) => checkedIngredients[ing.name])}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold shadow-sm shadow-orange-600/20 hover:shadow-md transition-all active:scale-95 shrink-0"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm nguyên liệu cần mua ({displayIngredients.length - checkedItemsCount})</span>
                  </button>
                </div>
              </div>

              {/* LƯỚI DANH SÁCH NGUYÊN LIỆU VỚI NÚT TICK VÀ NÚT THÊM VÀO GIỎ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayIngredients.map((ing, idx) => {
                  const isChecked = !!checkedIngredients[ing.name];
                  return (
                    <div
                      key={idx}
                      className={`group relative flex items-center justify-between p-3 rounded-2xl transition-all duration-200 border ${
                        isChecked
                          ? 'bg-slate-50/80 border-slate-200/50 text-slate-400'
                          : 'bg-white hover:bg-orange-50/30 border-slate-200/80 hover:border-orange-200 text-slate-800 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      {/* Bấm vào tên để tick chọn (Đã có sẵn -> Giảm giá) */}
                      <div
                        onClick={() => toggleIngredientCheck(ing.name)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                              : 'border-slate-300 bg-white group-hover:border-orange-400'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="flex flex-col min-w-0 pr-2">
                          <span
                            className={`text-xs sm:text-sm font-bold truncate ${
                              isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {ing.name}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span>{ing.amount} {ing.unit}</span>
                            <span>•</span>
                            <span className={isChecked ? 'line-through text-slate-300' : 'text-amber-600 font-semibold'}>
                              ~{ing.price.toLocaleString('vi-VN')} đ
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* NÚT THÊM RIÊNG TỪNG NGUYÊN LIỆU VÀO GIỎ HÀNG */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(ing);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isChecked
                              ? 'bg-slate-100 hover:bg-orange-100 text-slate-500 hover:text-orange-700'
                              : 'bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white border border-orange-200/70 hover:border-orange-500 shadow-2xs'
                          }`}
                          title={`Thêm ${ing.name} vào giỏ đi chợ`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden min-[420px]:inline">Giỏ</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. CÔNG THỨC CÁC BƯỚC NẤU (TIMELINE ĐƠN GIẢN, HIỆN ĐẠI, KHÔNG VIỀN HỘP) */}
            <div ref={cookingStepsRef} className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                  Các Bước Nấu ({displaySteps.length} bước)
                </h3>

                {/* Mini Timer Gọn Gàng */}
                <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono">
                  <Timer className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-bold text-orange-400">{formatTimer(timerSeconds)}</span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-1 rounded bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(300); }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Timeline Các Bước Nấu */}
              <div className="space-y-3">
                {displaySteps.map((step, idx) => {
                  const isActive = activeStepIndex === idx && isCookingMode;
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`p-3.5 sm:p-4 rounded-2xl transition-all flex items-start gap-3.5 ${
                        isActive
                          ? 'bg-orange-100/60 border border-orange-300 shadow-xs'
                          : 'bg-white border border-slate-200/60 hover:border-orange-200 shadow-2xs'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {step.stepNumber}
                      </span>

                      <div className="flex-1 space-y-1.5">
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                          {step.instruction}
                        </p>

                        {step.timerMinutes && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimerSeconds(step.timerMinutes! * 60);
                              setIsTimerRunning(true);
                              setActiveStepIndex(idx);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md hover:bg-orange-100 transition-colors"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Hẹn giờ {step.timerMinutes} phút</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. CÁC NÚT ĐIỀU KHIỂN NẤU VÀ HOÀN THÀNH (+50 XP) */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartCooking}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
              >
                <Utensils className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>BẮT ĐẦU NẤU NGAY</span>
                <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleCompleteCooking}
                disabled={isSubmittingCooking}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <CheckCheck className="w-4 h-4 text-white" />
                <span>{isSubmittingCooking ? 'Đang ghi nhận...' : 'Đã Nấu Xong (+50 XP)'}</span>
              </button>
            </div>

            {completedNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2 animate-bounce">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{completedNotice}</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MODAL BẢN ĐỒ TÌM 5 SIÊU THỊ GẦN NHẤT */}
      <NearbySupermarketsModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        neededIngredients={displayIngredients
          .filter((ing) => !checkedIngredients[ing.name])
          .map((ing) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit,
          }))}
      />
    </div>
  );
};
