export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ThreatStatus = 'ACTIVE' | 'MONITORED' | 'RESOLVED' | 'ARCHIVED';
export type VerificationStatus =
  | 'VERIFIED'
  | 'DOCUMENTED'
  | 'COMMUNITY_REPORTED'
  | 'UNDER_REVIEW'
  | 'MONITORED'
  | 'EDITORIAL'
  | 'UNVERIFIED';

export type SourceProvider =
  | 'RNP_CAIS'
  | 'CERT_BR'
  | 'EGUI_404'
  | 'COMMUNITY'
  | 'OFFICIAL_EXTERNAL_SOURCE'
  | 'OTHER';

export const RNP_FRAUD_CATALOG_URL = 'https://catalogodefraudes.rnp.br/';

export const RNP_CAIS_SOURCE = {
  name: 'Catálogo de Fraudes RNP/CAIS',
  organization: 'RNP / CAIS',
  url: 'https://catalogodefraudes.rnp.br/',
  type: 'OFFICIAL_EXTERNAL_SOURCE'
} as const;

export interface ExternalThreatSource {
  id: string;
  provider: 'RNP_CAIS' | 'CERT_BR' | 'EGUI_COMMUNITY' | 'OFFICIAL_EXTERNAL_SOURCE';
  externalId: string; // e.g. "RNP_CAIS:16745" or "16745"
  title: string;
  originalUrl: string;
  publishedAt?: string;
  accessedAt: string;
  tags: string[];
  sourceCategory?: string;
  organization?: string;
}

export interface EguiThreat {
  id: string; // e.g. "EGUI-SCAM-0042"
  slug: string;
  title: string;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'MONITORED' | 'RESOLVED' | 'ARCHIVED';
  verification: 'VERIFIED' | 'DOCUMENTED' | 'COMMUNITY_REPORTED' | 'UNDER_REVIEW';
  summary: string;
  overview: string;
  warningSigns: string[];
  howToProtect: string[];
  victimActions: string[];
  sources: ExternalThreatSource[];
  tags: string[];
  firstObserved?: string;
  lastUpdated: string;
  // Threat Graph relationships
  relatedThreatIds?: string[];
  relatedCaseIds?: string[];
  relatedArticleSlugs?: string[];
  relatedForumThreadSlugs?: string[];
}

export type SourceType =
  | 'OFFICIAL'
  | 'GOVERNMENT'
  | 'LAW_ENFORCEMENT'
  | 'SECURITY_RESEARCH'
  | 'JOURNALISM'
  | 'OFFICIAL_ALERT'
  | 'NEWS'
  | 'SECURITY_BULLETIN'
  | 'RESEARCH_REPORT';

export type ScamCategory =
  | 'PHISHING'
  | 'PIX SCAMS'
  | 'WHATSAPP FRAUD'
  | 'FAKE INVESTMENTS'
  | 'FAKE LOANS'
  | 'SOCIAL ENGINEERING'
  | 'ACCOUNT TAKEOVER'
  | 'IDENTITY FRAUD'
  | 'FAKE SUPPORT'
  | 'FAKE JOBS'
  | 'MARKETPLACE SCAMS'
  | 'ROMANCE SCAMS'
  | 'BANKING FRAUD'
  | 'MALWARE'
  | 'RANSOMWARE'
  | 'DATA BREACH'
  | 'SMISHING'
  | 'VISHING'
  | 'QR CODE SCAMS'
  | 'FAKE WEBSITES';

export interface PublicSource {
  id?: string;
  organization: string;
  title: string;
  url?: string;
  publishedAt?: string;
  accessedAt?: string;
  sourceType?: SourceType;
  type?: SourceType;
  isOfficial?: boolean;
}

export interface ScamItem {
  id: string;
  slug: string;
  title: string;
  category: ScamCategory;
  riskLevel: RiskLevel;
  status: ThreatStatus;
  date: string;
  lastUpdated: string;
  firstObserved?: string;
  summary: string;
  overview?: string;
  howItWorks: string[];
  threatFlow?: string[]; // High-level defensive flow (CONTACT -> SOCIAL ENGINEERING -> etc.)
  warningSigns: string[];
  commonTactics: string[];
  howToProtect: string[];
  victimActions: string[];
  affectedPlatforms: string[];
  geography?: string;
  country?: string;
  isVerified?: boolean;
  verificationDate?: string;
  verificationStatus?: VerificationStatus;
  sourceType?: SourceType;
  sourceProvider?: SourceProvider;
  originalRecordId?: string; // e.g., "RNP_CAIS:16745"
  originalUrl?: string;
  originalTitle?: string;
  originalCategory?: string;
  originalTags?: string[];
  originalDate?: string;
  externalSources?: ExternalThreatSource[];
  relatedThreatIds?: string[];
  relatedThreats?: string[];
  relatedCaseIds?: string[];
  relatedArticleSlugs?: string[];
  relatedForumThreadSlugs?: string[];
  sources: PublicSource[];
}

export interface ThreatItem {
  id: string;
  threatCode: string;
  slug: string;
  title: string;
  category: ScamCategory;
  riskLevel: RiskLevel;
  status: ThreatStatus;
  firstObserved: string;
  lastUpdated: string;
  detectedDate?: string;
  analyzedDate?: string;
  monitoredDate?: string;
  resolvedDate?: string;
  summary: string;
  severityScore: number; // 0 - 100
  targetVectors: string[];
  timelineStatus?: {
    firstObserved: string;
    detected: string;
    analyzed: string;
    monitored: string;
    resolved?: string;
  };
  safeIndicators: {
    type: 'SAFE_HASH_PATTERN' | 'DOMAIN_PATTERN' | 'BEHAVIORAL_TRIGGER' | 'SIGNATURE';
    value: string;
    note: string;
  }[];
  mitigationSummary: string;
  sources: PublicSource[];
}

export interface CaseTimelineEvent {
  timestamp: string;
  event: string;
  details: string;
}

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  date: string;
  country: string;
  category: ScamCategory;
  impactLevel: 'EXTREME' | 'HIGH' | 'MODERATE';
  status: 'ANALYZED' | 'MONITORED' | 'ARCHIVED';
  summary: string;
  timeline: CaseTimelineEvent[];
  attackAnatomy: {
    initialContact: string;
    manipulationTechnique: string;
    exploitationStep: string;
    damageVector: string;
  };
  defensesLearned: string[];
  sources: PublicSource[];
}

export interface EducationArticle {
  id: string;
  slug: string;
  title: string;
  category:
    | 'Cybersecurity Basics'
    | 'Privacy'
    | 'Passwords'
    | 'MFA'
    | 'Phishing'
    | 'Social Engineering'
    | 'Account Security'
    | 'Device Security'
    | 'Wi-Fi Security'
    | 'Backup'
    | 'Identity Protection'
    | 'Financial Security';
  author: string;
  date: string;
  readingTimeMinutes: number;
  excerpt: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  checklist: string[];
  sources: PublicSource[];
  relatedArticleSlugs?: string[];
}

export interface ScamAlert {
  id: string;
  alertNumber: string; // e.g. '#0042'
  type: string; // e.g. 'FAKE INVESTMENT'
  risk: RiskLevel;
  status: ThreatStatus;
  headline: string;
  warning: string;
  recommendedAction: string;
  date: string;
  urgent: boolean;
  victimHotlineNote?: string;
  source?: string;
  sourceUrl?: string;
}

export interface QuizQuestion {
  id: string;
  title: string;
  senderOrPlatform: string;
  scenarioText: string;
  simulatedMessage: {
    sender: string;
    avatarLetter?: string;
    channel: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'CALL' | 'INSTAGRAM' | 'BANK_APP';
    body: string;
    attachmentsOrLink?: string;
  };
  isSuspicious: boolean;
  threatType: ScamCategory | 'SAFE_INTERACTION';
  redFlags: string[];
  safeResponseExplanation: string;
  practicalDefensiveTip: string;
}

export interface ReportSubmission {
  id?: string;
  ticketId: string;
  title?: string;
  category: ScamCategory | 'OTHER';
  platform: string;
  url?: string;
  dateObserved?: string;
  incidentDate?: string;
  country?: string;
  contactMethod?: string;
  contactEmail?: string;
  description: string;
  additionalInfo?: string;
  indicators?: string[];
  status: 'PENDING' | 'PENDING_TRIAGE' | 'ANALYZED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  submittedAt: string;
  timestamp?: string;
  isAnonymous?: boolean;
  confirmedNoPersonalData: boolean;
  acceptedEducationalReview?: boolean;
}

export interface NewsletterSubscriber {
  email: string;
  frequency: 'INSTANT_ALERTS' | 'WEEKLY_DIGEST' | 'MONTHLY_BRIEF';
  subscribedAt: string;
  acceptedLgpd: boolean;
}

export interface SiteStats {
  threatsDocumented: number;
  casesAnalyzed: number;
  scamCategories: number;
  safetyGuides: number;
  alertsBroadcasted: number;
  scenariosTested: number;
  isDemo?: boolean;
  sourceNote?: string;
}

export type SearchResultType = 'SCAM' | 'THREAT' | 'CASE' | 'ARTICLE' | 'ALERT' | 'FORUM_THREAD';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  category: string;
  risk?: RiskLevel;
  status?: ThreatStatus;
  url: string;
  snippet: string;
}

/* ==========================================================================
   COMMUNITY FORUM DATA TYPES
   ========================================================================== */

export type UserRole = 'ADMIN' | 'MODERATOR' | 'EDITOR' | 'VERIFIED_CONTRIBUTOR' | 'MEMBER';
export type ThreadStatus = 'OPEN' | 'SOLVED' | 'LOCKED' | 'ARCHIVED';

export interface ForumBadge {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
  color: string;
}

export interface ForumMember {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  bio: string;
  joinedDate: string;
  reputation: number;
  threadsCount: number;
  repliesCount: number;
  solutionsCount: number;
  badges: string[]; // Badge codes
  isOnline?: boolean;
  verifiedSource?: boolean;
}

export interface ForumCategory {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  threadCount: number;
  postCount: number;
  moderators: string[];
  lastActivity?: string;
}

export interface ForumPost {
  id: string;
  threadId: string;
  authorId: string;
  author: ForumMember;
  content: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt?: string;
  likesCount: number;
  isLikedByMe?: boolean;
  isSolution?: boolean;
  quotedPostId?: string;
  postNumber: number;
}

export interface ForumThread {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  authorId: string;
  author: ForumMember;
  content: string;
  sourceUrl?: string;
  tags: string[];
  status: ThreadStatus;
  isPinned?: boolean;
  isHot?: boolean;
  isVerified?: boolean;
  viewsCount: number;
  repliesCount: number;
  likesCount: number;
  isLikedByMe?: boolean;
  isBookmarkedByMe?: boolean;
  hasSolution?: boolean;
  solutionPostId?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  lastReplyAuthor?: string;
}

export interface ForumTag {
  slug: string;
  name: string;
  count: number;
  description?: string;
}

export interface ForumNotification {
  id: string;
  userId: string;
  type: 'REPLY' | 'MENTION' | 'SOLUTION' | 'REPORT_REVIEWED' | 'MODERATION' | 'SYSTEM';
  title: string;
  message: string;
  linkUrl: string;
  createdAt: string;
  read: boolean;
}

export interface ForumBookmark {
  id: string;
  userId: string;
  threadId: string;
  threadTitle: string;
  threadSlug: string;
  categoryName: string;
  savedAt: string;
}

export interface ForumReport {
  id: string;
  targetType: 'THREAD' | 'POST';
  targetId: string;
  targetTitle?: string;
  reporterUsername: string;
  reason: 'SPAM' | 'HARASSMENT' | 'MISINFORMATION' | 'PERSONAL_DATA' | 'MALICIOUS_CONTENT' | 'ILLEGAL_REQUEST' | 'OTHER';
  details?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  assignedModerator?: string;
}

export interface ContentAnalysis {
  status: 'SAFE' | 'REVIEW' | 'BLOCK';
  riskScore: number; // 0 - 100
  flaggedReasons: string[];
  detectedPatterns: string[];
  recommendation: string;
}

/* ==========================================================================
   ADMIN & CONTROL CENTER TYPES
   ========================================================================== */

export type AuditAction =
  | 'LOGIN'
  | 'LOGIN_FAILURE'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'ARCHIVE'
  | 'MODERATION'
  | 'IMPORT'
  | 'INTEGRATION_SYNC'
  | 'SOURCE_UPDATE'
  | 'ROLE_CHANGE'
  | 'SYSTEM_CHANGE'
  | 'SYSTEM_PURGE'
  | 'CLEAR_LOGS';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  ip: string;
  result: 'SUCCESS' | 'WARNING' | 'DENIED' | 'FAILED' | 'FAILURE';
  details?: string;
}

export interface AdminMemberItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ANALYST' | 'MODERATOR' | 'RESEARCHER';
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface AdminSourceItem {
  id: string;
  name: string;
  organization: string;
  type: string;
  url: string;
  status: 'ACTIVE' | 'MONITORED' | 'DEGRADED' | 'INACTIVE';
  lastChecked: string;
  notes: string;
  recordsCount: number;
  isOfficial: boolean;
}

export interface SystemSettings {
  general: {
    siteName: string;
    tagline: string;
    contactEmail: string;
    maintenanceMode: boolean;
    publicRegistration: boolean;
  };
  brand: {
    primaryColor: string;
    accentColor: string;
    observerSignature: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
    robotsAllow: boolean;
  };
  pwa: {
    appName: string;
    shortName: string;
    themeColor: string;
    offlineModeBanner: boolean;
    cacheStrategy: string;
  };
  moderation: {
    autoModerateFlags: boolean;
    strictLgpdMasking: boolean;
    requireReviewForNewMembers: boolean;
    escalationThreshold: number;
  };
  security: {
    rateLimitingEnabled: boolean;
    requireMfaForAdmins: boolean;
    sessionTimeoutMinutes: number;
    defensiveDefangUrls: boolean;
  };
}

export interface AdminNotification {
  id: string;
  type: 'REPORT' | 'MODERATION' | 'IMPORT' | 'THREAT' | 'SYSTEM' | 'SOURCE';
  title: string;
  message: string;
  time: string;
  read: boolean;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  link?: string;
}

export interface SearchAnalyticsItem {
  query: string;
  count: number;
  zeroResults: boolean;
  category?: string;
  lastSearched: string;
}

