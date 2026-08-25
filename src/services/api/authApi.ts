import { apiClient } from './apiClient';
import { AuthSessionUser } from './types';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function unwrapData(value: unknown): unknown {
  return isRecord(value) && 'data' in value ? value.data : value;
}

export const authApi = {
  register: async (input: { name: string; email: string; password: string }): Promise<{ user: AuthSessionUser }> => {
    const res = await apiClient.post<unknown>('/auth/sign-up/email', input);
    const data = unwrapData(res);
    const user = isRecord(data) && isRecord(data.user) ? data.user : data;
    return { user: user as AuthSessionUser };
  },

  login: async (credentials: LoginCredentials): Promise<{ user: AuthSessionUser }> => {
    const identifier = credentials.email || credentials.username;
    if (!identifier || !credentials.password) {
      throw new Error('Informe o identificador e a senha.');
    }

    const res = await apiClient.post<unknown>('/auth/sign-in/email', {
      email: identifier,
      password: credentials.password
    });
    const data = unwrapData(res);
    const user = isRecord(data) && isRecord(data.user) ? data.user : data;
    return { user: user as AuthSessionUser };
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
      const res = await apiClient.get<unknown>('/users/me', { signal, timeoutMs: 7000 });
      const data = unwrapData(res);
      return isRecord(data) && isRecord(data.user)
        ? (data.user as unknown as AuthSessionUser)
        : (data as unknown as AuthSessionUser);
    } catch (err) {
      if (err instanceof Error && 'statusCode' in err && (err as { statusCode?: number }).statusCode === 401) {
        return null;
      }
      return null;
    }
  }
};
