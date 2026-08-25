import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Filter,
  ShieldAlert,
  ArrowUpDown,
  X,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Share2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  LifeBuoy,
  Database,
  Layers,
  BookOpen,
  MessageSquare,
  FileText,
  Radio,
  Info,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { scamsApi, ScamQueryParams } from '../../services/api/scamsApi';
import { ScamItem, ScamCategory, RiskLevel, ThreatStatus, RNP_FRAUD_CATALOG_URL } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CyberCard } from '../ui/CyberCard';
import { RnpEducationalDisclaimer } from '../ui/RnpEducationalDisclaimer';
import { SoundEngine } from '../../services/audioService';

interface ArchiveViewProps {
  initialSlug?: string;
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

type SourceFilterType = 'ALL' | 'RNP_CAIS' | 'EGUI_404' | 'OFFICIAL' | 'COMMUNITY';

export const ArchiveView: React.FC<ArchiveViewProps> = ({ initialSlug, onNavigate, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ScamCategory | 'ALL'>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ThreatStatus | 'ALL'>('ALL');
  const [selectedSource, setSelectedSource] = useState<SourceFilterType>('ALL');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'RISK_HIGH' | 'TITLE'>('DATE_DESC');

  const [scams, setScams] = useState<ScamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeScam, setActiveScam] = useState<ScamItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const categories: (ScamCategory | 'ALL')[] = [
    'ALL',
    'PHISHING',
    'PIX SCAMS',
    'WHATSAPP FRAUD',
    'BANKING FRAUD',
    'FAKE INVESTMENTS',
    'FAKE LOANS',
    'IDENTITY FRAUD',
    'ACCOUNT TAKEOVER',
    'MARKETPLACE SCAMS',
    'ROMANCE SCAMS',
    'FAKE SUPPORT',
    'FAKE JOBS',
    'MALWARE',
    'RANSOMWARE',
    'SOCIAL ENGINEERING'
  ];

  const fetchScams = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const params: ScamQueryParams = {
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        risk: selectedRisk !== 'ALL' ? selectedRisk : undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        sourceProvider: selectedSource !== 'ALL' ? selectedSource : undefined,
        search: searchQuery.trim() || undefined,
        sortBy: sortBy === 'TITLE' ? 'title' : sortBy === 'RISK_HIGH' ? 'risk' : 'date',
        order: sortBy === 'DATE_ASC' ? 'asc' : 'desc'
      };

      const res = await scamsApi.getScams(params, signal);
      setScams(res.data || []);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Não foi possível carregar o arquivo de ameaças.');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (initialSlug) {
      scamsApi.getScamBySlug(initialSlug).then((s) => {
        if (s) setActiveScam(s);
      }).catch(() => {});
    }
  }, [initialSlug]);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(() => {
      fetchScams(controller.signal);
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCategory, selectedRisk, selectedStatus, selectedSource, searchQuery, sortBy]);

  const sourceCounts = useMemo(() => {
    const rnp = scams.filter((s) => s.sourceProvider === 'RNP_CAIS' || s.originalRecordId?.startsWith('RNP_CAIS')).length;
    const egui = scams.filter((s) => s.sourceProvider === 'EGUI_404' || (!s.sourceProvider && !s.originalRecordId)).length;
    const community = scams.filter((s) => s.verificationStatus === 'COMMUNITY_REPORTED' || s.sourceProvider === 'COMMUNITY').length;
    const official = scams.filter((s) => s.sources?.some((src) => src.isOfficial || src.organization?.includes('RNP'))).length;
    return {
      total: scams.length,
      rnp,
      egui,
      community,
      official
    };
  }, [scams]);

  const filteredScams = scams;

  const handleOpenDetail = (scam: ScamItem) => {
    SoundEngine.playKeyClick();
    setActiveScam(scam);
  };

  const handleShare = () => {
    if (!activeScam) return;
    SoundEngine.playSuccessSound();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isRnpRecord = (scam: ScamItem) =>
    scam.sourceProvider === 'RNP_CAIS' ||
    Boolean(scam.originalRecordId?.startsWith('RNP_CAIS')) ||
    scam.sources.some((s) => s.organization.includes('RNP'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-3 font-tech">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
            <ShieldAlert className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">CLASSIFIED THREAT REPOSITORY</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                SoundEngine.playKeyClick();
                onNavigate('/archive/sources/rnp-cais');
              }}
              className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-[#E00000] text-neutral-300 hover:text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-3 h-3 text-[#FF5555]" />
              <span>Fonte: Catálogo RNP/CAIS ({sourceCounts.rnp})</span>
              <ChevronRight className="w-3 h-3 text-neutral-500" />
            </button>
            <button
              onClick={() => {
                SoundEngine.playKeyClick();
                onNavigate('/methodology');
              }}
              className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3 h-3" />
              <span>Metodologia</span>
            </button>
          </div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          SCAM ARCHIVE
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-3xl leading-relaxed">
          "Conheça os padrões antes de se tornar uma vítima." Catálogo técnico e defensivo de golpes, esquemas de engenharia social e vetores de fraude, integrando dados próprios e referências públicas verificadas.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#090909] border border-[#1f1f1f] rounded-lg p-4 font-tech space-y-4 shadow-xl">
        {/* Source Filter Tabs */}
        <div className="flex items-center gap-2 pb-3 border-b border-[#181818] overflow-x-auto">
          <span className="text-neutral-500 text-[10px] uppercase font-bold shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" />
            FONTE DE INTELIGÊNCIA:
          </span>
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              setSelectedSource('ALL');
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider shrink-0 transition-colors ${
              selectedSource === 'ALL'
                ? 'bg-white text-black font-bold'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            TODAS AS FONTES ({sourceCounts.total})
          </button>
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              setSelectedSource('RNP_CAIS');
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider shrink-0 transition-colors flex items-center gap-1.5 ${
              selectedSource === 'RNP_CAIS'
                ? 'bg-[#E00000] text-white shadow-[0_0_10px_rgba(224,0,0,0.4)]'
                : 'bg-neutral-900 border border-neutral-800 text-[#FF8888] hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5555] animate-pulse" />
            CATÁLOGO RNP / CAIS ({sourceCounts.rnp})
          </button>
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              setSelectedSource('EGUI_404');
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider shrink-0 transition-colors ${
              selectedSource === 'EGUI_404'
                ? 'bg-neutral-200 text-black'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            E GUI 404 RESEARCH ({sourceCounts.egui})
          </button>
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              setSelectedSource('OFFICIAL');
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider shrink-0 transition-colors ${
              selectedSource === 'OFFICIAL'
                ? 'bg-neutral-200 text-black'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            FONTES OFICIAIS ({sourceCounts.official})
          </button>
        </div>

        {/* Search Bar & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, identificador (ex: RNP_CAIS:16745, Pix, Receita Federal)..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#E00000] font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-neutral-300 focus:outline-none focus:border-[#E00000]"
            >
              <option value="DATE_DESC">Data (Mais recentes)</option>
              <option value="DATE_ASC">Data (Mais antigos)</option>
              <option value="RISK_HIGH">Gravidade de Risco</option>
              <option value="TITLE">Ordem Alfabética</option>
            </select>
          </div>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-500 text-[10px] uppercase font-bold shrink-0 mr-1">
            Categoria:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  SoundEngine.playKeyClick();
                  setSelectedCategory(cat);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-[#E00000] text-white'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                }`}
              >
                {cat === 'ALL' ? 'TODAS AS CATEGORIAS' : cat}
              </button>
            );
          })}
        </div>

        {/* Risk & Status quick toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-[#181818]">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Risco:</span>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedRisk === r
                    ? 'bg-neutral-200 text-black'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 text-[11px]">Status:</span>
            {(['ALL', 'ACTIVE', 'MONITORED', 'RESOLVED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedStatus === s
                    ? 'bg-neutral-200 text-black'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <span className="ml-auto text-neutral-500 text-[11px]">
            {filteredScams.length} registro(s) listado(s)
          </span>
        </div>
      </div>

      {/* Sourced Disclaimer Notice banner if viewing RNP or filtered */}
      {selectedSource === 'RNP_CAIS' && (
        <RnpEducationalDisclaimer
          compact
          onNavigateSource={() => onNavigate('/archive/sources/rnp-cais')}
        />
      )}

      {/* Scams Grid, Loading and Error States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-lg bg-[#0C0C0C] border border-[#1F1F1F] animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="w-20 h-4 bg-[#222222] rounded" />
                <div className="w-16 h-4 bg-[#222222] rounded" />
              </div>
              <div className="w-3/4 h-5 bg-[#222222] rounded" />
              <div className="space-y-2">
                <div className="w-full h-3 bg-[#1A1A1A] rounded" />
                <div className="w-5/6 h-3 bg-[#1A1A1A] rounded" />
              </div>
              <div className="w-full h-12 bg-[#171010] rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#140808] border border-[#3b1515] rounded-lg font-tech p-6 space-y-3">
          <AlertTriangle className="w-10 h-10 mx-auto text-[#FF4D4D]" />
          <h3 className="text-white text-lg font-bold">Falha ao consultar repositório de ameaças</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchScams()}
            className="mt-4 px-4 py-2 bg-[#E00000] text-white rounded text-xs hover:bg-[#FF1A1A] font-bold flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : filteredScams.length === 0 ? (
        <div className="text-center py-16 bg-[#080808] border border-[#1a1a1a] rounded-lg font-tech">
          <ShieldAlert className="w-10 h-10 mx-auto text-[#FF1A1A] opacity-50 mb-3" />
          <h3 className="text-white text-lg font-bold">Nenhum registro retornado pelo servidor com estes filtros</h3>
          <p className="text-neutral-400 text-xs mt-1">Tente remover filtros ou usar termos mais amplos de busca.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedRisk('ALL');
              setSelectedStatus('ALL');
              setSelectedSource('ALL');
            }}
            className="mt-4 px-4 py-2 bg-neutral-900 border border-neutral-700 text-white rounded text-xs hover:border-[#E00000] cursor-pointer"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScams.map((scam) => {
            const isRnp = isRnpRecord(scam);
            return (
              <CyberCard
                key={scam.id}
                onClick={() => handleOpenDetail(scam)}
                className="flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap font-tech">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold uppercase">
                      {scam.category}
                    </span>
                    <RiskBadge level={scam.riskLevel} className="text-[10px]" />
                  </div>

                  {/* Provenance Tag */}
                  {isRnp && (
                    <div className="flex items-center justify-between gap-1 text-[10px] font-tech text-[#FF7777] bg-[#1a0808] px-2 py-0.5 rounded border border-[#3b1212]">
                      <span className="font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5555]" />
                        FONTE: RNP / CAIS
                      </span>
                      <span className="font-mono text-neutral-400">
                        {scam.originalRecordId || 'Catálogo'}
                      </span>
                    </div>
                  )}

                  <h3 className="font-sans font-bold text-base text-white group-hover:text-[#FF4D4D] transition-colors leading-snug">
                    {scam.title}
                  </h3>

                  <p className="text-xs text-neutral-400 font-sans line-clamp-3 leading-relaxed">
                    {scam.summary}
                  </p>

                  {/* Warning signs snippet */}
                  <div className="p-2.5 rounded bg-[#120a0a] border border-[#260f0f] text-[11px] font-sans text-[#ffaaaa]">
                    <p className="font-tech text-[#FF5555] font-bold uppercase text-[10px] mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> SINAL PRINCIPAL:
                    </p>
                    <p className="line-clamp-2">{scam.warningSigns[0]}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#181818] flex items-center justify-between text-xs font-tech text-neutral-500">
                  <StatusBadge status={scam.status} className="text-[9px]" />
                  <span className="text-[#FF5555] group-hover:text-white flex items-center gap-1 font-bold text-[11px]">
                    <span>ANALISAR VETOR</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CyberCard>
            );
          })}
        </div>
      )}

      {/* INDIVIDUAL THREAT PROFILE MODAL (WITH SOURCE DATA & DEFENSIVE ANALYSIS SEPARATION) */}
      {activeScam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-4xl bg-[#090909] border-2 border-[#E00000] rounded-lg shadow-2xl overflow-hidden font-tech my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#0e0a0a] border-b border-[#221010] flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="classified-stamp text-[10px]">THREAT PROFILE</span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs uppercase font-bold">
                    {activeScam.category}
                  </span>
                  <RiskBadge level={activeScam.riskLevel} />
                  <StatusBadge status={activeScam.status} />
                  {isRnpRecord(activeScam) && (
                    <span className="px-2 py-0.5 rounded bg-[#240c0c] border border-[#E00000]/40 text-[#FF7777] text-xs font-bold font-mono">
                      {activeScam.originalRecordId || 'RNP_CAIS:INDEXED'}
                    </span>
                  )}
                </div>
                <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
                  {activeScam.title}
                </h2>
                <p className="text-xs text-neutral-500 font-tech">
                  ÚLTIMA ATUALIZAÇÃO: {activeScam.lastUpdated} · ID INTERNO: {activeScam.id.toUpperCase()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleShare}
                  className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
                  title="Compartilhar Alerta"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveScam(null)}
                  className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {copiedLink && (
              <div className="bg-emerald-950 border-b border-emerald-500 text-emerald-300 text-xs px-4 py-1.5 text-center font-sans">
                Link do dossiê copiado para a área de transferência!
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-neutral-300 font-sans text-xs sm:text-sm leading-relaxed">
              {/* SOURCE DATA SEPARATION (MANDATORY REQUIREMENT) */}
              {isRnpRecord(activeScam) ? (
                <div className="p-5 bg-[#0e0808] border border-[#3b1515] rounded-lg space-y-3 font-tech">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 text-[#FF5555] font-bold text-xs uppercase tracking-wider">
                      <Database className="w-4 h-4" />
                      <span>DADOS DA FONTE EXTERNA // SOURCE METADATA</span>
                    </div>
                    {activeScam.originalUrl && (
                      <a
                        href={activeScam.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(224,0,0,0.3)]"
                      >
                        <span>VER REGISTRO ORIGINAL NO CATÁLOGO RNP/CAIS</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-[#080505] rounded border border-[#240e0e]">
                      <span className="text-[10px] text-neutral-500 uppercase block">FONTE OFICIAL:</span>
                      <span className="text-white font-bold">Catálogo de Fraudes RNP/CAIS</span>
                    </div>
                    <div className="p-2.5 bg-[#080505] rounded border border-[#240e0e]">
                      <span className="text-[10px] text-neutral-500 uppercase block">ID ORIGINAL:</span>
                      <span className="text-[#FF7777] font-mono font-bold">
                        {activeScam.originalRecordId || 'RNP_CAIS'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#080505] rounded border border-[#240e0e]">
                      <span className="text-[10px] text-neutral-500 uppercase block">CATEGORIA NA FONTE:</span>
                      <span className="text-neutral-300 font-mono">
                        {activeScam.originalCategory || 'catálogo de fraudes'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#080505] rounded border border-[#240e0e]">
                      <span className="text-[10px] text-neutral-500 uppercase block">DATA DE REGISTRO:</span>
                      <span className="text-neutral-300">{activeScam.date}</span>
                    </div>
                  </div>

                  <RnpEducationalDisclaimer compact onNavigateSource={() => {
                    setActiveScam(null);
                    onNavigate('/archive/sources/rnp-cais');
                  }} />
                </div>
              ) : (
                <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg font-tech text-xs text-neutral-400 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-white font-bold block">PROVENIÊNCIA DA INTELIGÊNCIA:</span>
                    <span>Análise defensiva documentada pela equipe de pesquisa E GUI 404.</span>
                  </div>
                  <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded text-[10px]">
                    EGUI_RESEARCH_LAB
                  </span>
                </div>
              )}

              {/* 1. Overview */}
              <div className="space-y-2">
                <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
                  1. VISÃO GERAL & ANÁLISE DEFENSIVA // E GUI 404 ANALYSIS
                </h3>
                <p className="text-neutral-300 bg-[#0d0d0d] p-4 rounded border border-[#1c1c1c]">
                  {activeScam.summary}
                </p>
              </div>

              {/* Threat Flow if present */}
              {activeScam.threatFlow && activeScam.threatFlow.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-tech text-xs font-bold text-[#FF7777] uppercase tracking-wider">
                    VETOR DE PROPAGAÇÃO & SEQUÊNCIA DE EXPLORAÇÃO
                  </h4>
                  <div className="p-3 bg-[#0d0a0a] border border-[#260f0f] rounded font-tech text-xs flex items-center justify-between gap-2 overflow-x-auto">
                    {activeScam.threatFlow.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded shrink-0">
                          {step}
                        </span>
                        {idx < (activeScam.threatFlow?.length || 0) - 1 && (
                          <span className="text-[#FF5555] font-bold">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. How It Works */}
              <div className="space-y-2">
                <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
                  2. COMO O GOLPE OPERA / HOW IT WORKS
                </h3>
                <div className="space-y-2">
                  {activeScam.howItWorks.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded"
                    >
                      <span className="font-tech font-bold text-[#FF1A1A] text-xs px-2 py-0.5 bg-[#FF1A1A]/10 rounded shrink-0">
                        ETAPA 0{idx + 1}
                      </span>
                      <p className="text-neutral-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Signs & Common Tactics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-tech text-sm font-bold text-[#FF5555] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> SINAIS DE ALERTA (RED FLAGS)
                  </h3>
                  <ul className="space-y-1.5 bg-[#140a0a] p-4 rounded border border-[#2a1111]">
                    {activeScam.warningSigns.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-neutral-300">
                        <span className="text-[#FF1A1A] font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="font-tech text-sm font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-400" /> TÁTICAS COMUNS
                  </h3>
                  <ul className="space-y-1.5 bg-[#0d0d0d] p-4 rounded border border-[#1a1a1a]">
                    {activeScam.commonTactics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-neutral-300">
                        <span className="text-neutral-500 font-bold">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* How To Protect Yourself */}
              <div className="space-y-2">
                <h3 className="font-tech text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> GUIA DE PROTEÇÃO DEFENSIVA
                </h3>
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded space-y-2">
                  {activeScam.howToProtect.map((prot, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-neutral-200">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{prot}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What To Do If You Are A Victim */}
              <div className="space-y-2">
                <h3 className="font-tech text-sm font-bold text-[#FF5555] uppercase tracking-wider flex items-center gap-1.5">
                  <LifeBuoy className="w-4 h-4 text-[#FF5555]" /> PLANO DE RESPOSTA PARA VÍTIMAS
                </h3>
                <div className="bg-[#170a0a] border border-[#3b1212] p-4 rounded space-y-2">
                  {activeScam.victimActions.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-neutral-200">
                      <span className="font-tech font-bold text-[#FF5555] shrink-0">#{idx + 1}</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threat Graph Relationships */}
              <div className="p-4 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3 font-tech">
                <span className="text-xs text-white font-bold uppercase tracking-wider block border-l-2 border-[#E00000] pl-2">
                  CONEXÕES NO THREAT GRAPH // RELATED INTEL
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setActiveScam(null);
                      onNavigate('/threats');
                    }}
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-left flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] text-neutral-500 block">AMEAÇAS RELACIONADAS</span>
                      <span className="text-neutral-200 font-bold">Threat Radar</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FF5555]" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveScam(null);
                      onNavigate('/cases');
                    }}
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-left flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] text-neutral-500 block">ESTUDOS DE CASO</span>
                      <span className="text-neutral-200 font-bold">Case Files</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FF5555]" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveScam(null);
                      onNavigate('/forum');
                    }}
                    className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-left flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <span className="text-[10px] text-neutral-500 block">DISCUSSÕES</span>
                      <span className="text-neutral-200 font-bold">Community Forum</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#FF5555]" />
                  </button>
                </div>
              </div>

              {/* Platforms & Official References */}
              <div className="pt-4 border-t border-[#181818] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-tech text-xs text-neutral-500">
                <div>
                  <span className="text-neutral-400 font-bold block mb-1">PLATAFORMAS AFETADAS:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeScam.affectedPlatforms.map((p) => (
                      <span key={p} className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400 font-bold block mb-1">FONTES DE REFERÊNCIA:</span>
                  <div className="space-y-1">
                    {activeScam.sources.map((s, idx) => (
                      <div key={idx} className="text-neutral-400 flex items-center gap-1 text-[11px]">
                        {s.url ? (
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#FF5555] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3 text-[#FF1A1A]" />
                            <span>{s.title}</span>
                          </a>
                        ) : (
                          <>
                            <ExternalLink className="w-3 h-3 text-[#FF1A1A]" />
                            <span>{s.title}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-tech">
                Finalidade estritamente defensiva e educativa.
              </span>
              <button
                onClick={() => setActiveScam(null)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-tech font-bold cursor-pointer"
              >
                FECHAR PERFIL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
