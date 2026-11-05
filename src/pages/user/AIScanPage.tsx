import React, { useState, useRef, useEffect } from 'react';
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
  Refrigerator,
  History,
  Trash2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserHeader } from '../../components/user/UserHeader';
import { aiApi, type ScanIngredientResult, type ScanDetectedIngredient } from '../../api/ai.api';
import { NearbyStoresCard } from '../../components/supermarket/NearbyStoresCard';
import { fridgeApi } from '../../api/fridge.api';
import { useAuthStore } from '../../store/useAuthStore';
import { toast } from '../../context/ToastContext';
import { AuthRequiredModal } from '../../components/common/AuthRequiredModal';
import { PreviewModeBanner } from '../../components/common/PreviewModeBanner';

const foodIcons: Record<string, string> = {
  'silverware-fork-knife': '🍽️', 'food-drumstick': '🍗', 'fruit-cherries': '🍒', 'food-apple': '🍎', fish: '🐟', leaf: '🥬',
  'food-steak': '🥩', seed: '🌾', shaker: '🧂', 'bottle-tonic': '🥣', 'fruit-citrus': '🍋', egg: '🥚',
};

export const AIScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const scanRequestRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal yêu cầu đăng nhập khi chưa có tài khoản
  const [showAuthModal, setShowAuthModal] = useState<boolean>(!isAuthenticated);

  // Trạng thái chọn ảnh & phân tích
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanIngredientResult | null>(null);
  const [selectedTargetName, setSelectedTargetName] = useState<string | null>(null);
  const photoTargets: ScanDetectedIngredient[] = scanResult?.dishes?.length ? scanResult.dishes : scanResult?.ingredients || [];
  const selectedTarget = photoTargets.find(target => target.name === selectedTargetName) || photoTargets[0];
  const selectedIngredients = (scanResult?.ingredients || []).filter(item =>
    item.source !== 'inferred' && (!scanResult?.dishes?.length || (!!selectedTarget && item.dishNames?.includes(selectedTarget.name))));
  const hasIngredientLinks = (scanResult?.ingredients || []).some(item => item.dishNames?.length);
  const selectedTargetIndex = selectedTarget ? photoTargets.indexOf(selectedTarget) : -1;
  useEffect(() => { setSelectedTargetName(null); }, [scanResult]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trạng thái thêm nguyên liệu vào tủ lạnh
  const [addingToFridge, setAddingToFridge] = useState<boolean>(false);
  const [addedItemNames, setAddedItemNames] = useState<Set<string>>(new Set());
  const [fridgeNotification, setFridgeNotification] = useState<string | null>(null);

  // Trạng thái lịch sử quét
  const [scanHistory, setScanHistory] = useState<ScanIngredientResult[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'history'>('scanner');

  // Tải lịch sử quét khi mở trang (nếu đã đăng nhập)
  useEffect(() => {
    if (isAuthenticated) {
      loadScanHistory();
    }
  }, [isAuthenticated]);

  const loadScanHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await aiApi.getScanHistory(10);
      setScanHistory(history);
    } catch (err) {
      console.warn('Lỗi khi tải lịch sử quét:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Xử lý khi người dùng chọn file ảnh
  const handleFileSelect = (file: File) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      const msg = 'Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, JPEG, WEBP)';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const msg = 'Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn.';
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(localUrl);
    setAddedItemNames(new Set());
    setFridgeNotification(null);

    // Kích hoạt quét AI ngay khi chọn ảnh
    executeAIScan(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Kéo thả file
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Thực thi phân tích ảnh với Gemini Vision API
  const executeAIScan = async (fileToScan: File) => {
    const requestId = ++scanRequestRef.current;
    setScanResult(null);
    setIsScanning(true);
    setErrorMessage(null);

    try {
      const result = await aiApi.scanIngredients(fileToScan);
      if (requestId !== scanRequestRef.current) return;
      setScanResult(result);
      if (isAuthenticated) {
        loadScanHistory();
      }
    } catch (err: any) {
      if (requestId !== scanRequestRef.current) return;
      console.error('Lỗi khi quét ảnh AI:', err);
      setErrorMessage(err?.response?.data?.message || err?.message || 'Không thể phân tích ảnh lúc này. Vui lòng thử lại.');
    } finally {
      if (requestId === scanRequestRef.current) setIsScanning(false);
    }
  };

  const handleRescan = async () => {
    if (selectedFile) { await executeAIScan(selectedFile); return; }
    if (!previewUrl || isScanning) return;
    const imageUrl = previewUrl;
    const requestId = ++scanRequestRef.current;
    setIsScanning(true);
    setErrorMessage(null);
    setScanResult(null);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Không tải được ảnh lịch sử. Vui lòng chọn lại ảnh.');
      const blob = await response.blob();
      if (requestId !== scanRequestRef.current) return;
      const file = new File([blob], 'scan-history-photo', { type: blob.type });
      setSelectedFile(file);
      await executeAIScan(file);
    } catch (error) {
      if (requestId === scanRequestRef.current) setErrorMessage(error instanceof Error ? error.message : 'Không tải được ảnh. Vui lòng chọn lại ảnh.');
    } finally {
      if (requestId === scanRequestRef.current) setIsScanning(false);
    }
  };

  // Thêm 1 nguyên liệu vào tủ lạnh
  const handleAddSingleItemToFridge = async (ingredient: ScanDetectedIngredient) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      await fridgeApi.addItem({
        name: ingredient.name,
        category: ingredient.category || 'Rau củ',
        amount: '1 phần',
        storageLocation: 'chilled',
        note: `Nhận diện từ AI Scanner (${ingredient.confidence})`,
      });

      setAddedItemNames((prev) => new Set(prev).add(ingredient.name));
      toast.success(`Đã thêm "${ingredient.name}" vào Tủ Lạnh!`, {
        action: {
          label: 'Xem Tủ Lạnh',
          onClick: () => navigate('/kitchen')
        }
      });
      setFridgeNotification(`Đã thêm "${ingredient.name}" vào Tủ lạnh!`);
      setTimeout(() => setFridgeNotification(null), 3000);
    } catch (err) {
      console.error('Lỗi khi thêm vào tủ lạnh:', err);
      toast.error('Có lỗi khi thêm nguyên liệu vào tủ lạnh.');
    }
  };

  // Thêm tất cả nguyên liệu nhận diện vào tủ lạnh (1-Click)
  const handleAddAllToFridge = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!scanResult || selectedIngredients.length === 0) return;

    setAddingToFridge(true);
    let addedCount = 0;

    try {
      for (const ing of selectedIngredients) {
        if (ing.source !== 'inferred' && !addedItemNames.has(ing.name)) {
          await fridgeApi.addItem({
            name: ing.name,
            category: ing.category || 'Rau củ',
            amount: '1 phần',
            storageLocation: 'chilled',
            note: 'Tự động thêm từ AI Scanner',
          });
          addedCount++;
        }
      }

      setAddedItemNames(prev => new Set([...prev, ...selectedIngredients.map(item => item.name)]));
      toast.success(`🎉 Đã thêm thành công ${addedCount} nguyên liệu vào Tủ Lạnh!`, {
        action: {
          label: 'Xem Tủ Lạnh',
          onClick: () => navigate('/kitchen')
        }
      });
      setFridgeNotification(`🎉 Đã thêm thành công ${addedCount} nguyên liệu vào Tủ lạnh ("Bếp Của Tôi")!`);
      setTimeout(() => setFridgeNotification(null), 4000);
    } catch (err) {
      console.error('Lỗi khi thêm tất cả vào tủ lạnh:', err);
      toast.error('Có lỗi khi lưu nguyên liệu vào tủ lạnh. Vui lòng thử lại.');
      setFridgeNotification('Có lỗi khi lưu nguyên liệu vào tủ lạnh. Vui lòng thử lại.');
    } finally {
      setAddingToFridge(false);
    }
  };

  // Xóa ảnh làm lại từ đầu
  const handleReset = () => {
    ++scanRequestRef.current;
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setIsScanning(false);
    setErrorMessage(null);
    setAddedItemNames(new Set());
    setFridgeNotification(null);
    toast.info('Đã làm mới khu vực quét AI.');
  };

  // Xem lại một kết quả từ lịch sử
  const handleSelectHistoryItem = (item: ScanIngredientResult) => {
    ++scanRequestRef.current;
    setIsScanning(false);
    setScanResult(item);
    setPreviewUrl(item.imageUrl || item.image || null);
    setSelectedFile(null);
    setActiveTab('scanner');
    setAddedItemNames(new Set());
  };

  // Xóa một mục lịch sử
  const handleDeleteHistoryItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await aiApi.deleteScanHistory(id);
      setScanHistory((prev) => prev.filter((it) => it.id !== id && it._id !== id));
      toast.info('Đã xóa lượt quét khỏi lịch sử.');
    } catch (err) {
      console.error('Lỗi khi xóa lịch sử quét:', err);
      toast.error('Không thể xóa lịch sử quét.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-slate-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* Header đồng bộ */}
      <UserHeader />

      {/* Banner xem trước nếu chưa đăng nhập */}
      <PreviewModeBanner
        featureName="AI Camera Scan"
        onOpenAuthModal={() => setShowAuthModal(true)}
        redirectPath="/scan"
      />

      {/* Decorative background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-orange-200/20 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Tiêu đề & Thông điệp công nghệ AI */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-700 text-xs font-extrabold tracking-wide uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>Gemini Vision • Phân tích theo ảnh thực tế</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Quét & Nhận Diện Nguyên Liệu Tủ Lạnh
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Hệ thống thị giác máy tính nhận diện thực phẩm tức thì, gắn thẻ toạ độ trực quan (Bounding Pins), tự động đề xuất món ăn tối ưu và nạp thẳng vào tủ lạnh người dùng.
          </p>

          {/* Thanh chuyển tab Scanner / Lịch sử */}
          <div className="inline-flex p-1 bg-white border border-slate-200 rounded-2xl shadow-xs mt-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'scanner'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Máy Quét AI (Camera & Upload)</span>
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                  return;
                }
                setActiveTab('history');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-600'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Lịch Sử Quét Của Tôi</span>
              {scanHistory.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'history' ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'
                }`}>
                  {scanHistory.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* THÔNG BÁO TOAST KHI THÊM VÀO TỦ LẠNH THÀNH CÔNG */}
        {fridgeNotification && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{fridgeNotification}</span>
            </div>
            <Link
              to="/kitchen"
              className="px-3 py-1 bg-white text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-50 transition-colors shrink-0 flex items-center gap-1"
            >
              <Refrigerator className="w-3.5 h-3.5" />
              <span>Xem Tủ Lạnh</span>
            </Link>
          </div>
        )}

        {/* THÔNG BÁO LỖI NẾU CÓ */}
        {errorMessage && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: MÁY QUÉT ẢNH AI (SCANNER VIEW)
        ========================================================================== */}
        {activeTab === 'scanner' && (
          <>
            {/* THÔNG BÁO THÂN THIỆN: Laptop vs Mobile */}
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
                      Trên website bạn có thể <b>tải ảnh thực phẩm từ máy lên</b> để AI Gemini phân tích. Để chụp ảnh nhanh ngay tại trước cửa tủ lạnh, hãy cài đặt ứng dụng <b>SmartCook Mobile</b>!
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

            {/* KHU VỰC TẢI ẢNH VÀ HIỂN THỊ KẾT QUẢ QUÉT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* CỘT TRÁI: KHUNG UPLOAD VÀ HIỂN THỊ ẢNH CÓ BOUNDING PINS */}
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-orange-500" />
                    <span>Ảnh Tủ Lạnh / Nguyên Liệu</span>
                  </h3>
                  {previewUrl && (
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
                  onChange={handleInputChange}
                  accept="image/*"
                  className="hidden"
                />

                {!previewUrl ? (
                  <div 
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowAuthModal(true);
                        return;
                      }
                      fileInputRef.current?.click();
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="group cursor-pointer border-2 border-dashed border-orange-200 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50/80 rounded-2xl p-10 sm:p-14 text-center space-y-4 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white text-orange-500 flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-slate-800">
                        Kéo thả hoặc bấm để tải ảnh nguyên liệu từ máy tính
                      </p>
                      <p className="text-xs text-slate-500">
                        Hỗ trợ PNG, JPG, JPEG, WEBP (Tối đa 5MB)
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-sm group-hover:bg-orange-600 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Chọn tệp từ máy</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* KHUNG HIỂN THỊ ẢNH + LASER SCAN + BOUNDING PINS */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner group">
                      <img
                        src={previewUrl}
                        alt="Scan preview"
                        className="w-full h-auto block"
                      />
                      
                      {/* Scanning Animation Laser Line */}
                      {isScanning && (
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/20 via-orange-400/40 to-orange-500/20 flex flex-col items-center justify-center">
                          <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent animate-pulse shadow-[0_0_20px_#f59e0b]" />
                          <div className="mt-4 bg-slate-900/95 text-white px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2.5 border border-orange-400/60 shadow-xl backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                            <span>Gemini Vision đang bóc tách từng đối tượng...</span>
                          </div>
                        </div>
                      )}

                      {/* Only numbered dish markers occupy the photo; details appear one at a time. */}
                      {!isScanning && scanResult && (
                        <div className="absolute inset-0 pointer-events-none">
                          {photoTargets.map((target, index) => {
                            const pin = scanResult.pins.find(item => item.text === target.name);
                            if (!pin || !Number.isFinite(pin.top) || !Number.isFinite(pin.left) || pin.top < 0 || pin.top > 100 || pin.left < 0 || pin.left > 100) return null;
                            const isSelected = selectedTarget?.name === target.name;
                            return (
                              <button key={target.name} type="button"
                                aria-label={`Xem món ${index + 1}: ${target.name}`}
                                aria-pressed={isSelected} title={target.name}
                                onClick={() => setSelectedTargetName(target.name)}
                                style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto min-w-10 h-10 px-2 rounded-full border-2 shadow-lg flex items-center justify-center gap-1 text-xs font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 ${isSelected ? 'bg-orange-500 text-white border-white ring-4 ring-orange-400/30 z-20' : 'bg-white/95 text-slate-800 border-orange-300 z-10 hover:bg-orange-50'}`}>
                                <span aria-hidden="true">{foodIcons[target.icon || pin.icon || 'silverware-fork-knife'] || '🍽️'}</span>
                                <span>{index + 1}</span>
                              </button>
                            );
                          })}
                          {selectedTarget && (
                            <div className="absolute bottom-3 inset-x-3 rounded-2xl bg-slate-900/95 text-white shadow-lg px-3 py-2.5 flex items-center gap-3 border border-white/15" aria-live="polite" aria-atomic="true">
                              <span className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shrink-0 text-sm font-extrabold">{selectedTargetIndex + 1}</span>
                              <span className="text-xl" aria-hidden="true">{foodIcons[selectedTarget.icon || 'silverware-fork-knife'] || '🍽️'}</span>
                              <div className="min-w-0 flex-1"><p className="text-xs font-bold leading-relaxed break-words">{selectedTarget.name}</p><p className="text-[10px] text-slate-300 mt-0.5">Độ tin cậy AI ước tính: {selectedTarget.confidence}</p></div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Badge trạng thái hoàn thành */}
                      {!isScanning && scanResult && (
                        <div className="absolute top-3 left-3 bg-emerald-500/95 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>AI tự ước tính độ tin cậy: {scanResult.accuracy}%</span>
                        </div>
                      )}
                    </div>

                    {scanResult && photoTargets.length > 0 && <p className="text-xs text-slate-500 text-center">Chọn số trên ảnh hoặc chọn món trong danh sách để xem chi tiết.</p>}
                    <div className="flex gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Đổi ảnh khác</span>
                      </button>
                      
                      {previewUrl && (
                        <button
                          onClick={handleRescan}
                          disabled={isScanning}
                          className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>{isScanning ? 'Đang phân tích...' : 'Quét lại AI'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CỘT PHẢI: KẾT QUẢ NHẬN DIỆN VÀ GỢI Ý MÓN ĂN */}
              <div className="lg:col-span-6 space-y-6">
                
                {scanResult && photoTargets.length > 0 && (
                  <section className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-4" aria-label="Danh sách món trong ảnh">
                    <div><h3 className="font-bold text-base text-slate-900 flex items-center gap-2"><ChefHat className="w-5 h-5 text-orange-500" />{scanResult.dishes?.length ? 'Món ăn trong ảnh' : 'Thực phẩm trong ảnh'} ({photoTargets.length})</h3><p className="text-xs text-slate-500 mt-1">Số thứ tự tương ứng với dấu trên ảnh.</p></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
                      {photoTargets.map((target, index) => (
                        <button key={target.name} type="button" aria-pressed={selectedTarget?.name === target.name} onClick={() => setSelectedTargetName(target.name)}
                          className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl border transition-colors focus-visible:outline-2 focus-visible:outline-orange-500 ${selectedTarget?.name === target.name ? 'bg-orange-50 border-orange-400 ring-1 ring-orange-200' : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/40'}`}>
                          <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-extrabold ${selectedTarget?.name === target.name ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{index + 1}</span>
                          <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-slate-900 leading-relaxed break-words"><span aria-hidden="true">{foodIcons[target.icon || 'silverware-fork-knife'] || '🍽️'}</span> {target.name}</span><span className="block text-[10px] text-slate-500 mt-1">AI ước tính · {target.confidence}</span></span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Kết quả và độ tin cậy do AI ước tính. Hãy kiểm tra lại trước khi sử dụng.</p>
                  </section>
                )}

                {/* Box 1: Danh sách nguyên liệu AI tìm thấy */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <span>{scanResult?.dishes?.length ? 'Nguyên liệu của món' : 'Nguyên liệu nhận diện'} ({selectedIngredients.length})</span>
                      </h3>
                      {scanResult?.title && (
                        <p className="text-xs text-slate-400 mt-0.5">{scanResult.dishes?.length ? selectedTarget?.name : scanResult.title}</p>
                      )}
                    </div>

                    {scanResult && selectedIngredients.length > 0 && (
                      <button
                        onClick={handleAddAllToFridge}
                        disabled={addingToFridge}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 active:scale-95"
                      >
                        <Refrigerator className="w-3.5 h-3.5" />
                        <span>{addingToFridge ? 'Đang thêm...' : (scanResult?.dishes?.length ? 'Thêm nguyên liệu món này' : 'Thêm nguyên liệu vào tủ lạnh')}</span>
                      </button>
                    )}
                  </div>

                  {!previewUrl ? (
                    <div className="text-center py-10 text-slate-400 space-y-2">
                      <Info className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs">Vui lòng tải ảnh lên ở cột bên trái để AI tự động trích xuất nguyên liệu</p>
                    </div>
                  ) : isScanning ? (
                    <div className="py-12 text-center space-y-3">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-slate-600">Đang phân tích món ăn và nguyên liệu trong ảnh...</p>
                    </div>
                  ) : scanResult && selectedIngredients.length > 0 ? (
                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                      {selectedIngredients.map((item: ScanDetectedIngredient, idx: number) => {
                        const isAdded = addedItemNames.has(item.name);
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/50 border border-orange-100 hover:border-orange-200 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                                <span aria-hidden="true">{foodIcons[item.icon || 'silverware-fork-knife'] || '🍽️'}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 break-words">{item.name}</p>
                                <p className="text-[10px] text-slate-500 break-words">{item.evidence || item.category || 'Quan sát trong ảnh'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="text-xs font-extrabold text-orange-600">
                                  {typeof item.confidence === 'number' ? `${item.confidence}%` : item.confidence}
                                </span>
                                <p className="text-[9px] text-slate-400">Độ tin cậy</p>
                              </div>

                              <button
                                onClick={() => handleAddSingleItemToFridge(item)}
                                disabled={isAdded || item.source === 'inferred'}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                                  isAdded
                                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                    : 'bg-white border border-slate-200 hover:border-orange-400 hover:text-orange-600 text-slate-700 shadow-2xs'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Đã thêm</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    <span>Tủ lạnh</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      {errorMessage ? 'Chưa có kết quả nhận diện vì lượt quét chưa thành công. Vui lòng xem thông báo lỗi ở trên.' : scanResult?.dishes?.length && !hasIngredientLinks ? 'Lần quét này chưa có liên kết nguyên liệu theo món. Vui lòng quét lại ảnh để phân tích từng món.' : 'Chưa xác định rõ nguyên liệu nhìn thấy của món này. Hệ thống không tự suy đoán gia vị hoặc thành phần bị che.'}
                    </div>
                  )}
                </div>

                {scanResult && <NearbyStoresCard />}

                {/* Box 2: Món ăn đề xuất tức thì dựa trên ảnh quét */}
                {scanResult && scanResult.suggestedRecipe && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          <ChefHat className="w-5 h-5 text-orange-500" />
                          <span>Món Ăn Gợi Ý Nấu Ngay</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tối ưu từ các nguyên liệu tìm thấy ({scanResult.suggestedRecipe.matchPercent ?? 0}% trùng khớp)
                        </p>
                      </div>
                      <Link
                        to="/recipes"
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                      >
                        <span>Khám phá thêm</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="p-4 rounded-2xl border border-orange-200/80 bg-gradient-to-br from-orange-50/60 to-amber-50/40 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Đạt {scanResult.suggestedRecipe.matchPercent || 95}% Nguyên liệu sẵn có
                          </span>
                          <h4 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                            {scanResult.suggestedRecipe.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {scanResult.suggestedRecipe.desc}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-orange-100 text-xs">
                        <div className="flex items-center gap-4 text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-orange-500" />
                            <span>{scanResult.suggestedRecipe.durationMinutes ?? 0} phút</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{scanResult.suggestedRecipe.calories ?? 0} kcal</span>
                          </span>
                        </div>

                        <Link
                          to={scanResult.suggestedRecipe.recipeId ? `/recipe/${scanResult.suggestedRecipe.recipeId}` : '/recipes'}
                          className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <span>Xem cách nấu</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </>
        )}

        {/* =========================================================================
            TAB 2: LỊCH SỬ CÁC LẦN QUÉT (SCAN HISTORY VIEW)
        ========================================================================== */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-orange-500" />
                  <span>Nhật Ký Quét Thực Phẩm Gần Đây</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lưu trữ kết quả bóc tách nguyên liệu và gợi ý món ăn từ các lần quét trước của bạn.
                </p>
              </div>

              <button
                onClick={loadScanHistory}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm mới</span>
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500">Đang tải lịch sử quét...</p>
              </div>
            ) : scanHistory.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <Camera className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Chưa có lịch sử quét nào</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy tải ảnh thực phẩm lên ở tab Máy Quét để AI nhận diện và lưu trữ kết quả nhé!
                </p>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-orange-600 transition-colors"
                >
                  Quét ảnh ngay
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {scanHistory.map((item) => (
                  <div
                    key={item.id || item._id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="group cursor-pointer rounded-2xl border border-slate-200 hover:border-orange-300 bg-white hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Ảnh scan */}
                      <div className="relative h-40 bg-slate-900 overflow-hidden">
                        <img
                          src={item.imageUrl || item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold">
                          {item.scannedAt || 'Đã lưu'}
                        </div>
                        <button
                          onClick={(e) => handleDeleteHistoryItem(e, item.id || item._id || '')}
                          title="Xóa bản ghi này"
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-white text-xs transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Thông tin */}
                      <div className="p-4 space-y-2.5">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                          {item.title || 'Quét thực phẩm'}
                        </h4>

                        <div className="flex flex-wrap gap-1.5">
                          {item.ingredients.slice(0, 4).map((ing, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100"
                            >
                              {ing.name}
                            </span>
                          ))}
                          {item.ingredients.length > 4 && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                              +{item.ingredients.length - 4} nữa
                            </span>
                          )}
                        </div>

                        {item.suggestedRecipe && (
                          <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                            <ChefHat className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="truncate">{item.suggestedRecipe.title}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-emerald-600">
                        {item.accuracy}% độ tin cậy AI ước tính
                      </span>
                      <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal yêu cầu đăng nhập khi khách tương tác */}
      <AuthRequiredModal
        isOpen={showAuthModal && !isAuthenticated}
        onClose={() => setShowAuthModal(false)}
        featureType="camera"
        redirectPath="/scan"
      />
    </div>
  );
};
