import React, { useState } from 'react';
import {
  Flame,
  Shield,
  Activity,
  Filter,
  ExternalLink,
  Cpu,
  AlertTriangle,
  FileCode,
  Radio,
  CheckCircle,
  Eye
} from 'lucide-react';
import { ThreatService } from '../../services/dataService';
import { ThreatItem, ThreatStatus, RiskLevel } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface ThreatsViewProps {
  initialThreatId?: string;
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const ThreatsView: React.FC<ThreatsViewProps> = ({ initialThreatId, onNavigate, language }) => {
  const threats = ThreatService.getAllThreats();
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem>(() => {
    if (initialThreatId) {
      const found = ThreatService.getThreatById(initialThreatId);
      if (found) return found;
    }
    return threats[0];
  });
  const [statusFilter, setStatusFilter] = useState<ThreatStatus | 'ALL'>('ALL');

  const filteredThreats = threats.filter((t) => (statusFilter === 'ALL' ? true : t.status === statusFilter));

  const stats = {
    active: threats.filter((t) => t.status === 'ACTIVE').length,
    monitored: threats.filter((t) => t.status === 'MONITORED').length,
    resolved: threats.filter((t) => t.status === 'RESOLVED').length,
    highRisk: threats.filter((t) => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-tech">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Flame className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">LIVE DEFENSIVE TELEMETRY</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          THREAT INTELLIGENCE MATRIX
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Painel público de inteligência contra ameaças em tempo real. Padrões comportamentais, vetores de ataque e indicadores de compromisso defensivos (IOCs).
        </p>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">ACTIVE THREATS</span>
            <span className="font-display text-3xl text-[#FF1A1A]">{stats.active}</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-[#FF1A1A] radar-beacon" />
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">MONITORED</span>
            <span className="font-display text-3xl text-blue-400">{stats.monitored}</span>
          </div>
          <Activity className="w-4 h-4 text-blue-400" />
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">HIGH / CRITICAL RISK</span>
            <span className="font-display text-3xl text-amber-400">{stats.highRisk}</span>
          </div>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>

        <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase block font-bold">RESOLVED / NEUTRALIZED</span>
            <span className="font-display text-3xl text-emerald-400">{stats.resolved}</span>
          </div>
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Main Threat Workbench (List on left, detail on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Threat List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c1c1c]">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              AMEAÇAS OBSERVADAS ({filteredThreats.length})
            </span>
            <div className="flex items-center gap-1 text-[10px]">
              {(['ALL', 'ACTIVE', 'MONITORED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded ${
                    statusFilter === st ? 'bg-[#E00000] text-white' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredThreats.map((threat) => {
              const isSelected = selectedThreat.id === threat.id;
              return (
                <div
                  key={threat.id}
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    setSelectedThreat(threat);
                  }}
                  className={`p-4 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#140808] border-[#E00000] shadow-[0_0_15px_rgba(224,0,0,0.15)]'
                      : 'bg-[#0a0a0a] border-[#1c1c1c] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <span className="text-[#FF1A1A] font-bold">[{threat.threatCode}]</span>
                    <RiskBadge level={threat.riskLevel} className="text-[9px]" />
                  </div>

                  <h3 className="font-sans font-bold text-sm text-white line-clamp-1 mb-1">
                    {threat.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-[#181818]">
                    <span>{threat.category}</span>
                    <span className="font-bold text-neutral-400">SEVERIDADE: {threat.severityScore}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Threat Deep Dive Dossier */}
        <div className="lg:col-span-7">
          {selectedThreat && (
            <div className="hud-card bg-[#090909] border border-[#262626] rounded-lg p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-[#1c1c1c] pb-4 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#FF1A1A]">[{selectedThreat.threatCode}]</span>
                    <StatusBadge status={selectedThreat.status} />
                  </div>
                  <RiskBadge level={selectedThreat.riskLevel} />
                </div>

                <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
                  {selectedThreat.title}
                </h2>

                <div className="flex items-center gap-4 text-xs text-neutral-500 font-tech">
                  <span>PRIMEIRO SINAL: {selectedThreat.firstObserved}</span>
                  <span>ÚLTIMO REGISTRO: {selectedThreat.lastUpdated}</span>
                </div>
              </div>

              {/* Severity Gauge Meter */}
              <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-bold uppercase">ÍNDICE DE GRAVIDADE / IMPACTO:</span>
                  <span className="text-[#FF1A1A] font-bold text-sm">{selectedThreat.severityScore}/100</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-[#E00000]"
                    style={{ width: `${selectedThreat.severityScore}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
                  RESUMO DA AMEAÇA
                </h4>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed bg-[#0c0c0c] p-4 rounded border border-[#1a1a1a]">
                  {selectedThreat.summary}
                </p>
              </div>

              {/* Target Vectors */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  VETORES DE ENTRADA / TARGET VECTORS
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedThreat.targetVectors.map((vec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-200 rounded text-xs"
                    >
                      {vec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Safe Defensive Indicators (IOCs format) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#FF5555] uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" /> PADRÕES E INDICADORES DIDÁTICOS (IOCS SEGUROS)
                </h4>
                <div className="space-y-2">
                  {selectedThreat.safeIndicators.map((ioc, idx) => (
                    <div key={idx} className="p-3 bg-[#110c0c] border border-[#2b1616] rounded text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-bold text-[#FF7777]">{ioc.type}</span>
                        <span>INDICADOR #{idx + 1}</span>
                      </div>
                      <p className="text-neutral-200 font-mono text-xs break-all bg-black/40 p-1.5 rounded">
                        {ioc.value}
                      </p>
                      <p className="text-[11px] text-neutral-400 font-sans italic">{ioc.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mitigation & Public Sources */}
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-4 h-4" /> DIRETRIZ DE MITIGAÇÃO DEFENSIVA
                </h4>
                <p className="text-xs font-sans text-neutral-200 leading-relaxed">
                  {selectedThreat.mitigationSummary}
                </p>
              </div>

              {/* Sources */}
              <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-neutral-500">
                <span>FONTES: {selectedThreat.sources.map((s) => s.title).join(' · ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
