export interface AdminKPI {
  totalUsers: number;
  activeUsers: number;
  publishedRecipes: number;
  communityPostsToday: number;
  aiScansCount: number;
  aiChatMessagesCount: number;
  totalRevenueVnd: number;
  monthlyTargetVnd: number;
  monthlyAchievedPercent: number;
}

export interface HeroBannerConfig {
  _id: string;
  recipeId: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  locationTag: string;
  prepTime: string;
  calories: string;
  servings: string;
  isActive: boolean;
}

export interface SystemIngredientGroup {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  color: string;
}

export interface SystemIngredient {
  id: string;
  groupId: string;
  name: string;
  icon: string;
  unit: string;
  shelfLifeDays: number;
  synonyms: string[];
  inStockUsersCount: number;
}

export interface DishIngredientItem {
  name: string;
  amount: string; // hoặc number + unit (VD: 300g, 2 quả, 1 muỗng...)
  note?: string;
}

export interface DishCookingStep {
  stepNumber: number;
  instruction: string;
  timerMinutes?: number;
}

export interface DishRecipeAdmin {
  id: string;
  title: string;
  description: string;
  category: string; // Gia đình, Sức khỏe, Eat Clean, Món Việt, Món Âu...
  subCategory?: string;
  prepTimeMinutes: number;
  cookingTimeMinutes: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  servings: number;
  calories: number;
  macro: {
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
  estimatedCostVnd: number; // Mô đun chi phí món ăn: <20k, 20-30k, 30-50k, >50k
  image: string;
  author: string;
  status: 'published' | 'draft' | 'pending';
  rating: number;
  ratingsCount: number;
  ingredients: DishIngredientItem[];
  steps: DishCookingStep[];
  dietaryTags: string[]; // Healthy, Low Carb, High Protein, Ăn chay...
  substitutions?: Array<{ original: string; substitute: string; note: string }>; // Mô đun thay thế nguyên liệu
}

export interface PendingContribution {
  id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  submittedAt: string;
  image: string;
  category: string;
  cookingTimeMinutes: number;
  calories: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  ingredientsCount: number;
  stepsCount: number;
}

export interface CommunityPostAdmin {
  id: string;
  author: {
    id?: string;
    name: string;
    avatar: string;
    badge: string;
  };
  content: string;
  image: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  status: 'published' | 'pinned' | 'hidden' | 'flagged' | 'spam';
  reportCount?: number;
  reportsList?: Array<{
    reporter: string;
    reason: string;
    date: string;
    details?: string;
  }>;
}

export interface ModerationReport {
  id: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetPreview: string;
  reporterName: string;
  reason: 'Spam / Bán hàng' | 'Nội dung phản cảm' | 'Quấy rối / Đả kích' | 'Hình ảnh sai món';
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface AppUserAdmin {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  joinDate: string;
  lastActive: string;
  postsCount: number;
  savedRecipesCount: number;
  badge: 'Thành Viên Mới' | 'Đầu Bếp Nghiệp Dư' | 'Bếp Trưởng Bạc' | 'Master Chef';
  tier: 'Free' | 'VIP Premium';
  status: 'active' | 'suspended' | 'banned';
  dietPreference: string;
  // Thông tin mở rộng trên ứng dụng SmartCook Mobile
  smartFridgeItemsCount?: number;
  expiringItemsCount?: number;
  completedCookSessions?: number;
  aiScansCount?: number;
  healthGoal?: 'Giảm cân & Giữ dáng' | 'Tăng cơ săn chắc' | 'Ăn uống lành mạnh' | 'Tiết kiệm chi tiêu' | 'Nấu nhanh gia đình';
  allergies?: string[];
  favoriteIngredients?: string[];
  recentAppActivities?: Array<{
    action: string;
    description: string;
    timestamp: string;
    type: 'cook' | 'fridge' | 'ai_scan' | 'community' | 'saved';
  }>;
}

export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Content Editor' | 'Community Moderator' | 'Support Staff';
  avatar: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export interface AIEngineConfig {
  systemPrompt: string;
  personaTone: 'friendly' | 'professional' | 'traditional_viet';
  temperature: number;
  quickPrompts: string[];
  visionAccuracyOverall: number;
  recentScans: Array<{
    id: string;
    user: string;
    detectedLabels: string[];
    confidence: number;
    recommendedRecipe: string;
    timestamp: string;
  }>;
}

export interface PushNotificationSchedule {
  id: string;
  title: string;
  body: string;
  scheduledTime: string;
  targetAudience: 'all' | 'vip_only' | 'inactive_3days';
  category: 'lunch_meal' | 'dinner_meal' | 'promo' | 'weekly_digest';
  status: 'scheduled' | 'sent' | 'draft';
  clicksCount?: number;
}

export interface AdminTaskItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'normal';
}
