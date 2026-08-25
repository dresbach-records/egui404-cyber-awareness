import { apiClient } from './apiClient';
import { ModerationQueueItem, PaginationMeta } from './types';

export const moderationApi = {
  getModerationQueue: async (params?: { status?: string; type?: string; page?: number; limit?: number }, signal?: AbortSignal): Promise<{ data: ModerationQueueItem[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/admin/moderation', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ModerationQueueItem[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ModerationQueueItem[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  resolveItem: async (id: string, action: 'APPROVE' | 'REJECT' | 'DISMISS' | 'DELETE' | 'RESOLVE', notes?: string): Promise<void> => {
    await apiClient.patch(`/admin/moderation/${encodeURIComponent(id)}`, { action, notes });
  }
};
