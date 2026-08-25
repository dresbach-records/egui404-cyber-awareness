import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  subtext?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  subtext,
  as: Component = 'span'
}) => {
  return (
    <Component className={`relative inline-block font-display tracking-wider uppercase group ${className}`}>
      <span className="relative z-10">{text}</span>
      {subtext && (
        <span className="block font-tech text-xs tracking-widest text-[#FF1A1A] normal-case opacity-90">
          {subtext}
        </span>
      )}
    </Component>
  );
};
