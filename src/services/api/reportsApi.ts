import { apiClient } from './apiClient';
import { ReportSubmission } from '../../types';
import { PaginationMeta } from './types';

export const reportsApi = {
  submitReport: async (report: Partial<ReportSubmission>): Promise<{ ticketId: string; status: string; message?: string }> => {
    const res = await apiClient.post<any>('/reports', report);
    return (res && 'data' in res ? res.data : res) as { ticketId: string; status: string; message?: string };
  },

  getAdminReports: async (params?: { status?: string; page?: number; limit?: number; search?: string }, signal?: AbortSignal): Promise<{ data: ReportSubmission[]; meta?: PaginationMeta }> => {
    const res = await apiClient.get<any>('/admin/reports', { params, signal });

    if (res && 'data' in res && Array.isArray(res.data)) {
      return {
        data: res.data as ReportSubmission[],
        meta: res.meta
      };
    }

    if (Array.isArray(res)) {
      return {
        data: res as ReportSubmission[],
        meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 }
      };
    }

    return { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  updateReportStatus: async (id: string, status: string, notes?: string): Promise<ReportSubmission> => {
    const res = await apiClient.patch<any>(`/admin/reports/${encodeURIComponent(id)}`, { status, notes });
    return (res && 'data' in res ? res.data : res) as ReportSubmission;
  }
};
