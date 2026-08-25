export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ThreatStatus = 'ACTIVE' | 'MONITORED' | 'RESOLVED';

export type ScamCategory =
  | 'PHISHING'
  | 'PIX SCAMS'
  | 'WHATSAPP FRAUD'
  | 'FAKE INVESTMENTS'
  | 'FAKE LOANS'
  | 'IDENTITY FRAUD'
  | 'ACCOUNT TAKEOVER'
  | 'MARKETPLACE SCAMS'
  | 'ROMANCE SCAMS'
  | 'FAKE SUPPORT'
  | 'FAKE JOBS'
  | 'MALWARE'
  | 'RANSOMWARE'
  | 'SOCIAL ENGINEERING';

export interface PublicSource {
  title: string;
  url?: string;
  sourceType: 'OFFICIAL_ALERT' | 'NEWS' | 'SECURITY_BULLETIN' | 'RESEARCH_REPORT';
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
  summary: string;
  howItWorks: string[];
  warningSigns: string[];
  commonTactics: string[];
  howToProtect: string[];
  victimActions: string[];
  affectedPlatforms: string[];
  relatedThreatIds?: string[];
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
  summary: string;
  severityScore: number; // 0 - 100
  targetVectors: string[];
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
  ticketId: string;
  category: ScamCategory | 'OTHER';
  platform: string;
  url?: string;
  dateObserved: string;
  description: string;
  additionalInfo?: string;
  status: 'PENDING_TRIAGE' | 'ANALYZED' | 'ARCHIVED';
  submittedAt: string;
  confirmedNoPersonalData: boolean;
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
}

export type SearchResultType = 'SCAM' | 'THREAT' | 'CASE' | 'ARTICLE' | 'ALERT';

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
