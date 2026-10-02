import { create } from 'zustand';
import { chatApi, ApiConversationItem, ApiMessageItem } from '../api/chat.api';
import { socketService } from '../services/socket.service';
import { useAuthStore } from './useAuthStore';
import { playMessageNotificationSound, showDesktopNotification, requestDesktopNotificationPermission } from '../utils/sound';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  isMe: boolean;
  imageUri?: string;
  recipeAttachment?: {
    title: string;
    image?: string;
  };
}

export interface ChatConversation {
  id: string; // Conversation MongoDB ID
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerRole?: string; // e.g. 'Bếp Trưởng', 'Thành Viên'
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isLoaded?: boolean;
}

export interface ChatToastNotificationItem {
  id: string;
  conversationId: string;
  senderName: string;
  senderAvatar?: string;
  senderBadge?: string;
  text: string;
  timestamp: string;
}

interface ChatState {
  isOpen: boolean;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  typingStatus: Record<string, string>; // conversationId -> userName typing
  activeToast: ChatToastNotificationItem | null;

  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  dismissToast: () => void;
  setActiveConversation: (id: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  startChatWithUser: (user: { id: string; name: string; avatar?: string; role?: string }) => Promise<void>;
  sendMessage: (conversationId: string, text: string, imageUri?: string) => Promise<void>;
  handleIncomingMessage: (msg: any) => void;
  markAsRead: (conversationId: string) => void;
  setTyping: (conversationId: string, userName: string) => void;
  clearTyping: (conversationId: string) => void;
  initSocket: () => void;
}

let isSocketInitialized = false;

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  typingStatus: {},
  activeToast: null,

  openChat: () => {
    set({ isOpen: true, activeToast: null });
    get().initSocket();
    if (get().conversations.length === 0) {
      get().loadConversations();
    }
  },

  closeChat: () => {
    set({ isOpen: false });
  },

  toggleChat: () => {
    const nextState = !get().isOpen;
    if (nextState) {
      get().openChat();
    } else {
      get().closeChat();
    }
  },

  dismissToast: () => {
    set({ activeToast: null });
  },

  initSocket: () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    socketService.connect(token);
    requestDesktopNotificationPermission().catch(() => {});

    if (isSocketInitialized) return;
    isSocketInitialized = true;

    socketService.onNewMessage((msg: any) => {
      get().handleIncomingMessage(msg);
    });

    socketService.onUserTyping((data: { conversationId: string; userId: string; userName: string }) => {
      if (data?.conversationId && data?.userName) {
        get().setTyping(data.conversationId, data.userName);
      }
    });

    socketService.onUserStopTyping((data: { conversationId: string; userId: string }) => {
      if (data?.conversationId) {
        get().clearTyping(data.conversationId);
      }
    });
  },

  setActiveConversation: async (id: string) => {
    set({ activeConversationId: id, isOpen: true, activeToast: null });
    socketService.joinRoom(id);
    get().markAsRead(id);
    await get().loadMessages(id);
  },

  loadConversations: async () => {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated) return;

    try {
      set({ isLoading: true });
      get().initSocket();

      const items: ApiConversationItem[] = await chatApi.getConversations();

      const currentConversations = get().conversations;
      const mapped: ChatConversation[] = items.map((item) => {
        const existing = currentConversations.find((c) => c.id === item.conversationId);
        return {
          id: item.conversationId,
          partnerId: item.user?.id || item.id,
          partnerName: item.user?.name || 'Đầu bếp SmartCook',
          partnerAvatar: item.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          partnerRole: item.user?.badge || (item.user?.isChef ? 'Bếp Trưởng' : 'Thành Viên Bếp'),
          isOnline: item.isOnline !== false,
          lastMessage: item.lastMessage || 'Chưa có tin nhắn',
          lastMessageTime: item.lastMessageTime || 'Vừa xong',
          unreadCount: item.unreadCount || 0,
          messages: existing?.messages || [],
          isLoaded: existing?.isLoaded || false,
        };
      });

      set({ conversations: mapped, isLoading: false });

      // If no active conversation selected yet and we have conversations, pick the first
      const { activeConversationId } = get();
      if (!activeConversationId && mapped.length > 0) {
        const firstId = mapped[0].id;
        set({ activeConversationId: firstId });
        socketService.joinRoom(firstId);
        get().loadMessages(firstId);
      }
    } catch (error) {
      console.error('❌ [useChatStore] Failed to load conversations:', error);
      set({ isLoading: false });
    }
  },

  loadMessages: async (conversationId: string) => {
    if (!conversationId) return;

    try {
      const msgs: ApiMessageItem[] = await chatApi.getMessages(conversationId);
      const currentUser = useAuthStore.getState().user;
      const currentUserId = (currentUser?._id || '').toString();

      const mappedMessages: ChatMessage[] = msgs.map((m) => {
        const sId = (m.sender?.id || '').toString();
        const isMe = sId ? sId === currentUserId : m.isMe;

        return {
          id: m.id,
          conversationId,
          senderId: sId,
          senderName: m.sender?.name || (isMe ? 'Tôi' : 'Đối phương'),
          senderAvatar: m.sender?.avatar,
          text: m.text,
          imageUri: m.imageUri,
          createdAt: m.timestamp || 'Vừa xong',
          isMe,
        };
      });

      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv.id !== conversationId) return conv;
          return {
            ...conv,
            messages: mappedMessages,
            isLoaded: true,
          };
        }),
      }));
    } catch (error) {
      console.error(`❌ [useChatStore] Failed to load messages for ${conversationId}:`, error);
    }
  },

  startChatWithUser: async (targetUser) => {
    const auth = useAuthStore.getState();
    if (!auth.isAuthenticated || !auth.user) {
      alert('Vui lòng đăng nhập để bắt đầu trò chuyện cùng cộng đồng đầu bếp!');
      return;
    }

    try {
      get().initSocket();

      // Check if conversation already exists in current list
      const { conversations } = get();
      const existing = conversations.find(
        (c) => c.partnerId === targetUser.id || (targetUser.name && c.partnerName.toLowerCase() === targetUser.name.toLowerCase())
      );

      if (existing) {
        set({
          activeConversationId: existing.id,
          isOpen: true,
          activeToast: null,
        });
        socketService.joinRoom(existing.id);
        get().markAsRead(existing.id);
        await get().loadMessages(existing.id);
        return;
      }

      // Call backend to get or create 1-1 conversation
      const res = await chatApi.getOrCreateDirectChat(targetUser.id);
      const convId = res.conversationId;

      const newConv: ChatConversation = {
        id: convId,
        partnerId: res.user?.id || targetUser.id,
        partnerName: res.user?.name || targetUser.name,
        partnerAvatar: res.user?.avatar || targetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        partnerRole: res.user?.badge || targetUser.role || 'Thành Viên Bếp SmartCook',
        isOnline: true,
        lastMessage: res.lastMessage || 'Bắt đầu cuộc trò chuyện ẩm thực...',
        lastMessageTime: res.lastMessageTime || 'Vừa xong',
        unreadCount: 0,
        messages: [],
        isLoaded: false,
      };

      // Add to store
      set((state) => ({
        conversations: [newConv, ...state.conversations.filter((c) => c.id !== convId)],
        activeConversationId: convId,
        isOpen: true,
        activeToast: null,
      }));

      socketService.joinRoom(convId);
      await get().loadMessages(convId);
    } catch (error) {
      console.error('❌ [useChatStore] Failed to start direct chat:', error);
      alert('Không thể khởi tạo cuộc hội thoại. Vui lòng thử lại sau.');
    }
  },

  sendMessage: async (conversationId: string, text: string, imageUri?: string) => {
    if (!text.trim() && !imageUri) return;
    const cleanText = text.trim();

    const auth = useAuthStore.getState();
    const currentUser = auth.user;
    const currentUserId = (currentUser?._id || '').toString();
    const currentUserName = currentUser?.fullName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Tôi';
    const currentUserAvatar = currentUser?.avatar;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: tempId,
      conversationId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      text: cleanText,
      imageUri,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    // 1. Instant local render (0ms response time)
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          lastMessage: cleanText || '[Hình ảnh]',
          lastMessageTime: 'Vừa xong',
          messages: [...conv.messages, optimisticMessage],
        };
      }),
    }));

    // 2. Non-blocking asynchronous network delivery
    (async () => {
      try {
        const socketRes = await socketService.sendMessage(conversationId, cleanText, imageUri);

        if (socketRes?.success && socketRes.data) {
          const savedMsg = socketRes.data;
          set((state) => ({
            conversations: state.conversations.map((conv) => {
              if (conv.id !== conversationId) return conv;
              return {
                ...conv,
                messages: conv.messages.map((m) =>
                  m.id === tempId
                    ? {
                        ...m,
                        id: savedMsg.id || savedMsg._id || m.id,
                        createdAt: savedMsg.timestamp || m.createdAt,
                      }
                    : m
                ),
              };
            }),
          }));
        } else {
          // REST API fallback
          const restMsg = await chatApi.sendMessageFallback(conversationId, cleanText, imageUri);
          if (restMsg) {
            set((state) => ({
              conversations: state.conversations.map((conv) => {
                if (conv.id !== conversationId) return conv;
                return {
                  ...conv,
                  messages: conv.messages.map((m) =>
                    m.id === tempId
                      ? {
                          ...m,
                          id: restMsg.id || m.id,
                          createdAt: restMsg.timestamp || m.createdAt,
                        }
                      : m
                  ),
                };
              }),
            }));
          }
        }
      } catch (error) {
        console.error('❌ [useChatStore] Delivery error:', error);
      }
    })();
  },

  handleIncomingMessage: (msg: any) => {
    if (!msg?.conversationId) return;

    const convId = (msg.conversationId._id || msg.conversationId).toString();
    const currentUser = useAuthStore.getState().user;
    const currentUserId = (currentUser?._id || '').toString();

    const senderObj = msg.sender || {};
    const senderId = (senderObj._id || senderObj.id || msg.senderId || '').toString();
    const isMe = senderId === currentUserId;

    const incoming: ChatMessage = {
      id: (msg._id || msg.id || `msg-${Date.now()}`).toString(),
      conversationId: convId,
      senderId,
      senderName: senderObj.name || senderObj.fullName || (isMe ? 'Tôi' : 'Đối phương'),
      senderAvatar: senderObj.avatar,
      text: msg.text || '',
      imageUri: msg.imageUri,
      createdAt: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe,
    };

    const state = get();
    const isCurrentActiveAndOpen = state.isOpen && state.activeConversationId === convId;

    // Trigger rich notifications if incoming from someone else and not actively reading this conversation
    if (!isMe && !isCurrentActiveAndOpen) {
      // 1. Play audio chime
      playMessageNotificationSound();

      // 2. Show floating interactive toast
      set({
        activeToast: {
          id: incoming.id,
          conversationId: convId,
          senderName: incoming.senderName,
          senderAvatar: incoming.senderAvatar,
          senderBadge: senderObj.badge || 'Đầu bếp',
          text: incoming.text || '[Hình ảnh món ăn]',
          timestamp: 'Vừa xong',
        },
      });

      // 3. HTML5 Desktop Notification
      showDesktopNotification(
        `SmartCook: ${incoming.senderName}`,
        incoming.text || 'Đã gửi một ảnh món ăn',
        incoming.senderAvatar,
        () => {
          get().setActiveConversation(convId);
        }
      );
    }

    const existingIndex = state.conversations.findIndex((c) => c.id === convId);

    if (existingIndex === -1) {
      // Add conversation immediately with incoming message so it appears with zero lag
      const newConv: ChatConversation = {
        id: convId,
        partnerId: senderId,
        partnerName: incoming.senderName,
        partnerAvatar: incoming.senderAvatar,
        partnerRole: senderObj.badge || 'Thành Viên Bếp',
        isOnline: true,
        lastMessage: incoming.text || '[Hình ảnh]',
        lastMessageTime: 'Vừa xong',
        unreadCount: isCurrentActiveAndOpen ? 0 : 1,
        messages: [incoming],
        isLoaded: true,
      };

      set((s) => ({
        conversations: [newConv, ...s.conversations],
      }));
    } else {
      set((s) => ({
        conversations: s.conversations.map((conv) => {
          if (conv.id !== convId) return conv;

          // Check if message already exists by real server ID, OR matches an optimistic temp message
          const existingMsgIndex = conv.messages.findIndex(
            (m) =>
              m.id === incoming.id ||
              (isMe && m.id.startsWith('temp-') && m.text === incoming.text)
          );

          let updatedMessages: ChatMessage[];
          if (existingMsgIndex !== -1) {
            // Replace optimistic temp message with the server confirmed message (prevents duplicates)
            updatedMessages = conv.messages.map((m, idx) =>
              idx === existingMsgIndex ? incoming : m
            );
          } else {
            updatedMessages = [...conv.messages, incoming];
          }

          return {
            ...conv,
            lastMessage: incoming.text || '[Hình ảnh]',
            lastMessageTime: 'Vừa xong',
            unreadCount: isCurrentActiveAndOpen || isMe ? conv.unreadCount : conv.unreadCount + 1,
            messages: updatedMessages,
          };
        }),
      }));
    }
  },

  markAsRead: (conversationId: string) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ),
    }));
  },

  setTyping: (conversationId: string, userName: string) => {
    set((state) => ({
      typingStatus: {
        ...state.typingStatus,
        [conversationId]: userName,
      },
    }));
  },

  clearTyping: (conversationId: string) => {
    set((state) => {
      const next = { ...state.typingStatus };
      delete next[conversationId];
      return { typingStatus: next };
    });
  },
}));
