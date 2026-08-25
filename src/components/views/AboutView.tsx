import React from 'react';
import {
  Shield,
  Eye,
  Lock,
  FileCheck,
  AlertTriangle,
  Scale,
  Award,
  Terminal as TerminalIcon,
  CheckCircle,
  ExternalLink,
  Users
} from 'lucide-react';
import { SoundEngine } from '../../services/audioService';

interface AboutViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, language }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      {/* Header Banner */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-2 font-tech">
        <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
          <Eye className="w-4 h-4" />
          <span className="font-bold tracking-widest uppercase">THE OBSERVER // INSTITUTIONAL ARCHETYPE</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wider uppercase">
          E GUI 404 (恶鬼 · 404)
        </h1>
        <p className="text-neutral-400 font-sans text-sm sm:text-base max-w-2xl">
          Plataforma independente de Cyber Crime Awareness, Scam Intelligence e Defesa Digital.
        </p>
      </div>

      {/* Hero Narrative Card */}
      <div className="hud-card bg-[#080808] border border-[#222222] rounded-lg p-6 sm:p-10 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide uppercase">
              QUEM É O OBSERVADOR? / THE OBSERVER
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              O <b>E GUI 404</b> nasceu da necessidade de transformar dados técnicos de cibersegurança e inteligência sobre fraudes em conhecimento acessível, defensivo e prático para cidadãos, famílias e empresas.
            </p>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              A figura do <b>Observador (恶鬼)</b> representa uma sentinela digital neutra e vigilante. O nome "404" simboliza o vazio onde as ameaças tentam se esconder — um espaço que rastreamos, documentamos e neutralizamos por meio da educação.
            </p>
          </div>

          <div className="lg:col-span-4 p-6 bg-[#040404] border border-[#1f1f1f] rounded-lg text-center space-y-3 font-tech">
            <div className="w-14 h-14 rounded-full bg-[#0d0d0d] border border-[#E00000] text-white flex items-center justify-center mx-auto text-xl font-bold">
              恶鬼
            </div>
            <span className="text-xs text-[#FF5555] font-bold block uppercase tracking-widest">
              DEFENSIVE DOCTRINE
            </span>
            <p className="text-xs text-neutral-400 italic">
              "Conheça o golpe antes que ele conheça você."
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles & Pillars */}
      <div className="space-y-4">
        <h3 className="font-tech text-base font-bold text-white uppercase tracking-wider border-l-2 border-[#E00000] pl-2">
          PILARES & DIRETRIZES FUNDAMENTAIS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-tech text-xs">
          <div className="p-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded space-y-3">
            <div className="p-2.5 bg-[#E00000]/10 border border-[#E00000]/30 rounded text-[#FF1A1A] w-fit">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-base text-white">1. FINALIDADE DEFENSIVA ABSOLUTA</h4>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed">
              Nenhuma linha de código, tutorial ou relatório nesta plataforma ensina ou facilita condutas ilícitas. Todo o conteúdo é estruturado exclusivamente para proteção e resposta a incidentes.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded space-y-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-500/30 rounded text-blue-400 w-fit">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-base text-white">2. ANONIMATO & PROTEÇÃO DE VÍTIMAS</h4>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed">
              Relatos e denúncias recebidas passam por um rigoroso processo de anonimização e sanitização antes de compor estatísticas ou padrões do acervo.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded space-y-3">
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-400 w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-sans font-bold text-base text-white">3. RIGOR TÉCNICO & FONTES OFICIAIS</h4>
            <p className="text-neutral-400 font-sans text-xs leading-relaxed">
              Alertas são fundamentados em dados públicos de órgãos reguladores (Banco Central, Febraban, CERT.br, FTC) e análises de laboratório auditadas.
            </p>
          </div>
        </div>
      </div>

      {/* Safety & Legal Statements */}
      <div className="p-6 bg-[#0d0a0a] border border-[#2b1414] rounded-lg space-y-4 font-sans text-xs sm:text-sm text-neutral-300">
        <h3 className="font-tech text-sm font-bold text-[#FF5555] uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> COMPROMISSO DE RESPONSABILIDADE SOCIAL
        </h3>
        <p className="leading-relaxed">
          O <b>E GUI 404</b> incentiva a denúncia de fraudes exclusivamente às autoridades competentes (Polícia Civil, Delegacias de Crimes Cibernéticos, Ministério Público e canais oficiais das instituições bancárias). Não realizamos investigações privadas nem cobramos valores por orientações de segurança.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 font-tech text-xs">
          <button
            onClick={() => onNavigate('/editorial-policy')}
            className="text-[#FF5555] hover:text-white underline font-bold"
          >
            Ler Política Editorial Completa →
          </button>
          <button
            onClick={() => onNavigate('/privacy')}
            className="text-neutral-400 hover:text-white underline"
          >
            Política de Privacidade & LGPD →
          </button>
        </div>
      </div>
    </div>
  );
};
