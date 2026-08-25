import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', showIcon = true }) => {
  const config = {
    CRITICAL: {
      bg: 'bg-[#FF1A1A]/15 border-[#FF1A1A]',
      text: 'text-[#FF1A1A]',
      label: 'RISCO CRÍTICO',
      dot: 'bg-[#FF1A1A]'
    },
    HIGH: {
      bg: 'bg-[#E00000]/15 border-[#E00000]',
      text: 'text-[#FF5555]',
      label: 'RISCO ALTO',
      dot: 'bg-[#E00000]'
    },
    MEDIUM: {
      bg: 'bg-[#eab308]/15 border-[#eab308]',
      text: 'text-[#facc15]',
      label: 'RISCO MÉDIO',
      dot: 'bg-[#eab308]'
    },
    LOW: {
      bg: 'bg-[#22c55e]/15 border-[#22c55e]',
      text: 'text-[#4ade80]',
      label: 'RISCO BAIXO',
      dot: 'bg-[#22c55e]'
    }
  }[level] || {
    bg: 'bg-neutral-800 border-neutral-700',
    text: 'text-neutral-300',
    label: level,
    dot: 'bg-neutral-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[11px] font-tech font-bold uppercase tracking-wider ${config.bg} ${config.text} ${className}`}
    >
      {showIcon && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
};
