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
  accessToken: string;
  refreshToken: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  cookingTimeMinutes: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
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

export interface Post {
  _id: string;
  author: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  caption: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  recipe?: {
    _id: string;
    title: string;
  };
  tags: string[];
  reactionCounts: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  totalReactions: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
