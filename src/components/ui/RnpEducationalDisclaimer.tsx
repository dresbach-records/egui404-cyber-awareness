import React from 'react';
import { Shield, ExternalLink, Info, BookOpen } from 'lucide-react';
import { RNP_FRAUD_CATALOG_URL, RNP_CAIS_SOURCE } from '../../types';

interface RnpEducationalDisclaimerProps {
  className?: string;
  compact?: boolean;
  onNavigateSource?: () => void;
}

export const RnpEducationalDisclaimer: React.FC<RnpEducationalDisclaimerProps> = ({
  className = '',
  compact = false,
  onNavigateSource
}) => {
  if (compact) {
    return (
      <div
        className={`p-3 bg-[#0d0909] border border-[#2b1212] rounded text-xs font-sans text-neutral-300 space-y-1.5 ${className}`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap font-tech">
          <div className="flex items-center gap-1.5 text-[#FF5555] font-bold text-[11px] uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>FONTE & AVISO EDUCATIVO (RNP / CAIS)</span>
          </div>
          <a
            href={RNP_FRAUD_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-neutral-400 hover:text-[#FF1A1A] flex items-center gap-1 transition-colors"
          >
            <span>Fonte Original: Catálogo de Fraudes RNP/CAIS</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Esta página tem função informativa e educativa. O conteúdo é exemplificativo e não exaustivo. A ausência de um exemplar não significa que não seja real. A classificação do E GUI 404 é uma camada editorial própria e não representa posicionamento oficial da RNP/CAIS.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`hud-card bg-[#0a0707] border border-[#331414] rounded-lg p-5 space-y-4 font-sans text-neutral-300 ${className}`}
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-4 flex-wrap border-b border-[#240e0e] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#1e0a0a] border border-[#E00000]/60 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-[#FF5555]" />
          </div>
          <span className="font-tech font-bold text-xs text-[#FF5555] tracking-wider uppercase">
            AVISO INFORMATIVO & EDUCATIVO // FONTE OFICIAL DE REFERÊNCIA
          </span>
        </div>

        <div className="flex items-center gap-3 font-tech text-xs">
          <a
            href={RNP_FRAUD_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-[#E00000] text-neutral-300 hover:text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition-all"
          >
            <span>Catálogo de Fraudes RNP/CAIS</span>
            <ExternalLink className="w-3 h-3 text-[#FF1A1A]" />
          </a>
          {onNavigateSource && (
            <button
              onClick={onNavigateSource}
              className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Ver Metodologia de Fonte →
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Notice Text */}
      <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
        <p>
          Esta página tem função informativa e educativa. O conteúdo apresentado é exemplificativo e não exaustivo, uma vez que não é possível contemplar todos os casos de fraudes existentes. A ausência de determinado exemplar neste catálogo não significa que ele não seja válido ou real.
        </p>

        <p className="text-neutral-400">
          Os registros e referências provenientes do <strong>Catálogo de Fraudes RNP/CAIS</strong> devem ser consultados na fonte original para informações completas e atualizadas.
        </p>

        <div className="pt-2 border-t border-[#1f0d0d] text-[11px] text-neutral-400 font-tech">
          <span className="text-[#FF7777] font-bold">POSICIONAMENTO DO E GUI 404: </span>
          O E GUI 404 utiliza fontes públicas e referências externas para fins de conscientização, organização e educação sobre segurança digital. A classificação e apresentação realizadas pelo E GUI 404 constituem uma camada editorial própria e não representam posicionamento oficial da RNP/CAIS.
        </div>
      </div>
    </div>
  );
};
