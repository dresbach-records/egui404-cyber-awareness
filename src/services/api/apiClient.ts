import { ApiError, RequestOptions } from './types';

const DEFAULT_API_URL = 'https://api.egui404.fun/api/v1';
const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL;
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

function formatErrorMessage(statusCode: number, serverMessage?: string): string {
  if (serverMessage && typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
    return serverMessage;
  }
  switch (statusCode) {
    case 401:
      return 'Sessão expirada ou não autenticada. Faça login novamente.';
    case 403:
      return 'Você não possui permissão para esta operação.';
    case 404:
      return 'Registro não encontrado no servidor.';
    case 422:
      return 'Dados inválidos ou parâmetros não aceitos pelo servidor.';
    case 429:
      return 'Muitas solicitações detectadas. Aguarde e tente novamente.';
    case 500:
      return 'Erro interno no servidor.';
    case 502:
    case 503:
    case 504:
      return 'Serviço temporariamente indisponível. Tente em instantes.';
    default:
      return `Falha na requisição (Status HTTP ${statusCode}).`;
  }
}

function buildUrl(path: string, params?: object): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = new URL(`${API_BASE_URL}${cleanPath}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  return fullUrl.toString();
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    headers = {},
    signal,
    includeCredentials = true,
    timeoutMs = 15000
  } = options;

  const url = buildUrl(path, params);

  // Setup abort controller for timeout if caller hasn't provided a signal or along with it
  const timeoutController = new AbortController();
  const timeoutTimer = setTimeout(() => {
    timeoutController.abort();
  }, timeoutMs);

  // If external signal provided, listen to it
  if (signal) {
    signal.addEventListener('abort', () => timeoutController.abort());
  }

  const reqHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...headers
  };

  let serializedBody: string | undefined = undefined;
  if (body !== undefined && method !== 'GET') {
    reqHeaders['Content-Type'] = 'application/json';
    serializedBody = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, {
      method,
      headers: reqHeaders,
      body: serializedBody,
      credentials: includeCredentials ? 'include' : 'same-origin',
      signal: timeoutController.signal
    });

    clearTimeout(timeoutTimer);

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    let json: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        json = await response.json();
      } catch {
        json = null;
      }
    } else {
      const text = await response.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = text;
      }
    }

    if (!response.ok) {
      const serverMessage = json?.message || json?.error || (typeof json === 'string' ? json : undefined);
      const friendlyMessage = formatErrorMessage(response.status, serverMessage);
      throw new ApiError(friendlyMessage, response.status, json?.code, json?.details || json);
    }

    // Unwrap { success: true, data: T } if standardized backend format
    if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
      return json as T;
    }

    return json as T;
  } catch (err: any) {
    clearTimeout(timeoutTimer);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw new ApiError('A solicitação expirou por limite de tempo (Timeout). Tente novamente.', 408, 'TIMEOUT');
    }

    throw new ApiError(
      'Não foi possível conectar ao servidor backend. Verifique sua conexão.',
      0,
      'NETWORK_ERROR',
      err instanceof Error ? { message: err.message } : undefined
    );
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('GET', path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('POST', path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PATCH', path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PUT', path, body, options),

  delete: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('DELETE', path, undefined, options),

  getBaseUrl: (): string => API_BASE_URL
};
