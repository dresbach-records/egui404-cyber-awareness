import { SCAMS_DATA } from '../data/scamsData';
import { THREATS_DATA } from '../data/threatsData';
import { CASES_DATA } from '../data/casesData';
import { ARTICLES_DATA } from '../data/articlesData';
import { ALERTS_DATA } from '../data/alertsData';
import {
  ScamItem,
  ThreatItem,
  CaseFile,
  EducationArticle,
  ScamAlert,
  SiteStats,
  SearchResultItem,
  ScamCategory,
  RiskLevel,
  ThreatStatus,
  ReportSubmission,
  NewsletterSubscriber
} from '../types';

// Storage keys
const REPORTS_STORAGE_KEY = 'egui404_reports';
const NEWSLETTER_STORAGE_KEY = 'egui404_subscribers';

export const ScamService = {
  getAllScams: (): ScamItem[] => {
    return SCAMS_DATA;
  },
  getScamBySlug: (slug: string): ScamItem | undefined => {
    return SCAMS_DATA.find((s) => s.slug === slug || s.id === slug);
  },
  filterScams: (params: {
    category?: ScamCategory | 'ALL';
    risk?: RiskLevel | 'ALL';
    status?: ThreatStatus | 'ALL';
    search?: string;
    sortBy?: 'DATE_DESC' | 'DATE_ASC' | 'RISK_HIGH' | 'TITLE';
  }): ScamItem[] => {
    let list = [...SCAMS_DATA];

    if (params.category && params.category !== 'ALL') {
      list = list.filter((s) => s.category === params.category);
    }
    if (params.risk && params.risk !== 'ALL') {
      list = list.filter((s) => s.riskLevel === params.risk);
    }
    if (params.status && params.status !== 'ALL') {
      list = list.filter((s) => s.status === params.status);
    }
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.commonTactics.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.sortBy === 'DATE_ASC') {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (params.sortBy === 'RISK_HIGH') {
      const riskScore: Record<RiskLevel, number> = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      list.sort((a, b) => (riskScore[b.riskLevel] || 0) - (riskScore[a.riskLevel] || 0));
    } else if (params.sortBy === 'TITLE') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: DATE_DESC
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return list;
  }
};

export const ThreatService = {
  getAllThreats: (): ThreatItem[] => {
    return THREATS_DATA;
  },
  getThreatById: (id: string): ThreatItem | undefined => {
    return THREATS_DATA.find((t) => t.id === id || t.slug === id || t.threatCode === id);
  }
};

export const CaseService = {
  getAllCases: (): CaseFile[] => {
    return CASES_DATA;
  },
  getCaseById: (id: string): CaseFile | undefined => {
    return CASES_DATA.find((c) => c.id === id || c.caseNumber.toLowerCase().includes(id.toLowerCase()));
  }
};

export const ArticleService = {
  getAllArticles: (): EducationArticle[] => {
    return ARTICLES_DATA;
  },
  getArticleBySlug: (slug: string): EducationArticle | undefined => {
    return ARTICLES_DATA.find((a) => a.slug === slug || a.id === slug);
  }
};

export const AlertService = {
  getAllAlerts: (): ScamAlert[] => {
    return ALERTS_DATA;
  },
  getActiveAlerts: (): ScamAlert[] => {
    return ALERTS_DATA.filter((a) => a.status === 'ACTIVE');
  },
  createAlert: (alert: Omit<ScamAlert, 'id' | 'alertNumber' | 'status' | 'date'>): ScamAlert => {
    const newId = `alert-${Date.now()}`;
    const nextNum = `#${String(ALERTS_DATA.length + 1).padStart(4, '0')}`;
    const newAlert: ScamAlert = {
      ...alert,
      id: newId,
      alertNumber: nextNum,
      status: 'ACTIVE',
      date: new Date().toISOString().split('T')[0]
    };
    ALERTS_DATA.unshift(newAlert);
    return newAlert;
  }
};

export const StatsService = {
  getStats: (): SiteStats => {
    return {
      threatsDocumented: 148,
      casesAnalyzed: 42,
      scamCategories: 14,
      safetyGuides: 26,
      alertsBroadcasted: 42,
      scenariosTested: 12840
    };
  }
};

export const SearchService = {
  searchAll: (query: string): SearchResultItem[] => {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Search Scams
    SCAMS_DATA.forEach((scam) => {
      if (
        scam.title.toLowerCase().includes(q) ||
        scam.summary.toLowerCase().includes(q) ||
        scam.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: scam.id,
          type: 'SCAM',
          title: scam.title,
          subtitle: `Scam Archive · ${scam.category}`,
          category: scam.category,
          risk: scam.riskLevel,
          status: scam.status,
          url: `/archive/${scam.slug}`,
          snippet: scam.summary
        });
      }
    });

    // Search Threats
    THREATS_DATA.forEach((threat) => {
      if (
        threat.title.toLowerCase().includes(q) ||
        threat.summary.toLowerCase().includes(q) ||
        threat.threatCode.toLowerCase().includes(q)
      ) {
        results.push({
          id: threat.id,
          type: 'THREAT',
          title: `[${threat.threatCode}] ${threat.title}`,
          subtitle: `Threat Intelligence · Severity ${threat.severityScore}%`,
          category: threat.category,
          risk: threat.riskLevel,
          status: threat.status,
          url: `/threats?id=${threat.id}`,
          snippet: threat.summary
        });
      }
    });

    // Search Cases
    CASES_DATA.forEach((caseFile) => {
      if (
        caseFile.title.toLowerCase().includes(q) ||
        caseFile.summary.toLowerCase().includes(q) ||
        caseFile.caseNumber.toLowerCase().includes(q)
      ) {
        results.push({
          id: caseFile.id,
          type: 'CASE',
          title: `[${caseFile.caseNumber}] ${caseFile.title}`,
          subtitle: `Case File · ${caseFile.country} (${caseFile.impactLevel})`,
          category: caseFile.category,
          url: `/cases?id=${caseFile.id}`,
          snippet: caseFile.summary
        });
      }
    });

    // Search Articles
    ARTICLES_DATA.forEach((art) => {
      if (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: art.id,
          type: 'ARTICLE',
          title: art.title,
          subtitle: `Cyber Education · ${art.category} (${art.readingTimeMinutes} min read)`,
          category: art.category,
          url: `/education/${art.slug}`,
          snippet: art.excerpt
        });
      }
    });

    // Search Alerts
    ALERTS_DATA.forEach((alert) => {
      if (
        alert.headline.toLowerCase().includes(q) ||
        alert.warning.toLowerCase().includes(q) ||
        alert.type.toLowerCase().includes(q)
      ) {
        results.push({
          id: alert.id,
          type: 'ALERT',
          title: `[${alert.alertNumber}] ${alert.headline}`,
          subtitle: `Scam Alert Bulletin · ${alert.type}`,
          category: alert.type,
          risk: alert.risk,
          status: alert.status,
          url: `/alerts?id=${alert.id}`,
          snippet: alert.warning
        });
      }
    });

    return results;
  }
};

export const ReportService = {
  submitReport: (data: {
    category: ScamCategory;
    description: string;
    platform?: string;
    indicators?: string[];
    contactEmail?: string;
    isAnonymous: boolean;
  }): { ticketId: string } => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `EGUI-RPT-2026-${randomNum}`;
    const newReport = {
      id: `report-${Date.now()}`,
      category: data.category,
      description: data.description,
      platform: data.platform || '',
      indicators: data.indicators || [],
      contactEmail: data.contactEmail,
      isAnonymous: data.isAnonymous,
      ticketId,
      status: 'PENDING' as const,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newReport);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }

    return { ticketId };
  },
  getAllReports: () => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}

    // Default sample reports for admin preview
    return [
      {
        id: 'rep-01',
        ticketId: 'EGUI-RPT-2026-9482',
        category: 'PIX SCAMS' as ScamCategory,
        description: 'Tentativa de golpe via SMS alegando que um agendamento Pix suspeito seria debitado se eu não ligasse para um 0800 falso.',
        platform: 'SMS / Central 0800 Falsa',
        indicators: ['0800-777-1234', 'banco-seguranca-pix.online'],
        status: 'PENDING' as const,
        timestamp: '2026-02-25 10:14:02'
      },
      {
        id: 'rep-02',
        ticketId: 'EGUI-RPT-2026-3319',
        category: 'WHATSAPP FRAUD' as ScamCategory,
        description: 'Perfil falso com foto do meu irmão pedindo R$ 1.800 de transferência urgente alegando troca de número.',
        platform: 'WhatsApp',
        indicators: ['+55 11 98888-0000', 'pix-chave-aleatoria-temp'],
        status: 'PENDING' as const,
        timestamp: '2026-02-25 09:30:15'
      }
    ];
  },
  updateReportStatus: (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : ReportService.getAllReports();
      list = list.map((item: any) => (item.id === id ? { ...item, status: newStatus } : item));
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
};

export const ScamReportService = ReportService;

export const NewsletterService = {
  subscribe: (email: string, frequency: NewsletterSubscriber['frequency']): { success: boolean; message: string } => {
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Por favor forneça um endereço de e-mail válido.' };
    }

    const subscriber: NewsletterSubscriber = {
      email,
      frequency,
      subscribedAt: new Date().toISOString(),
      acceptedLgpd: true
    };

    try {
      const stored = localStorage.getItem(NEWSLETTER_STORAGE_KEY);
      const list: NewsletterSubscriber[] = stored ? JSON.parse(stored) : [];
      const exists = list.some((s) => s.email.toLowerCase() === email.toLowerCase());
      if (!exists) {
        list.push(subscriber);
        localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(list));
      }
    } catch {
      // ignore
    }

    return {
      success: true,
      message: 'Inscrição confirmada. Você receberá relatórios e alertas de segurança digital.'
    };
  }
};
