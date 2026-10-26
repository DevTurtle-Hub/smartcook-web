import { apiClient } from './client';
import { resolveCookingCommand } from '../utils/cookingCommands';
import type { CookingCommand } from '../utils/cookingCommands';
import { getCookingFactReply, getCookingScopeReply } from '../utils/cookingScope';
import type { CookingScopeContext } from '../utils/cookingScope';
import { useAuthStore } from '../store/useAuthStore';

export interface CookingVoiceRequest extends CookingScopeContext {
  userVoiceText: string;
  stepTimer: {
    targetMinutes: number; elapsedSeconds: number; remainingSeconds: number;
    isRunning: boolean; isOverdue: boolean; overdueSeconds: number;
  };
}

export interface CookingVoiceReply extends Omit<CookingCommand, 'action'> {
  action: CookingCommand['action'] | 'TROUBLESHOOT';
}

export function localCookingReply(request: CookingVoiceRequest): CookingVoiceReply | null {
  const refusal = getCookingScopeReply(request.userVoiceText, request);
  if (refusal) return { action: 'NONE', speechReply: refusal, suggestedQuickReplies: [] };
  const command = resolveCookingCommand(request.userVoiceText, request);
  if (command) return command;
  const fact = getCookingFactReply(request.userVoiceText, request);
  return fact ? { action: 'NONE', speechReply: fact } : null;
}

export const cookingVoiceApi = {
  async ask(request: CookingVoiceRequest, signal: AbortSignal): Promise<CookingVoiceReply> {
    const local = localCookingReply(request);
    if (local) return local;
    if (!useAuthStore.getState().accessToken) throw new Error('Hãy đăng nhập để trò chuyện với AI về cách xử lý món ăn.');
    const response = await apiClient.post('/ai/cooking-copilot', request, { signal, timeout: 20000 });
    const data = response.data?.data;
    // Navigation/timer controls only come from the deterministic local parser.
    if (!data || typeof data.speechReply !== 'string' || !data.speechReply.trim()
      || !['NONE', 'TROUBLESHOOT'].includes(data.action)) {
      throw new Error('Phản hồi trợ lý chưa hợp lệ. Hãy thử hỏi lại.');
    }
    return {
      action: data.action, speechReply: data.speechReply.slice(0, 1800),
      suggestedQuickReplies: Array.isArray(data.suggestedQuickReplies)
        ? data.suggestedQuickReplies.filter((item: unknown) => typeof item === 'string').slice(0, 3) : [],
    };
  },
  async transcribe(audioBase64: string, mimeType: string, signal: AbortSignal): Promise<string> {
    if (!useAuthStore.getState().accessToken) throw new Error('Hãy đăng nhập để dùng nhận diện giọng nói.');
    const response = await apiClient.post('/ai/cooking-transcription', { audioBase64, mimeType }, { signal, timeout: 20000 });
    const text = response.data?.data?.text;
    if (typeof text !== 'string' || !text.trim()) throw new Error('Chưa nghe rõ. Hãy nói gần micro và thử lại.');
    return text.trim();
  },
};
