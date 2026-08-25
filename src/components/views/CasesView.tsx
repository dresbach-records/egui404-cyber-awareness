import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Shield,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { casesApi } from '../../services/api/casesApi';
import { CaseFile } from '../../types';
import { CyberCard } from '../ui/CyberCard';
import { SoundEngine } from '../../services/audioService';

interface CasesViewProps {
  initialCaseId?: string;
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const CasesView: React.FC<CasesViewProps> = ({ initialCaseId, onNavigate, language }) => {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [activeCase, setActiveCase] = useState<CaseFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCases = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await casesApi.getCases({}, signal);
      const list = res.data || [];
      setCases(list);
      if (list.length > 0) {
        if (initialCaseId) {
          const match = list.find(c => c.id === initialCaseId || c.caseNumber.toLowerCase().includes(initialCaseId.toLowerCase()));
          setActiveCase(match || list[0]);
        } else {
          setActiveCase(list[0]);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Falha ao carregar dossiês investigativos.');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchCases(controller.signal);
    return () => controller.abort();
  }, [initialCaseId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-tech">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <FileText className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">INVESTIGATIVE DOSSIERS & INCIDENT ANATOMY</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          CASE FILES (DOSSIÊS INVESTIGATIVOS)
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Análise de casos documentados com desconstrução da cadeia de eventos, métodos de manipulação e aprendizados defensivos essenciais. Dados de vítimas protegidos e anonimizados.
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-[#090909] border border-[#1f1f1f] rounded animate-pulse space-y-2">
                <div className="w-20 h-4 bg-[#222] rounded" />
                <div className="w-40 h-4 bg-[#222] rounded" />
              </div>
            ))}
          </div>
          <div className="p-8 bg-[#080808] border border-[#222] rounded h-96 animate-pulse" />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-[#140808] border border-[#3b1515] rounded-lg p-6 space-y-3">
          <AlertTriangle className="w-10 h-10 mx-auto text-[#FF4D4D]" />
          <h3 className="text-white text-lg font-bold">Erro ao carregar casos</h3>
          <p className="text-neutral-400 text-xs max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchCases()}
            className="mt-4 px-4 py-2 bg-[#E00000] text-white rounded text-xs hover:bg-[#FF1A1A] font-bold flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-16 bg-[#080808] border border-[#1a1a1a] rounded-lg">
          <FileText className="w-10 h-10 mx-auto text-neutral-600 mb-3" />
          <h3 className="text-white text-lg font-bold">Nenhum dossiê investigativo disponível</h3>
        </div>
      ) : (
        <>
          {/* Case Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cases.map((c) => {
              const isSelected = activeCase?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    setActiveCase(c);
                  }}
                  className={`p-4 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#150a0a] border-[#E00000] shadow-[0_0_20px_rgba(224,0,0,0.15)]'
                      : 'bg-[#090909] border-[#1f1f1f] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="classified-stamp text-[10px] py-0 px-2">{c.caseNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold">
                      {c.impactLevel} IMPACT
                    </span>
                  </div>
                  <h3 className="font-sans font-bold text-sm text-white line-clamp-2 mb-2">{c.title}</h3>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-[#181818]">
                    <span>{c.country}</span>
                    <span>{c.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Case Deep Dive Dossier View */}
          {activeCase && (
            <div className="hud-card bg-[#080808] border border-[#262626] rounded-lg p-6 sm:p-8 space-y-8 font-sans">
              {/* Dossier Top Banner */}
              <div className="border-b border-[#1f1f1f] pb-6 space-y-3 font-tech">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="classified-stamp text-xs">{activeCase.caseNumber}</span>
                    <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs uppercase font-bold rounded">
                      {activeCase.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF1A1A]" />
                      {activeCase.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      {activeCase.date}
                    </span>
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase">
                  {activeCase.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed bg-[#0d0d0d] p-4 rounded border border-[#1a1a1a]">
                  {activeCase.summary}
                </p>
              </div>

              {/* Attack Anatomy Breakdown */}
              <div className="space-y-4">
                <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-[#E00000] pl-2">
                  <Layers className="w-4 h-4 text-[#FF1A1A]" />
                  ANATOMIA DO ATAQUE / ATTACK VECTOR BREAKDOWN
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-tech text-xs">
                  <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-1.5">
                    <span className="text-[10px] text-[#FF5555] font-bold block uppercase tracking-wider">
                      01. CONTATO INICIAL
                    </span>
                    <p className="text-neutral-300 font-sans">{activeCase.attackAnatomy.initialContact}</p>
                  </div>

                  <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-1.5">
                    <span className="text-[10px] text-[#FF5555] font-bold block uppercase tracking-wider">
                      02. MANIPULAÇÃO PSICOLÓGICA
                    </span>
                    <p className="text-neutral-300 font-sans">{activeCase.attackAnatomy.manipulationTechnique}</p>
                  </div>

                  <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-1.5">
                    <span className="text-[10px] text-[#FF5555] font-bold block uppercase tracking-wider">
                      03. ETAPA DE EXPLORAÇÃO
                    </span>
                    <p className="text-neutral-300 font-sans">{activeCase.attackAnatomy.exploitationStep}</p>
                  </div>

                  <div className="p-4 bg-[#0d0d0d] border border-[#1e1e1e] rounded space-y-1.5">
                    <span className="text-[10px] text-[#FF5555] font-bold block uppercase tracking-wider">
                      04. VETOR DE PREJUÍZO
                    </span>
                    <p className="text-neutral-300 font-sans">{activeCase.attackAnatomy.damageVector}</p>
                  </div>
                </div>
              </div>

              {/* Timeline of Events */}
              <div className="space-y-4 font-tech">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 border-l-2 border-neutral-600 pl-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  CRONOLOGIA DOS FATOS / TIMELINE
                </h3>

                <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1f1f1f]">
                  {activeCase.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 pl-8 relative text-xs">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#050505] border-2 border-[#E00000]" />
                      <div className="p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-[#FF5555] uppercase">{item.event}</span>
                          <span className="text-[11px] text-neutral-500">{item.timestamp}</span>
                        </div>
                        <p className="text-neutral-300 font-sans">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defenses Learned */}
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg space-y-3 font-tech">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  APRENDIZADOS E BLINDAGEM DEFENSIVA
                </h3>
                <ul className="space-y-2 font-sans text-xs text-neutral-200">
                  {activeCase.defensesLearned.map((def, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{def}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sources */}
              <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between text-xs text-neutral-500 font-tech">
                <span>FONTES PÚBLICAS CONSULTADAS: {activeCase.sources.map((s) => s.title).join(' · ')}</span>
                <span className="text-[10px] text-neutral-600 uppercase">IDENTIFICADOR CONFIDENCIAL ANÔNIMO</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
