import {
  ScamItem,
  ThreatItem,
  CaseFile,
  EducationArticle,
  ScamAlert,
  ForumCategory,
  ForumThread,
  ForumPost,
  ForumMember,
  ForumNotification,
  ReportSubmission,
  AuditLogItem,
  AdminSourceItem,
  SearchAnalyticsItem
} from '../../types';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error?: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(message: string, statusCode: number = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions {
  params?: object;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  includeCredentials?: boolean;
  timeoutMs?: number;
}

export interface AuthSessionUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ANALYST' | 'MODERATOR' | 'RESEARCHER' | 'MEMBER';
  avatarUrl?: string;
  createdAt?: string;
  plan?: 'FREE' | 'PREMIUM' | 'BUSINESS' | string;
  permissions?: string[];
  subscription?: {
    status?: string;
    currentPeriodEnd?: string;
  } | null;
  entitlements?: string[];
  account_type?: string;
}

export interface AuthSessionResponse {
  user: AuthSessionUser | null;
  session?: {
    id: string;
    userId: string;
    expiresAt: string;
  } | null;
}

export interface HealthStatusResponse {
  status: 'ok' | 'degraded' | 'maintenance' | 'unhealthy';
  version?: string;
  timestamp: string;
  uptime?: number;
  database?: 'connected' | 'disconnected';
  environment?: string;
}

export interface DashboardTelemetry {
  totalScams: number;
  activeThreats: number;
  totalThreats: number;
  totalCases: number;
  activeAlerts: number;
  totalArticles: number;
  pendingReports: number;
  totalSources: number;
  totalMembers: number;
  rnpRecords: number;
  recentActivity?: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
}

export interface RnpStatusResponse {
  enabled: boolean;
  lastSyncAt: string | null;
  status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR' | 'DISABLED';
  recordsCount: number;
  officialSourceUrl: string;
  message?: string;
}

export interface RnpSyncLog {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR' | 'PARTIAL';
  discoveredCount: number;
  createdCount: number;
  updatedCount: number;
  duplicateCount: number;
  durationMs: number;
  details?: string;
}

export interface ModerationQueueItem {
  id: string;
  type: 'THREAD' | 'POST' | 'REPORT' | 'USER';
  targetId: string;
  targetTitle?: string;
  targetContent: string;
  authorUsername: string;
  reportedBy?: string;
  reason: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}
