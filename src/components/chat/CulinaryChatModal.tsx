import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Send, 
  Search, 
  ChefHat, 
  Sparkles, 
  Flame, 
  LogIn,
  Loader2,
  CheckCheck
} from 'lucide-react';
import { useChatStore, ChatConversation } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socketService } from '../../services/socket.service';
import { AuthRequiredModal } from '../common/AuthRequiredModal';

export const CulinaryChatModal: React.FC = () => {
  const { 
    isOpen, 
    closeChat, 
    conversations, 
    activeConversationId, 
    setActiveConversation, 
    sendMessage,
    loadConversations,
    isLoading,
    typingStatus,
    initSocket
  } = useChatStore();

  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize conversations and socket when modal opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      initSocket();
      loadConversations();
    }
  }, [isOpen, isAuthenticated, initSocket, loadConversations]);

  const activeConv: ChatConversation | undefined = conversations.find(
    (c) => c.id === activeConversationId
  ) || conversations[0];

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && activeConv) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, activeConv?.messages, activeConv?.id]);

  // Clean up typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Nếu chưa đăng nhập, hiển thị Modal xác thực cao cấp chuẩn UX thay vì khung trắng rỗng
  if (!isAuthenticated) {
    return (
      <AuthRequiredModal
        isOpen={isOpen}
        onClose={closeChat}
        featureType="chat"
        redirectPath={window.location.pathname}
        allowPreview={true}
      />
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMessageInput(val);

    if (!activeConv) return;

    socketService.emitTyping(activeConv.id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitStopTyping(activeConv.id);
    }, 2500);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;

    const textToSend = messageInput;
    setMessageInput('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketService.emitStopTyping(activeConv.id);

    sendMessage(activeConv.id, textToSend);
  };

  const filteredConversations = conversations.filter((c) =>
    (c.partnerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickChefEmojis = ['😋', '🥘', '🍲', '🥩', '🥗', '🔥', '✨', '❤️', '👏', '👌'];

  const currentTypingUser = activeConv ? typingStatus[activeConv.id] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Nút Đóng Modal */}
      <button
        onClick={closeChat}
        className="fixed top-3 right-4 sm:top-4 sm:right-6 z-[110] px-3.5 py-2 rounded-2xl bg-white/95 hover:bg-rose-50 hover:text-rose-600 text-slate-700 flex items-center gap-1.5 shadow-lg border border-slate-200/90 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Đóng phòng chat"
      >
        <X className="w-4 h-4 text-slate-600 group-hover:text-rose-600" />
        <span className="text-xs font-black">Đóng</span>
      </button>

      {/* Khung chat chính */}
      <div className="relative w-[98vw] max-w-[1440px] h-[93vh] bg-[#fdfbf7] rounded-3xl shadow-2xl border border-amber-200/70 flex overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ================= CỘT TRÁI: DANH SÁCH HỘI THOẠI ================= */}
            <div className="w-80 sm:w-96 bg-white/95 border-r border-amber-100 flex flex-col shrink-0 h-full">
              
              {/* Header Danh sách */}
              <div className="p-4 pb-3 border-b border-amber-100/60 bg-gradient-to-b from-orange-50/60 to-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-xs shadow-orange-500/30">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-base tracking-tight font-heading">
                        Giao Lưu Bếp
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">Trò chuyện thời gian thực</p>
                    </div>
                  </div>
                  {isLoading && (
                    <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  )}
                </div>

                {/* Ô tìm kiếm người chat */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm bạn bếp, tin nhắn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-2xl text-xs border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all"
                  />
                </div>
              </div>

              {/* Danh sách các cuộc trò chuyện */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const isActive = activeConv?.id === conv.id;
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveConversation(conv.id)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 flex items-center gap-3 relative group ${
                          isActive 
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20' 
                            : 'hover:bg-orange-50/70 text-slate-700'
                        }`}
                      >
                        {/* Avatar & Online Dot */}
                        <div className="relative shrink-0">
                          <img
                            src={conv.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={conv.partnerName}
                            className={`w-12 h-12 rounded-2xl object-cover border-2 transition-transform group-hover:scale-105 ${
                              isActive ? 'border-white/80' : 'border-orange-200'
                            }`}
                          />
                          {conv.isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className={`font-extrabold text-xs sm:text-sm truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                              {conv.partnerName}
                            </h4>
                            <span className={`text-[10px] font-medium shrink-0 ${isActive ? 'text-white/85' : 'text-slate-400'}`}>
                              {conv.lastMessageTime}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs truncate ${isActive ? 'text-white/95' : 'text-slate-500'}`}>
                              {typingStatus[conv.id] ? (
                                <span className="italic font-medium text-emerald-300">đang soạn tin...</span>
                              ) : (
                                conv.lastMessage
                              )}
                            </p>
                            {conv.unreadCount > 0 && !isActive && (
                              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <ChefHat className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>Chưa có cuộc trò chuyện nào.</p>
                    <p className="text-[11px] text-slate-400">Hãy vào mục Cộng đồng để kết nối với các đầu bếp khác!</p>
                  </div>
                )}
              </div>

              {/* User Profile Bar Ở Dưới Cùng Cột Trái */}
              <div className="p-3.5 bg-slate-50/90 border-t border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt="My Avatar"
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-300"
                  />
                  <div>
                    <p className="text-xs font-black text-slate-800 leading-tight">
                      {user?.fullName || `${user?.lastName || ''} ${user?.firstName || 'Bếp Trưởng'}`.trim()}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Trực tuyến
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI: KHÔNG GIAN CHAT CHÍNH ================= */}
            {activeConv ? (
              <div className="flex-1 flex flex-col h-full bg-[#faf7f2] relative">
                
                {/* Top Bar của cuộc trò chuyện hiện tại */}
                <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md border-b border-amber-100 flex items-center justify-between shrink-0 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={activeConv.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={activeConv.partnerName}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-orange-200 shadow-xs"
                      />
                      {activeConv.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                          {activeConv.partnerName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{activeConv.partnerRole || 'Đầu Bếp'}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>Trò chuyện trực tiếp cùng đối phương</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Khu vực tin nhắn cuộn */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                  
                  {/* Lời chào mở đầu */}
                  <div className="text-center my-4 space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/70 border border-orange-200 text-orange-800 text-[11px] font-bold">
                      <Flame className="w-3.5 h-3.5 text-orange-600" />
                      <span>Không gian kết nối đam mê ẩm thực SmartCook</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Tin nhắn thời gian thực giữa bạn và {activeConv.partnerName}.
                    </p>
                  </div>

                  {/* Danh sách tin nhắn */}
                  {activeConv.messages.map((msg) => {
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-end gap-2.5 ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-150`}
                      >
                        {/* Avatar đối phương */}
                        {!msg.isMe && (
                          <img
                            src={msg.senderAvatar || activeConv.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={msg.senderName || activeConv.partnerName}
                            className="w-7 h-7 rounded-xl object-cover ring-1 ring-orange-200 shrink-0 mb-1"
                          />
                        )}

                        <div className="max-w-[80%] sm:max-w-[70%] space-y-1">
                          {/* Bong bóng tin nhắn */}
                          <div
                            className={`p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                              msg.isMe
                                ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-br-xs font-medium'
                                : 'bg-white text-slate-800 rounded-bl-xs border border-amber-100/90'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
                            {msg.imageUri && (
                              <img 
                                src={msg.imageUri} 
                                alt="Ảnh đính kèm" 
                                className="mt-2 rounded-2xl max-h-60 object-cover border border-white/20" 
                              />
                            )}
                          </div>

                          {/* Thời gian */}
                          <div className={`text-[10px] text-slate-400 font-medium px-2 flex items-center gap-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <span>{msg.createdAt}</span>
                            {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {currentTypingUser && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic px-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></span>
                      <span>{currentTypingUser} đang soạn tin nhắn...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Thanh biểu tượng emoji nhanh */}
                <div className="px-4 py-1.5 bg-white/70 border-t border-amber-100 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Biểu cảm nhanh:</span>
                  <div className="flex items-center gap-1">
                    {quickChefEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setMessageInput((prev) => prev + emoji)}
                        className="p-1 text-base hover:scale-125 transition-transform rounded-lg hover:bg-white cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ô soạn thảo tin nhắn */}
                <div className="p-3 sm:p-4 bg-white border-t border-amber-100">
                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    {/* Input text */}
                    <input
                      type="text"
                      placeholder={`Gửi lời nhắn cho ${activeConv.partnerName}...`}
                      value={messageInput}
                      onChange={handleInputChange}
                      className="flex-1 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-2xl px-4 py-3 text-xs sm:text-sm border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all placeholder-slate-400"
                    />

                    {/* Nút gửi */}
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold transition-all shadow-md shadow-orange-500/25 active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Gửi</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
                <ChefHat className="w-16 h-16 text-slate-200" />
                <h4 className="font-bold text-slate-600 text-base">Chọn một người bạn bếp để bắt đầu trò chuyện</h4>
                <p className="text-xs max-w-sm">Trao đổi kinh nghiệm nấu ăn, hỏi mẹo nêm nếm gia vị và chia sẻ niềm vui ẩm thực.</p>
              </div>
            )}
      </div>
    </div>
  );
};
