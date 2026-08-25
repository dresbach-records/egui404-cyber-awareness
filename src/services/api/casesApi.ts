import { apiClient } from './apiClient';
import { CaseFile } from '../../types';
import { PaginationMeta } from './types';

export interface CaseQueryParams {
  search?: string;
  category?: string;
  impact?: string;
  status?: string;
  country?: string;
  page?: number;
  limit?: number;
}

export const casesApi = {
  getCases: async (params?: CaseQueryParams, signal?: AbortSignal): Promise<{ data: CaseFile[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/cases', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as CaseFile[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as CaseFile[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  getCaseById: async (id: string, signal?: AbortSignal): Promise<CaseFile> => {
    const res = await apiClient.get<any>(`/cases/${encodeURIComponent(id)}`, { signal });
    return (res && 'data' in res ? res.data : res) as CaseFile;
  },

  createCase: async (caseData: Partial<CaseFile>): Promise<CaseFile> => {
    const res = await apiClient.post<any>('/cases', caseData);
    return (res && 'data' in res ? res.data : res) as CaseFile;
  },

  updateCase: async (id: string, updates: Partial<CaseFile>): Promise<CaseFile> => {
    const res = await apiClient.patch<any>(`/cases/${encodeURIComponent(id)}`, updates);
    return (res && 'data' in res ? res.data : res) as CaseFile;
  },

  deleteCase: async (id: string): Promise<void> => {
    await apiClient.delete(`/cases/${encodeURIComponent(id)}`);
  }
};
