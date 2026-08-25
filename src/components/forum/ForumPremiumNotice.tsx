import React from 'react';
import { LockKeyhole } from 'lucide-react';

interface ForumPremiumNoticeProps {
  onLearnMore?: () => void;
  language?: 'pt' | 'en';
}

/**
 * Aviso preparado para recursos futuros com entitlement confirmado pela API.
 * O núcleo FREE do Fórum não passa por este componente.
 */
export const ForumPremiumNotice: React.FC<ForumPremiumNoticeProps> = ({ onLearnMore, language = 'pt' }) => (
  <section className="border border-[#333] bg-[#111] p-5" aria-labelledby="forum-premium-title">
    <div className="flex items-start gap-3">
      <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-[#FF1A1A]" aria-hidden="true" />
      <div className="space-y-3">
        <div>
          <h2 id="forum-premium-title" className="font-tech text-sm font-bold tracking-wider text-white">
            {language === 'pt' ? 'RECURSO PREMIUM' : 'PREMIUM FEATURE'}
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-400">
            {language === 'pt'
              ? 'Este recurso faz parte do E GUI 404 Premium.'
              : 'This feature is part of E GUI 404 Premium.'}
          </p>
        </div>
        {onLearnMore && (
          <button type="button" onClick={onLearnMore} className="border border-[#555] px-3 py-1.5 text-xs font-bold tracking-wider text-neutral-200 transition-colors hover:border-[#FF1A1A] hover:text-white">
            {language === 'pt' ? 'CONHECER O PREMIUM' : 'LEARN ABOUT PREMIUM'}
          </button>
        )}
      </div>
    </div>
  </section>
);
