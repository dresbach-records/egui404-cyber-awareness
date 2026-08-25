import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Search,
  Users,
  Shield,
  Activity,
  Globe,
  Smartphone,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { AdminAnalyticsService } from '../../../services/adminService';

export const AdminAnalyticsView: React.FC = () => {
  const [topSearches] = useState(() => AdminAnalyticsService.getTopSearches());
  const [activePlatform] = useState(() => AdminAnalyticsService.getPlatformStats());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Telemetria, Inteligência de Busca & Engajamento
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Monitoramento em tempo real dos termos mais buscados pela população e métricas de impacto de prevenção.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] font-mono text-[#777777] uppercase">Consultas Defensivas Hoje</span>
          <div className="text-2xl font-['Bebas_Neue'] text-white">4,892</div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs semana anterior
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] font-mono text-[#777777] uppercase">Instalações PWA Ativas</span>
          <div className="text-2xl font-['Bebas_Neue'] text-cyan-400">1,248</div>
          <div className="text-[10px] font-mono text-[#888888]">Desktop, iOS e Android</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] font-mono text-[#777777] uppercase">Alertas Push Entregues</span>
          <div className="text-2xl font-['Bebas_Neue'] text-orange-400">18,340</div>
          <div className="text-[10px] font-mono text-[#888888]">Taxa de abertura 74.2%</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-1">
          <span className="text-[10px] font-mono text-[#777777] uppercase">Tempo Médio de Resposta Triagem</span>
          <div className="text-2xl font-['Bebas_Neue'] text-emerald-400">14 min</div>
          <div className="text-[10px] font-mono text-[#888888]">Fila 100% monitorada</div>
        </div>
      </div>

      {/* Grid: Top Search Queries & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Search Queries */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#E00000]" />
              <h3 className="text-sm font-mono font-bold text-white uppercase">
                Termos Mais Pesquisados (Radar de Golpes)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#777777]">Últimos 7 dias</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {topSearches.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-[#141414] border border-[#222222] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span className="text-[#666666]">#{idx + 1}</span> {item.term}
                  </span>
                  <span className="text-cyan-400 font-bold">{item.count} buscas</span>
                </div>
                <div className="h-1.5 w-full bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E00000] rounded-full"
                    style={{ width: `${Math.min(100, (item.count / 1500) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Device & Channel Breakdown */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white uppercase">
                Distribuição por Plataforma
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              PWA ENABLED
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <div className="flex items-center justify-between text-white">
                <span>Smartphones (Android & iOS Web/PWA)</span>
                <span className="font-bold">64.8%</span>
              </div>
              <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '64.8%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <div className="flex items-center justify-between text-white">
                <span>Desktop & Notebook (Windows / macOS / Linux)</span>
                <span className="font-bold">29.4%</span>
              </div>
              <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                <div className="h-full bg-[#E00000] rounded-full" style={{ width: '29.4%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] space-y-2">
              <div className="flex items-center justify-between text-white">
                <span>Tablets & Outros Dispositivos</span>
                <span className="font-bold">5.8%</span>
              </div>
              <div className="h-2 bg-[#222222] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '5.8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
