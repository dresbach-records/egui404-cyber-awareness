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
    const res = await apiClient.get<any>('/alerts', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ScamAlert[],
        meta: res.meta
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
    const res = await apiClient.get<any>(`/alerts/${encodeURIComponent(id)}`, { signal });
    return (res && 'data' in res ? res.data : res) as ScamAlert;
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
