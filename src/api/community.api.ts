import { apiClient } from './client';
import type { ApiResponse, Post } from '../types';

export const communityApi = {
  getPosts: async (params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<{ posts: Post[]; total: number }>>('/posts', { params });
    return res.data.data;
  },

  createPost: async (formData: FormData) => {
    const res = await apiClient.post<ApiResponse<Post>>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  reactPost: async (postId: string, type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => {
    const res = await apiClient.post<ApiResponse<any>>(`/posts/${postId}/react`, { type });
    return res.data.data;
  },

  sharePost: async (postId: string, caption?: string) => {
    const res = await apiClient.post<ApiResponse<Post>>(`/posts/${postId}/share`, { caption });
    return res.data.data;
  },

  getComments: async (postId: string, params?: { page?: number; limit?: number }) => {
    const res = await apiClient.get<ApiResponse<any>>(`/posts/${postId}/comments`, { params });
    return res.data.data;
  },

  addComment: async (postId: string, content: string, parentCommentId?: string) => {
    const res = await apiClient.post<ApiResponse<any>>(`/posts/${postId}/comments`, {
      content,
      parentComment: parentCommentId,
    });
    return res.data.data;
  },
};
