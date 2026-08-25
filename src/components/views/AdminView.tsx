import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Flame,
  FileCheck,
  Bell,
  Activity,
  CheckCircle,
  XCircle,
  Lock,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  Database,
  ExternalLink,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { ScamService, ThreatService, AlertService, ScamReportService } from '../../services/dataService';
import { RnpRepository } from '../../services/rnp/rnpRepository';
import { RnpImportLog, RnpSyncStats } from '../../services/rnp/rnpTypes';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { SoundEngine } from '../../services/audioService';

interface AdminViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, language }) => {
  const [adminTab, setAdminTab] = useState<'METRICS' | 'REPORTS' | 'NEW_ALERT' | 'SOURCES_SYNC' | 'LOGS'>('METRICS');
  const [reports, setReports] = useState(ScamReportService.getAllReports());

  // RNP Sync State
  const [syncStats, setSyncStats] = useState<RnpSyncStats>(() => RnpRepository.getSyncStats());
  const [syncLogs, setSyncLogs] = useState<RnpImportLog[]>(() => RnpRepository.getSyncLogs());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncConfirm, setShowSyncConfirm] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // New Alert State
  const [newHeadline, setNewHeadline] = useState('');
  const [newWarning, setNewWarning] = useState('');
  const [newType, setNewType] = useState('PIX / ENGENHARIA SOCIAL');
  const [newRisk, setNewRisk] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('CRITICAL');
  const [alertSuccess, setAlertSuccess] = useState(false);

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline || !newWarning) return;

    SoundEngine.playSuccessSound();
    AlertService.createAlert({
      type: newType,
      headline: newHeadline,
      warning: newWarning,
      risk: newRisk,
      recommendedAction: 'Validar sempre através do aplicativo ou canal oficial da instituição bancária.',
      urgent: newRisk === 'CRITICAL'
    });

    setAlertSuccess(true);
    setNewHeadline('');
    setNewWarning('');
    setTimeout(() => setAlertSuccess(false), 3000);
  };

  const handleApproveReport = (id: string) => {
    SoundEngine.playSuccessSound();
    ScamReportService.updateReportStatus(id, 'APPROVED');
    setReports(ScamReportService.getAllReports());
  };

  const handleRejectReport = (id: string) => {
    SoundEngine.playAlertSound();
    ScamReportService.updateReportStatus(id, 'REJECTED');
    setReports(ScamReportService.getAllReports());
  };

  const handleTriggerRnpSync = async () => {
    setShowSyncConfirm(false);
    setIsSyncing(true);
    SoundEngine.playKeyClick();

    try {
      const result = await RnpRepository.runManualSync();
      setSyncStats(result.stats);
      setSyncLogs(RnpRepository.getSyncLogs());
      SoundEngine.playSuccessSound();
      setSyncFeedback(`Sincronização concluída com sucesso! ${result.log.recordsDiscovered} descobertos, ${result.log.recordsCreated} novos, ${result.log.recordsUpdated} atualizados.`);
    } catch (e) {
      SoundEngine.playAlertSound();
      setSyncFeedback('Erro ao sincronizar repositório. Tente novamente.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-tech text-xs">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
            <Lock className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">INTEL OPS & COCKPIT // INTERNAL PREVIEW</span>
          </div>
          <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded text-[10px]">
            CLEARANCE: LEVEL_4_DEFENSIVE
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          OPERATIONAL INTEL COCKPIT
        </h1>
        <p className="text-neutral-400 font-sans text-xs sm:text-sm">
          Painel de triagem de incidentes, moderação de denúncias, sincronização de Threat Intelligence e telemetria defensiva.
        </p>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1c1c1c] pb-3 overflow-x-auto">
        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setAdminTab('METRICS');
          }}
          className={`px-4 py-2 rounded font-bold uppercase tracking-wider flex items-center gap-2 ${
            adminTab === 'METRICS' ? 'bg-[#E00000] text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>TELEMETRIA GERAL</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setAdminTab('SOURCES_SYNC');
          }}
          className={`px-4 py-2 rounded font-bold uppercase tracking-wider flex items-center gap-2 ${
            adminTab === 'SOURCES_SYNC' ? 'bg-[#E00000] text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>FONTES & SYNC RNP/CAIS</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setAdminTab('REPORTS');
          }}
          className={`px-4 py-2 rounded font-bold uppercase tracking-wider flex items-center gap-2 ${
            adminTab === 'REPORTS' ? 'bg-[#E00000] text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>FILA DE DENÚNCIAS ({reports.filter((r) => r.status === 'PENDING').length})</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setAdminTab('NEW_ALERT');
          }}
          className={`px-4 py-2 rounded font-bold uppercase tracking-wider flex items-center gap-2 ${
            adminTab === 'NEW_ALERT' ? 'bg-[#E00000] text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>EMITIR SCAM ALERT</span>
        </button>

        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            setAdminTab('LOGS');
          }}
          className={`px-4 py-2 rounded font-bold uppercase tracking-wider flex items-center gap-2 ${
            adminTab === 'LOGS' ? 'bg-[#E00000] text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>LOGS DE SISTEMA</span>
        </button>
      </div>

      {/* TAB 1: METRICS */}
      {adminTab === 'METRICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">ALERTAS ATIVOS EM BROADCAST</span>
              <span className="font-display text-3xl text-[#FF1A1A]">{AlertService.getActiveAlerts().length}</span>
              <span className="text-[10px] text-emerald-400 block">Sinal em tempo real</span>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">REGISTROS RNP/CAIS INDEXADOS</span>
              <span className="font-display text-3xl text-white">{RnpRepository.getAllScams().length}</span>
              <span className="text-[10px] text-[#FF5555] block">Catálogo Oficial de Fraudes</span>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">DENÚNCIAS PENDENTES</span>
              <span className="font-display text-3xl text-amber-400">
                {reports.filter((r) => r.status === 'PENDING').length}
              </span>
              <span className="text-[10px] text-neutral-400 block">Requer triagem analítica</span>
            </div>

            <div className="p-4 bg-[#0a0a0a] border border-[#222] rounded space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase">STATUS DO NÓ DEFENSIVO</span>
              <span className="font-display text-2xl text-emerald-400">OPERACIONAL</span>
              <span className="text-[10px] text-neutral-400 block">Latência: 12ms · 0 falhas</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THREAT INTEL SOURCES & RNP SYNC COCKPIT */}
      {adminTab === 'SOURCES_SYNC' && (
        <div className="space-y-6">
          {syncFeedback && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded font-sans text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Sync Header Box */}
          <div className="hud-card bg-[#0a0808] border border-[#2b1212] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#FF5555]">
                  <Database className="w-4 h-4" />
                  <span className="font-bold tracking-widest uppercase">
                    THREAT INTELLIGENCE SYNC ENGINE // RNP / CAIS
                  </span>
                </div>
                <h3 className="font-display text-2xl text-white mt-1">
                  Catálogo de Fraudes RNP/CAIS
                </h3>
                <p className="text-neutral-400 font-sans text-xs mt-1">
                  Serviço de importação e normalização defensiva com desativação de links e sanitização estrita.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate('/archive/sources/rnp-cais');
                  }}
                  className="px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver Página da Fonte</span>
                </button>

                <button
                  onClick={() => setShowSyncConfirm(true)}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(224,0,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'SINCRONIZANDO...' : 'EXECUTAR SYNC AGORA'}</span>
                </button>
              </div>
            </div>

            {/* Live Stats Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-[#220d0d] font-tech text-xs">
              <div className="p-3 bg-[#060404] rounded border border-[#1c0a0a]">
                <span className="text-[9px] text-neutral-500 uppercase block">DESCOBERTOS</span>
                <span className="text-white font-bold text-base">{syncStats.totalDiscovered}</span>
              </div>
              <div className="p-3 bg-[#060404] rounded border border-[#1c0a0a]">
                <span className="text-[9px] text-neutral-500 uppercase block">NOVOS</span>
                <span className="text-emerald-400 font-bold text-base">{syncStats.newRecords}</span>
              </div>
              <div className="p-3 bg-[#060404] rounded border border-[#1c0a0a]">
                <span className="text-[9px] text-neutral-500 uppercase block">ATUALIZADOS</span>
                <span className="text-blue-400 font-bold text-base">{syncStats.updatedRecords}</span>
              </div>
              <div className="p-3 bg-[#060404] rounded border border-[#1c0a0a]">
                <span className="text-[9px] text-neutral-500 uppercase block">INALTERADOS</span>
                <span className="text-neutral-400 font-bold text-base">{syncStats.unchangedRecords}</span>
              </div>
              <div className="p-3 bg-[#060404] rounded border border-[#1c0a0a]">
                <span className="text-[9px] text-neutral-500 uppercase block">DUPLICADOS</span>
                <span className="text-neutral-400 font-bold text-base">{syncStats.duplicates}</span>
              </div>
              <div className="p-3 bg-[#060404] rounded border border-[#1c0a0a]">
                <span className="text-[9px] text-neutral-500 uppercase block">ERROS / PULADOS</span>
                <span className="text-emerald-400 font-bold text-base">0 / 0</span>
              </div>
            </div>
          </div>

          {/* Sync History Logs */}
          <div className="space-y-3">
            <h4 className="font-tech text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>HISTÓRICO DE EXECUÇÕES DE SINCRONIZAÇÃO (IMPORT LOGS)</span>
              <span className="text-xs text-neutral-500 font-mono">Retenção: Últimas 20 execuções</span>
            </h4>

            <div className="bg-[#090909] border border-[#1f1f1f] rounded-lg overflow-hidden font-mono text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#121212] text-neutral-400 text-[10px] uppercase border-b border-[#222]">
                      <th className="p-3">ID DO LOG</th>
                      <th className="p-3">FONTE</th>
                      <th className="p-3">INÍCIO</th>
                      <th className="p-3">FIM</th>
                      <th className="p-3">DESCOBERTOS</th>
                      <th className="p-3">NOVOS</th>
                      <th className="p-3">ATUALIZADOS</th>
                      <th className="p-3">TRIGGER</th>
                      <th className="p-3">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181818] text-neutral-300">
                    {syncLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#111] transition-colors">
                        <td className="p-3 font-bold text-[#FF5555]">{log.id}</td>
                        <td className="p-3 font-sans text-white">{log.source}</td>
                        <td className="p-3 text-neutral-400">{log.startedAt}</td>
                        <td className="p-3 text-neutral-400">{log.finishedAt}</td>
                        <td className="p-3 font-bold">{log.recordsDiscovered}</td>
                        <td className="p-3 text-emerald-400 font-bold">+{log.recordsCreated}</td>
                        <td className="p-3 text-blue-400">{log.recordsUpdated}</td>
                        <td className="p-3 text-neutral-400 text-[10px]">{log.trigger}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                : 'bg-red-950 text-red-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS QUEUE */}
      {adminTab === 'REPORTS' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            FILA DE TRIAGEM DE DENÚNCIAS RECEBIDAS
          </h3>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded space-y-3 font-sans"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap font-tech text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold">{rep.ticketId}</span>
                    <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-white uppercase font-bold rounded">
                      {rep.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">{rep.timestamp}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-tech uppercase ${
                        rep.status === 'PENDING'
                          ? 'bg-amber-950 text-amber-300'
                          : rep.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-red-950 text-red-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-200 bg-[#060606] p-3 rounded border border-[#181818]">
                  {rep.description}
                </p>

                {rep.indicators.length > 0 && (
                  <div className="text-[11px] text-[#FF9999] font-mono">
                    INDICADORES INFORMADOS: {rep.indicators.join(' · ')}
                  </div>
                )}

                {rep.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-2 font-tech">
                    <button
                      onClick={() => handleRejectReport(rep.id)}
                      className="px-3 py-1.5 bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 rounded font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      REJEITAR / SPAM
                    </button>
                    <button
                      onClick={() => handleApproveReport(rep.id)}
                      className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 rounded font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      APROVAR PARA O ACERVO
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NEW ALERT */}
      {adminTab === 'NEW_ALERT' && (
        <form onSubmit={handleCreateAlert} className="hud-card bg-[#090909] border border-[#222] rounded-lg p-6 space-y-4 font-tech">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            EMISSÃO DE NOVO SCAM ALERT PÚBLICO
          </h3>

          {alertSuccess && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded font-sans">
              Scam Alert emitido e transmitido para a Home e feed com sucesso!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 block mb-1">TIPO / CANAL DA AMEAÇA</label>
              <input
                type="text"
                required
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">NÍVEL DE RISCO</label>
              <select
                value={newRisk}
                onChange={(e) => setNewRisk(e.target.value as any)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">MANCHETE / HEADLINE</label>
            <input
              type="text"
              required
              value={newHeadline}
              onChange={(e) => setNewHeadline(e.target.value)}
              placeholder="Ex: Falsa Intimação da Receita Federal por E-mail..."
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">ALERTA OPERACIONAL (WARNING TEXT)</label>
            <textarea
              required
              rows={3}
              value={newWarning}
              onChange={(e) => setNewWarning(e.target.value)}
              placeholder="Descreva a orientação urgente para que a população não caia no golpe..."
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-white font-sans"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold uppercase transition-all cursor-pointer"
          >
            TRANSMITIR ALERTA AGORA
          </button>
        </form>
      )}

      {/* TAB 5: LOGS */}
      {adminTab === 'LOGS' && (
        <div className="p-4 bg-[#050505] border border-[#1f1f1f] rounded font-mono text-xs text-neutral-400 space-y-1.5">
          <p className="text-neutral-500">[2026-08-25 14:02:11] SYSTEM_DAEMON initialized on port 3000</p>
          <p className="text-neutral-500">[2026-08-25 14:03:00] THREAT_MATRIX synched with RNP/CAIS catalog index</p>
          <p className="text-emerald-500">[2026-08-25 14:05:22] LGPD_ANONYMIZER service active (Zero PII stored)</p>
          <p className="text-[#FF5555]">[2026-08-25 14:10:44] RNP_SYNC_JOB completed (0 errors, 6 verified catalog items)</p>
        </div>
      )}

      {/* Sync Confirmation Modal */}
      {showSyncConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#0a0808] border-2 border-[#E00000] rounded-lg p-6 space-y-4 font-tech text-neutral-300">
            <div className="flex items-center gap-2 text-[#FF5555] font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>CONFIRMAR SINCRONIZAÇÃO RNP/CAIS</span>
            </div>
            <p className="font-sans text-xs text-neutral-300 leading-relaxed">
              Deseja iniciar a consulta e atualização dos metadados públicos do Catálogo de Fraudes RNP/CAIS?
              Todos os links maliciosos serão higienizados e os identificadores originais serão preservados.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSyncConfirm(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded font-bold cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                onClick={handleTriggerRnpSync}
                className="px-4 py-2 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold cursor-pointer"
              >
                CONFIRMAR E SINCRONIZAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
