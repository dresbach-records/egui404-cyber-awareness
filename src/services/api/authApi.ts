import { apiClient } from './apiClient';
import { AuthSessionUser, AuthSessionResponse, ApiResponse } from './types';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: AuthSessionUser; token?: string }> => {
    // Better Auth standard endpoint is /auth/sign-in/email or /auth/login
    try {
      const res = await apiClient.post<any>('/auth/sign-in/email', {
        email: credentials.email || (credentials.username?.includes('@') ? credentials.username : `${credentials.username}@egui404.org`),
        password: credentials.password
      });

      const data = res && 'data' in res ? res.data : res;
      const user: AuthSessionUser = data.user || data;
      return { user, token: data.token };
    } catch (err: any) {
      // Fallback endpoint if custom auth route
      if (err.statusCode === 404) {
        const fallbackRes = await apiClient.post<any>('/auth/login', credentials);
        const data = fallbackRes && 'data' in fallbackRes ? fallbackRes.data : fallbackRes;
        return { user: data.user || data, token: data.token };
      }
      throw err;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/sign-out', {});
    } catch {
      // Ignore if session already destroyed
    }
  },

  getSession: async (signal?: AbortSignal): Promise<AuthSessionUser | null> => {
    try {
      const res = await apiClient.get<any>('/auth/get-session', { signal, timeoutMs: 7000 });
      const data = res && 'data' in res ? res.data : res;
      if (data && (data.user || data.id)) {
        return data.user || data;
      }
      return null;
    } catch (err: any) {
      // Try /users/me as fallback
      if (err.statusCode === 404 || err.statusCode === 401) {
        try {
          const userRes = await apiClient.get<any>('/users/me', { signal, timeoutMs: 7000 });
          const userData = userRes && 'data' in userRes ? userRes.data : userRes;
          return userData || null;
        } catch {
          return null;
        }
      }
      return null;
    }
  }
};
