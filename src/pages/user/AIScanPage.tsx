import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChefHat, 
  Flame, 
  Clock, 
  RotateCcw,
  Zap,
  Info,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserHeader } from '../../components/user/UserHeader';

interface DetectedIngredient {
  name: string;
  confidence: number;
  category: string;
}

export const AIScanPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanCompleted, setScanCompleted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mocked AI scan results when uploading an image
  const [detectedIngredients, setDetectedIngredients] = useState<DetectedIngredient[]>([]);

  // Suggested dishes based on scan
  const suggestedDishes = [
    {
      id: 'seed-1',
      title: 'Thịt Kho Tàu Trứng Cút Nước Dừa',
      matchRate: '98% Nguyên liệu có sẵn',
      cookingTime: '45 phút',
      calories: '520 kcal',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      difficulty: 'Dễ',
    },
    {
      id: 'seed-3',
      title: 'Ức Gà Áp Chảo Sốt Bơ Tỏi',
      matchRate: '92% Nguyên liệu có sẵn',
      cookingTime: '15 phút',
      calories: '290 kcal',
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop&q=80',
      difficulty: 'Dễ',
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        startAIScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAIScan = () => {
    setIsScanning(true);
    setScanCompleted(false);

    // Simulate AI Vision recognition latency
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
      setDetectedIngredients([
        { name: 'Thịt ba chỉ heo', confidence: 99, category: 'Thịt tươi sống' },
        { name: 'Trứng gà ta', confidence: 97, category: 'Trứng & Sữa' },
        { name: 'Cà chua Đà Lạt', confidence: 95, category: 'Rau củ' },
        { name: 'Hành tím củ', confidence: 92, category: 'Gia vị tươi' },
        { name: 'Tỏi cô đơn', confidence: 94, category: 'Gia vị tươi' },
      ]);
    }, 1800);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setScanCompleted(false);
    setIsScanning(false);
    setDetectedIngredients([]);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* Header đồng bộ */}
      <UserHeader />

      {/* Decorative background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* Tiêu đề & Thông điệp công nghệ AI */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-700 text-xs font-extrabold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>SmartCook Vision AI 98% Độ Chính Xác</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Quét & Nhận Diện Nguyên Liệu Tủ Lạnh
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Hệ thống thị giác máy tính nhận dạng hơn 500+ loại thực phẩm Việt Nam chỉ trong 3 giây và tự động phân loại, kiểm tra hạn dùng và đề xuất món ăn phù hợp.
          </p>
        </div>

        {/* THÔNG BÁO THÂN THIỆN: Laptop không thể mang tới tủ lạnh chụp trực tiếp, khuyến khích tải App hoặc Upload ảnh */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-orange-200/90 rounded-3xl p-5 sm:p-6 shadow-xs backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 justify-center sm:justify-start">
                  <span>Trải nghiệm chụp ảnh trực tiếp 1 chạm tiện lợi trên điện thoại di động</span>
                  <span className="text-[10px] uppercase font-extrabold bg-orange-500 text-white px-2 py-0.5 rounded-full">Khuyên dùng</span>
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vì máy tính/laptop cồng kềnh khó di chuyển tới trước cửa tủ lạnh, trên website bạn có thể <b>tải ảnh thực phẩm từ máy lên</b> để AI nhận diện. Để chụp ảnh nhanh ngay tại gian bếp, hãy cài đặt ứng dụng <b>SmartCook Mobile</b>!
                </p>
              </div>
            </div>

            <a
              href="/#download"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tải App Cho Điện Thoại</span>
            </a>
          </div>
        </div>

        {/* KHU VỰC TẢI ẢNH TỪ LAPTOP VÀ QUÉT AI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT TRÁI: KHUNG UPLOAD VÀ HIỂN THỊ ẢNH */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" />
                <span>Ảnh Tủ Lạnh / Nguyên Liệu</span>
              </h3>
              {selectedImage && (
                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chọn ảnh khác</span>
                </button>
              )}
            </div>

            {/* Vùng Dropzone hoặc Preview */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer border-2 border-dashed border-orange-200 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50/80 rounded-2xl p-10 sm:p-14 text-center space-y-4 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white text-orange-500 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                  <Upload className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-slate-800">
                    Bấm để tải ảnh nguyên liệu từ máy tính của bạn
                  </p>
                  <p className="text-xs text-slate-500">
                    Hỗ trợ định dạng PNG, JPG, JPEG, WEBP (Dung lượng tối đa 10MB)
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-sm group-hover:bg-orange-600 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Chọn tệp từ máy tính</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                  <img
                    src={selectedImage}
                    alt="Scan preview"
                    className="w-full max-h-96 object-cover object-center"
                  />
                  
                  {/* Scanning Animation Laser Line */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 via-orange-400/40 to-orange-500/20 flex flex-col items-center justify-center">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse shadow-[0_0_15px_#f59e0b]" />
                      <div className="mt-4 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-orange-400/50 shadow-lg">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>AI đang phân tích từng đối tượng...</span>
                      </div>
                    </div>
                  )}

                  {scanCompleted && (
                    <div className="absolute top-3 left-3 bg-emerald-500/95 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã nhận diện thành công</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Đổi ảnh khác
                  </button>
                  <button
                    onClick={startAIScan}
                    disabled={isScanning}
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Quét lại AI</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CỘT PHẢI: KẾT QUẢ NHẬN DIỆN VÀ GỢI Ý MÓN ĂN */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Box 1: Danh sách nguyên liệu AI tìm thấy */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span>Nguyên Liệu Phát Hiện Được</span>
                </h3>
                {scanCompleted && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    5 Thực phẩm
                  </span>
                )}
              </div>

              {!selectedImage ? (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <Info className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Vui lòng tải ảnh lên ở cột bên trái để AI tự động trích xuất nguyên liệu</p>
                </div>
              ) : isScanning ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600">Đang đối chiếu dữ liệu với thư viện 500+ loại thực phẩm...</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {detectedIngredients.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/50 border border-orange-100 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.category}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-orange-600">
                          {item.confidence}%
                        </span>
                        <p className="text-[9px] text-slate-400">Độ tin cậy</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Box 2: Món ăn đề xuất tức thì dựa trên ảnh quét */}
            {scanCompleted && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-orange-500" />
                      <span>Món Ăn Gợi Ý Nấu Ngay</span>
                    </h3>
                    <p className="text-xs text-slate-500">Dựa trên 100% nguyên liệu vừa quét được</p>
                  </div>
                  <Link
                    to="/recipes"
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {suggestedDishes.map((dish) => (
                    <Link
                      key={dish.id}
                      to={`/recipe/${dish.id}`}
                      className="group flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-orange-300 hover:bg-orange-50/40 transition-all"
                    >
                      <img
                        src={dish.image}
                        alt={dish.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            {dish.matchRate}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-1 group-hover:text-orange-600 transition-colors">
                          {dish.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-orange-500" />
                            {dish.cookingTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-500" />
                            {dish.calories}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition-all shrink-0 mr-1" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
