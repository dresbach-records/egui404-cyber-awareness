import { apiClient } from './apiClient';
import { ThreatItem } from '../../types';
import { ApiListResponse, ApiResponse, PaginationMeta } from './types';

export interface ThreatQueryParams {
  search?: string;
  category?: string;
  risk?: string;
  status?: string;
  source?: string;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const threatsApi = {
  getThreats: async (params?: ThreatQueryParams, signal?: AbortSignal): Promise<{ data: ThreatItem[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/threats', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ThreatItem[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ThreatItem[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  getThreatBySlug: async (slugOrId: string, signal?: AbortSignal): Promise<ThreatItem> => {
    const res = await apiClient.get<any>(`/threats/${encodeURIComponent(slugOrId)}`, { signal });
    return (res && 'data' in res ? res.data : res) as ThreatItem;
  },

  createThreat: async (threat: Partial<ThreatItem>): Promise<ThreatItem> => {
    const res = await apiClient.post<any>('/threats', threat);
    return (res && 'data' in res ? res.data : res) as ThreatItem;
  },

  updateThreat: async (id: string, updates: Partial<ThreatItem>): Promise<ThreatItem> => {
    const res = await apiClient.patch<any>(`/threats/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as ThreatItem;
  },

  deleteThreat: async (id: string): Promise<void> => {
    await apiClient.delete(`/threats/${encodeURIComponent(id)}`);
  }
};
