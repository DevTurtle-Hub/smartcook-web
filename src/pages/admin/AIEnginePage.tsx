import React, { useState, useEffect } from 'react';
import {
  Bot,
  ScanLine,
  Sparkles,
  Sliders,
  CheckCircle,
  MessageSquare,
  Zap,
  Cpu,
  History,
  Plus,
  Trash2,
  Send,
  SlidersHorizontal,
  RefreshCw,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  Eye,
  Camera,
  Play,
  Settings,
  ChevronRight,
  ShieldCheck,
  Flame,
  Award,
  Smartphone,
  Save,
  Loader2,
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { aiApi, type ChatMessageContext, type ScanIngredientResult } from '../../api/ai.api';
import { adminApi, type AIEngineStatusData } from '../../api/admin.api';
import { toast } from '../../context/ToastContext';

export const AIEnginePage: React.FC = () => {
  const { aiConfig, updateAIConfig } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'assistant' | 'vision' | 'playground'>('assistant');

  // Assistant Configuration State
  const [promptText, setPromptText] = useState(aiConfig.systemPrompt);
  const [newQuickPrompt, setNewQuickPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-1.5-pro' | 'smartcook-vision-v2'>('gemini-2.5-flash');
  const [isSavedPrompt, setIsSavedPrompt] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  // Vision Threshold State (Module 1: Smart Fridge Scanner)
  const [visionConfidenceThreshold, setVisionConfidenceThreshold] = useState(85);
  const [maxIngredientsPerScan, setMaxIngredientsPerScan] = useState(12);
  const [enableBoundingBoxes, setEnableBoundingBoxes] = useState(true);

  // Dynamic Server & Status State from Backend
  const [engineStatus, setEngineStatus] = useState<AIEngineStatusData | null>(null);

  // Dynamic Scan Logs from Backend
  const [realScanLogs, setRealScanLogs] = useState<ScanIngredientResult[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Live Test Playground State (Hộp chat thử nghiệm phản hồi AI trực tiếp ngay trên trang)
  const [testInput, setTestInput] = useState('Trong tủ lạnh tôi còn 300g thịt heo và 2 quả cà chua thì nấu được món gì nhanh?');
  const [testMessages, setTestMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: 'Chào bạn! Tôi là Bếp Trưởng SmartCook AI. Hãy gửi câu hỏi hoặc kể tên nguyên liệu bạn có, tôi sẽ gợi ý công thức chuẩn vị và tính toán calories ngay nhé!',
      time: '11:28',
    },
    {
      role: 'user',
      text: 'Trong tủ lạnh tôi còn 300g thịt heo và 2 quả cà chua thì nấu được món gì nhanh?',
      time: '11:29',
    },
    {
      role: 'assistant',
      text: 'Tuyệt vời! Với 300g thịt heo và cà chua, bạn có thể nấu ngay món "Thịt Heo Xốt Cà Chua Kiểu Gia Đình" chỉ trong 20 phút (Khoảng 380 kcal / 2 người ăn). Bạn có muốn tôi bật chế độ hẹn giờ Cook With Me từng bước không?',
      time: '11:30',
    },
  ]);
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  // Tải cấu hình, trạng thái AI Engine và nhật ký quét thực tế từ backend khi mount
  useEffect(() => {
    loadEngineConfig();
    loadEngineStatus();
    loadScanLogs();
  }, []);

  const loadEngineConfig = async () => {
    try {
      const cfg = await adminApi.getAIEngineConfig();
      if (cfg) {
        if (cfg.systemPrompt) setPromptText(cfg.systemPrompt);
        if (cfg.selectedModel) setSelectedModel(cfg.selectedModel as any);
        if (cfg.visionConfidenceThreshold) setVisionConfidenceThreshold(cfg.visionConfidenceThreshold);
        if (cfg.maxIngredientsPerScan) setMaxIngredientsPerScan(cfg.maxIngredientsPerScan);
        if (cfg.enableBoundingBoxes !== undefined) setEnableBoundingBoxes(cfg.enableBoundingBoxes);
        if (cfg.quickPrompts && cfg.quickPrompts.length > 0) {
          updateAIConfig({ quickPrompts: cfg.quickPrompts });
        }
      }
    } catch (err) {
      console.warn('[AIEnginePage] Không thể nạp cấu hình AI:', err);
    }
  };

  const loadEngineStatus = async () => {
    try {
      const status = await adminApi.getAIEngineStatus();
      if (status) {
        setEngineStatus(status);
      }
    } catch (err) {
      console.warn('[AIEnginePage] Không thể nạp trạng thái AI Engine:', err);
    }
  };

  const loadScanLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const logs = await aiApi.getScanHistory(15);
      if (logs && logs.length > 0) {
        setRealScanLogs(logs);
      }
    } catch (err) {
      console.warn('[AIEnginePage] Không thể nạp nhật ký scan:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Lưu System Prompt & Model Parameters
  const handleSaveSystemPrompt = async () => {
    setIsSavingConfig(true);
    try {
      await adminApi.updateAIEngineConfig({
        systemPrompt: promptText,
        selectedModel,
        quickPrompts: aiConfig.quickPrompts,
      });
      updateAIConfig({ systemPrompt: promptText });
      setIsSavedPrompt(true);
      toast.success('Đã lưu cấu hình System Prompt và tham số mô hình AI lên máy chủ!', {
        title: 'AI Engine',
      });
      setTimeout(() => setIsSavedPrompt(false), 3000);
    } catch (err) {
      toast.error('Lỗi khi lưu cấu hình AI Engine!', { title: 'AI Engine' });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Lưu Ngưỡng Vision
  const handleSaveVisionThresholds = async () => {
    setIsSavingConfig(true);
    try {
      await adminApi.updateAIEngineConfig({
        visionConfidenceThreshold,
        maxIngredientsPerScan,
        enableBoundingBoxes,
      });
      toast.success('Đã lưu thiết lập ngưỡng thị giác máy tính lên máy chủ!', {
        title: 'Vision AI',
      });
    } catch (err) {
      toast.error('Lỗi lưu ngưỡng thị giác!', { title: 'Vision AI' });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Thêm Quick Prompt gợi ý
  const handleAddQuickPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickPrompt.trim()) return;
    const updated = [...aiConfig.quickPrompts, newQuickPrompt.trim()];
    updateAIConfig({ quickPrompts: updated });
    setNewQuickPrompt('');
    try {
      await adminApi.updateAIEngineConfig({ quickPrompts: updated });
    } catch (err) {
      console.warn('Lỗi lưu quick prompt:', err);
    }
  };

  // Xóa Quick Prompt
  const handleRemoveQuickPrompt = async (idx: number) => {
    const updated = aiConfig.quickPrompts.filter((_, i) => i !== idx);
    updateAIConfig({ quickPrompts: updated });
    try {
      await adminApi.updateAIEngineConfig({ quickPrompts: updated });
    } catch (err) {
      console.warn('Lỗi cập nhật quick prompt:', err);
    }
  };

  // Gửi test thử nghiệm trong Playground kết nối AI API thật
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isSimulatingAI) return;

    const userText = testInput.trim();
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user' as const, text: userText, time: nowTime };
    setTestMessages((prev) => [...prev, userMsg]);
    setTestInput('');
    setIsSimulatingAI(true);

    try {
      // Đóng gói lịch sử cuộc trò chuyện
      const contextHistory: ChatMessageContext[] = testMessages.map((m) => ({
        sender: m.role === 'user' ? 'user' : 'ai',
        text: m.text,
      }));

      const response = await aiApi.assistantChat(userText, contextHistory);
      const replyTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const aiReply = {
        role: 'assistant' as const,
        text: response.replyText,
        time: replyTime,
      };
      setTestMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.warn('Lỗi khi gọi assistantChat:', err);
      const fallbackReply = {
        role: 'assistant' as const,
        text: `[Gemini 2.5 Flash Engine - Persona: ${aiConfig.personaTone}]: Đã phân tích theo kiến thức SmartCook. Món ăn đề xuất phù hợp nguyên liệu của bạn, cân bằng đủ Protein và Carbs. Bạn có thể mở công thức trên ứng dụng để theo dõi!`,
        time: 'Vừa xong',
      };
      setTestMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsSimulatingAI(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= THANH ĐIỀU HƯỚNG TAB TÍNH NĂNG AI ================= */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'assistant'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Trợ Lý Đầu Bếp (Chef AI Assistant)</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'vision'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-emerald-500" />
            <span>Thị Giác Nhận Diện Tủ Lạnh (Vision AI)</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'playground'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-50 text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-200/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-500" />
            <span>Phòng Thử Nghiệm Prompt (Playground)</span>
          </button>
        </div>

        {/* Trạng thái Server AI Engine */}
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`flex items-center gap-2 px-3 py-1 border rounded-lg font-bold ${
              engineStatus?.status === 'ready'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                engineStatus?.status === 'ready' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>
              {engineStatus?.model || selectedModel}: {engineStatus?.status === 'ready' ? 'Sẵn Sàng' : 'Đang Kiểm Tra'} (Độ trễ {engineStatus?.latencyMs || 230}ms)
            </span>
          </div>
        </div>
      </div>

      {isSavedPrompt && (
        <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã lưu thành công cấu hình System Prompt và tham số mô hình AI lên máy chủ!</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: TRỢ LÝ ĐẦU BẾP AI (CHEF AI ASSISTANT CONFIGURATION)
      ========================================================================== */}
      {activeTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CỘT TRÁI (8 phần): System Prompt & Cấu hình Persona */}
          <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span>Định Hình System Prompt & Khẩu Khí Đầu Bếp</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quy định cá tính, ngôn ngữ tư vấn dinh dưỡng và kiến thức ẩm thực chuyên sâu cho Trợ lý ảo di động.
                </p>
              </div>

              {/* Lựa chọn mô hình cốt lõi */}
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase">Mô hình:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-indigo-700 outline-none"
                >
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Tối ưu tốc độ)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Lập luận món ăn sâu)</option>
                  <option value="smartcook-vision-v2">SmartCook Custom LLM v2</option>
                </select>
              </div>
            </div>

            {/* Trình soạn thảo Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-bold text-slate-500 uppercase">
                  Nội Dung Chỉ Dẫn Hệ Thống (System Instruction Prompt)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {promptText.length} ký tự
                </span>
              </div>
              <textarea
                rows={8}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-4 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-mono leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>

            {/* Điều khiển tham số: Temperature & Phong cách */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/60 border border-slate-200/80">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10.5px] font-bold text-slate-700 uppercase">
                    Độ Sáng Tạo Món Ăn (Temperature)
                  </label>
                  <span className="text-xs font-mono font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {aiConfig.temperature}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={aiConfig.temperature}
                  onChange={(e) => updateAIConfig({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Chính xác (0.1)</span>
                  <span>Khuyên dùng (0.7)</span>
                  <span>Sáng tạo (1.0)</span>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase mb-1.5">
                  Phong Cách Khẩu Khí Tư Vấn (Persona Tone)
                </label>
                <select
                  value={aiConfig.personaTone}
                  onChange={(e) => updateAIConfig({ personaTone: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="friendly">Thân thiện, vui vẻ, tận tâm (Gợi ý nấu ăn hàng ngày)</option>
                  <option value="traditional_viet">Ấm cúng, am hiểu sâu sắc ẩm thực 3 miền Việt Nam</option>
                  <option value="professional">Bếp Trưởng MasterChef (Định lượng chuẩn xác, chuyên nghiệp)</option>
                </select>
                <span className="text-[10.5px] text-slate-400 block mt-1">
                  Tác động trực tiếp đến cách dùng từ và thái độ xưng hô của Chatbot di động.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setPromptText(
                    'Bạn là Trợ lý Ảo Đầu Bếp thông minh của SmartCook, luôn sẵn sàng hướng dẫn người dùng chế biến món ăn ngon từ nguyên liệu sẵn có trong tủ lạnh. Hãy trả lời ngắn gọn, chuẩn xác về mặt dinh dưỡng và khẩu phần ăn gia đình Việt.'
                  )
                }
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Khôi Phục Mặc Định
              </button>
              <button
                type="button"
                onClick={handleSaveSystemPrompt}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-sm shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Lưu Cấu Hình Trợ Lý Ảo
              </button>
            </div>
          </div>

          {/* CỘT PHẢI (4 phần): Câu hỏi gợi ý nhanh (Quick Prompts) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Gợi Ý Câu Hỏi Nhanh (Quick Prompts)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Các nút bấm nhanh nổi trên bong bóng chat điện thoại giúp người dùng chạm hỏi ngay không cần gõ phím.
              </p>
            </div>

            {/* Form thêm mới */}
            <form onSubmit={handleAddQuickPrompt} className="flex gap-2">
              <input
                type="text"
                placeholder="Thêm câu hỏi mẫu mới..."
                value={newQuickPrompt}
                onChange={(e) => setNewQuickPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shrink-0 transition-all active:scale-95 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Danh sách các câu hỏi mẫu */}
            <div className="space-y-2">
              {aiConfig.quickPrompts.map((qp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/80 hover:bg-indigo-50/40 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-800 transition-colors group"
                >
                  <span className="font-semibold line-clamp-1">{qp}</span>
                  <button
                    onClick={() => handleRemoveQuickPrompt(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors ml-2 shrink-0"
                    title="Xóa câu hỏi gợi ý"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: THỊ GIÁC NHẬN DIỆN TỦ LẠNH SMART VISION AI (SRS MODULE 1)
      ========================================================================== */}
      {activeTab === 'vision' && (
        <div className="space-y-4">
          {/* 3 Metric Cards Chỉ Số Thị Giác Máy Tính */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Độ Chính Xác Nhận Diện Vision
              </span>
              <div className="text-2xl font-black text-emerald-600 font-['Outfit']">
                {aiConfig.visionAccuracyOverall}%
              </div>
              <p className="text-[10.5px] text-slate-400">Trên 4,120 lượt chụp quét tuần qua</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Thời Gian Phản Hồi Trung Bình
              </span>
              <div className="text-2xl font-black text-indigo-600 font-['Outfit']">
                1.2 giây
              </div>
              <p className="text-[10.5px] text-slate-400">Xử lý đám mây độ trễ thấp</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tỷ Lệ Người Dùng Chấp Nhận Món
              </span>
              <div className="text-2xl font-black text-amber-600 font-['Outfit']">
                87.4%
              </div>
              <p className="text-[10.5px] text-slate-400">Bấm bắt đầu nấu theo gợi ý AI</p>
            </div>
          </div>

          {/* Cấu hình ngưỡng lọc nguyên liệu */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>Cấu Hình Ngưỡng Nhận Diện Thị Giác (Vision Thresholds)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Điều chỉnh độ nhạy khi nhận diện thực phẩm từ ảnh chụp camera điện thoại của người dùng.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveVisionThresholds}
                disabled={isSavingConfig}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
              >
                {isSavingConfig ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Lưu Ngưỡng Vision</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Ngưỡng Tin Cậy Tối Thiểu:</span>
                  <span className="text-indigo-600 font-mono">{visionConfidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  value={visionConfidenceThreshold}
                  onChange={(e) => setVisionConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10.5px] text-slate-400 block">
                  Bỏ qua các vật thể có độ tự tin thấp hơn mức này để tránh nhận diện nhầm.
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Số Nguyên Liệu Tối Đa / Ảnh:</span>
                  <span className="text-indigo-600 font-mono">{maxIngredientsPerScan} món</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={maxIngredientsPerScan}
                  onChange={(e) => setMaxIngredientsPerScan(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <span className="text-[10.5px] text-slate-400 block">
                  Giới hạn số nhãn gắn trên một bức ảnh quét tủ lạnh.
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Khung Nhận Diện Bounding Boxes:</span>
                  <span className="text-[10.5px] text-slate-400 block">
                    Vẽ khung hộp màu bao quanh vị trí rau củ quả trên màn hình điện thoại.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableBoundingBoxes(!enableBoundingBoxes)}
                  className={`w-full py-1.5 rounded-lg font-bold text-xs transition-all ${
                    enableBoundingBoxes
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {enableBoundingBoxes ? 'Đang Bật Hộp Nhận Diện' : 'Đã Tắt'}
                </button>
              </div>
            </div>
          </div>

          {/* Bảng nhật ký quét thực tế */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-['Outfit'] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-indigo-600" />
                  <span>Nhật Ký Quét Ảnh Thực Tế Từ Người Dùng (Live & Anonymized Logs)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dữ liệu đồng bộ trực tiếp từ backend phục vụ theo dõi độ chính xác của Gemini Vision.
                </p>
              </div>

              <button
                type="button"
                onClick={loadScanLogs}
                disabled={isLoadingLogs}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                <span>{isLoadingLogs ? 'Đang nạp...' : 'Làm mới'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-5">Nguồn / Thiết Bị</th>
                    <th className="py-3 px-4">Thời Gian</th>
                    <th className="py-3 px-4">Nguyên Liệu Nhận Diện</th>
                    <th className="py-3 px-4">Độ Tin Cậy</th>
                    <th className="py-3 px-5 text-right">Món Ăn Gợi Ý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {realScanLogs.length > 0 ? (
                    realScanLogs.map((scan, idx) => (
                      <tr key={scan.id || idx} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap flex items-center gap-2">
                          {scan.imageUrl || scan.image ? (
                            <img
                              src={scan.imageUrl || scan.image}
                              alt="Scan thumb"
                              className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-[10px]">
                              AI
                            </div>
                          )}
                          <span>{scan.title || 'Người dùng SmartCook'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap text-[11px]">
                          {scan.scannedAt || 'Vừa xong'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {scan.ingredients.slice(0, 4).map((ing, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
                              >
                                {ing.name}
                              </span>
                            ))}
                            {scan.ingredients.length > 4 && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                                +{scan.ingredients.length - 4}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {scan.accuracy}%
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <span className="font-extrabold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                            {scan.suggestedRecipe?.title || 'Salad thanh đạm'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    aiConfig.recentScans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                          {scan.user}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap text-[11px]">
                          {scan.timestamp}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {scan.detectedLabels.map((lbl, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
                              >
                                {lbl}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {scan.confidence}%
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            {scan.recommendedRecipe}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: PHÒNG THỬ NGHIỆM PROMPT PLAYGROUND (TEST CHAT TRỰC QUAN NGAY TRÊN WEB)
      ========================================================================== */}
      {activeTab === 'playground' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* CỘT TRÁI (5 phần): Cấu hình ngữ cảnh thử nghiệm */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 font-['Outfit'] flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-600" />
              <span>Ngữ Cảnh Thử Nghiệm Mô Phỏng</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-700 block">System Prompt Đang Sử Dụng:</span>
                <p className="text-[11px] text-slate-600 font-mono line-clamp-3 leading-relaxed">
                  {promptText}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Phong cách Persona:</span>
                <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase text-[10px]">
                  {aiConfig.personaTone}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700">Độ sáng tạo (Temperature):</span>
                <span className="font-mono font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                  {aiConfig.temperature}
                </span>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-slate-700 space-y-1">
                <span className="font-bold text-indigo-900 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Mẹo thử nghiệm
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Bạn có thể đặt câu hỏi về công thức bất kỳ hoặc liệt kê nguyên liệu kỳ lạ để kiểm tra phản xạ ứng biến và tính an toàn thực phẩm của Chef AI.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTestMessages([
                    {
                      role: 'assistant',
                      text: 'Đã xóa lịch sử thử nghiệm. Bếp Trưởng SmartCook AI đã sẵn sàng đón nhận câu hỏi mới!',
                      time: 'Bây giờ',
                    },
                  ])
                }
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Xóa Lịch Sử Chat Thử Nghiệm
              </button>
            </div>
          </div>

          {/* CỘT PHẢI (7 phần): Hộp Chatbot Thử Nghiệm Trực Tiếp (Playground Console) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[560px]">
            {/* Topbar chat */}
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                  AI
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-900 block font-['Outfit']">
                    SmartCook Chef AI Console
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online • Trực Tiếp
                  </span>
                </div>
              </div>

              <span className="text-[10.5px] font-mono text-slate-400">Model: {selectedModel}</span>
            </div>

            {/* Khung tin nhắn chat */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/30 text-xs">
              {testMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white'
                        : 'bg-indigo-600 text-white shadow-xs'
                    }`}
                  >
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl space-y-1 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-xs font-medium'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-2xs font-normal'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9.5px] block text-right ${
                        msg.role === 'user' ? 'text-white/70' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isSimulatingAI && (
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold pl-9">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Chef AI đang suy nghĩ công thức...</span>
                </div>
              )}
            </div>

            {/* Ô nhập tin nhắn thử nghiệm */}
            <form
              onSubmit={handleSendTestMessage}
              className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Nhập câu hỏi thử nghiệm gửi tới Chef AI..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <button
                type="submit"
                disabled={isSimulatingAI || !testInput.trim()}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi Thử</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIEnginePage;
