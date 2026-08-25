import React, { useState, useEffect } from 'react';
import {
  Bell,
  Radio,
  Plus,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
  CheckCircle,
  Eye,
  Smartphone,
  Send,
  Zap,
  Volume2,
  Loader2
} from 'lucide-react';
import { ScamAlert, RiskLevel, ThreatStatus } from '../../../types';
import { AlertService } from '../../../services/dataService';
import { alertsApi } from '../../../services/api/alertsApi';
import { AuditLogService } from '../../../services/adminService';
import { RiskBadge } from '../../ui/RiskBadge';
import { StatusBadge } from '../../ui/StatusBadge';
import { SoundEngine } from '../../../services/audioService';

export const AdminAlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<ScamAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  // Form State
  const [headline, setHeadline] = useState('');
  const [warning, setWarning] = useState('');
  const [type, setType] = useState('PIX / ENGENHARIA SOCIAL');
  const [risk, setRisk] = useState<RiskLevel>('CRITICAL');
  const [urgent, setUrgent] = useState(true);
  const [recommendedAction, setRecommendedAction] = useState(
    'Validar sempre através do aplicativo ou canal oficial da instituição bancária.'
  );

  const fetchAlerts = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await alertsApi.getAlerts(undefined, signal);
      setAlerts(res.data || []);
    } catch {
      setAlerts(AlertService.getAllAlerts());
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchAlerts(controller.signal);
    return () => controller.abort();
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !warning) return;

    SoundEngine.playSuccessSound();
    const alertPayload: Partial<ScamAlert> = {
      type,
      headline,
      warning,
      risk,
      recommendedAction,
      urgent,
      status: 'ACTIVE',
      timestamp: new Date().toISOString()
    };

    let newAlert: ScamAlert;
    try {
      newAlert = await alertsApi.createAlert(alertPayload);
      setAlerts((prev) => [newAlert, ...prev]);
    } catch {
      newAlert = AlertService.createAlert({
        type,
        headline,
        warning,
        risk,
        recommendedAction,
        urgent
      });
      setAlerts(AlertService.getAllAlerts());
    }

    AuditLogService.log({
      user: 'admin',
      action: 'PUBLISH',
      entity: 'SCAM_ALERT',
      entityId: newAlert.alertNumber || newAlert.id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Transmitido alerta de emergência [${newAlert.alertNumber}]: ${newAlert.headline}`
    });

    setHeadline('');
    setWarning('');
    setBroadcastFeedback(`Alerta ${newAlert.alertNumber} transmitido para todos os canais com sucesso!`);
    setTimeout(() => setBroadcastFeedback(null), 5000);
  };

  const handleToggleStatus = async (id: string, currentStatus: ThreatStatus) => {
    const nextStatus: ThreatStatus = currentStatus === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE';
    SoundEngine.playKeyClick();
    try {
      await alertsApi.updateAlert(id, { status: nextStatus });
    } catch {}

    AlertService.updateAlert(id, { status: nextStatus });
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)));

    AuditLogService.log({
      user: 'admin',
      action: 'UPDATE',
      entity: 'SCAM_ALERT',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Status do alerta alterado para ${nextStatus}`
    });
  };

  const handleDelete = async (id: string) => {
    SoundEngine.playAlertSound();
    try {
      await alertsApi.deleteAlert(id);
    } catch {}

    AlertService.deleteAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));

    AuditLogService.log({
      user: 'admin',
      action: 'DELETE',
      entity: 'SCAM_ALERT',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Alerta ID ${id} excluído`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Central de Broadcast de Alertas & Push Defensivo
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Emissão em tempo real de avisos de golpe de alta gravidade, simulador de push e histórico de transmissões.
        </p>
      </div>

      {broadcastFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{broadcastFeedback}</span>
        </div>
      )}

      {/* Broadcast Form & Live Mobile Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Creator (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#E00000] animate-pulse" />
              <h2 className="text-sm font-mono font-bold text-white uppercase">
                Novo Broadcast de Emergência
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              DISPATCHER PRONTO
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-[#888888] mb-1">Título / Manchete do Alerta *</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Falsa Notificação do DETRAN com cobrança Pix imediata"
                className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#888888] mb-1">Tipo de Ameaça</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                >
                  <option value="PIX / ENGENHARIA SOCIAL">PIX / ENGENHARIA SOCIAL</option>
                  <option value="PHISHING BANCÁRIO">PHISHING BANCÁRIO</option>
                  <option value="FALSA CENTRAL TELEFÔNICA">FALSA CENTRAL TELEFÔNICA</option>
                  <option value="WHATSAPP CLONADO">WHATSAPP CLONADO</option>
                  <option value="GOLPE DO FALSO EMPREGO">GOLPE DO FALSO EMPREGO</option>
                  <option value="MALWARE BANCÁRIO">MALWARE BANCÁRIO</option>
                </select>
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Nível de Risco</label>
                <select
                  value={risk}
                  onChange={(e) => setRisk(e.target.value as RiskLevel)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Transmissão Urgente?</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="urgent-check"
                    checked={urgent}
                    onChange={(e) => setUrgent(e.target.checked)}
                    className="w-4 h-4 accent-[#E00000]"
                  />
                  <label htmlFor="urgent-check" className="text-white cursor-pointer select-none">
                    Flash Urgente
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#888888] mb-1">Texto de Advertência / Detalhes *</label>
              <textarea
                required
                rows={3}
                value={warning}
                onChange={(e) => setWarning(e.target.value)}
                placeholder="Descreva a mensagem que os golpistas usam e os sinais para identificação..."
                className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#888888] mb-1">Recomendação Defensiva Imediata</label>
              <input
                type="text"
                value={recommendedAction}
                onChange={(e) => setRecommendedAction(e.target.value)}
                placeholder="Ex: Não clique no link e consulte o site oficial do órgão."
                className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(224,0,0,0.4)] cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Transmitir Alerta</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Push Simulator (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#080808] border border-[#222222] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-xs font-mono text-[#888888] mb-3 self-start">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="uppercase font-bold">Simulação de Notificação Push PWA</span>
          </div>

          {/* Smartphone Mockup */}
          <div className="w-full max-w-sm rounded-3xl bg-[#050505] border-4 border-[#222222] p-3 shadow-2xl space-y-3 font-mono">
            <div className="w-20 h-1 bg-[#333333] rounded-full mx-auto mb-2"></div>

            {/* Notification Card */}
            <div className="p-3 rounded-2xl bg-[#181818]/90 border border-[#333333] shadow-lg space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-[#E00000] flex items-center justify-center text-[9px] text-white font-bold">
                    Ω
                  </div>
                  <span className="text-[10px] text-white font-bold">E GUI 404 ALERTA</span>
                </div>
                <span className="text-[9px] text-[#777777]">Agora</span>
              </div>

              <div className="text-xs font-bold text-white line-clamp-1">
                {headline || 'Exemplo: Falsa Intimação da Receita Federal'}
              </div>

              <p className="text-[11px] text-[#AAAAAA] line-clamp-2">
                {warning || 'Disparo massivo de e-mails com arquivos maliciosos anexados simulando cobrança de imposto.'}
              </p>

              <div className="pt-1 flex items-center justify-between text-[9px]">
                <RiskBadge level={risk} />
                <span className="text-cyan-400 underline">Abrir Dossiê</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-[#555555] pt-2">
              Preview em tela de bloqueio e feed em tempo real
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History Table */}
      <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
          <h3 className="text-sm font-mono font-bold text-white uppercase">
            Histórico de Alertas Broadcasted ({alerts.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141414] text-[#888888] uppercase text-[10px] border-b border-[#222222]">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Manchete</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Risco</th>
                <th className="p-3">Status</th>
                <th className="p-3">Data</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C1C1C]">
              {alerts.map((al) => (
                <tr key={al.id} className="hover:bg-[#121212] transition-colors">
                  <td className="p-3 font-bold text-[#E00000]">{al.alertNumber}</td>
                  <td className="p-3 text-white max-w-xs truncate">{al.headline}</td>
                  <td className="p-3 text-[#AAAAAA]">{al.type}</td>
                  <td className="p-3">
                    <RiskBadge level={al.risk} />
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(al.id, al.status)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        al.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-[#222222] text-[#888888]'
                      }`}
                    >
                      {al.status}
                    </button>
                  </td>
                  <td className="p-3 text-[#777777]">{al.date}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(al.id)}
                      className="p-1.5 rounded text-[#888888] hover:text-red-400 hover:bg-[#222222]"
                      title="Excluir Alerta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
