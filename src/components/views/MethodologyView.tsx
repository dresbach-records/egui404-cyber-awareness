import React from 'react';
import {
  Scale,
  ShieldCheck,
  BookOpen,
  FileCheck,
  RefreshCw,
  Users,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Flag
} from 'lucide-react';
import { RNP_FRAUD_CATALOG_URL, RNP_CAIS_SOURCE } from '../../types';
import { SoundEngine } from '../../services/audioService';

interface MethodologyViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({ onNavigate, language }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      {/* Header */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-3 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF5555]">
          <Scale className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">
            EDITORIAL STANDARDS // THREAT INTELLIGENCE GOVERNANCE
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          METODOLOGIA & FONTES
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Como o E GUI 404 coleta, higieniza, cataloga, classifica e atribui registros de inteligência defensiva contra golpes digitais.
        </p>
      </div>

      {/* Editorial Mission Statement Box */}
      <div className="p-6 bg-[#0c0808] border border-[#331414] rounded-lg space-y-3 font-sans">
        <div className="flex items-center gap-2 text-xs text-[#FF7777] font-tech font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>DECLARAÇÃO EDITORIAL DO E GUI 404</span>
        </div>
        <blockquote className="text-sm sm:text-base text-neutral-200 italic border-l-2 border-[#E00000] pl-4 leading-relaxed">
          "O E GUI 404 utiliza referências de fontes públicas e instituições especializadas para fins de conscientização e educação em segurança digital. Informações provenientes de fontes externas são identificadas e vinculadas à respectiva origem. A classificação, organização e análise editorial realizadas pelo E GUI 404 não constituem posicionamento oficial das fontes referenciadas."
        </blockquote>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Sources */}
        <div className="p-6 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-tech font-bold text-white uppercase tracking-wider">
            <span className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-[#FF5555]">01</span>
            <span>SELEÇÃO DE FONTES PÚBLICAS</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Priorizamos repositórios e alertas mantidos por entidades de referência técnica reconhecida, como o <strong>Catálogo de Fraudes do CAIS/RNP</strong>, boletins do <strong>CERT.br / NIC.br</strong> e orientações oficiais de órgãos reguladores e de segurança pública.
          </p>
          <div className="pt-2 text-xs text-neutral-400">
            <span className="font-tech text-white font-bold block mb-1">Critérios de Elegibilidade:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Finalidade educativa e de interesse coletivo.</li>
              <li>Acesso público e verificação técnica preliminar.</li>
              <li>Relevância comprovada para o ecossistema brasileiro.</li>
            </ul>
          </div>
        </div>

        {/* 2. Verification */}
        <div className="p-6 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-tech font-bold text-white uppercase tracking-wider">
            <span className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-[#FF5555]">02</span>
            <span>VERIFICAÇÃO & RIGOR DEFENSIVO</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Cada registro importado ou reportado recebe um nível formal de status de verificação:
          </p>
          <div className="space-y-1.5 font-tech text-xs">
            <div className="p-2 bg-[#121212] rounded flex items-center justify-between">
              <span className="text-emerald-400 font-bold">VERIFIED</span>
              <span className="text-neutral-400 text-[11px]">Validado com análise forense e contraprova</span>
            </div>
            <div className="p-2 bg-[#121212] rounded flex items-center justify-between">
              <span className="text-blue-400 font-bold">DOCUMENTED</span>
              <span className="text-neutral-400 text-[11px]">Originado de fonte oficial externa (ex: RNP/CAIS)</span>
            </div>
            <div className="p-2 bg-[#121212] rounded flex items-center justify-between">
              <span className="text-amber-400 font-bold">COMMUNITY_REPORTED</span>
              <span className="text-neutral-400 text-[11px]">Submetido por usuário aguardando triagem</span>
            </div>
          </div>
        </div>

        {/* 3. Classification */}
        <div className="p-6 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-tech font-bold text-white uppercase tracking-wider">
            <span className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-[#FF5555]">03</span>
            <span>CLASSIFICAÇÃO & NORMALIZAÇÃO</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Para facilitar a busca do cidadão e do pesquisador, o E GUI 404 traduz taxonomias variadas para categorias unificadas (<em>Phishing, Pix Scams, Banking Fraud, Malware, Identity Fraud, etc.</em>).
          </p>
          <p className="text-xs text-neutral-400">
            A categoria atribuída pelo E GUI 404 é explicitamente identificada como <strong>E GUI 404 Classification</strong>, preservando sempre a categoria e tags originais da fonte.
          </p>
        </div>

        {/* 4. Attribution */}
        <div className="p-6 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-tech font-bold text-white uppercase tracking-wider">
            <span className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-[#FF5555]">04</span>
            <span>ATRIBUIÇÃO & TRANSPARÊNCIA</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Nunca ocultamos a origem das informações. Cada ficha exibe o nome da organização emissora, o identificador original (ex: <code className="text-[#FF5555]">RNP_CAIS:16745</code>) e um botão para abrir o registro oficial na íntegra.
          </p>
          <p className="text-xs text-neutral-400">
            Não afirmamos parcerias inexistentes nem representação institucional não autorizada.
          </p>
        </div>

        {/* 5. Community & Moderation */}
        <div className="p-6 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-tech font-bold text-white uppercase tracking-wider">
            <span className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-[#FF5555]">05</span>
            <span>FLUXO DE DENÚNCIAS COMUNITÁRIAS</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Relatos enviados pela comunidade através da página de denúncia passam por um funil de integridade:
          </p>
          <div className="p-2.5 bg-[#121212] rounded font-tech text-xs text-neutral-300 text-center flex items-center justify-between gap-1 overflow-x-auto">
            <span>RELATO</span>
            <span>→</span>
            <span>MODERAÇÃO</span>
            <span>→</span>
            <span>REVISÃO EDITORIAL</span>
            <span>→</span>
            <span className="text-[#FF5555] font-bold">DOCUMENTADO</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Nenhum relato comunitário é publicado automaticamente sem validação de segurança para evitar vazamento de dados de terceiros ou fraudes artificiais.
          </p>
        </div>

        {/* 6. Corrections */}
        <div className="p-6 bg-[#090909] border border-[#1f1f1f] rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-xs font-tech font-bold text-white uppercase tracking-wider">
            <span className="w-6 h-6 rounded bg-[#1a1a1a] flex items-center justify-center text-[#FF5555]">06</span>
            <span>CORREÇÕES & RETIFICAÇÕES</span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Comprometemo-nos com a precisão dos fatos. Se você identificar qualquer imprecisão, link quebrado ou informação desatualizada, nosso canal de correções pode ser acionado diretamente.
          </p>
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              onNavigate('/report');
            }}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-tech font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5 text-[#FF5555]" />
            <span>Solicitar Correção Editorial</span>
          </button>
        </div>
      </div>

      {/* Featured Sources List */}
      <div className="space-y-4 pt-4 border-t border-[#1c1c1c]">
        <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider">
          Fontes de Inteligência Consultadas & Indexadas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-tech text-xs">
          <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded-lg flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-sm">Catálogo de Fraudes RNP/CAIS</p>
              <p className="text-neutral-400 text-[11px] font-sans">Rede Nacional de Ensino e Pesquisa (CAIS)</p>
            </div>
            <button
              onClick={() => {
                SoundEngine.playKeyClick();
                onNavigate('/archive/sources/rnp-cais');
              }}
              className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-[#E00000] text-neutral-200 rounded text-[11px] font-bold"
            >
              Ver Detalhes →
            </button>
          </div>

          <div className="p-4 bg-[#0a0a0a] border border-[#222222] rounded-lg flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-sm">CERT.br & NIC.br</p>
              <p className="text-neutral-400 text-[11px] font-sans">Centro de Estudos, Resposta e Tratamento de Incidentes de Segurança</p>
            </div>
            <a
              href="https://www.cert.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white rounded text-[11px] flex items-center gap-1"
            >
              <span>Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
