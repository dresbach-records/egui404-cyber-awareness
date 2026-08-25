import { SCAMS_DATA } from '../data/scamsData';
import { THREATS_DATA } from '../data/threatsData';
import { CASES_DATA } from '../data/casesData';
import { ARTICLES_DATA } from '../data/articlesData';
import { ALERTS_DATA } from '../data/alertsData';
import { RnpRepository } from './rnp/rnpRepository';
import {
  FORUM_CATEGORIES,
  FORUM_MEMBERS,
  FORUM_BADGES,
  FORUM_THREADS,
  FORUM_POSTS,
  FORUM_TAGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS
} from '../data/forumData';
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
  NewsletterSubscriber,
  ForumCategory,
  ForumMember,
  ForumBadge,
  ForumThread,
  ForumPost,
  ForumTag,
  ForumNotification,
  ForumReport,
  ContentAnalysis
} from '../types';

// Storage keys
const REPORTS_STORAGE_KEY = 'egui404_reports';
const NEWSLETTER_STORAGE_KEY = 'egui404_subscribers';
const FORUM_THREADS_STORAGE_KEY = 'egui404_forum_threads';
const FORUM_POSTS_STORAGE_KEY = 'egui404_forum_posts';
const FORUM_NOTIFS_STORAGE_KEY = 'egui404_forum_notifs';
const FORUM_MOD_STORAGE_KEY = 'egui404_forum_mod_reports';
const FORUM_BOOKMARKS_STORAGE_KEY = 'egui404_forum_bookmarks';
const CUSTOM_SCAMS_STORAGE_KEY = 'egui404_custom_scams';
const CUSTOM_THREATS_STORAGE_KEY = 'egui404_custom_threats';
const CUSTOM_CASES_STORAGE_KEY = 'egui404_custom_cases';
const CUSTOM_ARTICLES_STORAGE_KEY = 'egui404_custom_articles';
const CUSTOM_ALERTS_STORAGE_KEY = 'egui404_custom_alerts';

export const ScamService = {
  getAllScams: (): ScamItem[] => {
    let custom: ScamItem[] = [];
    try {
      const stored = localStorage.getItem(CUSTOM_SCAMS_STORAGE_KEY);
      if (stored) custom = JSON.parse(stored);
    } catch {}

    const rnpScams = RnpRepository.getAllScams();
    const seenIds = new Set<string>();
    const combined: ScamItem[] = [];

    // Custom/edited first, then RNP, then static seed data
    [...custom, ...rnpScams, ...SCAMS_DATA].forEach((item) => {
      if (!seenIds.has(item.id) && !seenIds.has(item.slug)) {
        seenIds.add(item.id);
        seenIds.add(item.slug);
        combined.push(item);
      }
    });

    return combined;
  },
  saveScam: (scam: ScamItem) => {
    try {
      let list = ScamService.getAllScams();
      const idx = list.findIndex((s) => s.id === scam.id || s.slug === scam.slug);
      if (idx >= 0) {
        list[idx] = scam;
      } else {
        list.unshift(scam);
      }
      localStorage.setItem(CUSTOM_SCAMS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },
  deleteScam: (id: string) => {
    try {
      let list = ScamService.getAllScams().filter((s) => s.id !== id && s.slug !== id);
      localStorage.setItem(CUSTOM_SCAMS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },
  getScamBySlug: (slug: string): ScamItem | undefined => {
    const all = ScamService.getAllScams();
    return all.find((s) => s.slug === slug || s.id === slug || s.originalRecordId === slug);
  },
  getSourceCounts: () => {
    const all = ScamService.getAllScams();
    const rnp = all.filter((s) => s.sourceProvider === 'RNP_CAIS' || s.originalRecordId?.startsWith('RNP_CAIS')).length;
    const egui = all.filter((s) => s.sourceProvider === 'EGUI_404' || (!s.sourceProvider && !s.originalRecordId)).length;
    const community = all.filter((s) => s.verificationStatus === 'COMMUNITY_REPORTED' || s.sourceProvider === 'COMMUNITY').length;
    const official = all.filter((s) => s.sources.some((src) => src.isOfficial || src.organization.includes('RNP') || src.organization.includes('CERT') || src.organization.includes('Banco Central'))).length;

    return {
      total: all.length,
      rnp,
      egui,
      community,
      official
    };
  },
  filterScams: (params: {
    category?: ScamCategory | 'ALL';
    risk?: RiskLevel | 'ALL';
    status?: ThreatStatus | 'ALL';
    source?: 'ALL' | 'RNP_CAIS' | 'EGUI_404' | 'COMMUNITY' | 'OFFICIAL';
    search?: string;
    sortBy?: 'DATE_DESC' | 'DATE_ASC' | 'RISK_HIGH' | 'TITLE';
  }): ScamItem[] => {
    let list = ScamService.getAllScams();

    if (params.source && params.source !== 'ALL') {
      if (params.source === 'RNP_CAIS') {
        list = list.filter((s) => s.sourceProvider === 'RNP_CAIS' || s.originalRecordId?.startsWith('RNP_CAIS'));
      } else if (params.source === 'EGUI_404') {
        list = list.filter((s) => s.sourceProvider === 'EGUI_404' || (!s.sourceProvider && !s.originalRecordId));
      } else if (params.source === 'COMMUNITY') {
        list = list.filter((s) => s.verificationStatus === 'COMMUNITY_REPORTED' || s.sourceProvider === 'COMMUNITY');
      } else if (params.source === 'OFFICIAL') {
        list = list.filter((s) => s.sources.some((src) => src.isOfficial));
      }
    }

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
          (s.originalRecordId && s.originalRecordId.toLowerCase().includes(q)) ||
          (s.overview && s.overview.toLowerCase().includes(q)) ||
          s.commonTactics.some((t) => t.toLowerCase().includes(q)) ||
          s.warningSigns.some((w) => w.toLowerCase().includes(q))
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
    try {
      const stored = localStorage.getItem(CUSTOM_THREATS_STORAGE_KEY);
      if (stored) {
        const custom: ThreatItem[] = JSON.parse(stored);
        const seen = new Set<string>();
        const res: ThreatItem[] = [];
        [...custom, ...THREATS_DATA].forEach((t) => {
          if (!seen.has(t.id)) {
            seen.add(t.id);
            res.push(t);
          }
        });
        return res;
      }
    } catch {}
    return THREATS_DATA;
  },
  getThreatById: (id: string): ThreatItem | undefined => {
    return ThreatService.getAllThreats().find(
      (t) => t.id === id || t.slug === id || t.threatCode.toLowerCase() === id.toLowerCase()
    );
  },
  saveThreat: (threat: ThreatItem) => {
    try {
      let list = ThreatService.getAllThreats();
      const idx = list.findIndex((t) => t.id === threat.id);
      if (idx >= 0) {
        list[idx] = threat;
      } else {
        list.unshift(threat);
      }
      localStorage.setItem(CUSTOM_THREATS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },
  deleteThreat: (id: string) => {
    try {
      let list = ThreatService.getAllThreats().filter((t) => t.id !== id);
      localStorage.setItem(CUSTOM_THREATS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
};

export const CaseService = {
  getAllCases: (): CaseFile[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_CASES_STORAGE_KEY);
      if (stored) {
        const custom: CaseFile[] = JSON.parse(stored);
        const seen = new Set<string>();
        const res: CaseFile[] = [];
        [...custom, ...CASES_DATA].forEach((c) => {
          if (!seen.has(c.id)) {
            seen.add(c.id);
            res.push(c);
          }
        });
        return res;
      }
    } catch {}
    return CASES_DATA;
  },
  getCaseById: (id: string): CaseFile | undefined => {
    return CaseService.getAllCases().find(
      (c) => c.id === id || c.caseNumber.toLowerCase().includes(id.toLowerCase())
    );
  },
  saveCase: (caseItem: CaseFile) => {
    try {
      let list = CaseService.getAllCases();
      const idx = list.findIndex((c) => c.id === caseItem.id);
      if (idx >= 0) {
        list[idx] = caseItem;
      } else {
        list.unshift(caseItem);
      }
      localStorage.setItem(CUSTOM_CASES_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },
  deleteCase: (id: string) => {
    try {
      let list = CaseService.getAllCases().filter((c) => c.id !== id);
      localStorage.setItem(CUSTOM_CASES_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
};

export const ArticleService = {
  getAllArticles: (): EducationArticle[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_ARTICLES_STORAGE_KEY);
      if (stored) {
        const custom: EducationArticle[] = JSON.parse(stored);
        const seen = new Set<string>();
        const res: EducationArticle[] = [];
        [...custom, ...ARTICLES_DATA].forEach((a) => {
          if (!seen.has(a.id) && !seen.has(a.slug)) {
            seen.add(a.id);
            seen.add(a.slug);
            res.push(a);
          }
        });
        return res;
      }
    } catch {}
    return ARTICLES_DATA;
  },
  getArticleBySlug: (slug: string): EducationArticle | undefined => {
    return ArticleService.getAllArticles().find((a) => a.slug === slug || a.id === slug);
  },
  saveArticle: (article: EducationArticle) => {
    try {
      let list = ArticleService.getAllArticles();
      const idx = list.findIndex((a) => a.id === article.id || a.slug === article.slug);
      if (idx >= 0) {
        list[idx] = article;
      } else {
        list.unshift(article);
      }
      localStorage.setItem(CUSTOM_ARTICLES_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },
  deleteArticle: (id: string) => {
    try {
      let list = ArticleService.getAllArticles().filter((a) => a.id !== id && a.slug !== id);
      localStorage.setItem(CUSTOM_ARTICLES_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
};

export const AlertService = {
  getAllAlerts: (): ScamAlert[] => {
    try {
      const stored = localStorage.getItem(CUSTOM_ALERTS_STORAGE_KEY);
      if (stored) {
        const custom: ScamAlert[] = JSON.parse(stored);
        const seen = new Set<string>();
        const res: ScamAlert[] = [];
        [...custom, ...ALERTS_DATA].forEach((a) => {
          if (!seen.has(a.id)) {
            seen.add(a.id);
            res.push(a);
          }
        });
        return res;
      }
    } catch {}
    return ALERTS_DATA;
  },
  getActiveAlerts: (): ScamAlert[] => {
    return AlertService.getAllAlerts().filter((a) => a.status === 'ACTIVE');
  },
  createAlert: (alert: Omit<ScamAlert, 'id' | 'alertNumber' | 'status' | 'date'>): ScamAlert => {
    const list = AlertService.getAllAlerts();
    const newId = `alert-${Date.now()}`;
    const nextNum = `#${String(list.length + 1).padStart(4, '0')}`;
    const newAlert: ScamAlert = {
      ...alert,
      id: newId,
      alertNumber: nextNum,
      status: 'ACTIVE',
      date: new Date().toISOString().split('T')[0]
    };
    list.unshift(newAlert);
    try {
      localStorage.setItem(CUSTOM_ALERTS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
    return newAlert;
  },
  updateAlert: (id: string, updates: Partial<ScamAlert>) => {
    let list = AlertService.getAllAlerts();
    list = list.map((a) => (a.id === id ? { ...a, ...updates } : a));
    try {
      localStorage.setItem(CUSTOM_ALERTS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },
  deleteAlert: (id: string) => {
    let list = AlertService.getAllAlerts().filter((a) => a.id !== id);
    try {
      localStorage.setItem(CUSTOM_ALERTS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
};

export const StatsService = {
  getStats: (): SiteStats => {
    return {
      threatsDocumented: 168,
      casesAnalyzed: 48,
      scamCategories: 18,
      safetyGuides: 32,
      alertsBroadcasted: 54,
      scenariosTested: 14620,
      isDemo: false,
      sourceNote: 'Dados compilados a partir de relatórios públicos oficiais do CERT.br, Banco Central do Brasil, FEBRABAN e CISA.'
    };
  }
};

export const SearchService = {
  searchAll: (query: string): SearchResultItem[] => {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResultItem[] = [];

    // Search Scams
    ScamService.getAllScams().forEach((scam) => {
      if (
        scam.title.toLowerCase().includes(q) ||
        scam.summary.toLowerCase().includes(q) ||
        scam.category.toLowerCase().includes(q) ||
        (scam.originalRecordId && scam.originalRecordId.toLowerCase().includes(q)) ||
        (scam.overview && scam.overview.toLowerCase().includes(q))
      ) {
        results.push({
          id: scam.id,
          type: 'SCAM',
          title: scam.title,
          subtitle: scam.sourceProvider === 'RNP_CAIS'
            ? `Arquivo de Golpes · Fonte: RNP/CAIS (${scam.originalRecordId || 'RNP'})`
            : `Arquivo de Golpes · ${scam.category}`,
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
          subtitle: `Threat Intelligence · Severidade ${threat.severityScore}%`,
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
          subtitle: `Caso Documentado · ${caseFile.country} (${caseFile.impactLevel})`,
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
          subtitle: `Guia de Segurança · ${art.category} (${art.readingTimeMinutes} min de leitura)`,
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
          subtitle: `Boletim de Ameaça · ${alert.type}`,
          category: alert.type,
          risk: alert.risk,
          status: alert.status,
          url: `/alerts?id=${alert.id}`,
          snippet: alert.warning
        });
      }
    });

    // Search Forum Threads
    try {
      const threads = ForumService.getThreads({});
      threads.forEach((t) => {
        if (
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        ) {
          results.push({
            id: t.id,
            type: 'FORUM_THREAD',
            title: t.title,
            subtitle: `Comunidade / Fórum · ${t.categoryName}`,
            category: t.categoryName,
            url: `/forum/topic/${t.slug}`,
            snippet: t.content.slice(0, 180) + '...'
          });
        }
      });
    } catch {}

    return results;
  }
};

export const ReportService = {
  submitReport: (data: {
    category: ScamCategory | 'OTHER';
    description: string;
    platform?: string;
    url?: string;
    incidentDate?: string;
    country?: string;
    contactMethod?: string;
    contactEmail?: string;
    indicators?: string[];
    isAnonymous: boolean;
    confirmedNoPersonalData: boolean;
    acceptedEducationalReview?: boolean;
  }): { ticketId: string } => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `EGUI-RPT-2026-${randomNum}`;
    const newReport: ReportSubmission = {
      id: `report-${Date.now()}`,
      ticketId,
      category: data.category,
      description: data.description,
      platform: data.platform || '',
      url: data.url,
      incidentDate: data.incidentDate || new Date().toISOString().split('T')[0],
      dateObserved: data.incidentDate || new Date().toISOString().split('T')[0],
      country: data.country || 'Brasil',
      contactMethod: data.contactMethod,
      contactEmail: data.contactEmail,
      indicators: data.indicators || [],
      isAnonymous: data.isAnonymous,
      confirmedNoPersonalData: data.confirmedNoPersonalData,
      acceptedEducationalReview: data.acceptedEducationalReview ?? true,
      status: 'PENDING_TRIAGE',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19)
    };

    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newReport);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(list));
    } catch {}

    return { ticketId };
  },
  getAllReports: (): ReportSubmission[] => {
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
        description: 'Tentativa de golpe via SMS alegando que um agendamento Pix suspeito de R$ 4.200 seria debitado se eu não ligasse para um 0800 falso.',
        platform: 'SMS / Central 0800 Falsa',
        indicators: ['0800-777-1234', 'banco-seguranca-pix.online'],
        status: 'PENDING_TRIAGE',
        confirmedNoPersonalData: true,
        submittedAt: '2026-02-25 10:14:02'
      },
      {
        id: 'rep-02',
        ticketId: 'EGUI-RPT-2026-3319',
        category: 'WHATSAPP FRAUD' as ScamCategory,
        description: 'Perfil falso com foto do meu irmão pedindo R$ 1.800 de transferência urgente alegando troca temporária de número.',
        platform: 'WhatsApp',
        indicators: ['+55 11 98888-0000', 'chave-pix-aleatoria-temp'],
        status: 'PENDING_TRIAGE',
        confirmedNoPersonalData: true,
        submittedAt: '2026-02-25 09:30:15'
      }
    ];
  },
  getPendingReports: (): ReportSubmission[] => {
    return ReportService.getAllReports().filter(
      (r) => r.status === 'PENDING' || r.status === 'PENDING_TRIAGE'
    );
  },
  updateReportStatus: (idOrTicket: string, newStatus: 'PENDING' | 'PENDING_TRIAGE' | 'APPROVED' | 'REJECTED' | 'ARCHIVED' | 'ANALYZED') => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      let list = stored ? JSON.parse(stored) : ReportService.getAllReports();
      list = list.map((item: any) =>
        item.id === idOrTicket || item.ticketId === idOrTicket ? { ...item, status: newStatus } : item
      );
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
    } catch {}

    return {
      success: true,
      message: 'Inscrição confirmada com sucesso. Você receberá relatórios e alertas de segurança digital.'
    };
  }
};

/* ==========================================================================
   CONTENT SAFETY & SANITIZATION ENGINE
   ========================================================================== */

export const ContentSafetyService = {
  analyzeText: (text: string): ContentAnalysis => {
    const reasons: string[] = [];
    const patterns: string[] = [];
    let risk = 0;

    // Check for raw CPF pattern (XXX.XXX.XXX-XX or 11 digits)
    const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;
    if (cpfRegex.test(text)) {
      risk += 40;
      reasons.push('Detectado padrão de CPF. Por segurança, remova ou mascare dados cadastrais.');
      patterns.push('CPF_PATTERN');
    }

    // Check for raw Credit Card pattern (13-19 digits)
    const cardRegex = /\b(?:\d[ -]*?){13,16}\b/g;
    if (cardRegex.test(text.replace(/[\n\r]/g, ' '))) {
      risk += 50;
      reasons.push('Detectada sequência numérica similar a cartão bancário. Nunca poste números de cartão.');
      patterns.push('CREDIT_CARD_PATTERN');
    }

    // Check for live malicious links without defang (e.g. http:// instead of hxxp or [.])
    const rawHttpRegex = /https?:\/\/[^\s]+/gi;
    const matches = text.match(rawHttpRegex);
    if (matches && matches.some((url) => !url.includes('egui404') && !url.includes('gov.br') && !url.includes('cert.br') && !url.includes('febraban.org.br'))) {
      risk += 25;
      reasons.push('Para segurança de todos, desative links suspeitos usando colchetes (ex: site[.]com em vez de link clicável).');
      patterns.push('ACTIVE_URL');
    }

    // Check for offensive/doxxing/hacking requests
    const illegalTerms = ['como hackear', 'como invadir', 'comprar dados', 'dump cpf', 'painel puxar dados', 'trojan download link'];
    const lower = text.toLowerCase();
    illegalTerms.forEach((term) => {
      if (lower.includes(term)) {
        risk += 60;
        reasons.push(`Uso de termos associados a atividades não permitidas ou ofensivas ("${term}").`);
        patterns.push('PROHIBITED_INTENT');
      }
    });

    let status: 'SAFE' | 'REVIEW' | 'BLOCK' = 'SAFE';
    if (risk >= 60) {
      status = 'BLOCK';
    } else if (risk >= 20) {
      status = 'REVIEW';
    }

    return {
      status,
      riskScore: Math.min(risk, 100),
      flaggedReasons: reasons,
      detectedPatterns: patterns,
      recommendation:
        status === 'BLOCK'
          ? 'Sua publicação foi barrada preventivamente para proteger dados pessoais e a segurança da comunidade.'
          : status === 'REVIEW'
          ? 'Por favor, revise o texto para mascarar dados sensíveis antes de publicar.'
          : 'Conteúdo em conformidade com as diretrizes da comunidade.'
    };
  }
};

/* ==========================================================================
   COMMUNITY FORUM SERVICE LAYER
   ========================================================================== */

export const ForumService = {
  getCategories: (): ForumCategory[] => {
    return FORUM_CATEGORIES;
  },

  getCategoryBySlug: (slug: string): ForumCategory | undefined => {
    return FORUM_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
  },

  getThreads: (params: {
    categorySlug?: string;
    tag?: string;
    search?: string;
    status?: 'ALL' | 'OPEN' | 'SOLVED';
    sortBy?: 'LATEST' | 'HOT' | 'POPULAR' | 'UNSOLVED';
  }): ForumThread[] => {
    let threads: ForumThread[] = [];
    try {
      const stored = localStorage.getItem(FORUM_THREADS_STORAGE_KEY);
      threads = stored ? JSON.parse(stored) : [...FORUM_THREADS];
    } catch {
      threads = [...FORUM_THREADS];
    }

    // Filter by Category
    if (params.categorySlug && params.categorySlug !== 'ALL') {
      threads = threads.filter(
        (t) => t.categorySlug === params.categorySlug || t.categoryId === params.categorySlug
      );
    }

    // Filter by Tag
    if (params.tag && params.tag !== 'ALL') {
      threads = threads.filter((t) => t.tags.includes(params.tag!));
    }

    // Filter by Status
    if (params.status && params.status !== 'ALL') {
      threads = threads.filter((t) => t.status === params.status);
    }

    // Filter by Search Query
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      threads = threads.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.author.displayName.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (params.sortBy === 'HOT') {
      threads.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0) || b.viewsCount - a.viewsCount);
    } else if (params.sortBy === 'POPULAR') {
      threads.sort((a, b) => b.likesCount + b.repliesCount * 2 - (a.likesCount + a.repliesCount * 2));
    } else if (params.sortBy === 'UNSOLVED') {
      threads = threads.filter((t) => !t.hasSolution);
      threads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: LATEST (Pinned first, then latest activity)
      threads.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.lastActivityAt || b.createdAt).getTime() - new Date(a.lastActivityAt || a.createdAt).getTime();
      });
    }

    return threads;
  },

  getThreadBySlug: (slugOrId: string): ForumThread | undefined => {
    const all = ForumService.getThreads({});
    return all.find((t) => t.slug === slugOrId || t.id === slugOrId);
  },

  createThread: (data: {
    title: string;
    categoryId: string;
    content: string;
    sourceUrl?: string;
    tags: string[];
    authorUsername?: string;
  }): { success: boolean; thread?: ForumThread; error?: string } => {
    // Content Safety Pre-check
    const check = ContentSafetyService.analyzeText(data.title + ' ' + data.content);
    if (check.status === 'BLOCK') {
      return {
        success: false,
        error: check.flaggedReasons.join(' ') || 'Conteúdo bloqueado pelas diretrizes de segurança.'
      };
    }

    const category = FORUM_CATEGORIES.find((c) => c.id === data.categoryId || c.slug === data.categoryId);
    const categoryName = category ? category.title : 'Discussões Gerais';
    const categorySlug = category ? category.slug : 'security-discussions';

    // Base slug generation
    const cleanTitle = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    const slug = `${cleanTitle}-${Date.now().toString().slice(-4)}`;

    const currentAuthor: ForumMember = FORUM_MEMBERS[0]; // Active session profile

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      slug,
      title: data.title,
      categoryId: category ? category.id : 'cat-01',
      categorySlug,
      categoryName,
      authorId: currentAuthor.id,
      author: currentAuthor,
      content: data.content,
      sourceUrl: data.sourceUrl,
      tags: data.tags.length > 0 ? data.tags : ['comunidade-alerta'],
      status: 'OPEN',
      isPinned: false,
      isHot: false,
      isVerified: false,
      viewsCount: 1,
      repliesCount: 0,
      likesCount: 0,
      isLikedByMe: false,
      isBookmarkedByMe: false,
      hasSolution: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      lastReplyAuthor: currentAuthor.displayName
    };

    try {
      const stored = localStorage.getItem(FORUM_THREADS_STORAGE_KEY);
      const list: ForumThread[] = stored ? JSON.parse(stored) : [...FORUM_THREADS];
      list.unshift(newThread);
      localStorage.setItem(FORUM_THREADS_STORAGE_KEY, JSON.stringify(list));
    } catch {}

    return { success: true, thread: newThread };
  },

  getPosts: (threadId: string): ForumPost[] => {
    try {
      const stored = localStorage.getItem(FORUM_POSTS_STORAGE_KEY);
      const allPosts: Record<string, ForumPost[]> = stored ? JSON.parse(stored) : FORUM_POSTS;
      return allPosts[threadId] || FORUM_POSTS[threadId] || [];
    } catch {
      return FORUM_POSTS[threadId] || [];
    }
  },

  createPost: (
    threadId: string,
    data: {
      content: string;
      sourceUrl?: string;
      quotedPostId?: string;
    }
  ): { success: boolean; post?: ForumPost; error?: string } => {
    // Content Safety Pre-check
    const check = ContentSafetyService.analyzeText(data.content);
    if (check.status === 'BLOCK') {
      return {
        success: false,
        error: check.flaggedReasons.join(' ') || 'Conteúdo bloqueado pelas diretrizes de segurança.'
      };
    }

    const currentAuthor = FORUM_MEMBERS[0];
    const existingPosts = ForumService.getPosts(threadId);

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      threadId,
      authorId: currentAuthor.id,
      author: currentAuthor,
      content: data.content,
      sourceUrl: data.sourceUrl,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLikedByMe: false,
      isSolution: false,
      quotedPostId: data.quotedPostId,
      postNumber: existingPosts.length + 1
    };

    try {
      const stored = localStorage.getItem(FORUM_POSTS_STORAGE_KEY);
      const allPosts: Record<string, ForumPost[]> = stored ? JSON.parse(stored) : { ...FORUM_POSTS };
      if (!allPosts[threadId]) {
        allPosts[threadId] = [];
      }
      allPosts[threadId].push(newPost);
      localStorage.setItem(FORUM_POSTS_STORAGE_KEY, JSON.stringify(allPosts));

      // Update Thread counters
      const storedThreads = localStorage.getItem(FORUM_THREADS_STORAGE_KEY);
      let threadsList: ForumThread[] = storedThreads ? JSON.parse(storedThreads) : [...FORUM_THREADS];
      threadsList = threadsList.map((t) => {
        if (t.id === threadId || t.slug === threadId) {
          return {
            ...t,
            repliesCount: (t.repliesCount || 0) + 1,
            lastActivityAt: new Date().toISOString(),
            lastReplyAuthor: currentAuthor.displayName
          };
        }
        return t;
      });
      localStorage.setItem(FORUM_THREADS_STORAGE_KEY, JSON.stringify(threadsList));
    } catch {}

    return { success: true, post: newPost };
  },

  toggleLikePost: (threadId: string, postId: string): boolean => {
    try {
      const stored = localStorage.getItem(FORUM_POSTS_STORAGE_KEY);
      const allPosts: Record<string, ForumPost[]> = stored ? JSON.parse(stored) : { ...FORUM_POSTS };
      const posts = allPosts[threadId] || [];
      const post = posts.find((p) => p.id === postId);
      if (post) {
        post.isLikedByMe = !post.isLikedByMe;
        post.likesCount += post.isLikedByMe ? 1 : -1;
        localStorage.setItem(FORUM_POSTS_STORAGE_KEY, JSON.stringify(allPosts));
        return post.isLikedByMe;
      }
    } catch {}
    return false;
  },

  toggleLikeThread: (threadId: string): boolean => {
    try {
      const stored = localStorage.getItem(FORUM_THREADS_STORAGE_KEY);
      let list: ForumThread[] = stored ? JSON.parse(stored) : [...FORUM_THREADS];
      const thread = list.find((t) => t.id === threadId || t.slug === threadId);
      if (thread) {
        thread.isLikedByMe = !thread.isLikedByMe;
        thread.likesCount += thread.isLikedByMe ? 1 : -1;
        localStorage.setItem(FORUM_THREADS_STORAGE_KEY, JSON.stringify(list));
        return thread.isLikedByMe;
      }
    } catch {}
    return false;
  },

  toggleBookmarkThread: (threadId: string): boolean => {
    try {
      const stored = localStorage.getItem(FORUM_THREADS_STORAGE_KEY);
      let list: ForumThread[] = stored ? JSON.parse(stored) : [...FORUM_THREADS];
      const thread = list.find((t) => t.id === threadId || t.slug === threadId);
      if (thread) {
        thread.isBookmarkedByMe = !thread.isBookmarkedByMe;
        localStorage.setItem(FORUM_THREADS_STORAGE_KEY, JSON.stringify(list));
        return thread.isBookmarkedByMe;
      }
    } catch {}
    return false;
  },

  markPostAsSolution: (threadId: string, postId: string) => {
    try {
      const storedPosts = localStorage.getItem(FORUM_POSTS_STORAGE_KEY);
      const allPosts: Record<string, ForumPost[]> = storedPosts ? JSON.parse(storedPosts) : { ...FORUM_POSTS };
      const posts = allPosts[threadId] || [];
      posts.forEach((p) => {
        p.isSolution = p.id === postId;
      });
      localStorage.setItem(FORUM_POSTS_STORAGE_KEY, JSON.stringify(allPosts));

      const storedThreads = localStorage.getItem(FORUM_THREADS_STORAGE_KEY);
      let list: ForumThread[] = storedThreads ? JSON.parse(storedThreads) : [...FORUM_THREADS];
      list = list.map((t) => {
        if (t.id === threadId || t.slug === threadId) {
          return { ...t, hasSolution: true, solutionPostId: postId, status: 'SOLVED' };
        }
        return t;
      });
      localStorage.setItem(FORUM_THREADS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },

  getMembers: (): ForumMember[] => {
    return FORUM_MEMBERS;
  },

  getMemberByUsername: (username: string): ForumMember | undefined => {
    return FORUM_MEMBERS.find((m) => m.username.toLowerCase() === username.toLowerCase() || m.id === username);
  },

  getBadges: (): ForumBadge[] => {
    return FORUM_BADGES;
  },

  getTags: (): ForumTag[] => {
    return FORUM_TAGS;
  },

  getNotifications: (): ForumNotification[] => {
    try {
      const stored = localStorage.getItem(FORUM_NOTIFS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  markNotificationAsRead: (id: string) => {
    try {
      const stored = localStorage.getItem(FORUM_NOTIFS_STORAGE_KEY);
      let list: ForumNotification[] = stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
      list = list.map((n) => (n.id === id ? { ...n, read: true } : n));
      localStorage.setItem(FORUM_NOTIFS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },

  markAllNotificationsAsRead: () => {
    try {
      const stored = localStorage.getItem(FORUM_NOTIFS_STORAGE_KEY);
      let list: ForumNotification[] = stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
      list = list.map((n) => ({ ...n, read: true }));
      localStorage.setItem(FORUM_NOTIFS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  },

  submitForumReport: (data: Omit<ForumReport, 'id' | 'createdAt' | 'status'>): { success: boolean; reportId: string } => {
    const reportId = `rep-${Date.now()}`;
    const newReport: ForumReport = {
      ...data,
      id: reportId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem(FORUM_MOD_STORAGE_KEY);
      const list: ForumReport[] = stored ? JSON.parse(stored) : INITIAL_REPORTS;
      list.unshift(newReport);
      localStorage.setItem(FORUM_MOD_STORAGE_KEY, JSON.stringify(list));
    } catch {}

    return { success: true, reportId };
  },

  getForumReports: (): ForumReport[] => {
    try {
      const stored = localStorage.getItem(FORUM_MOD_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  },

  updateForumReportStatus: (id: string, status: ForumReport['status']) => {
    try {
      const stored = localStorage.getItem(FORUM_MOD_STORAGE_KEY);
      let list: ForumReport[] = stored ? JSON.parse(stored) : INITIAL_REPORTS;
      list = list.map((r) => (r.id === id ? { ...r, status } : r));
      localStorage.setItem(FORUM_MOD_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
};
