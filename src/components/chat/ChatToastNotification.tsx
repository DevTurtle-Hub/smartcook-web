import React, { useEffect } from 'react';
import { MessageSquare, X, ArrowRight, ChefHat, Sparkles } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';

export const ChatToastNotification: React.FC = () => {
  const { activeToast, dismissToast, setActiveConversation, isOpen } = useChatStore();

  // Auto dismiss after 6 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeToast, dismissToast]);

  // Don't show toast if chat is already open
  if (!activeToast || isOpen) return null;

  const handleOpenChat = () => {
    if (activeToast.conversationId) {
      setActiveConversation(activeToast.conversationId);
      dismissToast();
    }
  };

  return (
    <div className="fixed top-5 right-4 sm:right-6 z-[150] max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-orange-200/80 ring-1 ring-orange-500/10 flex items-start gap-3 relative overflow-hidden group">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-300/10 rounded-full blur-xl pointer-events-none -mr-6 -mt-6"></div>

        {/* Sender Avatar */}
        <div className="relative shrink-0">
          <img
            src={activeToast.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={activeToast.senderName}
            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-orange-400/60 shadow-xs"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
              {activeToast.senderName}
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[9px] font-black shrink-0 flex items-center gap-0.5">
              <ChefHat className="w-2.5 h-2.5" />
              <span>{activeToast.senderBadge || 'Đầu Bếp'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
            {activeToast.text}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleOpenChat}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-[11px] font-extrabold shadow-sm shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Trả lời</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <span className="text-[10px] text-slate-400 font-medium">
              {activeToast.timestamp}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismissToast}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};

export default ChatToastNotification;
