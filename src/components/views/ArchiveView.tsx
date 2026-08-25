import React, { useState, useMemo } from 'react';
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
  LifeBuoy
} from 'lucide-react';
import { ScamService } from '../../services/dataService';
import { ScamItem, ScamCategory, RiskLevel, ThreatStatus } from '../../types';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface ArchiveViewProps {
  initialSlug?: string;
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ initialSlug, onNavigate, language }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ScamCategory | 'ALL'>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ThreatStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'DATE_DESC' | 'DATE_ASC' | 'RISK_HIGH' | 'TITLE'>('DATE_DESC');
  const [activeScam, setActiveScam] = useState<ScamItem | null>(() => {
    if (initialSlug) {
      return ScamService.getScamBySlug(initialSlug) || null;
    }
    return null;
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const categories: (ScamCategory | 'ALL')[] = [
    'ALL',
    'PHISHING',
    'PIX SCAMS',
    'WHATSAPP FRAUD',
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

  const filteredScams = useMemo(() => {
    return ScamService.filterScams({
      category: selectedCategory,
      risk: selectedRisk,
      status: selectedStatus,
      search: searchQuery,
      sortBy: sortBy
    });
  }, [selectedCategory, selectedRisk, selectedStatus, searchQuery, sortBy]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <ShieldAlert className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">CLASSIFIED THREAT REPOSITORY</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          SCAM ARCHIVE
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          "Conheça os padrões antes de se tornar uma vítima." Catálogo técnico de golpes, esquemas de engenharia social e vetores de fraude financeira.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#090909] border border-[#1f1f1f] rounded-lg p-4 font-tech space-y-4 shadow-xl">
        {/* Search Bar & Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome do golpe, táticas ou palavras-chave (ex: Pix agendado, SMS)..."
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
            {filteredScams.length} golpe(s) encontrado(s)
          </span>
        </div>
      </div>

      {/* Scams Grid */}
      {filteredScams.length === 0 ? (
        <div className="text-center py-16 bg-[#080808] border border-[#1a1a1a] rounded-lg font-tech">
          <ShieldAlert className="w-10 h-10 mx-auto text-[#FF1A1A] opacity-50 mb-3" />
          <h3 className="text-white text-lg font-bold">Nenhum golpe encontrado com estes filtros</h3>
          <p className="text-neutral-400 text-xs mt-1">Tente remover filtros ou usar termos mais amplos de busca.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedRisk('ALL');
              setSelectedStatus('ALL');
            }}
            className="mt-4 px-4 py-2 bg-neutral-900 border border-neutral-700 text-white rounded text-xs hover:border-[#E00000]"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScams.map((scam) => (
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
                  <span>VIEW CASE</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </CyberCard>
          ))}
        </div>
      )}

      {/* INDIVIDUAL THREAT PROFILE MODAL / DRAWER (#8 from prompt) */}
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
                </div>
                <h2 className="font-sans font-bold text-xl sm:text-2xl text-white">
                  {activeScam.title}
                </h2>
                <p className="text-xs text-neutral-500 font-tech">
                  ÚLTIMA ATUALIZAÇÃO: {activeScam.lastUpdated} · ID: {activeScam.id.toUpperCase()}
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
              {/* Overview */}
              <div className="space-y-2">
                <h3 className="font-tech text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
                  1. VISÃO GERAL / OVERVIEW
                </h3>
                <p className="text-neutral-300 bg-[#0d0d0d] p-4 rounded border border-[#1c1c1c]">
                  {activeScam.summary}
                </p>
              </div>

              {/* How It Works */}
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
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> COMO SE PROTEGER / DEFENSIVE GUIDE
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
                  <LifeBuoy className="w-4 h-4 text-[#FF5555]" /> O QUE FAZER SE VOCÊ FOI VÍTIMA
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

              {/* Platforms & Public Sources */}
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
                  <span className="text-neutral-400 font-bold block mb-1">FONTES PÚBLICAS:</span>
                  <div className="space-y-1">
                    {activeScam.sources.map((s, idx) => (
                      <div key={idx} className="text-neutral-400 flex items-center gap-1 text-[11px]">
                        <ExternalLink className="w-3 h-3 text-[#FF1A1A]" />
                        <span>{s.title}</span>
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
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded text-xs font-tech font-bold"
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
