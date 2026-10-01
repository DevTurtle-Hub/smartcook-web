import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private currentToken: string | null = null;
  private currentConversationId: string | null = null;

  // Persistent listener registries so subscriptions survive reconnects
  private messageListeners = new Set<(msg: any) => void>();
  private typingListeners = new Set<(data: { conversationId: string; userId: string; userName: string }) => void>();
  private stopTypingListeners = new Set<(data: { conversationId: string; userId: string }) => void>();

  // Community live feed persistent listener registries
  private communityPostListeners = new Set<(data: { post: any }) => void>();
  private postReactionListeners = new Set<(data: { postId: string; totalReactions: number; reactionCounts: Record<string, number>; userId: string; reactionType: string | null }) => void>();
  private postCommentListeners = new Set<(data: { postId: string; comment: any; commentsCount: number }) => void>();
  private postDeletedListeners = new Set<(data: { postId: string }) => void>();

  /**
   * Connect to WebSocket server with JWT authentication (or as guest)
   */
  public connect(tokenOverride?: string): Socket | null {
    const token = tokenOverride || useAuthStore.getState().accessToken || localStorage.getItem('smartcook_token');

    // If socket exists and connected with the same token, reuse it
    if (this.socket && this.currentToken === (token || '') && (this.socket.connected || this.socket.active)) {
      return this.socket;
    }

    this.currentToken = token || '';

    // Disconnect previous socket cleanly
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('✅ [SocketService] Connected to server, socketId:', this.socket?.id);
      // Re-join current active conversation room if set
      if (this.currentConversationId) {
        this.socket?.emit('join_room', { conversationId: this.currentConversationId });
      }
    });

    // Forward chat events to persistent listeners
    this.socket.on('new_message', (msg: any) => {
      this.messageListeners.forEach((fn) => {
        try {
          fn(msg);
        } catch (e) {
          console.error('Error in new_message listener:', e);
        }
      });
    });

    this.socket.on('user_typing', (data: any) => {
      this.typingListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('Error in user_typing listener:', e);
        }
      });
    });

    this.socket.on('user_stop_typing', (data: any) => {
      this.stopTypingListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('Error in user_stop_typing listener:', e);
        }
      });
    });

    // Forward community realtime events to persistent listeners
    this.socket.on('new_community_post', (data: any) => {
      this.communityPostListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('Error in new_community_post listener:', e);
        }
      });
    });

    this.socket.on('post_reaction_updated', (data: any) => {
      this.postReactionListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('Error in post_reaction_updated listener:', e);
        }
      });
    });

    this.socket.on('new_post_comment', (data: any) => {
      this.postCommentListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('Error in new_post_comment listener:', e);
        }
      });
    });

    this.socket.on('post_deleted', (data: any) => {
      this.postDeletedListeners.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error('Error in post_deleted listener:', e);
        }
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 [SocketService] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('⚠️ [SocketService] Connection warning:', err.message);
    });

    return this.socket;
  }

  /**
   * Disconnect socket cleanly
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
      this.currentConversationId = null;
      console.log('🔌 [SocketService] Socket disconnected manually');
    }
  }

  /**
   * Get raw socket instance
   */
  public getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check connection status
   */
  public isConnected(): boolean {
    return !!this.socket?.connected;
  }

  /**
   * Join a conversation room (1-1 or community room)
   */
  public joinRoom(conversationId: string) {
    if (!conversationId) return;
    this.currentConversationId = conversationId;
    if (this.socket?.connected) {
      this.socket.emit('join_room', { conversationId });
      console.log(`👥 [SocketService] Joined room conv_${conversationId}`);
    } else {
      this.connect();
    }
  }

  /**
   * Leave a conversation room
   */
  public leaveRoom(conversationId: string) {
    if (!conversationId) return;
    if (this.currentConversationId === conversationId) {
      this.currentConversationId = null;
    }
    if (this.socket?.connected) {
      this.socket.emit('leave_room', { conversationId });
      console.log(`👋 [SocketService] Left room conv_${conversationId}`);
    }
  }

  /**
   * Send a chat message through WebSocket with safety timeout
   */
  public sendMessage(
    conversationId: string,
    text: string,
    imageUri?: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        this.connect();
      }

      if (!this.socket || !this.socket.connected) {
        return resolve({ success: false, error: 'Socket chưa kết nối, sử dụng REST fallback' });
      }

      let hasResolved = false;
      const timeoutTimer = setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          resolve({ success: false, error: 'Socket send timeout' });
        }
      }, 1500);

      this.socket.emit(
        'send_message',
        { conversationId, text, imageUri },
        (res: { success: boolean; data?: any; error?: string }) => {
          if (!hasResolved) {
            hasResolved = true;
            clearTimeout(timeoutTimer);
            if (res) {
              resolve(res);
            } else {
              resolve({ success: true });
            }
          }
        }
      );
    });
  }

  /**
   * Emit typing event
   */
  public emitTyping(conversationId: string) {
    if (this.socket?.connected && conversationId) {
      this.socket.emit('typing', { conversationId });
    }
  }

  /**
   * Emit stop typing event
   */
  public emitStopTyping(conversationId: string) {
    if (this.socket?.connected && conversationId) {
      this.socket.emit('stop_typing', { conversationId });
    }
  }

  /**
   * Listen to incoming chat messages
   */
  public onNewMessage(callback: (message: any) => void) {
    this.messageListeners.add(callback);
    this.connect();
  }

  public offNewMessage(callback: (message: any) => void) {
    this.messageListeners.delete(callback);
  }

  /**
   * Listen to typing indicator events
   */
  public onUserTyping(callback: (data: { conversationId: string; userId: string; userName: string }) => void) {
    this.typingListeners.add(callback);
    this.connect();
  }

  public offUserTyping(callback: (data: any) => void) {
    this.typingListeners.delete(callback);
  }

  /**
   * Listen to stop typing indicator events
   */
  public onUserStopTyping(callback: (data: { conversationId: string; userId: string }) => void) {
    this.stopTypingListeners.add(callback);
    this.connect();
  }

  public offUserStopTyping(callback: (data: any) => void) {
    this.stopTypingListeners.delete(callback);
  }

  /**
   * Community Live Feed Real-time Subscriptions
   */
  public onCommunityPost(callback: (data: { post: any }) => void) {
    this.communityPostListeners.add(callback);
    this.connect();
  }

  public offCommunityPost(callback: (data: { post: any }) => void) {
    this.communityPostListeners.delete(callback);
  }

  public onPostReaction(callback: (data: { postId: string; totalReactions: number; reactionCounts: Record<string, number>; userId: string; reactionType: string | null }) => void) {
    this.postReactionListeners.add(callback);
    this.connect();
  }

  public offPostReaction(callback: (data: any) => void) {
    this.postReactionListeners.delete(callback);
  }

  public onPostComment(callback: (data: { postId: string; comment: any; commentsCount: number }) => void) {
    this.postCommentListeners.add(callback);
    this.connect();
  }

  public offPostComment(callback: (data: any) => void) {
    this.postCommentListeners.delete(callback);
  }

  public onPostDeleted(callback: (data: { postId: string }) => void) {
    this.postDeletedListeners.add(callback);
    this.connect();
  }

  public offPostDeleted(callback: (data: any) => void) {
    this.postDeletedListeners.delete(callback);
  }
}

export const socketService = new SocketService();
export default socketService;
