import { apiClient } from './client';

export interface ChatAuthor {
  id: string;
  name: string;
  avatar?: string;
  badge?: string;
  isChef?: boolean;
}

export interface ApiConversationItem {
  id: string; // other user id or conv id
  conversationId: string;
  user: ChatAuthor;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface ApiMessageItem {
  id: string;
  conversationId: string;
  sender: ChatAuthor;
  text: string;
  imageUri?: string;
  timestamp: string;
  isMe: boolean;
  createdAt: string;
}

export interface ApiRoomItem {
  id: string;
  roomCode: string;
  title: string;
  description: string;
  iconName: string;
  tags: string[];
  activeMembers: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isAiBot: boolean;
}

export const chatApi = {
  /**
   * Get all user direct conversations
   */
  async getConversations(): Promise<ApiConversationItem[]> {
    const response = await apiClient.get('/chat/conversations');
    return response.data?.data || [];
  },

  /**
   * Get message history for a conversation or room
   */
  async getMessages(conversationId: string, limit = 50, before?: string): Promise<ApiMessageItem[]> {
    const params: Record<string, any> = { limit };
    if (before) params.before = before;
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`, { params });
    return response.data?.data || [];
  },

  /**
   * Get or create 1-1 direct conversation with a target user
   */
  async getOrCreateDirectChat(targetUserId: string): Promise<{
    conversationId: string;
    id: string;
    user: ChatAuthor;
    lastMessage: string;
    lastMessageTime: string;
  }> {
    const response = await apiClient.post('/chat/direct', { targetUserId });
    return response.data?.data;
  },

  /**
   * Get public community chat rooms
   */
  async getCommunityRooms(): Promise<ApiRoomItem[]> {
    const response = await apiClient.get('/chat/rooms');
    return response.data?.data || [];
  },

  /**
   * Send a chat message via REST API fallback
   */
  async sendMessageFallback(conversationId: string, text: string, imageUri?: string): Promise<ApiMessageItem> {
    const response = await apiClient.post(`/chat/conversations/${conversationId}/messages`, {
      text,
      imageUri,
    });
    return response.data?.data;
  },
};

export default chatApi;
