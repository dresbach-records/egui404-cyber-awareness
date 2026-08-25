import { apiClient } from './apiClient';
import { ScamAlert } from '../../types';
import { PaginationMeta } from './types';

export interface AlertQueryParams {
  search?: string;
  urgent?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

export const alertsApi = {
  getAlerts: async (params?: AlertQueryParams, signal?: AbortSignal): Promise<{ data: ScamAlert[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<unknown>('/alerts', { params: params as object, signal });
    const payload = res as { data?: unknown; meta?: PaginationMeta };

    if (Array.isArray(payload.data)) {
      return {
        data: payload.data as ScamAlert[],
        meta: payload.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ScamAlert[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  getAlertById: async (id: string, signal?: AbortSignal): Promise<ScamAlert> => {
    const res = await apiClient.get<unknown>(`/alerts/${encodeURIComponent(id)}`, { signal });
    const payload = res as { data?: unknown };
    return (payload.data ?? res) as ScamAlert;
  },

  createAlert: async (alert: Partial<ScamAlert>): Promise<ScamAlert> => {
    const res = await apiClient.post<any>('/alerts', alert);
    return (res && 'data' in res ? res.data : res) as ScamAlert;
  },

  updateAlert: async (id: string, updates: Partial<ScamAlert>): Promise<ScamAlert> => {
    const res = await apiClient.patch<any>(`/alerts/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as ScamAlert;
  },

  deleteAlert: async (id: string): Promise<void> => {
    await apiClient.delete(`/alerts/${encodeURIComponent(id)}`);
  }
};
