import { apiClient } from './apiClient';
import { SearchResultItem } from '../../types';
import { PaginationMeta } from './types';

export const searchApi = {
  search: async (query: string, params?: { type?: string; limit?: number }, signal?: AbortSignal): Promise<{ data: SearchResultItem[]; meta?: PaginationMeta }> => {
    if (!query || !query.trim()) {
      return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }

    const res = await apiClient.get<any>('/search', {
      params: { q: query.trim(), ...params },
      signal
    });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as SearchResultItem[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as SearchResultItem[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
};
