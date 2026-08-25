import { apiClient } from './apiClient';
import { ForumCategory, ForumThread, ForumPost } from '../../types';
import { PaginationMeta } from './types';

export interface ForumThreadQueryParams {
  categoryId?: string;
  categorySlug?: string;
  tag?: string;
  search?: string;
  status?: string;
  sort?: 'recent' | 'popular' | 'unanswered' | 'solved';
  page?: number;
  limit?: number;
}

export const forumApi = {
  getCategories: async (signal?: AbortSignal): Promise<ForumCategory[]> => {
    const res = await apiClient.get<any>('/forum/categories', { signal });
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data as ForumCategory[];
    }
    if (Array.isArray(res)) {
      return res as ForumCategory[];
    }
    return [];
  },

  getThreads: async (params?: ForumThreadQueryParams, signal?: AbortSignal): Promise<{ data: ForumThread[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/forum/threads', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ForumThread[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ForumThread[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  getThreadBySlug: async (slugOrId: string, signal?: AbortSignal): Promise<ForumThread> => {
    const res = await apiClient.get<any>(`/forum/threads/${encodeURIComponent(slugOrId)}`, { signal });
    return (res && 'data' in res ? res.data : res) as ForumThread;
  },

  createThread: async (thread: Partial<ForumThread>): Promise<ForumThread> => {
    const res = await apiClient.post<any>('/forum/threads', thread);
    return (res && 'data' in res ? res.data : res) as ForumThread;
  },

  updateThread: async (id: string, updates: Partial<ForumThread>): Promise<ForumThread> => {
    const res = await apiClient.patch<any>(`/forum/threads/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as ForumThread;
  },

  deleteThread: async (id: string): Promise<void> => {
    await apiClient.delete(`/forum/threads/${encodeURIComponent(id)}`);
  },

  getPosts: async (threadId: string, params?: { page?: number; limit?: number }, signal?: AbortSignal): Promise<{ data: ForumPost[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>(`/forum/threads/${encodeURIComponent(threadId)}/posts`, { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ForumPost[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ForumPost[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  createPost: async (threadId: string, data: { content: string; quotedPostId?: string; sourceUrl?: string }): Promise<ForumPost> => {
    const res = await apiClient.post<any>(`/forum/threads/${encodeURIComponent(threadId)}/posts`, data);
    return (res && 'data' in res ? res.data : res) as ForumPost;
  },

  updatePost: async (postId: string, data: { content: string }): Promise<ForumPost> => {
    const res = await apiClient.patch<any>(`/forum/posts/${encodeURIComponent(postId)}`, data);
    return (res && 'data' in res ? res.data : res) as ForumPost;
  },

  deletePost: async (postId: string): Promise<void> => {
    await apiClient.delete(`/forum/posts/${encodeURIComponent(postId)}`);
  },

  toggleLike: async (threadId: string): Promise<{ liked: boolean; likesCount: number }> => {
    try {
      const res = await apiClient.post<any>(`/forum/threads/${encodeURIComponent(threadId)}/like`, {});
      return res && 'data' in res ? res.data : res;
    } catch {
      const patchRes = await apiClient.patch<any>(`/forum/threads/${encodeURIComponent(threadId)}/like`, {});
      return patchRes && 'data' in patchRes ? patchRes.data : patchRes;
    }
  },

  toggleBookmark: async (threadId: string): Promise<{ bookmarked: boolean }> => {
    const res = await apiClient.post<any>(`/forum/threads/${encodeURIComponent(threadId)}/bookmark`, {});
    return res && 'data' in res ? res.data : res;
  },

  reportThread: async (threadId: string, reportData: { reason: string; details?: string }): Promise<void> => {
    await apiClient.post(`/forum/threads/${encodeURIComponent(threadId)}/report`, reportData);
  },

  markSolution: async (threadId: string, postId: string): Promise<ForumThread> => {
    const res = await apiClient.patch<any>(`/forum/threads/${encodeURIComponent(threadId)}/solve`, { solutionPostId: postId });
    return (res && 'data' in res ? res.data : res) as ForumThread;
  },

  pinThread: async (threadId: string, isPinned: boolean): Promise<ForumThread> => {
    const res = await apiClient.patch<any>(`/forum/threads/${encodeURIComponent(threadId)}/pin`, { isPinned });
    return (res && 'data' in res ? res.data : res) as ForumThread;
  },

  lockThread: async (threadId: string, isLocked: boolean): Promise<ForumThread> => {
    const res = await apiClient.patch<any>(`/forum/threads/${encodeURIComponent(threadId)}/lock`, { isLocked });
    return (res && 'data' in res ? res.data : res) as ForumThread;
  }
};
