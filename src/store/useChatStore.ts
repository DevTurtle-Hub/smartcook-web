import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  isMe: boolean;
  recipeAttachment?: {
    title: string;
    image?: string;
  };
}

export interface ChatConversation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRole?: string; // 'Bếp Trưởng', 'Chuyên Gia Dinh Dưỡng', etc.
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

interface ChatState {
  isOpen: boolean;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  
  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setActiveConversation: (id: string) => void;
  startChatWithUser: (user: { id: string; name: string; avatar?: string; role?: string }) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-mai',
    partnerId: 'u1',
    partnerName: 'Nguyễn Thị Mai',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    partnerRole: 'Yêu Bếp & Cơm Nhà',
    isOnline: true,
    lastMessage: 'Nước dừa xiêm nấu ra màu cánh gián tự nhiên đỉnh thật bạn ơi!',
    lastMessageTime: '10 phút trước',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'u1',
        senderName: 'Nguyễn Thị Mai',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'Chào bạn! Mình thấy bạn cũng thích nấu mấy món kho gia đình đúng không?',
        createdAt: '10:15',
        isMe: false,
      },
      {
        id: 'm2',
        senderId: 'me',
        senderName: 'Tôi',
        text: 'Đúng rồi bạn, mình hay xem công thức trên SmartCook rồi nấu theo.',
        createdAt: '10:18',
        isMe: true,
      },
      {
        id: 'm3',
        senderId: 'u1',
        senderName: 'Nguyễn Thị Mai',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        text: 'Nước dừa xiêm nấu ra màu cánh gián tự nhiên đỉnh thật bạn ơi!',
        createdAt: '10:20',
        isMe: false,
      }
    ]
  },
  {
    id: 'conv-hoang',
    partnerId: 'u2',
    partnerName: 'Trần Văn Hoàng',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    partnerRole: 'Eat Clean & Fitness Chef',
    isOnline: true,
    lastMessage: 'Ức gà áp chảo sốt bơ tỏi ướp thêm chút mật ong ăn mềm lắm.',
    lastMessageTime: '1 giờ trước',
    unreadCount: 0,
    messages: [
      {
        id: 'mh1',
        senderId: 'u2',
        senderName: 'Trần Văn Hoàng',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'Chào bro! Tính năng scan tủ lạnh của SmartCook gợi ý chuẩn bài phết nhỉ.',
        createdAt: '09:00',
        isMe: false,
      },
      {
        id: 'mh2',
        senderId: 'me',
        senderName: 'Tôi',
        text: 'Chuẩn luôn, đỡ phải nghĩ xem nay ăn gì.',
        createdAt: '09:05',
        isMe: true,
      },
      {
        id: 'mh3',
        senderId: 'u2',
        senderName: 'Trần Văn Hoàng',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        text: 'Ức gà áp chảo sốt bơ tỏi ướp thêm chút mật ong ăn mềm lắm.',
        createdAt: '09:12',
        isMe: false,
      }
    ]
  },
  {
    id: 'conv-hung',
    partnerId: 'c-hung',
    partnerName: 'Lê Tuấn Hưng',
    partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    partnerRole: 'Chuyên Gia Nấu Nướng',
    isOnline: false,
    lastMessage: 'Hôm nào có dịp mình chia sẻ thêm mẹo kho thịt không cần thắng đường nha!',
    lastMessageTime: 'Hôm qua',
    unreadCount: 0,
    messages: [
      {
        id: 'm-hung-1',
        senderId: 'c-hung',
        senderName: 'Lê Tuấn Hưng',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'Hôm nào có dịp mình chia sẻ thêm mẹo kho thịt không cần thắng đường nha!',
        createdAt: 'Hôm qua',
        isMe: false,
      }
    ]
  }
];

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  conversations: INITIAL_CONVERSATIONS,
  activeConversationId: 'conv-mai',

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setActiveConversation: (id: string) => {
    set({ activeConversationId: id, isOpen: true });
    get().markAsRead(id);
  },

  startChatWithUser: (targetUser) => {
    const { conversations } = get();
    const existing = conversations.find(
      (c) => c.partnerId === targetUser.id || c.partnerName.toLowerCase() === targetUser.name.toLowerCase()
    );

    if (existing) {
      set({
        activeConversationId: existing.id,
        isOpen: true,
      });
      get().markAsRead(existing.id);
      return;
    }

    const newConvId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newConvId,
      partnerId: targetUser.id,
      partnerName: targetUser.name,
      partnerAvatar: targetUser.avatar,
      partnerRole: targetUser.role || 'Thành Viên Bếp SmartCook',
      isOnline: true,
      lastMessage: 'Bắt đầu cuộc trò chuyện ẩm thực...',
      lastMessageTime: 'Vừa xong',
      unreadCount: 0,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          senderId: targetUser.id,
          senderName: targetUser.name,
          senderAvatar: targetUser.avatar,
          text: `Xin chào! Rất vui được kết nối cùng bạn trên SmartCook 🍳`,
          createdAt: 'Vừa xong',
          isMe: false,
        }
      ]
    };

    set({
      conversations: [newConv, ...conversations],
      activeConversationId: newConvId,
      isOpen: true,
    });
  },

  sendMessage: (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'Tôi',
      text: text.trim(),
      createdAt: 'Vừa xong',
      isMe: true,
    };

    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: text.trim(),
          lastMessageTime: 'Vừa xong',
          messages: [...conv.messages, newMsg]
        };
      })
    }));

    // Giả lập đối phương phản hồi tự động nếu cần sau 1.5s
    setTimeout(() => {
      const currentConv = get().conversations.find((c) => c.id === conversationId);
      if (!currentConv) return;
      
      const botReplies = [
        'Ý tưởng nấu món này tuyệt quá bạn ơi! 🥘',
        'Cảm ơn bạn đã chia sẻ nhé, để tối nay mình thử làm xem sao ✨',
        'Mẹo này hay thật, công nhận nấu ăn bằng SmartCook tiện hơn hẳn 🥰',
        'Bạn có cần thêm gợi ý nguyên liệu gì trong tủ lạnh không?'
      ];
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];

      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: currentConv.partnerId,
        senderName: currentConv.partnerName,
        senderAvatar: currentConv.partnerAvatar,
        text: randomReply,
        createdAt: 'Vừa xong',
        isMe: false,
      };

      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id !== conversationId) return conv;
          return {
            ...conv,
            lastMessage: randomReply,
            lastMessageTime: 'Vừa xong',
            messages: [...conv.messages, replyMsg]
          };
        })
      }));
    }, 1200);
  },

  markAsRead: (conversationId: string) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    }));
  }
}));
