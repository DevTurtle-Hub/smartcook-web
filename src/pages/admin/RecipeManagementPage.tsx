import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '../../api/recipe.api';
import type { Recipe } from '../../types';

export const RecipeManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-recipes', search],
    queryFn: () => recipeApi.getRecipes({ search: search || undefined }),
  });

  const dummyRecipes: Recipe[] = [
    {
      _id: '1',
      title: 'Thịt Kho Tàu Trứng Cút Nước Dừa',
      description: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&auto=format&fit=crop&q=80',
      category: 'Gia đình',
      cookingTimeMinutes: 45,
      difficulty: 'Trung bình',
      servingsCount: 4,
      nutrition: { calories: 520, proteinGrams: 32, carbsGrams: 12, fatGrams: 38 },
      ingredients: [],
      steps: [],
      ratingAverage: 4.9,
      ratingsCount: 48,
      createdAt: '2026-09-15',
    },
    {
      _id: '2',
      title: 'Canh Chua Cá Hồi Miền Tây',
      description: '',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&auto=format&fit=crop&q=80',
      category: 'Món Việt',
      cookingTimeMinutes: 25,
      difficulty: 'Dễ',
      servingsCount: 4,
      nutrition: { calories: 310, proteinGrams: 28, carbsGrams: 14, fatGrams: 16 },
      ingredients: [],
      steps: [],
      ratingAverage: 4.8,
      ratingsCount: 35,
      createdAt: '2026-09-16',
    },
    {
      _id: '3',
      title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi Mật Ong',
      description: '',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&auto=format&fit=crop&q=80',
      category: 'Healthy',
      cookingTimeMinutes: 15,
      difficulty: 'Dễ',
      servingsCount: 2,
      nutrition: { calories: 290, proteinGrams: 42, carbsGrams: 8, fatGrams: 10 },
      ingredients: [],
      steps: [],
      ratingAverage: 4.9,
      ratingsCount: 62,
      createdAt: '2026-09-17',
    },
  ];

  const recipes = data?.recipes && data.recipes.length > 0 ? data.recipes : dummyRecipes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">Quản Lý Công Thức</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Danh sách công thức chuẩn MasterChef phục vụ thuật toán gợi ý tủ lạnh.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          <span>Thêm Công Thức Mới</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên công thức..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">Tổng: {recipes.length} công thức</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Món Ăn</th>
                <th className="p-4">Danh Mục</th>
                <th className="p-4">Thời Gian</th>
                <th className="p-4">Độ Khó</th>
                <th className="p-4">Calo</th>
                <th className="p-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Đang tải danh sách công thức...</td>
                </tr>
              ) : (
                recipes.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                      <span className="font-bold text-slate-900 text-xs">{item.title}</span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-medium text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">{item.cookingTimeMinutes} phút</td>
                    <td className="p-4">
                      <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{item.nutrition.calories} kcal</td>
                    <td className="p-4 text-right space-x-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors" title="Xem">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors" title="Chỉnh sửa">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
