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
  Sliders
} from 'lucide-react';
import { ScamService, ThreatService, AlertService, ScamReportService } from '../../services/dataService';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { SoundEngine } from '../../services/audioService';

interface AdminViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, language }) => {
  const [adminTab, setAdminTab] = useState<'METRICS' | 'REPORTS' | 'NEW_ALERT' | 'LOGS'>('METRICS');
  const [reports, setReports] = useState(ScamReportService.getAllReports());

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
          Painel de triagem de incidentes, moderação de denúncias, emissão de alertas comunitários e telemetria defensiva.
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
              <span className="text-[10px] text-neutral-500 uppercase">AMEAÇAS CATALOGADAS</span>
              <span className="font-display text-3xl text-white">{ThreatService.getAllThreats().length}</span>
              <span className="text-[10px] text-neutral-400 block">Assinaturas defensivas</span>
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

      {/* TAB 2: REPORTS QUEUE */}
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
                      className="px-3 py-1.5 bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 rounded font-bold transition-colors flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      REJEITAR / SPAM
                    </button>
                    <button
                      onClick={() => handleApproveReport(rep.id)}
                      className="px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 rounded font-bold transition-colors flex items-center gap-1"
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

      {/* TAB 3: NEW ALERT */}
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
            className="px-6 py-2.5 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold uppercase transition-all"
          >
            TRANSMITIR ALERTA AGORA
          </button>
        </form>
      )}

      {/* TAB 4: LOGS */}
      {adminTab === 'LOGS' && (
        <div className="p-4 bg-[#050505] border border-[#1f1f1f] rounded font-mono text-xs text-neutral-400 space-y-1.5">
          <p className="text-neutral-500">[2026-02-25 14:02:11] SYSTEM_DAEMON initialized on port 3000</p>
          <p className="text-neutral-500">[2026-02-25 14:03:00] THREAT_MATRIX synched with public CERT feeds</p>
          <p className="text-emerald-500">[2026-02-25 14:05:22] LGPD_ANONYMIZER service active (Zero PII stored)</p>
          <p className="text-[#FF5555]">[2026-02-25 14:10:44] NEW_ALERT #0042 published to Scam Alert Broadcast</p>
        </div>
      )}
    </div>
  );
};
