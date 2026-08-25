import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Filter,
  ExternalLink,
  ChevronRight,
  Send,
  Zap,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { ReportSubmission, ScamItem, ScamCategory } from '../../../types';
import { ScamReportService, ScamService } from '../../../services/dataService';
import { AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminReportsView: React.FC = () => {
  const [reports, setReports] = useState<ReportSubmission[]>(() => ScamReportService.getAllReports());
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [inspectingReport, setInspectingReport] = useState<ReportSubmission | null>(null);

  const filteredReports = reports.filter((r) => {
    if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        r.ticketId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.platform.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleUpdateStatus = (ticketId: string, status: ReportSubmission['status']) => {
    SoundEngine.playKeyClick();
    ScamReportService.updateReportStatus(ticketId, status);
    setReports(ScamReportService.getAllReports());

    AuditLogService.log({
      user: 'moderator_triage',
      action: 'MODERATION',
      entity: 'REPORT_SUBMISSION',
      entityId: ticketId,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Status da denúncia [${ticketId}] alterado para ${status}`
    });

    if (inspectingReport?.ticketId === ticketId) {
      setInspectingReport({ ...inspectingReport, status });
    }
  };

  const handleConvertToArchive = (report: ReportSubmission) => {
    SoundEngine.playSuccessSound();
    const newScam: ScamItem = {
      id: `EGUI-COMMUNITY-${report.ticketId.replace('#', '')}`,
      slug: `denuncia-${report.ticketId.toLowerCase().replace('#', '')}`,
      title: report.title || `Fraude relatada: ${report.category} via ${report.platform}`,
      category: (report.category as ScamCategory) || 'PHISHING',
      riskLevel: 'HIGH',
      status: 'MONITORED',
      date: report.incidentDate || report.submittedAt.split('T')[0] || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      summary: report.description,
      overview: `Incidente registrado via canal seguro de denúncias públicas (Whistleblower). Plataforma afetada: ${report.platform}. ${report.additionalInfo || ''}`,
      howItWorks: ['Contato inicial pela plataforma ' + report.platform, 'Abordagem persuasiva e tentativa de extração de valores'],
      warningSigns: ['Abordagem não solicitada', 'Solicitação de dados bancários ou códigos de verificação'],
      commonTactics: ['Engenharia Social', 'Urgência Simulada'],
      howToProtect: ['Não compartilhar códigos SMS ou senhas', 'Bloquear e reportar o remetente'],
      victimActions: ['Contatar o canal oficial da instituição', 'Registrar Boletim de Ocorrência Policial'],
      affectedPlatforms: [report.platform],
      sourceProvider: 'COMMUNITY',
      verificationStatus: 'COMMUNITY_REPORTED',
      sources: [
        {
          organization: 'E GUI 404 Whistleblower Channel',
          title: `Relatório de Denúncia Comunitária [${report.ticketId}]`,
          url: 'https://egui404.org/report',
          isOfficial: false
        }
      ]
    };

    ScamService.saveScam(newScam);
    handleUpdateStatus(report.ticketId, 'APPROVED');

    AuditLogService.log({
      user: 'moderator_triage',
      action: 'PUBLISH',
      entity: 'SCAM_ARCHIVE',
      entityId: newScam.id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Denúncia [${report.ticketId}] convertida em dossiê defensivo no Arquivo.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Triagem de Denúncias Whistleblower & Incidentes
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Fila de análise técnica e mascaramento de dados (LGPD) de incidentes submetidos pela população.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por Ticket #TKT-001, plataforma, descrição..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
        >
          <option value="ALL">Todos os Status</option>
          <option value="PENDING">PENDING</option>
          <option value="PENDING_TRIAGE">PENDING_TRIAGE</option>
          <option value="ANALYZED">ANALYZED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#666666] bg-[#0D0D0D] border border-[#222222] rounded-xl">
            Nenhuma denúncia encontrada na fila.
          </div>
        ) : (
          filteredReports.map((r) => (
            <div
              key={r.ticketId}
              className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] hover:border-[#333333] transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {r.ticketId}
                  </span>
                  <span className="text-xs font-mono text-white font-semibold">{r.category}</span>
                  <span className="text-[10px] font-mono text-[#777777]">via {r.platform}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      r.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : r.status === 'REJECTED'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-[10px] font-mono text-[#666666]">{r.submittedAt}</span>
                </div>
              </div>

              <p className="text-xs font-mono text-[#CCCCCC] bg-[#141414] p-3 rounded-lg border border-[#1F1F1F]">
                {r.description}
              </p>

              {r.url && (
                <div className="text-[11px] font-mono text-[#777777] truncate">
                  <span className="text-[#555555]">URL Envolvida: </span>
                  <span className="text-cyan-400 font-mono">{r.url}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#1C1C1C] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#666666]">
                  {r.isAnonymous ? <span>🔒 Denúncia Anônima</span> : <span>Contato Registrado</span>}
                  {r.confirmedNoPersonalData && <span>· LGPD Validado</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(r.ticketId, 'APPROVED')}
                    className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aprovar</span>
                  </button>

                  <button
                    onClick={() => handleConvertToArchive(r)}
                    className="px-2.5 py-1 rounded bg-[#E00000]/15 hover:bg-[#E00000]/25 text-[#FF4444] border border-[#E00000]/40 text-xs font-mono font-semibold flex items-center gap-1 cursor-pointer"
                    title="Adicionar ao Arquivo de Golpes Público"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Ingerir no Arquivo</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(r.ticketId, 'REJECTED')}
                    className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Descartar</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AdminModerationView: React.FC = () => {
  return <AdminReportsView />;
};
