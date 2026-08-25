import React from 'react';
import { ThreatStatus } from '../../types';

interface StatusBadgeProps {
  status: ThreatStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = {
    ACTIVE: {
      bg: 'bg-[#FF1A1A]/10 border-[#FF1A1A]/60',
      text: 'text-[#FF4D4D]',
      dot: 'bg-[#FF1A1A] radar-beacon',
      label: 'ATIVO / EM CIRCULAÇÃO'
    },
    MONITORED: {
      bg: 'bg-[#3b82f6]/10 border-[#3b82f6]/50',
      text: 'text-[#60a5fa]',
      dot: 'bg-[#3b82f6]',
      label: 'MONITORADO'
    },
    RESOLVED: {
      bg: 'bg-[#10b981]/10 border-[#10b981]/50',
      text: 'text-[#34d399]',
      dot: 'bg-[#10b981]',
      label: 'NEUTRALIZADO / RESOLVIDO'
    }
  }[status] || {
    bg: 'bg-neutral-800 border-neutral-700',
    text: 'text-neutral-400',
    dot: 'bg-neutral-500',
    label: status
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[11px] font-tech font-bold uppercase tracking-wider ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
