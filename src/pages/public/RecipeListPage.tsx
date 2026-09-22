import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  Flame, 
  Users, 
  ChefHat, 
  Heart, 
  Sparkles, 
  Zap, 
  Star, 
  TrendingUp, 
  Award, 
  ArrowRight,
  Utensils
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '../../api/recipe.api';
import type { Recipe } from '../../types';
import { UserHeader } from '../../components/user/UserHeader';
import { resolveRecipeImage, handleImageError } from '../../utils/imageFallback';

export interface ExtendedRecipe extends Recipe {
  badgeType?: 'hot' | 'popular' | 'trending' | 'chef_choice' | 'quick';
  badgeLabel?: string;
  badgeGradient?: string;
  quickNote?: string;
}

// Danh sách món ăn phong phú chuẩn ẩm thực, có món Cơm Đùi Gà Trứng Ốp giống ảnh mẫu 100%
export const richFallbackRecipes: ExtendedRecipe[] = [
  {
    _id: 'seed-chicken-rice',
    title: 'Cơm Đùi Gà Trứng Ốp',
    description: 'Đùi gà rim sốt mật ong đậm đà ăn kèm trứng ốp la lòng đào béo ngậy, bơ sáp và cà chua bi thanh mát.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80',
    category: 'Tiện lợi',
    cookingTimeMinutes: 12,
    difficulty: 'Nhanh gọn',
    servingsCount: 1,
    nutrition: { calories: 450, proteinGrams: 35, carbsGrams: 42, fatGrams: 16 },
    ingredients: [
      { name: 'Đùi gà góc tư hoặc phi lê', amount: 200, unit: 'g' },
      { name: 'Trứng gà', amount: 1, unit: 'quả' },
      { name: 'Cơm trắng', amount: 1, unit: 'bát' },
      { name: 'Quả bơ sáp & cà chua', amount: 1, unit: 'phần' },
      { name: 'Nước sốt teriyaki hoặc mật ong tỏi', amount: 2, unit: 'thìa' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Ướp đùi gà với nước sốt trong 5 phút.', timerMinutes: 5 },
      { stepNumber: 2, instruction: 'Áp chảo đùi gà vàng giòn 2 mặt, đồng thời ốp la trứng lòng đào.', timerMinutes: 7 },
      { stepNumber: 3, instruction: 'Bày cơm ra đĩa, xếp thịt gà thái lát, trứng ốp la, bơ và thưởng thức.', timerMinutes: 2 },
    ],
    ratingAverage: 5.0,
    ratingsCount: 528,
    createdAt: new Date().toISOString(),
    badgeType: 'hot',
    badgeLabel: 'HOT',
    badgeGradient: 'from-orange-500 to-amber-500',
    quickNote: 'Nhanh gọn',
  },
  {
    _id: 'seed-1',
    title: 'Thịt Kho Tàu Trứng Cút Nước Dừa',
    description: 'Thịt ba chỉ mềm rục ngấm trọn nước dừa xiêm Bến Tre, trứng cút bùi béo màu cánh gián tự nhiên.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&auto=format&fit=crop&q=80',
    category: 'Gia đình',
    cookingTimeMinutes: 45,
    difficulty: 'Chuẩn vị',
    servingsCount: 4,
    nutrition: { calories: 520, proteinGrams: 32, carbsGrams: 12, fatGrams: 38 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.9,
    ratingsCount: 328,
    createdAt: new Date().toISOString(),
    badgeType: 'popular',
    badgeLabel: 'POPULAR',
    badgeGradient: 'from-rose-500 to-orange-500',
    quickNote: 'Mâm cơm gia đình',
  },
  {
    _id: 'seed-2',
    title: 'Canh Chua Cá Hồi Miền Tây',
    description: 'Vị chua thanh mát của me và dứa kết hợp cá hồi giàu omega-3, dọc mùng giòn sần sật.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=700&auto=format&fit=crop&q=80',
    category: 'Món Việt',
    cookingTimeMinutes: 25,
    difficulty: 'Thanh mát',
    servingsCount: 4,
    nutrition: { calories: 310, proteinGrams: 28, carbsGrams: 14, fatGrams: 16 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.8,
    ratingsCount: 215,
    createdAt: new Date().toISOString(),
    badgeType: 'popular',
    badgeLabel: 'POPULAR',
    badgeGradient: 'from-rose-500 to-orange-500',
    quickNote: 'Thanh nhiệt',
  },
  {
    _id: 'seed-3',
    title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
    description: 'Món ăn chuẩn Healthy ít calo, ức gà mềm ngọt không bị khô, hòa quyện sốt bơ tỏi thơm lừng.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=700&auto=format&fit=crop&q=80',
    category: 'Healthy',
    cookingTimeMinutes: 15,
    difficulty: 'Dễ làm',
    servingsCount: 2,
    nutrition: { calories: 290, proteinGrams: 42, carbsGrams: 8, fatGrams: 10 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.9,
    ratingsCount: 340,
    createdAt: new Date().toISOString(),
    badgeType: 'hot',
    badgeLabel: 'HOT',
    badgeGradient: 'from-orange-500 to-amber-500',
    quickNote: 'Eat Clean',
  },
  {
    _id: 'seed-4',
    title: 'Bò Bít Tết Sốt Tiêu Đen Kiểu Pháp',
    description: 'Thịt thăn bò mềm mọng nước ăn kèm măng tây áp chảo và sốt tiêu đen cay nồng quý phái.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=700&auto=format&fit=crop&q=80',
    category: 'Nấu nhanh',
    cookingTimeMinutes: 20,
    difficulty: 'Cao cấp',
    servingsCount: 2,
    nutrition: { calories: 480, proteinGrams: 45, carbsGrams: 10, fatGrams: 28 },
    ingredients: [],
    steps: [],
    ratingAverage: 5.0,
    ratingsCount: 520,
    createdAt: new Date().toISOString(),
    badgeType: 'popular',
    badgeLabel: 'POPULAR',
    badgeGradient: 'from-rose-500 to-orange-500',
    quickNote: 'Bếp trưởng',
  },
  {
    _id: 'seed-5',
    title: 'Sườn Xào Chua Ngọt Bắc Bộ',
    description: 'Sườn non chặt khúc đảo vàng óng, nước sốt cà chua giấm bỗng chua ngọt sánh quyện đậm đà.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80',
    category: 'Gia đình',
    cookingTimeMinutes: 30,
    difficulty: 'Chuẩn vị',
    servingsCount: 4,
    nutrition: { calories: 490, proteinGrams: 35, carbsGrams: 18, fatGrams: 30 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.9,
    ratingsCount: 290,
    createdAt: new Date().toISOString(),
    badgeType: 'hot',
    badgeLabel: 'HOT',
    badgeGradient: 'from-orange-500 to-amber-500',
    quickNote: 'Đậm đà tốn cơm',
  },
  {
    _id: 'seed-6',
    title: 'Salad Cá Hồi Bơ Sáp Dầu Giấm',
    description: 'Rau xà lách rocket tươi giòn cùng bơ sáp béo ngậy và cá hồi hun khói giàu dưỡng chất.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop&q=80',
    category: 'Healthy',
    cookingTimeMinutes: 10,
    difficulty: 'Nhanh gọn',
    servingsCount: 2,
    nutrition: { calories: 260, proteinGrams: 24, carbsGrams: 12, fatGrams: 14 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.8,
    ratingsCount: 188,
    createdAt: new Date().toISOString(),
    badgeType: 'popular',
    badgeLabel: 'POPULAR',
    badgeGradient: 'from-rose-500 to-orange-500',
    quickNote: 'Giảm cân đẹp da',
  },
  {
    _id: 'seed-7',
    title: 'Phở Bò Tái Lăn Hà Nội',
    description: 'Nước dùng ninh xương 12 tiếng thơm quế hồi, thịt bò xào lăn lửa lớn dậy mùi tỏi gừng.',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=700&auto=format&fit=crop&q=80',
    category: 'Món Việt',
    cookingTimeMinutes: 50,
    difficulty: 'Cầu kỳ',
    servingsCount: 4,
    nutrition: { calories: 450, proteinGrams: 38, carbsGrams: 52, fatGrams: 12 },
    ingredients: [],
    steps: [],
    ratingAverage: 5.0,
    ratingsCount: 780,
    createdAt: new Date().toISOString(),
    badgeType: 'hot',
    badgeLabel: 'HOT',
    badgeGradient: 'from-orange-500 to-amber-500',
    quickNote: 'Tinh hoa Hà Nội',
  },
  {
    _id: 'seed-8',
    title: 'Tôm Sốt Bơ Tỏi Chanh Vàng',
    description: 'Tôm sú tươi giòn sốt ngập tràn bơ lạt Pháp, tỏi băm thơm phức và chút chanh thanh tao.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=700&auto=format&fit=crop&q=80',
    category: 'Tiện lợi',
    cookingTimeMinutes: 15,
    difficulty: 'Nhanh gọn',
    servingsCount: 3,
    nutrition: { calories: 340, proteinGrams: 36, carbsGrams: 6, fatGrams: 18 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.9,
    ratingsCount: 340,
    createdAt: new Date().toISOString(),
    badgeType: 'popular',
    badgeLabel: 'POPULAR',
    badgeGradient: 'from-rose-500 to-orange-500',
    quickNote: 'Tiệc nhanh',
  }
];

export const RecipeListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'hot' | 'popular'>('all');
  const [savedRecipes, setSavedRecipes] = useState<Record<string, boolean>>({});

  const categories = ['Tất cả', 'Tiện lợi', 'Gia đình', 'Món Việt', 'Healthy', 'Nấu nhanh'];

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', search, selectedCategory],
    queryFn: () =>
      recipeApi.getRecipes({
        search: search || undefined,
        category: selectedCategory === 'Tất cả' ? undefined : selectedCategory,
      }),
    retry: 1,
  });

  const baseRecipes = data?.recipes && data.recipes.length > 0 ? data.recipes : richFallbackRecipes;

  // Lọc theo từ khóa, danh mục, và nút bấm HOT / POPULAR
  const filteredRecipes = (baseRecipes as ExtendedRecipe[]).filter((recipe) => {
    const matchesSearch = 
      recipe.title.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Tất cả' || recipe.category === selectedCategory;
    const matchesBadge = 
      badgeFilter === 'all' || 
      (badgeFilter === 'hot' && recipe.badgeType === 'hot') ||
      (badgeFilter === 'popular' && recipe.badgeType === 'popular');

    return matchesSearch && matchesCat && matchesBadge;
  });

  const toggleFavorite = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedRecipes((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!id.startsWith('seed-')) {
      try {
        await recipeApi.toggleFavorite(id);
      } catch (err) {
        console.warn('Failed to toggle favorite in backend:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-28">
      {/* Header đồng bộ */}
      <UserHeader />

      {/* Trang trí ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] right-[5%] w-[600px] h-[600px] bg-orange-300/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-[15%] left-[5%] w-[700px] h-[700px] bg-amber-300/15 rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 space-y-8">
        
        {/* HERO HEADER MỞ THOÁNG ĐÃNG - TÍCH HỢP HÌNH ẢNH ĐẦU BẾP NẤU ĂN TRONG SUỐT HOÀN HẢO */}
        <section className="relative pt-2 pb-6 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* CỘT TRÁI (7 cols): NỘI DUNG, TYPOGRAPHY & TÌM KIẾM */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200/90 text-orange-700 text-xs font-black tracking-wide uppercase shadow-2xs">
                <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
                <span>Thực Đơn Thông Minh Cá Nhân Hóa Dành Riêng Cho Bạn</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight font-heading text-slate-900 leading-[1.12]">
                Khám Phá Món Ngon <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                  Chuẩn Vị Cơm Nhà Việt Nam
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                Hơn 500+ công thức đã được cân bằng calo và vi chất dinh dưỡng. Tự động đối chiếu theo thời gian thực với thực phẩm sẵn có trong tủ lạnh gia đình bạn.
              </p>

              {/* Thanh Tìm Kiếm Đẳng Cấp Nền Trắng Viền Cam Mờ */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto lg:mx-0">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm món ngon: Cơm đùi gà, thịt kho tàu, canh chua, cá hồi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base font-medium border border-orange-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <Link
                  to="/scan"
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>Quét Tủ Lạnh Tức Thì</span>
                </Link>
              </div>

              {/* Chỉ số nhanh & Cam kết chất lượng */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>100% Nguyên Liệu Sẵn Có</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.9/5 Điểm Đánh Giá</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Định Lượng Calo Chuẩn</span>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (5 cols): HÌNH ẢNH ĐẦU BẾP NẤU ĂN CHÂN THỰC TRONG SUỐT HÒA MÀU VÀO NỀN WEB */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-xl group">
                
                {/* Glow nền mờ nhẹ nhàng */}
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

                {/* Ảnh đầu bếp chân thật trong suốt 100%, hòa tan tự nhiên vào trang web */}
                <div className="relative overflow-visible flex items-center justify-center">
                  <img
                    src="/chef_transparent.png"
                    alt="Đầu bếp chuyên nghiệp SmartCook nấu ăn cùng nguyên liệu tươi ngon"
                    className="w-full max-h-[560px] object-contain scale-100 group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* THANH ĐIỀU HƯỚNG DANH MỤC & CÁC NÚT LỌC HOT, POPULAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 pb-4 border-b border-orange-200/60">
          
          {/* Category Filter Pills */}
          <div className="flex items-center flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm scale-105'
                    : 'bg-white text-slate-600 hover:text-orange-600 hover:bg-orange-50/60 border border-slate-200 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* CÁC NÚT BẤM (BTN) HOT VÀ POPULAR */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Phân loại:</span>
            
            {/* Nút Tất cả */}
            <button
              onClick={() => setBadgeFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                badgeFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tất cả
            </button>

            {/* Nút BTN HOT */}
            <button
              onClick={() => setBadgeFilter(badgeFilter === 'hot' ? 'all' : 'hot')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-200 shadow-sm ${
                badgeFilter === 'hot'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white ring-2 ring-orange-400 ring-offset-1 scale-105 shadow-orange-500/30'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>HOT</span>
            </button>

            {/* Nút BTN POPULAR */}
            <button
              onClick={() => setBadgeFilter(badgeFilter === 'popular' ? 'all' : 'popular')}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-200 shadow-sm ${
                badgeFilter === 'popular'
                  ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white ring-2 ring-rose-400 ring-offset-1 scale-105 shadow-rose-500/30'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>POPULAR</span>
            </button>
          </div>

        </div>

        {/* DANH SÁCH RECIPE CARDS - THIẾT KẾ CHUẨN 100% THEO ẢNH MẪU (FULL RỘNG 4-5 CỘT TRÊN MÀN HÌNH LỚN) */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <div key={n} className="bg-white rounded-[28px] p-3 shadow-sm border border-slate-100 animate-pulse space-y-3">
                <div className="w-full aspect-square bg-slate-200 rounded-2xl"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-5 bg-slate-200 rounded w-full"></div>
                <div className="h-8 bg-slate-100 rounded-xl w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
            {filteredRecipes.map((recipe) => {
              const isSaved = savedRecipes[recipe._id];
              return (
                <div
                  key={recipe._id}
                  className="group relative bg-white rounded-[28px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.12)] border border-slate-100/90 hover:border-orange-200 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  {/* PHẦN 1: ẢNH MÓN ĂN BO TRÒN GÓC (GIỐNG HÌNH MẪU) KÈM NÚT TIM & BADGE HOT/POPULAR */}
                  <div className="relative w-full aspect-square rounded-[22px] overflow-hidden bg-slate-100">
                    <img
                      src={resolveRecipeImage(recipe.image, recipe.title || recipe.category)}
                      alt={recipe.title}
                      onError={(e) => handleImageError(e, resolveRecipeImage(null, recipe.title || recipe.category))}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* BADGE HOT / POPULAR NẰM Ở GÓC TRÊN TRÁI ẢNH */}
                    {recipe.badgeLabel && (
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-md bg-gradient-to-r ${recipe.badgeGradient || 'from-orange-500 to-amber-500'}`}>
                          <Flame className="w-3 h-3 fill-white text-white" />
                          <span>{recipe.badgeLabel}</span>
                        </span>
                      </div>
                    )}

                    {/* NÚT TRÁI TIM YÊU THÍCH TRÒN MÀU TRẮNG Ở GÓC TRÊN PHẢI (CHUẨN THEO ẢNH MẪU) */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(e, recipe._id)}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 z-10"
                      title="Lưu yêu thích"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isSaved 
                            ? 'text-rose-500 fill-rose-500' 
                            : 'text-slate-400 group-hover:text-rose-500'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* PHẦN 2: THÔNG TIN MÓN ĂN DƯỚI ẢNH (CHUẨN 100% THEO ẢNH MẪU) */}
                  <div className="pt-3 px-1 flex-1 flex flex-col justify-between space-y-2.5">
                    
                    <div>
                      {/* DÒNG 1: ICON MẶT TRỨNG ỐP LA 🍳 + THỜI GIAN NẤU • NHANH GỌN */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600">
                        <span className="text-sm leading-none">🍳</span>
                        <span>{recipe.cookingTimeMinutes} phút</span>
                        <span className="text-orange-400 font-normal">•</span>
                        <span>{recipe.quickNote || recipe.difficulty || 'Nhanh gọn'}</span>
                      </div>

                      {/* DÒNG 2: TÊN MÓN ĂN IN ĐẬM RÕ RÀNG (VÍ DỤ: Cơm Đùi Gà Trứng Ốp) */}
                      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug line-clamp-1 mt-1 group-hover:text-orange-600 transition-colors font-heading">
                        {recipe.title}
                      </h3>
                    </div>

                    {/* DÒNG 3: CATEGORY VÀ NÚT 'Xem chi tiết ->' TRONG KHUNG BO VIỀN CAM NHẸ */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-400 truncate max-w-[85px] sm:max-w-[100px]">
                        {recipe.category} • ...
                      </span>

                      <Link
                        to={`/recipes/${recipe._id}`}
                        className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-500 border border-orange-200 hover:border-orange-500 text-orange-600 hover:text-white text-xs font-bold transition-all duration-200 flex items-center gap-1 shrink-0 shadow-2xs group/btn"
                      >
                        <span>Xem chi tiết</span>
                        <span className="text-xs transition-transform group-hover/btn:translate-x-0.5">→</span>
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* THÔNG BÁO KHI KHÔNG TÌM THẤY MÓN ĂN */}
        {filteredRecipes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-orange-100 shadow-sm max-w-xl mx-auto space-y-3">
            <ChefHat className="w-16 h-16 text-orange-300 mx-auto" />
            <h4 className="font-bold text-base text-slate-800">Không tìm thấy món ăn phù hợp</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy thử tìm kiếm với từ khóa khác (ví dụ: gà, cơm, trứng, thịt) hoặc bấm nút Tất cả.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('Tất cả'); setBadgeFilter('all'); }}
              className="mt-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md hover:bg-orange-600 transition-colors"
            >
              Xem tất cả món ăn
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
