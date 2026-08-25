import { apiClient } from './apiClient';
import { EducationArticle } from '../../types';
import { PaginationMeta } from './types';

export interface ArticleQueryParams {
  search?: string;
  category?: string;
  status?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  author?: string;
  page?: number;
  limit?: number;
}

export const articlesApi = {
  getArticles: async (params?: ArticleQueryParams, signal?: AbortSignal): Promise<{ data: EducationArticle[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<unknown>('/articles', { params: params as object, signal });
    const payload = res as { data?: unknown; meta?: PaginationMeta };

    if (Array.isArray(payload.data)) {
      return {
        data: payload.data as EducationArticle[],
        meta: payload.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as EducationArticle[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  getArticleBySlug: async (slugOrId: string, signal?: AbortSignal): Promise<EducationArticle> => {
    const res = await apiClient.get<unknown>(`/articles/${encodeURIComponent(slugOrId)}`, { signal });
    const payload = res as { data?: unknown };
    return (payload.data ?? res) as EducationArticle;
  },

  createArticle: async (article: Partial<EducationArticle>): Promise<EducationArticle> => {
    const res = await apiClient.post<any>('/articles', article);
    return (res && 'data' in res ? res.data : res) as EducationArticle;
  },

  updateArticle: async (id: string, updates: Partial<EducationArticle>): Promise<EducationArticle> => {
    const res = await apiClient.patch<any>(`/articles/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as EducationArticle;
  },

  deleteArticle: async (id: string): Promise<void> => {
    await apiClient.delete(`/articles/${encodeURIComponent(id)}`);
  }
};
