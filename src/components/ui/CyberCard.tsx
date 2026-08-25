import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'accent' | 'warning' | 'terminal';
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  className = '',
  id,
  variant = 'default',
  onClick,
  hoverEffect = true
}) => {
  const variantStyles = {
    default: 'bg-[#0d0d0d] border-[#222222] hover:border-[#444444]',
    accent: 'bg-[#0f0a0a] border-[#E00000]/40 hover:border-[#FF1A1A]',
    warning: 'bg-[#140e05] border-[#eab308]/40 hover:border-[#eab308]',
    terminal: 'bg-[#080808] border-[#1c1c1c] font-tech'
  }[variant];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative hud-card rounded-md p-5 transition-all duration-200 ${variantStyles} ${
        hoverEffect ? 'hover:shadow-[0_4px_24px_rgba(224,0,0,0.08)] hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
