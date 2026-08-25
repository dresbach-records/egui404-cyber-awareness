import { apiClient } from './apiClient';
import { HealthStatusResponse, ApiResponse } from './types';

export const healthApi = {
  getHealth: async (signal?: AbortSignal): Promise<HealthStatusResponse> => {
    try {
      const res = await apiClient.get<HealthStatusResponse | ApiResponse<HealthStatusResponse>>('/health', {
        signal,
        includeCredentials: false,
        timeoutMs: 8000
      });
      if (res && 'data' in res && (res as ApiResponse<HealthStatusResponse>).data) {
        return (res as ApiResponse<HealthStatusResponse>).data;
      }
      return res as HealthStatusResponse;
    } catch (err) {
      throw err;
    }
  },

  getReadiness: async (signal?: AbortSignal): Promise<{ status: string; database: boolean }> => {
    const res = await apiClient.get<{ status: string; database: boolean } | ApiResponse<{ status: string; database: boolean }>>(
      '/health/readiness',
      { signal, includeCredentials: false, timeoutMs: 8000 }
    );
    if (res && 'data' in res && (res as ApiResponse<{ status: string; database: boolean }>).data) {
      return (res as ApiResponse<{ status: string; database: boolean }>).data;
    }
    return res as { status: string; database: boolean };
  },

  getOpenApi: async (signal?: AbortSignal): Promise<unknown> => {
    return apiClient.get<unknown>('/openapi', { signal, includeCredentials: false });
  }
};
