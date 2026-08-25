import { apiClient } from './apiClient';
import { AdminSourceItem } from '../../types';
import { RnpStatusResponse, RnpSyncLog, PaginationMeta } from './types';

export const sourcesApi = {
  getSources: async (signal?: AbortSignal): Promise<AdminSourceItem[]> => {
    const res = await apiClient.get<any>('/admin/sources', { signal });
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data as AdminSourceItem[];
    }
    if (Array.isArray(res)) {
      return res as AdminSourceItem[];
    }
    return [];
  },

  createSource: async (source: Partial<AdminSourceItem>): Promise<AdminSourceItem> => {
    const res = await apiClient.post<any>('/admin/sources', source);
    return (res && 'data' in res ? res.data : res) as AdminSourceItem;
  },

  updateSource: async (id: string, updates: Partial<AdminSourceItem>): Promise<AdminSourceItem> => {
    const res = await apiClient.patch<any>(`/admin/sources/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as AdminSourceItem;
  },

  deleteSource: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/sources/${encodeURIComponent(id)}`);
  },

  getRnpStatus: async (signal?: AbortSignal): Promise<RnpStatusResponse> => {
    const res = await apiClient.get<any>('/admin/sources/rnp/status', { signal });
    return (res && 'data' in res ? res.data : res) as RnpStatusResponse;
  },

  getRnpLogs: async (params?: { page?: number; limit?: number }, signal?: AbortSignal): Promise<{ data: RnpSyncLog[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/admin/sources/rnp/logs', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as RnpSyncLog[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as RnpSyncLog[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  },

  triggerRnpSync: async (): Promise<{ status: string; recordsDiscovered?: number; recordsUpdated?: number; message?: string }> => {
    const res = await apiClient.post<any>('/admin/sources/rnp/sync', {});
    return (res && 'data' in res ? res.data : res);
  }
};
