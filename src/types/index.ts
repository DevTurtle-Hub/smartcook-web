export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  role: 'user' | 'admin';
  chefExp: number;
  level: string;
  isActive: boolean;
  preferences?: {
    hasCompletedSurvey: boolean;
    portion?: string;
    cuisines?: string[];
    healthGoal?: string;
    restrictions?: string[];
    tasteProfile?: string[];
    cookingTime?: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn?: string;
  };
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  image: string;
  youtubeVideoId?: string | null;
  category: string;
  cookingTimeMinutes: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó' | string;
  servingsCount: number;
  nutrition: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }>;
  steps: Array<{
    stepNumber: number;
    instruction: string;
    timerMinutes?: number;
    image?: string;
  }>;
  ratingAverage: number;
  ratingsCount: number;
  createdAt: string;
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface Post {
  _id: string;
  id?: string;
  dishName?: string;
  author: {
    _id: string;
    id?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    avatar?: string;
    level?: string;
    badge?: string;
    isChef?: boolean;
    role?: string;
  };
  caption: string;
  content?: string;
  images: Array<{
    url: string;
    publicId?: string;
  }>;
  imageUrls?: string[];
  recipeId?: {
    _id: string;
    title: string;
    image?: string;
  } | string;
  recipe?: {
    _id: string;
    title: string;
    image?: string;
  };
  tags: string[];
  reactions?: Record<string, ReactionType>;
  reactionCounts?: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  totalReactions?: number;
  likesCount?: number;
  isLiked?: boolean;
  myReaction?: ReactionType | null;
  commentsCount?: number;
  sharesCount?: number;
  isPinned?: boolean;
  status?: 'published' | 'hidden' | 'flagged';
  createdAt: string;
  updatedAt?: string;
}

export interface PostComment {
  _id: string;
  id?: string;
  postId: string;
  author: {
    _id: string;
    id?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    avatar?: string;
    level?: string;
    role?: string;
  };
  content: string;
  parentComment?: string;
  parentCommentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
