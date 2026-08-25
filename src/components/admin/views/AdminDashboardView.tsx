import React from 'react';
import {
  ShieldAlert,
  Flame,
  FileCheck,
  Bell,
  Activity,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Database,
  Users,
  Search,
  ExternalLink,
  ArrowRight,
  Shield,
  Layers,
  Terminal,
  Clock
} from 'lucide-react';
import { ScamService, ThreatService, CaseService, AlertService, ScamReportService } from '../../../services/dataService';
import { RnpRepository } from '../../../services/rnp/rnpRepository';
import { AdminAnalyticsService, AuditLogService } from '../../../services/adminService';
import { RiskBadge } from '../../ui/RiskBadge';
import { StatusBadge } from '../../ui/StatusBadge';
import { SoundEngine } from '../../../services/audioService';

interface AdminDashboardViewProps {
  onNavigateSub: (sub: string) => void;
  onQuickAction: (action: 'NEW_THREAT' | 'NEW_ALERT' | 'NEW_SCAM' | 'SYNC_RNP') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateSub,
  onQuickAction
}) => {
  const telemetry = AdminAnalyticsService.getTelemetrySummary();
  const recentReports = ScamReportService.getAllReports().slice(0, 5);
  const recentLogs = AuditLogService.getLogs().slice(0, 5);
  const activeAlerts = AlertService.getActiveAlerts().slice(0, 3);
  const threats = ThreatService.getAllThreats().slice(0, 4);
  const rnpStats = RnpRepository.getSyncStats();

  const statCards = [
    {
      id: 'scams',
      label: 'Golpes no Arquivo',
      value: telemetry.totalScams,
      change: '+14% esta semana',
      icon: ShieldAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      route: 'archive',
      badge: 'LIVE DATA'
    },
    {
      id: 'threats',
      label: 'Ameaças Ativas',
      value: `${telemetry.activeThreats} / ${telemetry.totalThreats}`,
      change: '4 de alta gravidade',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      route: 'threats',
      badge: 'IOC MATRIX'
    },
    {
      id: 'reports',
      label: 'Denúncias Pendentes',
      value: telemetry.pendingReports,
      change: 'Fila de triagem',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
      route: 'reports',
      badge: telemetry.pendingReports > 0 ? 'AÇÃO REQUERIDA' : 'LIMPO'
    },
    {
      id: 'rnp',
      label: 'Catálogo RNP/CAIS',
      value: telemetry.rnpRecords,
      change: `Último sync: ${rnpStats.lastRun || 'Hoje'}`,
      icon: RefreshCw,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
      route: 'sources-rnp',
      badge: 'OFICIAL CAIS'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Status & Quick Controls */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#120808] via-[#0E0E0E] to-[#0A0A0A] border border-[#2A1818] relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#E00000]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                SISTEMA OPERACIONAL ESTÁVEL
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#222222] text-[#888888]">
                NÍVEL DEFENSIVO 1
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-['Bebas_Neue'] tracking-wide text-white">
              Painel de Inteligência & Controle Central
            </h1>
            <p className="text-xs sm:text-sm font-mono text-[#AAAAAA] max-w-2xl mt-1">
              Supervisão de ameaças cibernéticas em tempo real, moderação de denúncias da comunidade e sincronização com o Catálogo RNP/CAIS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onQuickAction('SYNC_RNP')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#262626] border border-[#333333] text-xs font-mono text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync RNP/CAIS</span>
            </button>
            <button
              onClick={() => onQuickAction('NEW_ALERT')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-xs font-mono font-semibold text-white transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Emitir Alerta</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={() => {
                SoundEngine.playKeyClick();
                onNavigateSub(stat.route);
              }}
              className="p-4 rounded-xl bg-[#0D0D0D] hover:bg-[#121212] border border-[#222222] hover:border-[#444444] transition-all cursor-pointer group relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${stat.bgColor} ${stat.borderColor} border flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#181818] border border-[#262626] text-[#888888] font-bold">
                    {stat.badge}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#888888]">{stat.label}</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{stat.value}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#666666]">
                <span>{stat.change}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: Active Alerts & Whistleblower Triage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts Broadcast */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#E00000]" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Broadcast de Alertas Urgentes
              </h2>
            </div>
            <button
              onClick={() => onNavigateSub('alerts')}
              className="text-xs font-mono text-[#888888] hover:text-white flex items-center gap-1"
            >
              <span>Gerenciar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] hover:border-[#3A3A3A] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#E00000] bg-[#E00000]/10 px-2 py-0.5 rounded border border-[#E00000]/20">
                    {alert.alertNumber} · {alert.type}
                  </span>
                  <RiskBadge level={alert.risk} />
                </div>
                <h3 className="text-xs font-mono font-semibold text-white line-clamp-1">
                  {alert.headline}
                </h3>
                <p className="text-[11px] font-mono text-[#999999] mt-1 line-clamp-2">
                  {alert.warning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Whistleblower Reports Queue */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Triagem de Denúncias Recentes
              </h2>
            </div>
            <button
              onClick={() => onNavigateSub('reports')}
              className="text-xs font-mono text-[#888888] hover:text-white flex items-center gap-1"
            >
              <span>Ver Fila ({telemetry.pendingReports})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentReports.length === 0 ? (
              <div className="text-center py-8 text-xs font-mono text-[#666666]">
                Nenhuma denúncia pendente na fila.
              </div>
            ) : (
              recentReports.map((rep) => (
                <div
                  key={rep.ticketId}
                  onClick={() => onNavigateSub('reports')}
                  className="p-3 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#AAAAAA] font-semibold">
                      {rep.ticketId} · {rep.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                        rep.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : rep.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#DDDDDD] line-clamp-1">
                    {rep.description}
                  </p>
                  <div className="text-[10px] font-mono text-[#666666] mt-1 flex items-center gap-2">
                    <span>Plataforma: {rep.platform}</span>
                    <span>·</span>
                    <span>{rep.submittedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Threat Matrix Snippet & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Matrix Snippet */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222]">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Matriz de Ameaças em Monitoramento
              </h2>
            </div>
            <button
              onClick={() => onNavigateSub('threats')}
              className="text-xs font-mono text-[#888888] hover:text-white flex items-center gap-1"
            >
              <span>Matriz Completa</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {threats.map((t) => (
              <div
                key={t.id}
                onClick={() => onNavigateSub('threats')}
                className="p-3.5 rounded-xl bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-orange-400">
                      [{t.threatCode}]
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#222222] text-[#AAAAAA]">
                      Score {t.severityScore}%
                    </span>
                  </div>
                  <h3 className="text-xs font-mono font-semibold text-white line-clamp-1">
                    {t.title}
                  </h3>
                  <p className="text-[11px] font-mono text-[#888888] mt-1 line-clamp-2">
                    {t.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#222222] flex items-center justify-between">
                  <RiskBadge level={t.riskLevel} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail Snippet */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Auditoria Operacional
              </h2>
            </div>
            <button
              onClick={() => onNavigateSub('audit-logs')}
              className="text-xs font-mono text-[#888888] hover:text-white flex items-center gap-1"
            >
              <span>Ver Todos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 flex-1 font-mono text-xs">
            {recentLogs.map((log) => (
              <div key={log.id} className="p-2.5 rounded-lg bg-[#141414] border border-[#222222]">
                <div className="flex items-center justify-between gap-1 text-[10px] text-[#777777] mb-1">
                  <span className="text-emerald-400 font-bold">{log.action}</span>
                  <span>{log.timestamp.split(' ')[1]}</span>
                </div>
                <div className="text-[11px] text-[#CCCCCC] truncate">{log.details}</div>
                <div className="text-[9px] text-[#555555] mt-1 flex items-center justify-between">
                  <span>@{log.user}</span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
