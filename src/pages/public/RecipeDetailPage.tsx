import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recipeApi } from '../../api/recipe.api';
import type { Recipe } from '../../types';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // Timer State for Cooking Mode
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min default
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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

  // Sample default recipe if seeded or API unavailable
  const recipe: Recipe = recipeData || {
    _id: id || '1',
    title: 'Thịt Kho Tàu Trứng Cút Nước Dừa Xiêm',
    description: 'Món ăn quốc hồn quốc tuý của người Việt với từng miếng thịt ba rọi mềm tan trong miệng, thấm đẫm vị ngọt tự nhiên của dừa xiêm Bến Tre và những quả trứng cút bùi ngậy.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80',
    category: 'Gia đình',
    cookingTimeMinutes: 45,
    difficulty: 'Trung bình',
    servingsCount: 4,
    nutrition: {
      calories: 520,
      proteinGrams: 32,
      carbsGrams: 12,
      fatGrams: 38,
    },
    ingredients: [
      { name: 'Thịt ba rọi rút sườn', amount: 500, unit: 'g', notes: 'Cắt khối vuông 3x3cm' },
      { name: 'Trứng cút', amount: 15, unit: 'quả', notes: 'Luộc chín bóc vỏ' },
      { name: 'Nước dừa tươi xiêm', amount: 400, unit: 'ml' },
      { name: 'Nước mắm ngon', amount: 3, unit: 'thìa canh' },
      { name: 'Hành tím & tỏi băm', amount: 2, unit: 'củ' },
      { name: 'Đường phèn hoặc nước màu dừa', amount: 1, unit: 'thìa' },
    ],
    steps: [
      {
        stepNumber: 1,
        instruction: 'Thịt ba rọi rửa sạch với nước muối loãng, chần qua nước sôi 2 phút để sạch bọt rồi vớt ra để ráo, cắt khối vuông vừa ăn.',
        timerMinutes: 2,
      },
      {
        stepNumber: 2,
        instruction: 'Ướp thịt với hành tỏi băm, 2 thìa nước mắm ngon, 1 thìa đường phèn, hạt tiêu trong 20 phút cho thấm gia vị.',
        timerMinutes: 20,
      },
      {
        stepNumber: 3,
        instruction: 'Bắc nồi lên bếp, cho 1 thìa dầu ăn và đảo thịt săn lại. Đổ nước dừa tươi vào ngập mặt thịt, đun sôi rồi hạ lửa nhỏ liu riu vớt bọt.',
        timerMinutes: 30,
      },
      {
        stepNumber: 4,
        instruction: 'Khi thịt bắt đầu mềm, cho trứng cút vào kho cùng thêm 15 phút đến khi nước kho sánh vàng cánh gián thì tắt bếp.',
        timerMinutes: 15,
      },
    ],
    ratingAverage: 4.9,
    ratingsCount: 48,
    createdAt: new Date().toISOString(),
  };

  const toggleIngredientCheck = (name: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <Link
        to="/recipes"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại kho công thức</span>
      </Link>

      {/* Recipe Header Card */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2">
        <div className="h-72 md:h-full relative overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-800 shadow-sm">
              {recipe.category}
            </span>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-sm">
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit'] leading-snug">
              {recipe.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div>
              <Clock className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Thời gian</div>
              <div className="font-bold text-xs sm:text-sm text-slate-800">{recipe.cookingTimeMinutes} phút</div>
            </div>
            <div>
              <Flame className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Năng lượng</div>
              <div className="font-bold text-xs sm:text-sm text-slate-800">{recipe.nutrition.calories} kcal</div>
            </div>
            <div>
              <Users className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-[11px] text-slate-400">Khẩu phần</div>
              <div className="font-bold text-xs sm:text-sm text-slate-800">{recipe.servingsCount} người</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all ${
                isFavorite
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isFavorite ? 'Đã Lưu Yêu Thích' : 'Lưu Yêu Thích'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Content: Ingredients & Cooking Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingredients Checklist */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Nguyên Liệu Cần Có</h3>
            <span className="text-xs text-slate-400 font-medium">{recipe.ingredients.length} nguyên liệu</span>
          </div>

          <p className="text-xs text-slate-500">Tick chọn những nguyên liệu bạn đã chuẩn bị sẵn sàng:</p>

          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[ing.name];
              return (
                <li
                  key={idx}
                  onClick={() => toggleIngredientCheck(ing.name)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-400 line-through'
                      : 'bg-slate-50 hover:bg-slate-100 border-transparent text-slate-800'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div className="text-xs flex-1">
                    <span className="font-bold">{ing.name}</span>: {ing.amount} {ing.unit}
                    {ing.notes && <span className="text-slate-400 block text-[11px] font-normal not-italic">{ing.notes}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cooking Steps & Built-in Timer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Timer Widget */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg border border-slate-700 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đồng Hồ Hẹn Giờ Bếp</span>
              </div>
              <div className="text-3xl font-extrabold font-mono tracking-tight mt-1">
                {formatTimer(timerSeconds)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-md"
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(300);
                }}
                className="w-11 h-11 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Steps List */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit']">Các Bước Thực Hiện</h3>

            <div className="space-y-6">
              {recipe.steps.map((step) => (
                <div key={step.stepNumber} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {step.instruction}
                    </p>
                    {step.timerMinutes && (
                      <button
                        onClick={() => {
                          setTimerSeconds(step.timerMinutes! * 60);
                          setIsTimerRunning(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Hẹn giờ {step.timerMinutes} phút cho bước này</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
