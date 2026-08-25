import { apiClient } from './apiClient';
import { AuthSessionUser, ApiResponse, ApiListResponse } from './types';
import { UserRole } from '../../types';

export const usersApi = {
  getMe: async (signal?: AbortSignal): Promise<AuthSessionUser> => {
    const res = await apiClient.get<any>('/users/me', { signal });
    return (res && 'data' in res ? res.data : res) as AuthSessionUser;
  },

  updateMe: async (data: Partial<AuthSessionUser>): Promise<AuthSessionUser> => {
    const res = await apiClient.patch<any>('/users/me', data);
    return (res && 'data' in res ? res.data : res) as AuthSessionUser;
  },

  getUserByUsername: async (username: string, signal?: AbortSignal): Promise<AuthSessionUser> => {
    const res = await apiClient.get<any>(`/users/${encodeURIComponent(username)}`, { signal });
    return (res && 'data' in res ? res.data : res) as AuthSessionUser;
  },

  getUsers: async (params?: { page?: number; limit?: number; role?: string; search?: string }, signal?: AbortSignal): Promise<ApiListResponse<AuthSessionUser>> => {
    const res = await apiClient.get<any>('/admin/users', { params, signal });
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res as ApiListResponse<AuthSessionUser>;
    }
    if (Array.isArray(res)) {
      return { success: true, data: res, meta: { page: 1, limit: res.length, total: res.length, totalPages: 1 } };
    }
    return { success: true, data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  },

  updateUserRole: async (userId: string, role: UserRole | string): Promise<AuthSessionUser> => {
    const res = await apiClient.patch<any>(`/admin/users/${encodeURIComponent(userId)}/role`, { role });
    return (res && 'data' in res ? res.data : res) as AuthSessionUser;
  }
};
