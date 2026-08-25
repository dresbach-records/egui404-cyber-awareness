import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flame,
  FileText,
  BookOpen,
  ArrowRight,
  Terminal as TerminalIcon,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock,
  Cpu,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { scamsApi } from '../../services/api/scamsApi';
import { threatsApi } from '../../services/api/threatsApi';
import { casesApi } from '../../services/api/casesApi';
import { alertsApi } from '../../services/api/alertsApi';
import { analyticsApi } from '../../services/api/analyticsApi';
import { ScamItem, ThreatItem, CaseFile, ScamAlert } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CyberCard } from '../ui/CyberCard';
import { Terminal } from '../ui/Terminal';
import { SoundEngine } from '../../services/audioService';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, language }) => {
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);

  const [loading, setLoading] = useState(true);
  const [featuredScams, setFeaturedScams] = useState<ScamItem[]>([]);
  const [featuredThreats, setFeaturedThreats] = useState<ThreatItem[]>([]);
  const [featuredCases, setFeaturedCases] = useState<CaseFile[]>([]);
  const [latestAlert, setLatestAlert] = useState<ScamAlert | null>(null);
  const [stats, setStats] = useState<{
    threatsDocumented: number;
    casesAnalyzed: number;
    scamCategories: number;
    safetyGuides: number;
    alertsBroadcasted: number;
    scenariosTested: number;
  }>({
    threatsDocumented: 0,
    casesAnalyzed: 0,
    scamCategories: 18,
    safetyGuides: 0,
    alertsBroadcasted: 0,
    scenariosTested: 12
  });

  const loadData = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const [scamsRes, threatsRes, casesRes, alertsRes, dashboardRes] = await Promise.allSettled([
        scamsApi.getScams({ limit: 4 }, signal),
        threatsApi.getThreats({ limit: 3 }, signal),
        casesApi.getCases({ limit: 2 }, signal),
        alertsApi.getAlerts({ limit: 1 }, signal),
        analyticsApi.getDashboard(signal)
      ]);

      if (scamsRes.status === 'fulfilled') {
        setFeaturedScams(scamsRes.value.data || []);
      }
      if (threatsRes.status === 'fulfilled') {
        setFeaturedThreats(threatsRes.value.data || []);
      }
      if (casesRes.status === 'fulfilled') {
        setFeaturedCases(casesRes.value.data || []);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value.data.length > 0) {
        setLatestAlert(alertsRes.value.data[0]);
      }
      if (dashboardRes.status === 'fulfilled' && dashboardRes.value) {
        const d = dashboardRes.value;
        setStats({
          threatsDocumented: d.totalScams || (scamsRes.status === 'fulfilled' ? scamsRes.value.data.length : 0),
          casesAnalyzed: d.totalCases || (casesRes.status === 'fulfilled' ? casesRes.value.data.length : 0),
          scamCategories: 18,
          safetyGuides: d.totalArticles || 10,
          alertsBroadcasted: d.activeAlerts || (alertsRes.status === 'fulfilled' ? alertsRes.value.data.length : 0),
          scenariosTested: 12
        });
      }
    } catch {
      // Handled cleanly with empty/fallback states
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, []);

  // Cinematic Boot Sequence
  const bootMessages = [
    'INITIALIZING E_GUI_404...',
    'LOADING THREAT DATABASE...',
    'IDENTITY: UNKNOWN',
    'TRACE: 404 NOT FOUND',
    'SIGNAL: ACTIVE',
    'STATUS: ONLINE'
  ];

  useEffect(() => {
    // Only run full boot on first visit, or allow quick skip
    const hasBooted = sessionStorage.getItem('egui404_booted');
    if (hasBooted) {
      setBooting(false);
      return;
    }

    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev < bootMessages.length - 1) {
          SoundEngine.playKeyClick();
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setBooting(false);
            sessionStorage.setItem('egui404_booted', 'true');
            SoundEngine.playSuccessSound();
          }, 400);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, []);

  const skipBoot = () => {
    setBooting(false);
    sessionStorage.setItem('egui404_booted', 'true');
  };

  if (booting) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 font-tech">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-[#222222] p-6 rounded shadow-2xl relative">
          <div className="flex items-center justify-between mb-4 border-b border-[#1c1c1c] pb-2">
            <span className="text-xs text-[#FF1A1A] font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-ping" />
              SYSTEM_BOOT // E_GUI_404
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">v2.6</span>
          </div>

          <div className="space-y-2 mb-6 min-h-[140px]">
            {bootMessages.slice(0, bootStep + 1).map((msg, i) => (
              <div key={i} className="text-xs flex items-center gap-2 text-neutral-300 font-tech">
                <span className="text-[#E00000]">&gt;</span>
                <span className={i === bootStep ? 'text-white font-bold' : 'text-neutral-400'}>{msg}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#181818]">
            <span className="text-[11px] text-neutral-500 animate-pulse">Carregando módulos defensivos...</span>
            <button
              onClick={skipBoot}
              className="text-[11px] text-neutral-400 hover:text-white px-2 py-1 bg-neutral-900 border border-neutral-800 rounded transition-colors"
            >
              Pular Inicialização ↵
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-20">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden border-b border-[#1a1a1a] cyber-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Classification Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E00000]/10 border border-[#E00000]/30 text-xs font-tech text-[#FF5555]">
                <span className="w-2 h-2 rounded-full bg-[#FF1A1A] animate-pulse" />
                <span className="tracking-widest uppercase font-bold">CYBER CRIME AWARENESS & INTELLIGENCE</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl text-white tracking-wider uppercase leading-none">
                  E GUI 404 <span className="text-[#FF1A1A]">· 恶鬼</span>
                </h1>
                <p className="font-tech text-lg sm:text-xl text-[#FF4D4D] font-semibold tracking-wide">
                  "Conheça o golpe antes que ele conheça você."
                </p>
                <p className="text-xs font-tech text-neutral-500 tracking-widest uppercase">
                  "Know the threat before it knows you." · EXPOSE. EDUCATE. PROTECT.
                </p>
              </div>

              {/* Subtext */}
              <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed max-w-xl">
                Plataforma independente de inteligência contra fraudes digitais. Mapeamos os padrões de engenharia social,
                phishing e golpes financeiros em circulação para transformar sinais de ameaça em defesa proativa.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate('/archive');
                  }}
                  className="px-6 py-3 bg-[#E00000] text-white hover:bg-[#FF1A1A] rounded font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(224,0,0,0.3)] hover:shadow-[0_0_30px_rgba(224,0,0,0.5)]"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>ENTER THE ARCHIVE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate('/threats');
                  }}
                  className="px-6 py-3 bg-neutral-900 border border-neutral-700 text-white hover:border-[#FF1A1A] rounded font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-[#FF1A1A]" />
                  <span>EXPLORE THREATS</span>
                </button>

                <button
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate('/quiz');
                  }}
                  className="px-4 py-3 bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white rounded font-tech text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SIMULADOR</span>
                </button>
              </div>

              {/* Mini Status Footer */}
              <div className="flex items-center gap-6 pt-4 text-xs font-tech text-neutral-500 border-t border-[#181818]">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-bold">ARCHETYPE:</span>
                  <span className="text-white">THE OBSERVER</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-bold">MODE:</span>
                  <span className="text-emerald-400">DEFENSIVE_ONLY</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-bold">NODE:</span>
                  <span className="text-neutral-300">404-ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Live Interactive Terminal Widget */}
            <div className="lg:col-span-5">
              <Terminal onNavigate={onNavigate} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-tech">
          <div className="hud-card p-4 rounded bg-[#0a0a0a] border border-[#1e1e1e] flex flex-col justify-between">
            <div className="text-[11px] text-neutral-500 uppercase tracking-widest flex items-center justify-between">
              <span>THREATS DOCUMENTED</span>
              <ShieldAlert className="w-4 h-4 text-[#FF1A1A]" />
            </div>
            <div className="mt-3">
              <span className="font-display text-3xl sm:text-4xl text-white tracking-wider">{stats.threatsDocumented}</span>
              <span className="text-xs text-[#FF5555] block mt-0.5">+12 monitoradas este mês</span>
            </div>
          </div>

          <div className="hud-card p-4 rounded bg-[#0a0a0a] border border-[#1e1e1e] flex flex-col justify-between">
            <div className="text-[11px] text-neutral-500 uppercase tracking-widest flex items-center justify-between">
              <span>CASES ANALYZED</span>
              <FileText className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="mt-3">
              <span className="font-display text-3xl sm:text-4xl text-white tracking-wider">{stats.casesAnalyzed}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">Dossiês com anatomia de ataque</span>
            </div>
          </div>

          <div className="hud-card p-4 rounded bg-[#0a0a0a] border border-[#1e1e1e] flex flex-col justify-between">
            <div className="text-[11px] text-neutral-500 uppercase tracking-widest flex items-center justify-between">
              <span>SCAM CATEGORIES</span>
              <Cpu className="w-4 h-4 text-[#E00000]" />
            </div>
            <div className="mt-3">
              <span className="font-display text-3xl sm:text-4xl text-white tracking-wider">{stats.scamCategories}</span>
              <span className="text-xs text-neutral-400 block mt-0.5">Vetores de engenharia social</span>
            </div>
          </div>

          <div className="hud-card p-4 rounded bg-[#0a0a0a] border border-[#1e1e1e] flex flex-col justify-between">
            <div className="text-[11px] text-neutral-500 uppercase tracking-widest flex items-center justify-between">
              <span>SAFETY GUIDES</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-3">
              <span className="font-display text-3xl sm:text-4xl text-white tracking-wider">{stats.safetyGuides}</span>
              <span className="text-xs text-emerald-400 block mt-0.5">Checklists de prevenção prática</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCAM ALERT COMPONENT (#10 from prompt) */}
      {latestAlert && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hud-card rounded-lg bg-gradient-to-r from-[#170505] via-[#0d0707] to-[#080808] border-2 border-[#E00000] p-6 shadow-[0_0_30px_rgba(224,0,0,0.15)] font-tech">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-[#E00000] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    SCAM ALERT {latestAlert.alertNumber}
                  </span>
                  <RiskBadge level={latestAlert.risk} />
                  <StatusBadge status={latestAlert.status} />
                  <span className="text-xs text-neutral-400">EMITIDO EM: {latestAlert.date}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                  TYPE: {latestAlert.type} — {latestAlert.headline}
                </h3>

                <div className="p-3 bg-[#260a0a]/50 border-l-4 border-[#FF1A1A] rounded text-xs text-[#FFC4C4] font-sans leading-relaxed">
                  <p className="font-bold font-tech text-[#FF5555] uppercase text-[11px] mb-1">WARNING / ALERTA CRÍTICO:</p>
                  "{latestAlert.warning}"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate('/alerts');
                  }}
                  className="px-5 py-3 bg-[#E00000] hover:bg-[#FF1A1A] text-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                >
                  <span>READ FULL ALERT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED SCAMS FROM THE ARCHIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-[#1c1c1c] pb-4">
          <div>
            <span className="text-xs font-tech text-[#FF1A1A] uppercase tracking-widest font-bold">
              // SCAM ARCHIVE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wider uppercase">
              GOLPES MAIS FREQUENTES EM CIRCULAÇÃO
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Padrões comportamentais, sinais de alerta e táticas de engenharia social documentadas.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/archive')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-tech text-[#FF5555] hover:text-white transition-colors"
          >
            <span>VER TODOS OS GOLPES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredScams.map((scam) => (
            <CyberCard
              key={scam.id}
              onClick={() => onNavigate(`/archive/${scam.slug}`)}
              className="group"
            >
              <div className="flex items-start justify-between gap-3 mb-2 font-tech">
                <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold uppercase">
                  {scam.category}
                </span>
                <RiskBadge level={scam.riskLevel} />
              </div>

              <h3 className="font-sans font-bold text-base text-white group-hover:text-[#FF4D4D] transition-colors line-clamp-1 mb-2">
                {scam.title}
              </h3>

              <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed mb-4">
                {scam.summary}
              </p>

              <div className="pt-3 border-t border-[#181818] flex items-center justify-between text-xs font-tech text-neutral-500">
                <span className="text-[11px]">ATUALIZADO: {scam.lastUpdated}</span>
                <span className="text-[#FF5555] group-hover:text-white flex items-center gap-1 font-bold text-[11px]">
                  <span>VER DETALHES</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </CyberCard>
          ))}
        </div>

        <div className="sm:hidden text-center pt-2">
          <button
            onClick={() => onNavigate('/archive')}
            className="w-full py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded font-tech text-xs"
          >
            VER ARQUIVO COMPLETO DE GOLPES →
          </button>
        </div>
      </section>

      {/* 5. INTERACTIVE SCAM SIMULATOR TEASER ("Você reconheceria o golpe?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hud-card rounded-lg bg-[#080b0e] border border-[#1e293b] p-6 sm:p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 font-sans">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-xs font-tech text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-bold uppercase tracking-wider">SIMULADOR EDUCATIVO INTERATIVO</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl text-white tracking-wider uppercase">
                VOCÊ RECONHECERIA O GOLPE?
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                Teste sua capacidade de identificar mensagens fraudulentas, falsas notificações de banco, clonagem de WhatsApp e e-mails de phishing em cenários realistas e seguros.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 font-tech text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Feedback Tático Imediato</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Red Flags Explicadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Anônimo & Seguro</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate('/quiz');
                  }}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Play className="w-4 h-4" />
                  <span>INICIAR TESTE AGORA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quiz Preview Card */}
            <div className="lg:col-span-5 bg-[#050505] border border-[#222222] rounded p-4 font-tech text-xs space-y-3">
              <div className="flex items-center justify-between text-neutral-500 text-[11px] pb-2 border-b border-[#181818]">
                <span>EXEMPLO DE CENÁRIO // SMS</span>
                <span className="text-[#FF1A1A] font-bold">DESAFIO #01</span>
              </div>
              <div className="p-3 bg-neutral-900/90 rounded border border-neutral-800 text-neutral-300 font-sans">
                <p className="text-[11px] font-tech text-neutral-500 mb-1">BANCO ALERTA (SMS):</p>
                <p className="text-xs">
                  "Tentativa de transferencia PIX R$ 3.500 identificada. Se NAO foi voce, responda com o TOKEN recebido para cancelar."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-tech">
                <div className="py-2 text-center rounded bg-neutral-900 border border-neutral-700 text-neutral-400 text-xs font-bold">
                  NORMAL
                </div>
                <div className="py-2 text-center rounded bg-[#FF1A1A]/20 border border-[#FF1A1A] text-[#FF5555] text-xs font-bold">
                  SUSPEITO (GOLPE)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. THREAT INTELLIGENCE FEED & CASE FILES HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Threats Matrix */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF1A1A]" />
                <h3 className="font-display text-2xl text-white tracking-wider uppercase">
                  THREAT INTELLIGENCE FEED
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/threats')}
                className="text-xs font-tech text-[#FF5555] hover:text-white"
              >
                VER DASHBOARD →
              </button>
            </div>

            <div className="space-y-3">
              {featuredThreats.map((threat) => (
                <div
                  key={threat.id}
                  onClick={() => onNavigate(`/threats?id=${threat.id}`)}
                  className="p-4 bg-[#0a0a0a] border border-[#1c1c1c] hover:border-[#333] rounded cursor-pointer transition-colors font-tech space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="text-[#FF1A1A] font-bold">[{threat.threatCode}]</span>
                    <div className="flex items-center gap-2">
                      <RiskBadge level={threat.riskLevel} className="text-[10px]" />
                      <StatusBadge status={threat.status} className="text-[10px]" />
                    </div>
                  </div>

                  <h4 className="font-sans font-bold text-sm text-white line-clamp-1">{threat.title}</h4>
                  <p className="text-xs text-neutral-400 font-sans line-clamp-1">{threat.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Investigative Dossiers */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <h3 className="font-display text-2xl text-white tracking-wider uppercase">
                  CASE FILES (DOSSIÊS)
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/cases')}
                className="text-xs font-tech text-neutral-400 hover:text-white"
              >
                TODOS OS CASOS →
              </button>
            </div>

            <div className="space-y-3">
              {featuredCases.map((caseFile) => (
                <div
                  key={caseFile.id}
                  onClick={() => onNavigate(`/cases?id=${caseFile.id}`)}
                  className="p-4 bg-[#0a0a0a] border border-[#1c1c1c] hover:border-[#333] rounded cursor-pointer transition-colors font-tech space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="classified-stamp text-[10px] py-0 px-2">{caseFile.caseNumber}</span>
                    <span className="text-[10px] text-neutral-500">{caseFile.country}</span>
                  </div>
                  <h4 className="font-sans font-bold text-sm text-white line-clamp-2">{caseFile.title}</h4>
                  <p className="text-xs text-neutral-400 font-sans line-clamp-2">{caseFile.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. MANIFESTO & PHILOSOPHY SECTION (#19 from prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hud-card rounded-lg bg-[#070707] border border-[#222222] p-8 sm:p-12 text-center relative overflow-hidden font-tech">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-block p-3 rounded-full bg-[#E00000]/10 border border-[#E00000]/30 text-[#FF1A1A] mb-2">
              <Lock className="w-6 h-6 mx-auto" />
            </div>

            <h2 className="font-display text-3xl sm:text-5xl text-white tracking-wider uppercase">
              O MANIFESTO DO OBSERVADOR
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-neutral-300 font-sans italic leading-relaxed max-w-xl mx-auto">
              <p>"Anonymity is not absence."</p>
              <p>"Knowledge is defense."</p>
              <p>"Every signal leaves a pattern."</p>
              <p>"Every pattern can become awareness."</p>
            </div>

            <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-center gap-6 text-sm font-tech font-black tracking-widest text-[#FF1A1A]">
              <span>EXPOSE.</span>
              <span>·</span>
              <span>EDUCATE.</span>
              <span>·</span>
              <span>PROTECT.</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="px-5 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-xs font-tech uppercase rounded transition-colors"
              >
                CONHEÇA A MISSÃO E POLÍTICA EDITORIAL →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
