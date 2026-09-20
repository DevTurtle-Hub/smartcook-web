import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Check,
  X,
  Clock,
  Flame,
  Star,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Layers,
  ArrowUpDown,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChefHat,
  Bookmark,
  Share2,
  Scale,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import type { DishRecipeAdmin, SystemIngredient } from '../../types/admin';

export const DishManagementPage: React.FC = () => {
  const {
    recipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    ingredients,
    ingredientGroups,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    pendingContributions,
    approveContribution,
    rejectContribution,
    heroBanner,
    updateHeroBanner,
  } = useAdminStore();

  // Tab chính: 'dishes' (Danh sách món ăn & công thức) | 'ingredients' (Kho nguyên liệu & tủ lạnh) | 'pending' (Duyệt đóng góp) | 'banner' (Cấu hình Banner Mobile)
  const [mainTab, setMainTab] = useState<'dishes' | 'ingredients' | 'pending' | 'banner'>('dishes');

  // ================= STATE DÀNH CHO TAB MÓN ĂN =================
  const [dishSearch, setDishSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedCostFilter, setSelectedCostFilter] = useState<string>('all'); // all, <20k, 20k-50k, >50k
  const [dishSortBy, setDishSortBy] = useState<'rating' | 'time' | 'calories' | 'cost'>('rating');
  const [dishSortOrder, setDishSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal Xem chi tiết món ăn (Theo đặc tả SRS Module 5, 6, 9, 10, 11, 15, 19, 20)
  const [viewingDish, setViewingDish] = useState<DishRecipeAdmin | null>(null);

  // Modal Thêm / Sửa Món Ăn
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<DishRecipeAdmin | null>(null);
  const [formDishTitle, setFormDishTitle] = useState('');
  const [formDishDesc, setFormDishDesc] = useState('');
  const [formDishCat, setFormDishCat] = useState('Món Việt');
  const [formDishSubCat, setFormDishSubCat] = useState('');
  const [formDishPrepTime, setFormDishPrepTime] = useState(10);
  const [formDishCookTime, setFormDishCookTime] = useState(20);
  const [formDishDifficulty, setFormDishDifficulty] = useState<'Dễ' | 'Trung bình' | 'Khó'>('Dễ');
  const [formDishServings, setFormDishServings] = useState(2);
  const [formDishCalories, setFormDishCalories] = useState(350);
  const [formDishProtein, setFormDishProtein] = useState(30);
  const [formDishCarbs, setFormDishCarbs] = useState(25);
  const [formDishFat, setFormDishFat] = useState(12);
  const [formDishFiber, setFormDishFiber] = useState(3);
  const [formDishCost, setFormDishCost] = useState(50000);
  const [formDishImage, setFormDishImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600');
  const [formDishAuthor, setFormDishAuthor] = useState('SmartCook MasterChef');
  const [formDishTags, setFormDishTags] = useState('Healthy, Ăn gia đình');
  const [formDishIngredientsRaw, setFormDishIngredientsRaw] = useState('Thịt gà (300g)\nCà rốt (1 củ)\nHành lá (2 nhánh)');
  const [formDishStepsRaw, setFormDishStepsRaw] = useState('Sơ chế và ướp gia vị trong 10 phút (Timer: 10)\nÁp chảo lửa vừa cho chín đều (Timer: 8)\nBày ra đĩa và thưởng thức');

  // Modal Xóa Món Ăn
  const [deleteDishId, setDeleteDishId] = useState<string | null>(null);

  // Modal Từ Chối Duyệt
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // ================= STATE DÀNH CHO TAB KHO NGUYÊN LIỆU =================
  const [ingSearch, setIngSearch] = useState('');
  const [ingGroupId, setIngGroupId] = useState('all');
  const [viewingIngredient, setViewingIngredient] = useState<SystemIngredient | null>(null);
  const [showIngModal, setShowIngModal] = useState(false);
  const [editingIng, setEditingIng] = useState<SystemIngredient | null>(null);
  const [formIngName, setFormIngName] = useState('');
  const [formIngGroupId, setFormIngGroupId] = useState('grp-1');
  const [formIngUnit, setFormIngUnit] = useState('gram');
  const [formIngShelfLife, setFormIngShelfLife] = useState(7);
  const [formIngSynonyms, setFormIngSynonyms] = useState('');
  const [deleteIngId, setDeleteIngId] = useState<string | null>(null);

  // Danh mục lọc món ăn theo SRS Module 4 (Gia đình, Sức khỏe, Ăn chay, Ẩm thực, Nhanh & Tiện lợi, Tiết kiệm)
  const dishCategories = [
    'Tất cả',
    'Gia đình',
    'Sức khỏe',
    'Ẩm thực',
    'Nhanh & Tiện lợi',
    'Tiết kiệm',
    'Chế độ ăn chay',
  ];

  // Helper tính toán nhóm nguyên liệu
  const getGroupName = (gid: string) => {
    return ingredientGroups.find((g) => g.id === gid)?.name || 'Khác';
  };

  // Filter & Sort Recipes
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter((r) => {
        const query = dishSearch.toLowerCase().trim();
        const matchQuery =
          !query ||
          r.title.toLowerCase().includes(query) ||
          r.category.toLowerCase().includes(query) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(query));

        const matchCat =
          selectedCategory === 'Tất cả' ||
          r.category === selectedCategory ||
          (r.subCategory && r.subCategory.includes(selectedCategory));

        let matchCost = true;
        if (selectedCostFilter === '<20k') matchCost = r.estimatedCostVnd < 20000;
        else if (selectedCostFilter === '20k-50k')
          matchCost = r.estimatedCostVnd >= 20000 && r.estimatedCostVnd <= 50000;
        else if (selectedCostFilter === '>50k') matchCost = r.estimatedCostVnd > 50000;

        return matchQuery && matchCat && matchCost;
      })
      .sort((a, b) => {
        let valA: number = 0;
        let valB: number = 0;
        if (dishSortBy === 'rating') {
          valA = a.rating;
          valB = b.rating;
        } else if (dishSortBy === 'time') {
          valA = a.cookingTimeMinutes + a.prepTimeMinutes;
          valB = b.cookingTimeMinutes + b.prepTimeMinutes;
        } else if (dishSortBy === 'calories') {
          valA = a.calories;
          valB = b.calories;
        } else if (dishSortBy === 'cost') {
          valA = a.estimatedCostVnd;
          valB = b.estimatedCostVnd;
        }

        return dishSortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [recipes, dishSearch, selectedCategory, selectedCostFilter, dishSortBy, dishSortOrder]);

  // Filter Ingredients
  const filteredIngredients = useMemo(() => {
    return ingredients.filter((ing) => {
      const q = ingSearch.toLowerCase().trim();
      const matchQ =
        !q ||
        ing.name.toLowerCase().includes(q) ||
        ing.synonyms.some((s) => s.toLowerCase().includes(q));
      const matchGroup = ingGroupId === 'all' || ing.groupId === ingGroupId;
      return matchQ && matchGroup;
    });
  }, [ingredients, ingSearch, ingGroupId]);

  // Open Add/Edit Dish Modal
  const handleOpenDishModal = (dish?: DishRecipeAdmin) => {
    if (dish) {
      setEditingDish(dish);
      setFormDishTitle(dish.title);
      setFormDishDesc(dish.description);
      setFormDishCat(dish.category);
      setFormDishSubCat(dish.subCategory || '');
      setFormDishPrepTime(dish.prepTimeMinutes);
      setFormDishCookTime(dish.cookingTimeMinutes);
      setFormDishDifficulty(dish.difficulty);
      setFormDishServings(dish.servings);
      setFormDishCalories(dish.calories);
      setFormDishProtein(dish.macro.protein);
      setFormDishCarbs(dish.macro.carbs);
      setFormDishFat(dish.macro.fat);
      setFormDishFiber(dish.macro.fiber || 0);
      setFormDishCost(dish.estimatedCostVnd);
      setFormDishImage(dish.image);
      setFormDishAuthor(dish.author);
      setFormDishTags(dish.dietaryTags.join(', '));
      setFormDishIngredientsRaw(
        dish.ingredients.map((i) => `${i.name} (${i.amount})${i.note ? ` - ${i.note}` : ''}`).join('\n')
      );
      setFormDishStepsRaw(
        dish.steps
          .map((s) => `${s.instruction}${s.timerMinutes ? ` (Timer: ${s.timerMinutes})` : ''}`)
          .join('\n')
      );
    } else {
      setEditingDish(null);
      setFormDishTitle('');
      setFormDishDesc('');
      setFormDishCat('Món Việt');
      setFormDishSubCat('');
      setFormDishPrepTime(10);
      setFormDishCookTime(20);
      setFormDishDifficulty('Dễ');
      setFormDishServings(2);
      setFormDishCalories(350);
      setFormDishProtein(30);
      setFormDishCarbs(25);
      setFormDishFat(12);
      setFormDishFiber(3);
      setFormDishCost(45000);
      setFormDishImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600');
      setFormDishAuthor('SmartCook MasterChef');
      setFormDishTags('Healthy, Gia đình');
      setFormDishIngredientsRaw('Thịt heo (300g)\nHành tây (1 củ)\nGia vị (vừa đủ)');
      setFormDishStepsRaw('Sơ chế sạch nguyên liệu (Timer: 5)\nNấu chín vừa ăn (Timer: 15)');
    }
    setShowDishModal(true);
  };

  // Save Dish
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDishTitle.trim()) return;

    // Parse ingredients raw
    const parsedIngs = formDishIngredientsRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^([^(]+)(?:\(([^)]+)\))?(?:-(.*))?$/);
        return {
          name: match ? match[1].trim() : line,
          amount: match && match[2] ? match[2].trim() : 'vừa đủ',
          note: match && match[3] ? match[3].trim() : undefined,
        };
      });

    // Parse steps raw
    const parsedSteps = formDishStepsRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, idx) => {
        const timerMatch = line.match(/\(Timer:\s*(\d+)\)/i);
        const timer = timerMatch ? parseInt(timerMatch[1], 10) : undefined;
        const cleanInstruction = line.replace(/\(Timer:\s*\d+\)/i, '').trim();
        return {
          stepNumber: idx + 1,
          instruction: cleanInstruction || line,
          timerMinutes: timer,
        };
      });

    const parsedTags = formDishTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const dishData = {
      title: formDishTitle.trim(),
      description: formDishDesc.trim() || 'Món ăn dinh dưỡng được cung cấp bởi SmartCook Assistant.',
      category: formDishCat,
      subCategory: formDishSubCat.trim() || undefined,
      prepTimeMinutes: Number(formDishPrepTime) || 0,
      cookingTimeMinutes: Number(formDishCookTime) || 0,
      difficulty: formDishDifficulty,
      servings: Number(formDishServings) || 2,
      calories: Number(formDishCalories) || 0,
      macro: {
        protein: Number(formDishProtein) || 0,
        carbs: Number(formDishCarbs) || 0,
        fat: Number(formDishFat) || 0,
        fiber: Number(formDishFiber) || 0,
      },
      estimatedCostVnd: Number(formDishCost) || 0,
      image: formDishImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      author: formDishAuthor.trim() || 'SmartCook MasterChef',
      status: 'published' as const,
      ingredients: parsedIngs.length > 0 ? parsedIngs : [{ name: 'Nguyên liệu chính', amount: 'vừa đủ' }],
      steps: parsedSteps.length > 0 ? parsedSteps : [{ stepNumber: 1, instruction: 'Chế biến món ăn' }],
      dietaryTags: parsedTags.length > 0 ? parsedTags : ['SmartCook'],
    };

    if (editingDish) {
      updateRecipe(editingDish.id, dishData);
    } else {
      addRecipe(dishData);
    }
    setShowDishModal(false);
  };

  // Delete Dish Confirm
  const handleConfirmDeleteDish = () => {
    if (deleteDishId) {
      deleteRecipe(deleteDishId);
      setDeleteDishId(null);
    }
  };

  // Open Add/Edit Ingredient Modal
  const handleOpenIngModal = (item?: SystemIngredient) => {
    if (item) {
      setEditingIng(item);
      setFormIngName(item.name);
      setFormIngGroupId(item.groupId);
      setFormIngUnit(item.unit);
      setFormIngShelfLife(item.shelfLifeDays);
      setFormIngSynonyms(item.synonyms.join(', '));
    } else {
      setEditingIng(null);
      setFormIngName('');
      setFormIngGroupId(ingredientGroups[0]?.id || 'grp-1');
      setFormIngUnit('gram');
      setFormIngShelfLife(7);
      setFormIngSynonyms('');
    }
    setShowIngModal(true);
  };

  // Save Ingredient
  const handleSaveIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIngName.trim()) return;

    const synList = formIngSynonyms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingIng) {
      updateIngredient(editingIng.id, {
        name: formIngName.trim(),
        groupId: formIngGroupId,
        unit: formIngUnit.trim() || 'gram',
        shelfLifeDays: Number(formIngShelfLife) || 1,
        synonyms: synList.length > 0 ? synList : editingIng.synonyms,
      });
    } else {
      addIngredient({
        name: formIngName.trim(),
        icon: '🥗',
        groupId: formIngGroupId,
        unit: formIngUnit.trim() || 'gram',
        shelfLifeDays: Number(formIngShelfLife) || 1,
        synonyms: synList.length > 0 ? synList : [formIngName.trim().toLowerCase()],
      });
    }
    setShowIngModal(false);
  };

  // Delete Ingredient Confirm
  const handleConfirmDeleteIng = () => {
    if (deleteIngId) {
      deleteIngredient(deleteIngId);
      setDeleteIngId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= THANH ĐIỀU HƯỚNG TAB CHÍNH ================= */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setMainTab('dishes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              mainTab === 'dishes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Công Thức & Món Ăn</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                mainTab === 'dishes' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {recipes.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab('ingredients')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              mainTab === 'ingredients'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Kho Nguyên Liệu Tủ Lạnh</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                mainTab === 'ingredients' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {ingredients.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              mainTab === 'pending'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Duyệt Đóng Góp</span>
            {pendingContributions.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingContributions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMainTab('banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              mainTab === 'banner'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Banner Mobile</span>
          </button>
        </div>

        {/* Nút tác vụ nhanh tạo mới */}
        {mainTab === 'dishes' && (
          <button
            onClick={() => handleOpenDishModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Món Ăn Mới</span>
          </button>
        )}

        {mainTab === 'ingredients' && (
          <button
            onClick={() => handleOpenIngModal()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm Nguyên Liệu</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: QUẢN LÝ MÓN ĂN & CÔNG THỨC (DẠNG TABLE CHỮ NHẬT DÀI CHUYÊN NGHIỆP)
      ========================================================================== */}
      {mainTab === 'dishes' && (
        <div className="space-y-4">
          {/* Thanh tìm kiếm & Bộ lọc theo đặc tả SRS Module 4, 15 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            {/* Row 1: Search + Sort + Lọc chi phí */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Ô tìm kiếm */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên món, nguyên liệu..."
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Lọc ngân sách chi phí (Module 15: Cost Calculation) */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400 font-bold uppercase shrink-0">Chi phí:</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs text-slate-600 font-medium">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: '<20k', label: '< 20k' },
                    { id: '20k-50k', label: '20k - 50k' },
                    { id: '>50k', label: '> 50k' },
                  ].map((cost) => (
                    <button
                      key={cost.id}
                      onClick={() => setSelectedCostFilter(cost.id)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        selectedCostFilter === cost.id
                          ? 'bg-white text-indigo-600 font-bold shadow-2xs'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      {cost.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl text-xs text-slate-600 font-medium ml-auto">
                <span className="text-[11px] text-slate-400 font-bold uppercase px-2">Xếp theo:</span>
                <button
                  onClick={() => setDishSortBy('rating')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    dishSortBy === 'rating' ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  Đánh giá
                </button>
                <button
                  onClick={() => setDishSortBy('time')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    dishSortBy === 'time' ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  Thời gian
                </button>
                <button
                  onClick={() => setDishSortBy('calories')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    dishSortBy === 'calories' ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  Calories
                </button>
                <button
                  onClick={() => setDishSortOrder(dishSortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-slate-400 hover:text-indigo-600"
                  title="Đảo chiều sắp xếp"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Row 2: Tabs Danh mục theo Module 4 SRS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-2 border-t border-slate-100">
              {dishCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* BẢNG TABLE MÓN ĂN CHỮ NHẬT DÀI TỐI GIẢN */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Món Ăn & Công Thức</th>
                    <th className="py-3.5 px-4">Phân Loại</th>
                    <th className="py-3.5 px-4">Độ Phổ Biến & Tương Tác</th>
                    <th className="py-3.5 px-4">Thẻ Ăn Kiêng & Mục Đích</th>
                    <th className="py-3.5 px-4">Định Mức Chi Phí</th>
                    <th className="py-3.5 px-5 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRecipes.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Không tìm thấy món ăn nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredRecipes.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        {/* Cột 1: Tên Món Ăn + Hình ảnh món ăn rõ nét */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border border-slate-200 shadow-xs shrink-0 bg-slate-100 group-hover:border-indigo-300 transition-colors">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm block leading-snug">
                                {item.title}
                              </span>
                              <span className="text-[11px] text-slate-400 mt-1 block">
                                <strong className="text-slate-600 font-semibold">{item.ingredients.length}</strong> nguyên liệu • <strong className="text-slate-600 font-semibold">{item.steps.length}</strong> bước nấu • {item.author}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cột 2: Phân Loại */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 font-bold text-[11px] border border-indigo-100">
                            {item.category}
                          </span>
                          {item.subCategory && (
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {item.subCategory}
                            </span>
                          )}
                        </td>

                        {/* Cột 3: Độ Phổ Biến & Tương Tác (Rating ⭐, Đánh giá, Thời gian nấu) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-['Outfit'] text-slate-900 font-bold">{item.rating}</span>
                            </div>
                            <span className="text-[10.5px] text-slate-400">
                              ({item.ratingsCount} lượt nấu)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
                            <Clock className="w-3 h-3 text-indigo-500" />
                            <span>{item.prepTimeMinutes + item.cookingTimeMinutes} phút chuẩn bị & nấu</span>
                          </div>
                        </td>

                        {/* Cột 4: Thẻ Ăn Kiêng & Mục Đích (SRS Module 2 & 4) */}
                        <td className="py-4 px-4 max-w-[220px]">
                          <div className="flex flex-wrap gap-1">
                            {item.dietaryTags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:border-indigo-200 transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Độ khó: <strong className="text-slate-700 font-semibold">{item.difficulty}</strong> • {item.servings} người ăn
                          </span>
                        </td>

                        {/* Cột 5: Định Mức Chi Phí & Dinh Dưỡng Tổng Quan */}
                        <td className="py-4 px-4 whitespace-nowrap font-['Outfit']">
                          <div className="text-sm font-extrabold text-slate-900">
                            {item.estimatedCostVnd.toLocaleString()} đ
                          </div>
                          <span className="text-[10.5px] text-amber-600 font-bold block mt-0.5 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {item.calories} kcal
                          </span>
                        </td>

                        {/* Cột 7: Thao Tác (Xem Chi Tiết, Sửa, Xóa) */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {/* Nút Xem Chi Tiết */}
                            <button
                              onClick={() => setViewingDish(item)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white font-bold text-xs transition-all active:scale-95 shadow-2xs"
                              title="Xem toàn bộ hồ sơ món ăn"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem chi tiết</span>
                            </button>

                            {/* Nút Sửa */}
                            <button
                              onClick={() => handleOpenDishModal(item)}
                              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Chỉnh sửa thông tin món ăn"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Nút Xóa */}
                            <button
                              onClick={() => setDeleteDishId(item.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Xóa món ăn"
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

            {/* Footer tóm tắt bảng món ăn */}
            <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
              <span>
                Đang hiển thị <strong>{filteredRecipes.length}</strong> / <strong>{recipes.length}</strong> món ăn trong hệ thống
              </span>
              <span className="text-[11px] text-slate-400">
                Tuân thủ chuẩn dữ liệu SmartCook Specification v1.0
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: KHO NGUYÊN LIỆU & TỦ LẠNH (DẠNG TABLE CHỮ NHẬT TỐI GIẢN)
      ========================================================================== */}
      {mainTab === 'ingredients' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm nguyên liệu, alias..."
                  value={ingSearch}
                  onChange={(e) => setIngSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Tabs nhóm nguyên liệu */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
                <button
                  onClick={() => setIngGroupId('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                    ingGroupId === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  Tất cả ({ingredients.length})
                </button>

                {ingredientGroups.map((grp) => (
                  <button
                    key={grp.id}
                    onClick={() => setIngGroupId(grp.id)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 ${
                      ingGroupId === grp.id
                        ? 'bg-indigo-600 text-white shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <span>{grp.name}</span>
                    <span className="ml-1.5 text-[10px] opacity-75">({grp.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* BẢNG NGUYÊN LIỆU */}
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
                        Không tìm thấy nguyên liệu phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredIngredients.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="py-3.5 px-5 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {getGroupName(item.groupId)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                          {item.unit}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2.5 py-0.5 rounded-md font-semibold text-[11px]">
                            <Clock className="w-3 h-3 text-emerald-600" />
                            ~{item.shelfLifeDays} ngày
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingIngredient(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white font-semibold text-xs transition-all active:scale-95"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem chi tiết</span>
                            </button>
                            <button
                              onClick={() => handleOpenIngModal(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteIngId(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
            <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-5">
              <span>
                Đang hiển thị <strong>{filteredIngredients.length}</strong> / <strong>{ingredients.length}</strong> nguyên liệu
              </span>
              <span className="text-[11px] text-slate-400">SmartCook Taxonomy & Inventory</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DUYỆT ĐÓNG GÓP NGƯỜI DÙNG
      ========================================================================== */}
      {mainTab === 'pending' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl flex items-center gap-3 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Công thức do cộng đồng người dùng gửi lên qua tính năng <strong>Wizard Creator</strong> trên Mobile App cần được Admin duyệt chất lượng trước khi hiển thị cho toàn bộ người dùng.
            </span>
          </div>

          {pendingContributions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">Không có công thức nào chờ duyệt!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tất cả bài đóng góp từ người dùng đã được xử lý hoàn tất.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingContributions.map((contrib) => (
                <div
                  key={contrib.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={contrib.image}
                        alt={contrib.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                        Chờ duyệt
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] text-white">
                        {contrib.submittedAt}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{contrib.title}</h4>
                      <p className="text-xs text-slate-500">
                        Đăng bởi: <strong>{contrib.authorName}</strong> ({contrib.authorEmail})
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold pt-1">
                        <span>⏱ {contrib.cookingTimeMinutes} phút</span>
                        <span>🔥 {contrib.calories} kcal</span>
                        <span>🥗 {contrib.ingredientsCount} nguyên liệu</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        approveContribution(contrib.id);
                        alert(`Đã duyệt công thức "${contrib.title}" thành công!`);
                      }}
                      className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all"
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: CẤU HÌNH BANNER HERO MOBILE
      ========================================================================== */}
      {mainTab === 'banner' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Outfit']">
                Cấu Hình Banner Hero Slider Trên Mobile
              </h3>
              <p className="text-xs text-slate-400">
                Món ăn này sẽ tự động hiển thị ở đầu trang chủ Mobile App SmartCook.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
              Đang hoạt động trên App
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Live Preview Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
              <img
                src={heroBanner.imageUrl}
                alt={heroBanner.title}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 text-white space-y-2">
                <span className="px-2.5 py-1 bg-rose-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg self-start">
                  {heroBanner.badge}
                </span>
                <h4 className="text-xl font-bold font-['Outfit']">{heroBanner.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{heroBanner.subtitle}</p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-200 pt-1">
                  <span>⏱ {heroBanner.prepTime}</span>
                  <span>🔥 {heroBanner.calories}</span>
                  <span>👥 {heroBanner.servings}</span>
                </div>
              </div>
            </div>

            {/* Quick Action gán món từ danh sách */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Chọn món ăn ghim làm Banner Trang Chủ:
              </span>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {recipes.map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={r.image} alt={r.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <h6 className="font-bold text-slate-900 truncate">{r.title}</h6>
                        <span className="text-[10px] text-slate-400">{r.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        updateHeroBanner({
                          title: r.title,
                          subtitle: r.description,
                          imageUrl: r.image,
                          prepTime: `${r.cookingTimeMinutes} phút`,
                          calories: `${r.calories} kcal`,
                          servings: `${r.servings} phần`,
                          locationTag: r.category,
                        });
                        alert(`Đã đổi Banner Mobile thành "${r.title}"!`);
                      }}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold rounded-lg shrink-0 transition-colors"
                    >
                      Ghim Banner
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: XEM CHI TIẾT HỒ SƠ MÓN ĂN TOÀN DIỆN (LAYOUT RỘNG GẦN FULL MÀN HÌNH, BO NHẸ, TỐI GIẢN CAO CẤP)
      ========================================================================== */}
      {viewingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[92vh] rounded-xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-slate-800">
            {/* Topbar tối giản */}
            <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 tracking-wide">
                  {viewingDish.category} {viewingDish.subCategory ? `• ${viewingDish.subCategory}` : ''}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500 font-medium">
                  Mã món: <code className="text-slate-800 font-mono text-[11px]">{viewingDish.id}</code>
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500">
                  Tác giả: <strong className="text-slate-700">{viewingDish.author}</strong>
                </span>
              </div>
              <button
                onClick={() => setViewingDish(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body 2 Cột Độc Đáo Hiện Đại Gần Full Màn Hình */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* CỘT TRÁI (5 phần): Ảnh lớn nghệ thuật + Thông số cốt lõi + Bảng Dinh Dưỡng */}
              <div className="lg:col-span-5 border-r border-slate-200/80 p-6 overflow-y-auto space-y-5 bg-slate-50/40">
                {/* Ảnh món ăn tỷ lệ điện ảnh với bo góc nhẹ rounded-lg */}
                <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group">
                  <img
                    src={viewingDish.image}
                    alt={viewingDish.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{viewingDish.rating}</span>
                    <span className="text-slate-400">({viewingDish.ratingsCount})</span>
                  </div>
                </div>

                {/* Tiêu đề & mô tả */}
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900 leading-snug font-['Outfit']">
                    {viewingDish.title}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {viewingDish.description}
                  </p>
                  {viewingDish.dietaryTags && viewingDish.dietaryTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {viewingDish.dietaryTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10.5px] font-medium bg-white text-slate-600 border border-slate-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Khối 4 Thẻ Thông Số Tối Giản */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Tổng Thời Gian
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-['Outfit'] block">
                      {viewingDish.prepTimeMinutes + viewingDish.cookingTimeMinutes} phút
                    </span>
                    <span className="text-[10.5px] text-slate-500 block">
                      Chuẩn bị {viewingDish.prepTimeMinutes}p • Nấu {viewingDish.cookingTimeMinutes}p
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Khẩu Phần / Độ Khó
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-['Outfit'] block">
                      {viewingDish.servings} người ăn
                    </span>
                    <span className="text-[10.5px] text-slate-500 block">
                      Độ phức tạp: {viewingDish.difficulty}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Mức Năng Lượng
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-['Outfit'] block">
                      {viewingDish.calories} kcal
                    </span>
                    <span className="text-[10.5px] text-slate-500 block">
                      Theo khẩu phần tiêu chuẩn
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Chi Phí Dự Kiến (SRS 15)
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-['Outfit'] block">
                      {viewingDish.estimatedCostVnd.toLocaleString()} đ
                    </span>
                    <span className="text-[10.5px] text-slate-500 block">
                      ~{Math.round(viewingDish.estimatedCostVnd / viewingDish.servings).toLocaleString()} đ / người
                    </span>
                  </div>
                </div>

                {/* Bảng phân bổ Macro Dinh Dưỡng (SRS Module 11) - Gam màu trung tính thanh lịch */}
                <div className="p-4 bg-white rounded-lg border border-slate-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Cân Bằng Dinh Dưỡng (Macro)
                    </span>
                    <span className="text-[10.5px] text-slate-400">Chuẩn hóa 1 khẩu phần</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                      <span className="text-[10px] text-indigo-600 font-bold block">Protein</span>
                      <strong className="text-xs font-extrabold text-indigo-950 font-['Outfit'] block mt-0.5">
                        {viewingDish.macro.protein}g
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] text-amber-700 font-bold block">Carbs</span>
                      <strong className="text-xs font-extrabold text-amber-950 font-['Outfit'] block mt-0.5">
                        {viewingDish.macro.carbs}g
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                      <span className="text-[10px] text-amber-700 font-bold block">Fat</span>
                      <strong className="text-xs font-extrabold text-amber-950 font-['Outfit'] block mt-0.5">
                        {viewingDish.macro.fat}g
                      </strong>
                    </div>
                    <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                      <span className="text-[10px] text-indigo-600 font-bold block">Chất Xơ</span>
                      <strong className="text-xs font-extrabold text-indigo-950 font-['Outfit'] block mt-0.5">
                        {viewingDish.macro.fiber || 0}g
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (7 phần): Nguyên Liệu Chi Tiết + Quy Trình Nấu Timeline + Thay Thế Nguyên Liệu */}
              <div className="lg:col-span-7 p-6 overflow-y-auto space-y-6 bg-white">
                {/* 1. Danh sách nguyên liệu & định lượng dạng table nhỏ gọn */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Nguyên Liệu Cần Thiết ({viewingDish.ingredients.length} thành phần)
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Đồng bộ với Module Tủ Lạnh & Mua Sắm
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200/90 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80">
                        <tr>
                          <th className="py-2.5 px-3.5">Tên Nguyên Liệu</th>
                          <th className="py-2.5 px-3.5">Định Lượng</th>
                          <th className="py-2.5 px-3.5">Ghi Chú Sơ Chế</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewingDish.ingredients.map((ing, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3.5 font-semibold text-slate-800">{ing.name}</td>
                            <td className="py-2.5 px-3.5 font-mono text-slate-700 font-medium">{ing.amount}</td>
                            <td className="py-2.5 px-3.5 text-slate-400 text-[11px]">{ing.note || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Quy trình nấu từng bước (Cooking Steps Timeline kèm Timer) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Quy Trình Hướng Dẫn Nấu Ăn (SRS Module 9 & 10)
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Tổng {viewingDish.steps.length} bước thực hiện
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {viewingDish.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-colors flex items-start gap-3 bg-white"
                      >
                        <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {step.stepNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 leading-relaxed font-normal">
                            {step.instruction}
                          </p>
                        </div>
                        {step.timerMinutes && (
                          <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{step.timerMinutes} phút</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Đề xuất thay thế nguyên liệu thông minh (SRS Module 20) */}
                {viewingDish.substitutions && viewingDish.substitutions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Gợi Ý Thay Thế Nguyên Liệu (SRS Module 20: Substitution)
                    </h4>
                    <div className="space-y-2">
                      {viewingDish.substitutions.map((sub, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="line-through text-slate-400">{sub.original}</span>
                            <span className="text-slate-400 font-mono">→</span>
                            <strong className="text-slate-800">{sub.substitute}</strong>
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal">{sub.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal Tối Giản */}
            <div className="px-6 py-3 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Nhấn ESC hoặc nút Đóng để quay lại danh sách
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const current = viewingDish;
                    setViewingDish(null);
                    handleOpenDishModal(current);
                  }}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                >
                  Chỉnh Sửa Món Này
                </button>
                <button
                  onClick={() => setViewingDish(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Đóng Cửa Sổ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: XEM CHI TIẾT NGUYÊN LIỆU
      ========================================================================== */}
      {viewingIngredient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit']">{viewingIngredient.name}</h3>
                <span className="text-xs text-slate-400">
                  Nhóm: {getGroupName(viewingIngredient.groupId)} • Đơn vị: {viewingIngredient.unit}
                </span>
              </div>
              <button onClick={() => setViewingIngredient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10.5px] text-slate-400 font-bold uppercase block">Hạn Bảo Quản Gợi Ý (SRS 14)</span>
                <span className="text-sm font-bold text-slate-800 block">~{viewingIngredient.shelfLifeDays} ngày</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Từ Khóa Đồng Nghĩa / AI Match (Synonyms):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingIngredient.synonyms.map((syn, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      #{syn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingIngredient(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / CHỈNH SỬA MÓN ĂN (LAYOUT RỘNG GẦN FULL MÀN HÌNH, BO NHẸ, 2 CỘT TỐI GIẢN)
      ========================================================================== */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-6xl h-[92vh] rounded-xl border border-slate-200/90 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col text-slate-800">
            {/* Topbar tối giản */}
            <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 font-['Outfit']">
                  {editingDish ? 'Chỉnh Sửa Hồ Sơ Món Ăn' : 'Thêm Món Ăn Mới'}
                </span>
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs text-slate-500">
                  Chuẩn hóa theo SmartCook Specification v1.0
                </span>
              </div>
              <button
                onClick={() => setShowDishModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Đóng cửa sổ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form 2 Cột Độc Đáo Hiện Đại Gần Full Màn Hình */}
            <form onSubmit={handleSaveDish} className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* CỘT TRÁI (5 phần): Ảnh preview, Tên, Danh mục, Macro, Chi phí */}
              <div className="lg:col-span-5 border-r border-slate-200/80 p-6 overflow-y-auto space-y-4 bg-slate-50/40 text-xs">
                {/* Ảnh Preview */}
                <div className="space-y-1.5">
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                    <img
                      src={formDishImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600';
                      }}
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium">
                      Hình ảnh đại diện món ăn
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Đường Dẫn Ảnh (URL)
                    </label>
                    <input
                      type="text"
                      value={formDishImage}
                      onChange={(e) => setFormDishImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>

                {/* Tên món & Mô tả */}
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Tên Món Ăn <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Bò Bít Tết Sốt Tiêu Đen..."
                      value={formDishTitle}
                      onChange={(e) => setFormDishTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Mô Tả Hương Vị & Đặc Điểm Món
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả hương vị, điểm đặc sắc của món..."
                      value={formDishDesc}
                      onChange={(e) => setFormDishDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>

                {/* Danh mục, Tác giả, Tag */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Danh Mục Chính (SRS 4)
                    </label>
                    <select
                      value={formDishCat}
                      onChange={(e) => setFormDishCat(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      {dishCategories.filter((c) => c !== 'Tất cả').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Phân Nhóm Phụ (Subcategory)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Món Âu, Canh..."
                      value={formDishSubCat}
                      onChange={(e) => setFormDishSubCat(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Tác Giả Công Thức
                    </label>
                    <input
                      type="text"
                      value={formDishAuthor}
                      onChange={(e) => setFormDishAuthor(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase mb-1">
                      Thẻ Khẩu Vị / Tags
                    </label>
                    <input
                      type="text"
                      placeholder="Healthy, Low Carb..."
                      value={formDishTags}
                      onChange={(e) => setFormDishTags(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* 4 Thẻ Thông số: Thời gian, Khẩu phần, Độ khó, Chi phí */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Thời Gian Chuẩn Bị / Nấu (p)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="Chuẩn bị"
                        value={formDishPrepTime}
                        onChange={(e) => setFormDishPrepTime(Number(e.target.value))}
                        className="w-1/2 p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-semibold"
                        title="Thời gian chuẩn bị (phút)"
                      />
                      <span className="text-slate-400">+</span>
                      <input
                        type="number"
                        placeholder="Nấu"
                        value={formDishCookTime}
                        onChange={(e) => setFormDishCookTime(Number(e.target.value))}
                        className="w-1/2 p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-semibold"
                        title="Thời gian nấu (phút)"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Khẩu Phần / Độ Khó
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={formDishServings}
                        onChange={(e) => setFormDishServings(Number(e.target.value))}
                        className="w-1/2 p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-semibold"
                        title="Số người ăn"
                      />
                      <select
                        value={formDishDifficulty}
                        onChange={(e) => setFormDishDifficulty(e.target.value as any)}
                        className="w-1/2 p-1 bg-slate-50 border border-slate-200 rounded text-xs"
                      >
                        <option value="Dễ">Dễ</option>
                        <option value="Trung bình">Vừa</option>
                        <option value="Khó">Khó</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-2 p-2.5 bg-white rounded-lg border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Chi Phí Ước Tính (SRS Module 15)
                      </span>
                      <span className="text-[10.5px] text-slate-500">
                        Ngân sách nguyên liệu dự kiến
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 w-36">
                      <input
                        type="number"
                        step="1000"
                        value={formDishCost}
                        onChange={(e) => setFormDishCost(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-right text-xs font-bold text-slate-900 font-mono"
                      />
                      <span className="text-slate-400 text-xs">đ</span>
                    </div>
                  </div>
                </div>

                {/* Macro Dinh dưỡng */}
                <div className="p-3 bg-white rounded-lg border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                      Thông Số Dinh Dưỡng (SRS Module 11)
                    </span>
                    <span className="text-[10.5px] text-slate-400">Khẩu phần chuẩn</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    <div>
                      <label className="text-[9.5px] text-slate-400 block mb-0.5">Calories</label>
                      <input
                        type="number"
                        value={formDishCalories}
                        onChange={(e) => setFormDishCalories(Number(e.target.value))}
                        className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-400 block mb-0.5">Protein(g)</label>
                      <input
                        type="number"
                        value={formDishProtein}
                        onChange={(e) => setFormDishProtein(Number(e.target.value))}
                        className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-400 block mb-0.5">Carbs(g)</label>
                      <input
                        type="number"
                        value={formDishCarbs}
                        onChange={(e) => setFormDishCarbs(Number(e.target.value))}
                        className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-400 block mb-0.5">Fat(g)</label>
                      <input
                        type="number"
                        value={formDishFat}
                        onChange={(e) => setFormDishFat(Number(e.target.value))}
                        className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-400 block mb-0.5">Fiber(g)</label>
                      <input
                        type="number"
                        value={formDishFiber}
                        onChange={(e) => setFormDishFiber(Number(e.target.value))}
                        className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-center text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI (7 phần): Nhập liệu Nguyên Liệu & Quy Trình Nấu Từng Bước */}
              <div className="lg:col-span-7 p-6 overflow-y-auto space-y-5 bg-white text-xs">
                {/* 1. Nhập danh sách nguyên liệu */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Danh Sách Nguyên Liệu Cần Thiết (Mỗi dòng 1 nguyên liệu)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Cú pháp: <code className="font-mono text-slate-600">Tên (Định lượng) - Ghi chú</code>
                    </span>
                  </div>
                  <textarea
                    rows={6}
                    value={formDishIngredientsRaw}
                    onChange={(e) => setFormDishIngredientsRaw(e.target.value)}
                    className="w-full p-3.5 bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-300 leading-relaxed"
                    placeholder="Thịt bò thăn ngoại (350g) - Chọn loại có vân mỡ đều&#10;Măng tây xanh (150g) - Bỏ phần gốc già&#10;Bơ lạt (20g)&#10;Tiêu đen xay vỡ (10g)"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Ví dụ: <em>Thịt gà phi lê (300g) - Rửa sạch để ráo</em> hoặc <em>Cà rốt (1 củ)</em>
                  </span>
                </div>

                {/* 2. Nhập các bước nấu kèm Timer */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Các Bước Thực Hiện Tuần Tự (Mỗi dòng 1 bước thực hiện)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Có thể gắn timer: <code className="font-mono text-slate-600">(Timer: số phút)</code>
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={formDishStepsRaw}
                    onChange={(e) => setFormDishStepsRaw(e.target.value)}
                    className="w-full p-3.5 bg-slate-50/70 border border-slate-200/90 rounded-lg text-xs font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-300 leading-relaxed"
                    placeholder="Ướp thịt bò với muối biển, tiêu đen trong 15 phút (Timer: 15)&#10;Áp chảo mỗi mặt 2-3 phút để đạt độ chín vừa (Timer: 5)&#10;Cho bơ, tỏi đập dập rưới đều lên mặt thịt rồi cho thịt nghỉ 5 phút (Timer: 5)&#10;Áp chảo măng tây và rưới nước sốt lên đĩa thưởng thức (Timer: 3)"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Hệ thống sẽ tự động chuyển các dòng thành timeline trực quan kèm đồng hồ đếm ngược Smart Timer cho người dùng Mobile.
                  </span>
                </div>
              </div>

              {/* Footer Modal Tối Giản */}
              <div className="col-span-1 lg:col-span-12 px-6 py-3.5 border-t border-slate-200/80 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-[11px] text-slate-400">
                  Dữ liệu lưu trữ sẽ tự động đồng bộ thời gian thực với Mobile App SmartCook
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDishModal(false)}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg transition-colors shadow-2xs"
                  >
                    {editingDish ? 'Lưu Thay Đổi Món Ăn' : 'Hoàn Tất Tạo Món'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THÊM / SỬA NGUYÊN LIỆU (CRUD)
      ========================================================================== */}
      {showIngModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                {editingIng ? 'Chỉnh Sửa Nguyên Liệu' : 'Thêm Nguyên Liệu Mới'}
              </h3>
              <button onClick={() => setShowIngModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIngredient} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Tên Nguyên Liệu</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thịt gà"
                  value={formIngName}
                  onChange={(e) => setFormIngName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Nhóm Thực Phẩm</label>
                <select
                  value={formIngGroupId}
                  onChange={(e) => setFormIngGroupId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {ingredientGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Đơn Vị Tính</label>
                  <input
                    type="text"
                    value={formIngUnit}
                    onChange={(e) => setFormIngUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">HSD Gợi Ý (ngày)</label>
                  <input
                    type="number"
                    value={formIngShelfLife}
                    onChange={(e) => setFormIngShelfLife(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  Từ Khóa Alias / Đồng Nghĩa (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="gà, ức gà, cánh gà..."
                  value={formIngSynonyms}
                  onChange={(e) => setFormIngSynonyms(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIngModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA MÓN ĂN ================= */}
      {deleteDishId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-5 rounded-3xl border border-slate-200 shadow-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Xác nhận xóa món ăn?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thao tác này sẽ xóa công thức khỏi cơ sở dữ liệu hệ thống SmartCook. Bạn có chắc chắn muốn tiếp tục?
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteDishId(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleteDish}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Xóa Vĩnh Viễn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA NGUYÊN LIỆU ================= */}
      {deleteIngId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white max-w-sm w-full p-5 rounded-3xl border border-slate-200 shadow-2xl space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Xác nhận xóa nguyên liệu?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nguyên liệu này sẽ bị xóa khỏi từ điển taxonomy. Bạn có chắc chắn không?
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteIngId(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDeleteIng}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TỪ CHỐI DUYỆT BÀI ĐÓNG GÓP ================= */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">Từ Chối Công Thức Đóng Góp</h4>
            <textarea
              rows={3}
              placeholder="Nhập lý do từ chối gửi cho tác giả..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-3.5 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (rejectModalId) {
                    rejectContribution(rejectModalId, rejectionReason || 'Nội dung chưa đạt tiêu chuẩn');
                    setRejectModalId(null);
                    setRejectionReason('');
                  }
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DishManagementPage;
