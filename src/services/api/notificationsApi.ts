import { apiClient } from './apiClient';
import { ForumNotification } from '../../types';
import { PaginationMeta } from './types';

export const notificationsApi = {
  getNotifications: async (signal?: AbortSignal): Promise<ForumNotification[]> => {
    const res = await apiClient.get<any>('/notifications', { signal });
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data as ForumNotification[];
    }
    if (Array.isArray(res)) {
      return res as ForumNotification[];
    }
    return [];
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${encodeURIComponent(id)}/read`, {});
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.post('/notifications/read-all', {});
  }
};
