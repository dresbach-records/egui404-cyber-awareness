import { apiClient } from './apiClient';
import { DashboardTelemetry } from './types';
import { SearchAnalyticsItem } from '../../types';

export interface AnalyticsOverview {
  totalVisits: number;
  uniqueVisitors: number;
  scamSearches: number;
  topSearchTerms: Array<{ term: string; count: number }>;
  categoryBreakdown: Array<{ category: string; count: number }>;
  platformDistribution: {
    mobile: string;
    desktop: string;
    tablet: string;
  };
  timeSeries: Array<{ date: string; visits: number; reports: number; threats: number }>;
}

export interface NotFoundAnalyticsItem {
  id: string;
  path: string;
  referrer?: string;
  ipHash?: string;
  timestamp: string;
  userAgent?: string;
}

export const analyticsApi = {
  getDashboard: async (signal?: AbortSignal): Promise<DashboardTelemetry> => {
    const res = await apiClient.get<any>('/admin/dashboard', { signal });
    return (res && 'data' in res ? res.data : res) as DashboardTelemetry;
  },

  getAnalytics: async (params?: { period?: '7d' | '30d' | '90d' | '1y' }, signal?: AbortSignal): Promise<AnalyticsOverview> => {
    const res = await apiClient.get<any>('/admin/analytics', { params, signal });
    return (res && 'data' in res ? res.data : res) as AnalyticsOverview;
  },

  get404Visits: async (params?: { page?: number; limit?: number }, signal?: AbortSignal): Promise<NotFoundAnalyticsItem[]> => {
    const res = await apiClient.get<any>('/admin/analytics/404-visits', { params, signal });
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data as NotFoundAnalyticsItem[];
    }
    if (Array.isArray(res)) {
      return res as NotFoundAnalyticsItem[];
    }
    return [];
  }
};
