import React from 'react';
import { ShieldAlert, AlertTriangle, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { AlertService } from '../../services/dataService';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface AlertsViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AlertsView: React.FC<AlertsViewProps> = ({ onNavigate, language }) => {
  const alerts = AlertService.getAllAlerts();

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
    </div>
  );
};
