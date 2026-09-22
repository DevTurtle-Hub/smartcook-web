import React from 'react';

/**
 * Danh sách ảnh ẩm thực chất lượng cao (Unsplash CDN 200 OK) dự phòng cho từng danh mục & món ăn
 */
export const DEFAULT_RECIPE_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  vietnamese: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80', // Canh chua / Món Việt
  soup: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  quick: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800&q=80', // Mỳ Ý / Nấu nhanh
  pasta: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=800&q=80',
  healthy: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80', // Salad
  family: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', // Cơm gia đình
  steak: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
  beef: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
  tofu: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
};

// URL ảnh test hỏng đã biết (ví dụ ảnh 149-byte màn hình đen)
const CORRUPTED_IMAGE_SUBSTRINGS = [
  'vdbbuq7e02m0iqfekhrn',
  'photo-1621996346565-e3d5d6281541',
  'photo-1546069901-d8a9599a7e63?',
];

/**
 * Kiểm tra và giải quyết ảnh hợp lệ ngay từ lúc render
 */
export function resolveRecipeImage(url?: string | null, titleOrCategory?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getFallbackByKeyword(titleOrCategory);
  }

  // Kiểm tra nếu URL là ảnh hỏng đã biết
  for (const badSub of CORRUPTED_IMAGE_SUBSTRINGS) {
    if (url.includes(badSub)) {
      return getFallbackByKeyword(titleOrCategory);
    }
  }

  return url;
}

/**
 * Tìm ảnh phù hợp theo từ khóa tên món hoặc danh mục
 */
export function getFallbackByKeyword(keyword?: string): string {
  if (!keyword) return DEFAULT_RECIPE_IMAGE;
  const lower = keyword.toLowerCase();

  if (lower.includes('canh') || lower.includes('cá hồi') || lower.includes('chua') || lower.includes('việt')) {
    return CATEGORY_FALLBACK_IMAGES.vietnamese;
  }
  if (lower.includes('mỳ') || lower.includes('bò bằm') || lower.includes('pasta') || lower.includes('spaghetti')) {
    return CATEGORY_FALLBACK_IMAGES.pasta;
  }
  if (lower.includes('đậu hũ') || lower.includes('thịt sốt') || lower.includes('tiết kiệm')) {
    return CATEGORY_FALLBACK_IMAGES.tofu;
  }
  if (lower.includes('salad') || lower.includes('healthy') || lower.includes('eat clean') || lower.includes('bơ')) {
    return CATEGORY_FALLBACK_IMAGES.healthy;
  }
  if (lower.includes('bò') || lower.includes('bít tết') || lower.includes('steak')) {
    return CATEGORY_FALLBACK_IMAGES.steak;
  }

  return DEFAULT_RECIPE_IMAGE;
}

/**
 * Event handler xử lý khi ảnh gặp lỗi tải (onError)
 * Tự động chuyển sang ảnh dự phòng và chống vòng lặp vô hạn
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl?: string
): void {
  const target = e.currentTarget;
  if (target.dataset.fallbackApplied === 'true') {
    return; // Tránh lặp vô hạn
  }
  target.dataset.fallbackApplied = 'true';
  target.src = fallbackUrl || DEFAULT_RECIPE_IMAGE;
}
