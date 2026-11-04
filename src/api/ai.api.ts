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

export interface ScanDetectedIngredient {
  name: string;
  confidence: string | number;
  icon?: string;
  category?: string;
  source?: 'visible' | 'inferred';
  dishNames?: string[];
  evidence?: string;
}

export interface ScanPin {
  text: string;
  icon?: string;
  confidence?: string;
  top: number;
  left: number;
}

export interface ScanSuggestedRecipe {
  title: string;
  desc: string;
  calories: number;
  durationMinutes: number;
  matchPercent: number;
  recipeId?: string;
  image?: string;
}

export interface ScanIngredientResult {
  id: string;
  _id?: string;
  title: string;
  imageUrl: string;
  image: string;
  accuracy: number;
  dishes?: { name: string; confidence: string; icon?: string }[];
  ingredients: ScanDetectedIngredient[];
  pins: ScanPin[];
  suggestedRecipe: ScanSuggestedRecipe;
  scannedAt: string;
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

  /**
   * Quét và phân tích hình ảnh thực phẩm bằng Gemini Vision
   */
  scanIngredients: async (
    fileOrData: File | FormData | { file?: File; imageBase64?: string; imageUrl?: string }
  ): Promise<ScanIngredientResult> => {
    let body: FormData | any;
    let headers: Record<string, string> = {};

    if (fileOrData instanceof FormData) {
      body = fileOrData;
      headers['Content-Type'] = 'multipart/form-data';
    } else if (fileOrData instanceof File) {
      body = new FormData();
      body.append('image', fileOrData);
      headers['Content-Type'] = 'multipart/form-data';
    } else if (fileOrData.file) {
      body = new FormData();
      body.append('image', fileOrData.file);
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      body = fileOrData;
    }

    const response = await apiClient.post('/ai/scan-ingredients', body, { headers, timeout: 150000 });

    if (response.data && response.data.data) {
      const d = response.data.data;
      if (!Array.isArray(d.ingredients) || (!d.ingredients.length && !d.dishes?.length) || typeof d.accuracy !== 'number') {
        throw new Error('AI chưa nhận diện được thực phẩm trong ảnh. Vui lòng thử ảnh rõ hơn.');
      }
      return {
        id: d.id || d._id || 'scan-' + Date.now(),
        _id: d._id || d.id,
        title: d.title || 'Quét thực phẩm mới',
        imageUrl: d.imageUrl || d.image || '',
        image: d.image || d.imageUrl || '',
        accuracy: d.accuracy ?? 0,
        dishes: d.dishes || [],
        ingredients: d.ingredients || [],
        pins: d.pins || [],
        suggestedRecipe: d.suggestedRecipe ? { ...d.suggestedRecipe, recipeId: d.suggestedRecipe.id || d.suggestedRecipe.recipeId } : undefined,
        scannedAt: d.scannedAt || new Date().toLocaleString('vi-VN'),
      };
    }
    throw new Error('Dữ liệu phân tích AI không hợp lệ');
  },

  /**
   * Lấy lịch sử quét thực phẩm AI của người dùng
   */
  getScanHistory: async (limit: number = 30): Promise<ScanIngredientResult[]> => {
    try {
      const response = await apiClient.get(`/ai/scan-history?limit=${limit}`);
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data.map((item: any) => ({
          id: item.id || item._id || 'hist-' + Math.random(),
          _id: item._id || item.id,
          title: item.title || 'Quét thực phẩm',
          imageUrl: item.imageUrl || item.image || '',
          image: item.image || item.imageUrl || '',
          accuracy: item.accuracy ?? 0,
          dishes: item.dishes || [],
          ingredients: item.ingredients || [],
          pins: item.pins || [],
          suggestedRecipe: item.suggestedRecipe,
          scannedAt: item.scannedAt || '',
        }));
      }
      return [];
    } catch (err: any) {
      console.warn('[aiApi.getScanHistory] Failed to fetch scan history:', err?.message || err);
      return [];
    }
  },

  /**
   * Xóa một bản ghi lịch sử quét
   */
  deleteScanHistory: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/ai/scan-history/${id}`);
    } catch (err: any) {
      console.warn('[aiApi.deleteScanHistory] Failed to delete scan item:', err?.message || err);
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
