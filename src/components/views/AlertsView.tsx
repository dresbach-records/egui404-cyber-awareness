import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, Clock, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { alertsApi } from '../../services/api/alertsApi';
import { ScamAlert } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface AlertsViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigate, language }) => {
  const [alerts, setAlerts] = useState<ScamAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await alertsApi.getAlerts({}, signal);
      setAlerts(res.data || []);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Falha ao carregar boletins de alerta.');
      }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-tech">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <ShieldAlert className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">CRITICAL WARNING BULLETINS</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          SCAM ALERTS & BOLETINS
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Comunicados urgentes de fraudes emergentes, campanhas massivas de phishing e novas ondas de engenharia social direcionadas a cidadãos e empresas.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 bg-[#090909] border border-[#1f1f1f] rounded-lg animate-pulse space-y-4">
              <div className="w-32 h-5 bg-[#222] rounded" />
              <div className="w-3/4 h-6 bg-[#222] rounded" />
              <div className="w-full h-16 bg-[#161616] rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#140808] border border-[#3b1515] rounded-lg p-6 space-y-3">
          <AlertTriangle className="w-10 h-10 mx-auto text-[#FF4D4D]" />
          <h3 className="text-white text-lg font-bold">Erro ao carregar boletins</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchAlerts()}
            className="mt-4 px-4 py-2 bg-[#E00000] text-white rounded text-xs hover:bg-[#FF1A1A] font-bold flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-16 bg-[#080808] border border-[#1a1a1a] rounded-lg">
          <ShieldAlert className="w-10 h-10 mx-auto text-neutral-600 mb-3" />
          <h3 className="text-white text-lg font-bold">Nenhum alerta ativo no momento</h3>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="hud-card bg-[#090909] border-2 border-[#E00000]/60 hover:border-[#E00000] rounded-lg p-6 sm:p-8 space-y-6 transition-all"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#1c1c1c] pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#E00000] text-white text-xs font-bold uppercase tracking-wider rounded">
                    SCAM ALERT {alert.alertNumber}
                  </span>
                  <RiskBadge level={alert.risk} />
                  <StatusBadge status={alert.status} />
                </div>
                <span className="text-xs text-neutral-400 font-mono">EMITIDO EM: {alert.date}</span>
              </div>

              <div className="space-y-2 font-sans">
                <span className="text-xs font-tech text-[#FF5555] uppercase font-bold tracking-wider">
                  VETOR: {alert.type}
                </span>
                <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
                  {alert.headline}
                </h2>
              </div>

              <div className="p-4 bg-[#1b0808] border-l-4 border-[#FF1A1A] rounded text-xs sm:text-sm text-[#FFC4C4] font-sans leading-relaxed">
                <b className="font-tech text-[#FF5555] uppercase block mb-1">ALERTA OPERACIONAL:</b>
                "{alert.warning}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded space-y-2">
                  <b className="font-tech text-neutral-300 uppercase block">CANAL DO GOLPE:</b>
                  <p className="text-neutral-400">{alert.type}</p>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded space-y-2">
                  <b className="font-tech text-emerald-400 uppercase block">RECOMENDAÇÃO DEFENSIVA IMEDIATA:</b>
                  <p className="text-neutral-200">
                    Bloqueie o remetente, não clique em links recebidos e valide sempre através do aplicativo ou canal oficial da instituição.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
