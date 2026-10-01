import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private currentConversationId: string | null = null;

  /**
   * Connect to WebSocket server with JWT authentication
   */
  public connect(tokenOverride?: string): Socket | null {
    const token = tokenOverride || useAuthStore.getState().accessToken || localStorage.getItem('smartcook_token');

    if (!token) {
      console.warn('⚠️ [SocketService] No token found, skipping socket connection');
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    // If socket exists but disconnected, disconnect old before recreating
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ [SocketService] Connected to server, socketId:', this.socket?.id);
      // Re-join current active conversation room if set
      if (this.currentConversationId) {
        this.joinRoom(this.currentConversationId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 [SocketService] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ [SocketService] Connection error:', err.message);
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
   * Send a chat message through WebSocket with ACK callback
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

      if (!this.socket) {
        return resolve({ success: false, error: 'Socket không thể kết nối' });
      }

      this.socket.emit(
        'send_message',
        { conversationId, text, imageUri },
        (res: { success: boolean; data?: any; error?: string }) => {
          if (res) {
            resolve(res);
          } else {
            resolve({ success: true });
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
   * Listen to incoming messages
   */
  public onNewMessage(callback: (message: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('new_message', callback);
  }

  public offNewMessage(callback: (message: any) => void) {
    this.socket?.off('new_message', callback);
  }

  /**
   * Listen to typing indicator events
   */
  public onUserTyping(callback: (data: { conversationId: string; userId: string; userName: string }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('user_typing', callback);
  }

  public offUserTyping(callback: (data: any) => void) {
    this.socket?.off('user_typing', callback);
  }

  /**
   * Listen to stop typing indicator events
   */
  public onUserStopTyping(callback: (data: { conversationId: string; userId: string }) => void) {
    if (!this.socket) this.connect();
    this.socket?.on('user_stop_typing', callback);
  }

  public offUserStopTyping(callback: (data: any) => void) {
    this.socket?.off('user_stop_typing', callback);
  }
}

export const socketService = new SocketService();
export default socketService;
