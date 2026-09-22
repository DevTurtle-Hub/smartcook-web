import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  Utensils,
  ChevronDown,
  ChefHat,
  MessageSquare,
  Bot,
  Flame,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { aiApi, type ChatMessageContext } from '../../api/ai.api';
import { useAuthStore } from '../../store/useAuthStore';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  suggestedDishes?: string[];
  quickPrompts?: string[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    text: 'Xin chào bạn! Mình là **Đầu Bếp Trợ Lý AI** của SmartCook 👩‍🍳.\n\nHôm nay bạn muốn nấu món gì, cần gợi ý thực đơn, hay đang băn khoăn cách chế biến nguyên liệu nào?',
    time: 'Vừa xong',
    suggestedDishes: ['Cơm Gà Teriyaki Áp Chảo', 'Bò Bít Tết Sốt Tiêu Măng Tây', 'Canh Chua Cá Hồi'],
    quickPrompts: [
      'Hôm nay ăn gì nhanh gọn?',
      'Món thanh đạm ít dầu',
      'Cách ướp thịt bò mềm',
      'Gợi ý bữa tối 2 người'
    ]
  }
];

const DEFAULT_QUICK_PROMPTS = [
  'Hôm nay ăn gì nhanh gọn?',
  'Món thanh đạm ít dầu',
  'Cách ướp thịt bò mềm',
  'Gợi ý bữa tối 2 người',
  'Món ngon từ ức gà',
  'Nấu gì dưới 20 phút?'
];

export const FloatingChefAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus ô input khi mở modal
  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Tự ẩn tooltip sau 8 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (queryToSend?: string) => {
    const query = (queryToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    // Cập nhật giao diện tin nhắn của user
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Chuẩn bị lịch sử hội thoại gửi lên backend
    const conversationHistory: ChatMessageContext[] = messages
      .slice(-6)
      .map((m) => ({ sender: m.sender, text: m.text }));

    try {
      const reply = await aiApi.assistantChat(query, conversationHistory);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply.replyText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestedDishes: reply.suggestedDishes,
        quickPrompts: reply.quickPrompts
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Lỗi khi trò chuyện với AI:', error);
      const errorMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Bếp xin lỗi, hệ thống AI đang bận trong giây lát. Bạn hãy thử lại câu hỏi nhé!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputText('');
  };

  const handleSuggestedDishClick = (dishName: string) => {
    handleSendMessage(`Hãy hướng dẫn tôi công thức chi tiết và các bước nấu món "${dishName}" nhé!`);
  };

  // Helper format bold text trong tin nhắn markdown
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-extrabold text-orange-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <aside aria-label="Đầu Bếp Trợ Lý AI" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* ========================================================================= */}
      {/* 1. NÚT MASCOT ĐẦU BẾP AI NỔI TRÒN (FLOATING CHEF BOT BUTTON)              */}
      {/* ========================================================================= */}
      {!isOpen && (
        <div className="relative group">
          {/* Tooltip Chào Mừng / Bắt Mắt */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-orange-200 text-slate-800 text-xs font-bold whitespace-nowrap animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <span>Hỏi Đầu Bếp AI nè!</span>
              <span className="text-sm">👩‍🍳</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="ml-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Vòng hào quang sáng (Glowing Aura Effect) */}
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-emerald-400 via-teal-400 to-orange-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />

          {/* Mascot Button Nổi Bật */}
          <button
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setShowTooltip(false)}
            aria-label="Mở Trợ lý Ảo SmartCook"
            className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white p-1 shadow-[0_8px_25px_rgba(249,115,22,0.35)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.45)] hover:scale-108 active:scale-95 transition-all duration-300 border-2 border-emerald-400 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {/* Ảnh Avatar Đầu Bếp Robot Tròn Trị Chuẩn Mobile */}
            <img
              src="/ai-chef-avatar.png"
              alt="Đầu Bếp Trợ Lý AI"
              className="w-full h-full object-cover rounded-full select-none pointer-events-none drop-shadow-sm"
            />

            {/* Online Status Dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse shadow-xs" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CỬA SỔ HỘI THOẠI TRỢ LÝ AI CHUẨN HIỆN ĐẠI (AI CHAT WINDOW MODAL)         */}
      {/* ========================================================================= */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] md:w-[430px] h-[580px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-[28px] shadow-[0_16px_50px_rgba(0,0,0,0.18)] border border-orange-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* HEADER CHAT XỊN SÒ */}
          <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 p-4 px-5 text-white flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-white/20 p-0.5 border-2 border-white/60 shrink-0 overflow-hidden shadow-inner">
                <img
                  src="/ai-chef-avatar.png"
                  alt="Đầu Bếp Trợ Lý AI"
                  className="w-full h-full object-cover rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-base tracking-tight font-heading leading-none">
                    Đầu Bếp Trợ Lý AI
                  </h3>
                  <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
                </div>
                <p className="text-[11px] text-orange-100 font-medium mt-0.5">
                  SmartCook • Tư vấn thực đơn & nấu nướng
                </p>
              </div>
            </div>

            {/* Các Nút Điều Khiển */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Làm mới đoạn chat"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* THÔNG TIN NGỮ CẢNH TỦ LẠNH & KHẨU VỊ */}
          {isAuthenticated && (
            <div className="bg-orange-50/80 border-b border-orange-100 px-4 py-1.5 flex items-center justify-between text-[11px] text-orange-800">
              <span className="flex items-center gap-1 font-medium truncate">
                <span>🥗</span>
                <span>Đã kết nối tủ lạnh & khẩu vị: <b>{user?.firstName || 'Bạn'}</b></span>
              </span>
              <Link to="/my-kitchen" className="text-orange-600 hover:underline font-bold shrink-0 text-[10px]">
                Xem tủ lạnh →
              </Link>
            </div>
          )}

          {/* DANH SÁCH TIN NHẮN (MESSAGE LIST) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-gradient-to-b from-orange-50/20 to-transparent">
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${isAI ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Avatar AI nhỏ bên trái */}
                  {isAI && (
                    <div className="w-8 h-8 rounded-full border border-emerald-300 shrink-0 overflow-hidden bg-white shadow-2xs mt-0.5">
                      <img
                        src="/ai-chef-avatar.png"
                        alt="Chef Bot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2 ${isAI ? 'items-start' : 'items-end flex flex-col'}`}>
                    {/* Bong bóng tin nhắn */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                        isAI
                          ? 'bg-[#FFF7ED] border border-orange-200/70 text-slate-800 rounded-tl-sm'
                          : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-sm font-medium shadow-orange-500/20'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {renderFormattedText(msg.text)}
                      </div>

                      {/* Gợi Ý Món Ăn Bấm Được Trực Tiếp (Clickable Suggested Dishes) */}
                      {isAI && msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-orange-200/60 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
                            <Utensils className="w-3 h-3" />
                            <span>Món ăn gợi ý liên quan:</span>
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.suggestedDishes.map((dish) => (
                              <button
                                key={dish}
                                onClick={() => handleSuggestedDishClick(dish)}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white border border-orange-300 text-orange-700 text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1"
                              >
                                <span>{dish}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick prompts kèm theo phản hồi của AI */}
                    {isAI && msg.quickPrompts && msg.quickPrompts.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {msg.quickPrompts.map((prompt) => (
                          <button
                            key={prompt}
                            onClick={() => handleSendMessage(prompt)}
                            className="px-2.5 py-1 rounded-full bg-orange-100/70 hover:bg-orange-200 text-orange-800 text-[10px] font-bold transition-colors text-left"
                          >
                            💬 {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-400 px-1">{msg.time}</span>
                  </div>
                </div>
              );
            })}

            {/* Hiệu ứng đang gõ phản hồi */}
            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-500 animate-pulse">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-emerald-300">
                  <img src="/ai-chef-avatar.png" alt="Chef Bot" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#FFF7ED] border border-orange-200/70 px-3.5 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="text-[11px] font-medium text-orange-800">Đầu bếp AI đang soạn câu trả lời</span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* THANH GỢI Ý CÂU HỎI NHANH TRÊN Ô INPUT */}
          <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Hỏi nhanh:</span>
            {DEFAULT_QUICK_PROMPTS.slice(0, 4).map((p) => (
              <button
                key={p}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-600 hover:text-orange-600 text-[10px] font-medium whitespace-nowrap transition-colors shadow-2xs shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* INPUT FORM GỬI TIN NHẮN */}
          <div className="p-3 bg-white border-t border-orange-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi đầu bếp AI về món ăn, calo, mẹo nấu..."
                  disabled={isTyping}
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-orange-500 focus:bg-white text-xs font-medium text-slate-800 focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                />
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-orange-500/20 active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </aside>
  );
};
