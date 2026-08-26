import { apiClient } from './apiClient';
import { ApiError } from './types';
import { ForumThread } from '../../types';

export interface FeedPage { data: ForumThread[]; nextCursor?: string | null; hasMore?: boolean; }

export async function getForYouFeed(params: { cursor?: string; limit?: number } = {}, signal?: AbortSignal): Promise<FeedPage> {
  const response = await apiClient.get<any>('/forum/feeds/for-you', { params: { cursor: params.cursor, limit: params.limit ?? 20 }, signal });
  const data = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
  return { data, nextCursor: response?.nextCursor ?? response?.meta?.nextCursor ?? null, hasMore: response?.hasMore ?? Boolean(response?.meta?.hasMore) };
}

export function getFeedErrorState(error: unknown): { title: string; description: string; action?: string } {
  if (error instanceof ApiError && error.statusCode === 401) return { title: 'Entre para receber um feed personalizado', description: 'Faça login para descobrir discussões relevantes para você.', action: 'Entrar' };
  if (error instanceof ApiError && error.statusCode === 403) return { title: 'Feed personalizado indisponível', description: 'Sua conta não possui acesso a este feed.' };
  if (error instanceof ApiError && error.statusCode === 429) return { title: 'Muitas solicitações', description: 'Aguarde alguns instantes antes de tentar novamente.', action: 'Tentar novamente' };
  if (error instanceof ApiError && error.statusCode >= 500) return { title: 'Community temporariamente indisponível', description: 'O serviço está com instabilidade. Tente novamente.', action: 'Tentar novamente' };
  if (error instanceof ApiError && error.statusCode === 0) return { title: 'Você está offline', description: 'Verifique sua conexão para carregar o feed.', action: 'Tentar novamente' };
  return { title: 'Não foi possível carregar o feed', description: 'Tente novamente sem perder sua sessão.', action: 'Tentar novamente' };
}
