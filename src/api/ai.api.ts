import { apiClient } from './client';

export interface ChatMessageContext {
  sender: 'ai' | 'user';
  text: string;
}

export interface AssistantChatResponse {
  replyText: string;
  suggestedDishes?: string[];
  quickPrompts?: string[];
}

export const aiApi = {
  /**
   * Hỏi đáp với Đầu Bếp Trợ Lý AI SmartCook
   */
  assistantChat: async (
    message: string,
    conversationHistory: ChatMessageContext[] = []
  ): Promise<AssistantChatResponse> => {
    try {
      const response = await apiClient.post('/ai/assistant-chat', {
        message,
        conversationHistory,
      });

      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Dữ liệu phản hồi không đúng định dạng');
    } catch (err: any) {
      console.warn('[aiApi.assistantChat] Request failed, using client fallback:', err?.message || err);
      return getClientFallbackResponse(message);
    }
  },
};

/**
 * Phản hồi dự phòng thông minh ở Client khi mất kết nối mạng hoặc server bận
 */
function getClientFallbackResponse(query: string): AssistantChatResponse {
  const lower = query.toLowerCase();

  if (lower.includes('ức gà') || lower.includes('thịt gà') || lower.includes('ga')) {
    return {
      replyText:
        'Với thịt gà, Bếp gợi ý bạn làm **Cơm Gà Teriyaki áp chảo sốt mật ong** giòn da hoặc **Salad Ức Gà Eat Clean** thanh đạm. Bạn có muốn xem công thức chi tiết không?',
      suggestedDishes: ['Cơm Gà Teriyaki Áp Chảo', 'Salad Ức Gà Bơ Sốt Chanh Dây'],
      quickPrompts: ['Cách làm nước sốt gà', 'Mẹo ức gà không bị khô'],
    };
  }

  if (lower.includes('eat clean') || lower.includes('thanh đạm') || lower.includes('ít dầu') || lower.includes('healthy')) {
    return {
      replyText:
        'Thực đơn Eat Clean lý tưởng hôm nay: **Salad Cá Hồi Bơ Sốt Chanh Dây** và **Bò Bít Tết Sốt Tiêu Măng Tây**. Giàu đạm, ít carb và không hề ngấy mỡ!',
      suggestedDishes: ['Salad Cá Hồi Bơ Sốt Chanh Dây', 'Bò Bít Tết Sốt Tiêu Măng Tây'],
      quickPrompts: ['Calo trong 1 đĩa salad', 'Món thanh đạm dưới 500 kcal'],
    };
  }

  if (lower.includes('hôm nay ăn gì') || lower.includes('gợi ý') || lower.includes('bữa tối') || lower.includes('bữa trưa')) {
    return {
      replyText:
        'Hôm nay thời tiết rất thích hợp cho một bữa ăn ấm cúng! Bếp gợi ý bạn món **Mỳ Ý Bò Bằm Sốt Cà Chua (Bolognese)** thơm ngậy hoặc **Canh Chua Cá Hồi** thanh mát giải nhiệt nhé!',
      suggestedDishes: ['Mỳ Ý Bò Bằm Sốt Cà Chua (Bolognese)', 'Canh Chua Cá Hồi Test Mobile'],
      quickPrompts: ['Món dưới 20 phút', 'Gợi ý bữa ăn cho 2 người'],
    };
  }

  if (lower.includes('bò') || lower.includes('thịt bò')) {
    return {
      replyText:
        '💡 **Bí quyết ướp thịt bò mềm mọng nước:**\nƯớp cùng 1 thìa dầu ô liu + tỏi băm + chút nước tương và xíu bột bắp trong 15 phút. Xào lửa lớn đảo nhanh tay là thịt ngọt lịm không hề dai nhé!',
      suggestedDishes: ['Bò Bít Tết Sốt Tiêu Măng Tây', 'Bò xào măng tây'],
      quickPrompts: ['Nhiệt độ áp chảo bò', 'Rau ăn kèm thịt bò'],
    };
  }

  return {
    replyText: `SmartCook đã ghi nhận câu hỏi của bạn: "${query}". Bếp gợi ý bạn nên tận dụng các nguyên liệu sẵn có trong tủ lạnh hoặc duyệt qua kho công thức hot hôm nay nhé!`,
    suggestedDishes: ['Cơm Gà Teriyaki Áp Chảo', 'Bò Bít Tết Sốt Tiêu Măng Tây'],
    quickPrompts: ['Hôm nay ăn gì?', 'Món thanh đạm ít dầu', 'Cách ướp thịt bò mềm'],
  };
}
