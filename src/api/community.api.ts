import { apiClient } from './client';
import type { ApiResponse, Post, PostComment, ReactionType } from '../types';

export interface GetPostsParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
  authorId?: string;
}

export interface GetPostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetCommentsResponse {
  comments: PostComment[];
  total: number;
}

export const communityApi = {
  getPosts: async (params?: GetPostsParams): Promise<GetPostsResponse> => {
    const res = await apiClient.get<ApiResponse<GetPostsResponse>>('/posts', { params });
    return res.data.data;
  },

  getPostById: async (postId: string): Promise<Post> => {
    const res = await apiClient.get<ApiResponse<Post>>(`/posts/${postId}`);
    return res.data.data;
  },

  createPost: async (formData: FormData): Promise<Post> => {
    const res = await apiClient.post<ApiResponse<Post>>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  reactPost: async (postId: string, type: ReactionType): Promise<Post> => {
    const res = await apiClient.post<ApiResponse<Post>>(`/posts/${postId}/react`, { type });
    return res.data.data;
  },

  sharePost: async (postId: string, caption?: string): Promise<Post> => {
    const res = await apiClient.post<ApiResponse<Post>>(`/posts/${postId}/share`, { caption });
    return res.data.data;
  },

  getComments: async (postId: string, params?: { page?: number; limit?: number }): Promise<GetCommentsResponse> => {
    const res = await apiClient.get<ApiResponse<GetCommentsResponse>>(`/posts/${postId}/comments`, { params });
    return res.data.data;
  },

  addComment: async (postId: string, content: string, parentCommentId?: string): Promise<PostComment> => {
    const res = await apiClient.post<ApiResponse<PostComment>>(`/posts/${postId}/comments`, {
      content,
      parentComment: parentCommentId,
    });
    return res.data.data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<null>>(`/posts/${postId}`);
  },

  // Admin moderation endpoints
  togglePin: async (postId: string): Promise<Post> => {
    const res = await apiClient.patch<ApiResponse<Post>>(`/posts/${postId}/pin`);
    return res.data.data;
  },

  updateStatus: async (postId: string, status: 'published' | 'hidden' | 'flagged'): Promise<Post> => {
    const res = await apiClient.patch<ApiResponse<Post>>(`/posts/${postId}/status`, { status });
    return res.data.data;
  },
};
