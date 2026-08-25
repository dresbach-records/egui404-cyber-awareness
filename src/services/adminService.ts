import {
  AuditLogItem,
  AdminSourceItem,
  SystemSettings,
  AdminNotification,
  SearchAnalyticsItem,
  AdminMemberItem,
  ForumMember,
  UserRole,
  ThreatItem,
  ScamItem,
  CaseFile,
  ScamAlert,
  EducationArticle
} from '../types';
import { ScamService, ThreatService, CaseService, AlertService, ArticleService, ScamReportService } from './dataService';
import { RnpRepository } from './rnp/rnpRepository';
import { FORUM_MEMBERS } from '../data/forumData';

// Local storage keys
const AUDIT_LOGS_KEY = 'egui404_audit_logs';
const SOURCES_KEY = 'egui404_admin_sources';
const SETTINGS_KEY = 'egui404_admin_settings';
const NOTIFICATIONS_KEY = 'egui404_admin_notifications';
const MEMBERS_KEY = 'egui404_admin_members';
const SEARCH_ANALYTICS_KEY = 'egui404_search_analytics';

// Initial Mock Datasets
const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'AUD-9021',
    timestamp: '2026-08-25 14:32:10',
    user: 'observer_root',
    action: 'INTEGRATION_SYNC',
    entity: 'RNP_CAIS_CATALOG',
    entityId: 'SYNC_JOB_674',
    ip: '10.0.4.102',
    result: 'SUCCESS',
    details: 'Sincronização do Catálogo de Fraudes RNP/CAIS concluída com 6 registros verificados.'
  },
  {
    id: 'AUD-9020',
    timestamp: '2026-08-25 14:15:00',
    user: 'sec_editor_01',
    action: 'PUBLISH',
    entity: 'SCAM_ARCHIVE',
    entityId: 'SCAM-PIX-MED',
    ip: '192.168.1.55',
    result: 'SUCCESS',
    details: 'Publicado dossiê defensivo: Golpe do Falso Mecanismo Especial de Devolução (MED).'
  },
  {
    id: 'AUD-9019',
    timestamp: '2026-08-25 13:48:22',
    user: 'moderator_cyber',
    action: 'MODERATION',
    entity: 'COMMUNITY_REPORT',
    entityId: 'REP-77821',
    ip: '172.16.0.41',
    result: 'SUCCESS',
    details: 'Denúncia de phishing bancário aprovada para ingestão e redação editorial.'
  },
  {
    id: 'AUD-9018',
    timestamp: '2026-08-25 12:00:15',
    user: 'system_daemon',
    action: 'SYSTEM_CHANGE',
    entity: 'PWA_MANIFEST',
    entityId: 'SW_CACHE_V3',
    ip: '127.0.0.1',
    result: 'SUCCESS',
    details: 'Cache de manifesto PWA atualizado para suporte offline responsivo.'
  },
  {
    id: 'AUD-9017',
    timestamp: '2026-08-25 10:22:45',
    user: 'unknown_probe',
    action: 'LOGIN',
    entity: 'ADMIN_PORTAL',
    entityId: 'AUTH_SESSION',
    ip: '45.134.22.9',
    result: 'DENIED',
    details: 'Tentativa de login sem credenciais válidas bloqueada pelo rate limiter.'
  }
];

const INITIAL_SOURCES: AdminSourceItem[] = [
  {
    id: 'src-rnp',
    name: 'Catálogo de Fraudes RNP/CAIS',
    organization: 'Rede Nacional de Ensino e Pesquisa / CAIS',
    type: 'OFFICIAL_EXTERNAL_SOURCE',
    url: 'https://catalogodefraudes.rnp.br/',
    status: 'ACTIVE',
    lastChecked: '2026-08-25 14:30',
    notes: 'Catálogo público e oficial de fraudes brasileiras. Sincronização automatizada com defanging de links.',
    recordsCount: 6,
    isOfficial: true
  },
  {
    id: 'src-cert-br',
    name: 'CERT.br / NIC.br',
    organization: 'Centro de Estudos, Resposta e Tratamento de Incidentes de Segurança no Brasil',
    type: 'OFFICIAL_EXTERNAL_SOURCE',
    url: 'https://www.cert.br/',
    status: 'ACTIVE',
    lastChecked: '2026-08-25 12:00',
    notes: 'Boletins de segurança e estatísticas consolidadas de incidentes cibernéticos.',
    recordsCount: 14,
    isOfficial: true
  },
  {
    id: 'src-bacen',
    name: 'Banco Central do Brasil (BCB)',
    organization: 'Banco Central do Brasil',
    type: 'GOVERNMENT',
    url: 'https://www.bcb.gov.br/estabilidadefinanceira/segurancapix',
    status: 'ACTIVE',
    lastChecked: '2026-08-25 09:15',
    notes: 'Diretrizes oficiais sobre Mecanismo Especial de Devolução (MED) e segurança Pix.',
    recordsCount: 8,
    isOfficial: true
  },
  {
    id: 'src-pf',
    name: 'Polícia Federal — Crimes Cibernéticos',
    organization: 'Polícia Federal',
    type: 'LAW_ENFORCEMENT',
    url: 'https://www.gov.br/pf/pt-br/assuntos/crimes-ciberneticos',
    status: 'MONITORED',
    lastChecked: '2026-08-24 18:00',
    notes: 'Alertas públicos de operações contra quadrilhas digitais e fraudes financeiras.',
    recordsCount: 5,
    isOfficial: true
  },
  {
    id: 'src-egui-lab',
    name: 'E GUI 404 Research Lab',
    organization: 'E GUI 404 Cyber Intelligence',
    type: 'SECURITY_RESEARCH',
    url: 'https://egui404.org/lab',
    status: 'ACTIVE',
    lastChecked: '2026-08-25 14:35',
    notes: 'Análises heurísticas defensivas e engenharia reversa de mensagens de golpe.',
    recordsCount: 22,
    isOfficial: false
  }
];

const INITIAL_MEMBERS: AdminMemberItem[] = [
  {
    id: 'usr-001',
    name: 'Comandante de Operações',
    email: 'admin@egui404.org',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLogin: '2026-08-25 14:30'
  },
  {
    id: 'usr-002',
    name: 'Analista de Engenharia Social',
    email: 'analyst@egui404.org',
    role: 'ANALYST',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLogin: '2026-08-25 13:10'
  },
  {
    id: 'usr-003',
    name: 'Pesquisador de Ameaças RNP',
    email: 'research@egui404.org',
    role: 'RESEARCHER',
    status: 'ACTIVE',
    mfaEnabled: true,
    lastLogin: '2026-08-25 11:45'
  }
];

export interface LegacySystemSettings {
  platformName: string;
  contactEmail: string;
  emergencyBroadcastActive: boolean;
  allowPublicSubmissions: boolean;
  soundEffectsEnabled: boolean;
}

const INITIAL_LEGACY_SETTINGS: LegacySystemSettings = {
  platformName: 'E GUI 404 — Cyber Crime Awareness',
  contactEmail: 'security@egui404.org',
  emergencyBroadcastActive: true,
  allowPublicSubmissions: true,
  soundEffectsEnabled: true
};

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    type: 'REPORT',
    title: 'Nova Denúncia da Comunidade',
    message: 'Usuário enviou relatório de falso SMS bancário do Banco do Brasil com link suspeito.',
    time: 'Há 15 minutos',
    read: false,
    severity: 'WARNING',
    link: '/admin/reports'
  },
  {
    id: 'notif-2',
    type: 'IMPORT',
    title: 'Sincronização RNP/CAIS Concluída',
    message: 'Catálogo de Fraudes atualizado: 6 registros processados sem erros.',
    time: 'Há 1 hora',
    read: false,
    severity: 'INFO',
    link: '/admin/sources/rnp'
  },
  {
    id: 'notif-3',
    type: 'MODERATION',
    title: 'Tópico no Fórum Sinalizado',
    message: 'Tópico "Como recuperar conta invadida" recebeu 2 votos de moderação por dados pessoais.',
    time: 'Há 3 horas',
    read: true,
    severity: 'CRITICAL',
    link: '/admin/moderation'
  }
];

const INITIAL_SEARCH_ANALYTICS: SearchAnalyticsItem[] = [
  { query: 'golpe do pix', count: 482, zeroResults: false, category: 'PIX SCAMS', lastSearched: 'Há 2 min' },
  { query: 'falsa central nubank', count: 329, zeroResults: false, category: 'BANKING FRAUD', lastSearched: 'Há 5 min' },
  { query: 'falso emprego telegram', count: 215, zeroResults: false, category: 'FAKE JOBS', lastSearched: 'Há 12 min' },
  { query: 'intimação receita federal', count: 184, zeroResults: false, category: 'PHISHING', lastSearched: 'Há 25 min' },
  { query: 'recuperação de conta hackeada', count: 96, zeroResults: true, category: 'ACCOUNT TAKEOVER', lastSearched: 'Há 1 hora' },
  { query: 'criptomoeda robô telegram', count: 77, zeroResults: false, category: 'FAKE INVESTMENTS', lastSearched: 'Há 2 horas' }
];

export const AuditLogService = {
  getLogs: (): AuditLogItem[] => {
    try {
      const stored = localStorage.getItem(AUDIT_LOGS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },
  getAll: (): AuditLogItem[] => {
    return AuditLogService.getLogs();
  },
  log: (entry: Omit<AuditLogItem, 'id' | 'timestamp'>) => {
    const list = AuditLogService.getLogs();
    const newLog: AuditLogItem = {
      ...entry,
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    list.unshift(newLog);
    try {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(list.slice(0, 100)));
    } catch {}
    return newLog;
  },
  clearLogs: () => {
    try {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify([]));
    } catch {}
  }
};

export const AdminSourcesService = {
  getSources: (): AdminSourceItem[] => {
    try {
      const stored = localStorage.getItem(SOURCES_KEY);
      return stored ? JSON.parse(stored) : INITIAL_SOURCES;
    } catch {
      return INITIAL_SOURCES;
    }
  },
  getAll: (): AdminSourceItem[] => {
    return AdminSourcesService.getSources();
  },
  toggleSource: (id: string) => {
    const list = AdminSourcesService.getSources().map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...s, status: nextStatus as any };
      }
      return s;
    });
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(list));
    } catch {}
  },
  addSource: (source: Omit<AdminSourceItem, 'id' | 'lastChecked'>) => {
    const list = AdminSourcesService.getSources();
    const newSource: AdminSourceItem = {
      ...source,
      id: `src-${Date.now()}`,
      lastChecked: new Date().toISOString().substring(0, 16).replace('T', ' ')
    };
    list.push(newSource);
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(list));
      AuditLogService.log({
        user: 'admin',
        action: 'SOURCE_UPDATE',
        entity: 'SOURCE',
        entityId: newSource.id,
        ip: '127.0.0.1',
        result: 'SUCCESS',
        details: `Nova fonte adicionada: ${newSource.name}`
      });
    } catch {}
    return newSource;
  },
  updateSource: (id: string, updates: Partial<AdminSourceItem>) => {
    let list = AdminSourcesService.getSources();
    list = list.map((s) => (s.id === id ? { ...s, ...updates, lastChecked: new Date().toISOString().substring(0, 16).replace('T', ' ') } : s));
    try {
      localStorage.setItem(SOURCES_KEY, JSON.stringify(list));
      AuditLogService.log({
        user: 'admin',
        action: 'SOURCE_UPDATE',
        entity: 'SOURCE',
        entityId: id,
        ip: '127.0.0.1',
        result: 'SUCCESS',
        details: `Fonte atualizada: ${id}`
      });
    } catch {}
  }
};

export const AdminSettingsService = {
  getSettings: (): LegacySystemSettings => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_LEGACY_SETTINGS;
    } catch {
      return INITIAL_LEGACY_SETTINGS;
    }
  },
  saveSettings: (settings: LegacySystemSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      AuditLogService.log({
        user: 'admin',
        action: 'SYSTEM_CHANGE',
        entity: 'SETTINGS',
        entityId: 'SYS_CONFIG',
        ip: '127.0.0.1',
        result: 'SUCCESS',
        details: 'Configurações de sistema atualizadas.'
      });
    } catch {}
  }
};

export const AdminNotificationService = {
  getNotifications: (): AdminNotification[] => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  markAsRead: (id: string) => {
    const list = AdminNotificationService.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    } catch {}
  },
  markAllAsRead: () => {
    const list = AdminNotificationService.getNotifications().map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    } catch {}
  }
};

export const AdminMemberService = {
  getAll: (): AdminMemberItem[] => {
    try {
      const stored = localStorage.getItem(MEMBERS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  },
  save: (member: AdminMemberItem) => {
    const list = AdminMemberService.getAll();
    const existingIdx = list.findIndex((m) => m.id === member.id);
    if (existingIdx >= 0) {
      list[existingIdx] = member;
    } else {
      list.push(member);
    }
    try {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
    } catch {}
  },
  delete: (id: string) => {
    const list = AdminMemberService.getAll().filter((m) => m.id !== id);
    try {
      localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
    } catch {}
  },
  getMembers: (): ForumMember[] => {
    return FORUM_MEMBERS;
  },
  updateMemberRole: (id: string, role: UserRole) => {
    AuditLogService.log({
      user: 'admin',
      action: 'ROLE_CHANGE',
      entity: 'USER',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Cargo do usuário alterado para ${role}`
    });
  }
};

export const AdminAnalyticsService = {
  getSearchAnalytics: (): SearchAnalyticsItem[] => {
    try {
      const stored = localStorage.getItem(SEARCH_ANALYTICS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_SEARCH_ANALYTICS;
    } catch {
      return INITIAL_SEARCH_ANALYTICS;
    }
  },
  getTopSearches: () => {
    return [
      { term: 'Falsa Central Nubank', count: 1420 },
      { term: 'Golpe do Pix Agendado', count: 1180 },
      { term: 'Intimação Falsa Receita Federal', count: 890 },
      { term: 'Emprego Avaliador Shopee', count: 740 },
      { term: 'Clonagem WhatsApp Código 6 Dígitos', count: 620 }
    ];
  },
  getPlatformStats: () => {
    return {
      mobile: '64.8%',
      desktop: '29.4%',
      tablet: '5.8%'
    };
  },
  getTelemetrySummary: () => {
    const scams = ScamService.getAllScams();
    const threats = ThreatService.getAllThreats();
    const cases = CaseService.getAllCases();
    const alerts = AlertService.getAllAlerts();
    const articles = ArticleService.getAllArticles();
    const reports = ScamReportService.getAllReports();
    const sources = AdminSourcesService.getSources();
    const members = AdminMemberService.getAll();

    return {
      totalScams: scams.length,
      activeThreats: threats.filter((t) => t.status === 'ACTIVE').length,
      totalThreats: threats.length,
      totalCases: cases.length,
      activeAlerts: alerts.filter((a) => a.urgent || a.status === 'ACTIVE').length,
      totalArticles: articles.length,
      pendingReports: reports.filter((r) => r.status === 'PENDING' || r.status === 'PENDING_TRIAGE').length,
      totalSources: sources.length,
      totalMembers: members.length,
      rnpRecords: RnpRepository.getAllScams().length
    };
  }
};

export const RnpSyncService = {
  triggerSync: () => {
    const all = RnpRepository.getAllScams();
    return {
      count: all.length,
      date: new Date().toLocaleTimeString('pt-BR')
    };
  }
};
