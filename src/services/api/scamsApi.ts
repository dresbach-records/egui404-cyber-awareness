import { apiClient } from './apiClient';
import { ScamItem } from '../../types';
import { ApiListResponse, PaginationMeta } from './types';

export interface ScamQueryParams {
  search?: string;
  category?: string;
  risk?: string;
  severity?: string;
  status?: string;
  source?: string;
  sourceProvider?: string;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const scamsApi = {
  getScams: async (params?: ScamQueryParams, signal?: AbortSignal): Promise<{ data: ScamItem[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/scams', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ScamItem[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ScamItem[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  getScamBySlug: async (slugOrId: string, signal?: AbortSignal): Promise<ScamItem> => {
    const res = await apiClient.get<any>(`/scams/${encodeURIComponent(slugOrId)}`, { signal });
    return (res && 'data' in res ? res.data : res) as ScamItem;
  },

  createScam: async (scam: Partial<ScamItem>): Promise<ScamItem> => {
    const res = await apiClient.post<any>('/scams', scam);
    return (res && 'data' in res ? res.data : res) as ScamItem;
  },

  updateScam: async (id: string, updates: Partial<ScamItem>): Promise<ScamItem> => {
    const res = await apiClient.patch<any>(`/scams/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as ScamItem;
  },

  deleteScam: async (id: string): Promise<void> => {
    await apiClient.delete(`/scams/${encodeURIComponent(id)}`);
  }
};
