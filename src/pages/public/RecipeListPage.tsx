import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Flame, Users, ChefHat } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '../../api/recipe.api';
import type { Recipe } from '../../types';

// Fallback seed recipes if backend is not running yet
const fallbackRecipes: Recipe[] = [
  {
    _id: 'seed-1',
    title: 'Thịt Kho Tàu Trứng Cút Nước Dừa',
    description: 'Món ăn truyền thống đậm đà với thịt ba chỉ mềm béo ngấm nước dừa xiêm và trứng cút thơm ngon.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    category: 'Gia đình',
    cookingTimeMinutes: 45,
    difficulty: 'Trung bình',
    servingsCount: 4,
    nutrition: { calories: 520, proteinGrams: 32, carbsGrams: 12, fatGrams: 38 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.9,
    ratingsCount: 48,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed-2',
    title: 'Canh Chua Cá Hồi Miền Tây',
    description: 'Vị chua thanh mát của me và dứa kết hợp cá hồi giàu omega-3, dọc mùng giòn sần sật.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    category: 'Món Việt',
    cookingTimeMinutes: 25,
    difficulty: 'Dễ',
    servingsCount: 4,
    nutrition: { calories: 310, proteinGrams: 28, carbsGrams: 14, fatGrams: 16 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.8,
    ratingsCount: 35,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed-3',
    title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
    description: 'Món ăn chuẩn Healthy ít calo, ức gà mềm ngọt không bị khô, hòa quyện sốt bơ tỏi thơm lừng.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
    category: 'Healthy',
    cookingTimeMinutes: 15,
    difficulty: 'Dễ',
    servingsCount: 2,
    nutrition: { calories: 290, proteinGrams: 42, carbsGrams: 8, fatGrams: 10 },
    ingredients: [],
    steps: [],
    ratingAverage: 4.9,
    ratingsCount: 62,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'seed-4',
    title: 'Bò Bít Tết Sốt Tiêu Đen Kiểu Pháp',
    description: 'Thịt thăn bò mềm mọng nước ăn kèm măng tây áp chảo và sốt tiêu đen cay nồng quý phái.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    category: 'Nấu nhanh < 20p',
    cookingTimeMinutes: 20,
    difficulty: 'Trung bình',
    servingsCount: 2,
    nutrition: { calories: 480, proteinGrams: 45, carbsGrams: 10, fatGrams: 28 },
    ingredients: [],
    steps: [],
    ratingAverage: 5.0,
    ratingsCount: 77,
    createdAt: new Date().toISOString(),
  },
];

export const RecipeListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = ['Tất cả', 'Gia đình', 'Món Việt', 'Healthy', 'Nấu nhanh < 20p', 'Tiết kiệm'];

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', search, selectedCategory],
    queryFn: () =>
      recipeApi.getRecipes({
        search: search || undefined,
        category: selectedCategory === 'Tất cả' ? undefined : selectedCategory,
      }),
    retry: 1,
  });

  const recipes = data?.recipes && data.recipes.length > 0 ? data.recipes : fallbackRecipes;

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'Tất cả' || recipe.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
          Khám Phá Công Thức Chuẩn Việt
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Hàng trăm món ăn ngon từ bữa cơm gia đình đến món ăn healthy kiêng khem, hướng dẫn chi tiết từng bước.
        </p>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm món ăn, nguyên liệu (thịt kho, canh chua, cá hồi...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 animate-pulse space-y-3">
              <div className="w-full h-48 bg-slate-200 rounded-2xl"></div>
              <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all group flex flex-col"
            >
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                  {recipe.category}
                </span>
                <span className="absolute top-3 right-3 bg-orange-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                  {recipe.difficulty}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                {/* Metadata */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span>{recipe.cookingTimeMinutes}p</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{recipe.nutrition.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{recipe.servingsCount} người</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredRecipes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800">Không tìm thấy công thức phù hợp</h4>
          <p className="text-xs text-slate-500 mt-1">Hãy thử tìm kiếm với từ khoá khác hoặc chọn lại danh mục.</p>
        </div>
      )}
    </div>
  );
};
