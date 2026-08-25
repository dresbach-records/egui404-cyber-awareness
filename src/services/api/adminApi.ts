import { apiClient } from './apiClient';
import { AuditLogItem } from '../../types';
import { PaginationMeta } from './types';

export interface SystemConfig {
  platformName: string;
  contactEmail: string;
  emergencyBroadcastActive: boolean;
  allowPublicSubmissions: boolean;
  soundEffectsEnabled: boolean;
  maintenanceMode?: boolean;
}

export const adminApi = {
  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string; search?: string }, signal?: AbortSignal): Promise<{ data: AuditLogItem[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/admin/audit-logs', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as AuditLogItem[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as AuditLogItem[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 50, total: 0, totalPages: 0 } };
  },

  createAuditLog: async (log: Omit<AuditLogItem, 'id' | 'timestamp'>): Promise<AuditLogItem> => {
    const res = await apiClient.post<any>('/admin/audit-logs', log);
    return (res && 'data' in res ? res.data : res) as AuditLogItem;
  },

  getSettings: async (signal?: AbortSignal): Promise<SystemConfig> => {
    const res = await apiClient.get<any>('/admin/settings', { signal });
    return (res && 'data' in res ? res.data : res) as SystemConfig;
  },

  updateSettings: async (settings: Partial<SystemConfig>): Promise<SystemConfig> => {
    const res = await apiClient.patch<any>('/admin/settings', settings);
    return (res && 'data' in res ? res.data : res) as SystemConfig;
  }
};
