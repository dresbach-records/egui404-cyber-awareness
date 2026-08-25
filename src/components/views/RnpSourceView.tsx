import React, { useState } from 'react';
import {
  ExternalLink,
  Shield,
  FileText,
  Calendar,
  Layers,
  CheckCircle,
  Database,
  ArrowLeft,
  ChevronRight,
  Info,
  ShieldAlert
} from 'lucide-react';
import { RNP_FRAUD_CATALOG_URL, RNP_CAIS_SOURCE } from '../../types';
import { RnpRepository } from '../../services/rnp/rnpRepository';
import { RnpEducationalDisclaimer } from '../ui/RnpEducationalDisclaimer';
import { CyberCard } from '../ui/CyberCard';
import { RiskBadge } from '../ui/RiskBadge';
import { StatusBadge } from '../ui/StatusBadge';
import { SoundEngine } from '../../services/audioService';

interface RnpSourceViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const RnpSourceView: React.FC<RnpSourceViewProps> = ({ onNavigate, language }) => {
  const rnpScams = RnpRepository.getAllScams();
  const syncStats = RnpRepository.getSyncStats();
  const rawRecords = RnpRepository.getRawRecords();

  const categories = Array.from(
    new Set(rawRecords.map((r) => r.sourceCategory).filter(Boolean))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4 font-tech text-xs">
        <button
          onClick={() => {
            SoundEngine.playKeyClick();
            onNavigate('/archive');
          }}
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF1A1A]" />
          <span>VOLTAR AO SCAM ARCHIVE</span>
        </button>

        <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded text-[10px]">
          EXTERNAL SOURCE PROFILE // RNP_CAIS
        </span>
      </div>

      {/* Hero Header */}
      <div className="border-b border-[#1f1f1f] pb-8 space-y-4 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF5555]">
          <Shield className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">
            FONTE OFICIAL DE REFERÊNCIA & THREAT INTELLIGENCE
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
              RNP / CAIS
            </h1>
            <p className="text-xl text-[#FF5555] font-tech tracking-wide mt-1">
              Catálogo de Fraudes
            </p>
          </div>

          <a
            href={RNP_FRAUD_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-tech font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(224,0,0,0.3)] transition-all cursor-pointer shrink-0"
          >
            <span>VISIT OFFICIAL SOURCE</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-neutral-300 font-sans text-sm sm:text-base max-w-3xl leading-relaxed">
          O <strong>Catálogo de Fraudes</strong> é mantido pelo <strong>CAIS (Centro de Atendimento a Incidentes de Segurança)</strong> da <strong>RNP (Rede Nacional de Ensino e Pesquisa)</strong>. Trata-se de um repositório público com finalidade informativa e educativa, catalogando amostras e exemplares de comunicações maliciosas, engenharia social e golpes virtuais observados na internet brasileira.
        </p>
      </div>

      {/* Mandatory Disclaimer */}
      <RnpEducationalDisclaimer onNavigateSource={() => onNavigate('/methodology')} />

      {/* Metadata & Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-tech">
        <div className="p-4 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-1">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">ORGANIZAÇÃO</span>
          <p className="text-white font-bold text-sm">RNP / CAIS</p>
          <span className="text-[10px] text-neutral-400">Rede Nacional de Ensino e Pesquisa</span>
        </div>

        <div className="p-4 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-1">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">REGISTROS INDEXADOS</span>
          <p className="text-[#FF5555] font-bold text-lg">{rnpScams.length} registros</p>
          <span className="text-[10px] text-neutral-400">Indexação defensiva pelo E GUI 404</span>
        </div>

        <div className="p-4 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-1">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">ÚLTIMA SINCRONIZAÇÃO</span>
          <p className="text-white font-bold text-sm">{syncStats.lastRun}</p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            STATUS: DOCUMENTED
          </span>
        </div>

        <div className="p-4 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-1">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">CAMADA EDITORIAL</span>
          <p className="text-white font-bold text-sm">E GUI 404 Defense Layer</p>
          <span className="text-[10px] text-neutral-400">Normalização e Análise Preventiva</span>
        </div>
      </div>

      {/* Methodology and Scope Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4 bg-[#080808] border border-[#1c1c1c] rounded-lg p-6 font-sans">
            <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
              Metodologia de Indexação & Atribuição
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <p>
                O E GUI 404 integra referências do Catálogo de Fraudes RNP/CAIS através de um processo transparente de normalização:
              </p>
              <ul className="space-y-2 pl-4 list-disc text-neutral-400">
                <li>
                  <strong className="text-white">Preservação do Identificador Original:</strong> Cada registro mantém o ID oficial (ex: <code className="text-[#FF7777]">RNP_CAIS:16745</code>) e link direto para a página original do catálogo.
                </li>
                <li>
                  <strong className="text-white">Higienização Defensiva:</strong> Links e anexos maliciosos são neutralizados (defanged) para impedir qualquer risco de infecção ou navegação involuntária.
                </li>
                <li>
                  <strong className="text-white">Separação entre Fonte e Análise:</strong> Os dados de origem (título e categoria original) são apresentados em seção distinta da análise editorial do E GUI 404 (red flags, guia de proteção e ações para vítimas).
                </li>
                <li>
                  <strong className="text-white">Não há cópia indiscriminada:</strong> As mensagens são processadas para extrair apenas os padrões de engenharia social e sinais de alerta relevantes para a conscientização cidadã.
                </li>
              </ul>
            </div>
          </div>

          {/* Sourced Records Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
                Registros Referenciados do Catálogo ({rnpScams.length})
              </h3>
              <span className="font-tech text-xs text-neutral-500">
                Fonte: Catálogo de Fraudes RNP/CAIS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rnpScams.map((scam) => (
                <CyberCard
                  key={scam.id}
                  onClick={() => {
                    SoundEngine.playKeyClick();
                    onNavigate(`/archive/${scam.slug}`);
                  }}
                  className="flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 font-tech">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-bold uppercase">
                        {scam.category}
                      </span>
                      <span className="text-[9px] text-[#FF5555] font-tech font-bold">
                        {scam.originalRecordId}
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-sm text-white group-hover:text-[#FF5555] transition-colors leading-snug">
                      {scam.title}
                    </h4>

                    <p className="text-xs text-neutral-400 font-sans line-clamp-2">
                      {scam.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[#181818] flex items-center justify-between text-xs font-tech text-neutral-500">
                    <RiskBadge level={scam.riskLevel} className="text-[9px]" />
                    <span className="text-[#FF5555] group-hover:text-white flex items-center gap-1 font-bold text-[10px]">
                      <span>VER ANÁLISE</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </CyberCard>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Categories & Institutional Transparency */}
        <div className="space-y-6 font-tech">
          <div className="p-5 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
              Categorias da Fonte Mapeadas
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded text-[11px] text-neutral-300 font-mono"
                >
                  RNP:{cat}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3 text-xs font-sans text-neutral-400">
            <h4 className="font-tech text-xs font-bold text-white uppercase tracking-wider border-l-2 border-neutral-700 pl-2">
              Transparência Institucional
            </h4>
            <p>
              O E GUI 404 é um projeto independente de conscientização defensiva. Não representamos a RNP nem possuímos parceria institucional formal com a RNP/CAIS.
            </p>
            <p className="text-[11px] text-neutral-500">
              Todas as menções respeitam os princípios de citação, atribuição de fontes públicas e incentivo ao acesso à fonte oficial.
            </p>
          </div>

          <div className="p-5 bg-[#0d0909] border border-[#2b1212] rounded-lg space-y-3 text-xs font-sans">
            <h4 className="font-tech text-xs font-bold text-[#FF5555] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Precisa reportar ou verificar?
            </h4>
            <p className="text-neutral-300">
              Para conferir se um e-mail ou SMS recebido é legítimo, consulte sempre os canais oficiais do emissor ou a base pública do CAIS/RNP.
            </p>
            <a
              href={RNP_FRAUD_CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2 text-center bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded text-xs font-tech font-bold transition-colors"
            >
              Acessar Catálogo Oficial →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
