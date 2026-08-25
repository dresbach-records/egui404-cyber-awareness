import React, { useState, useEffect } from 'react';
import { Shield, Check, Eye } from 'lucide-react';

interface CookieBannerProps {
  onNavigateLegal?: (path: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigateLegal }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('egui404_lgpd_consent');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('egui404_lgpd_consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#0c0c0c] border border-[#262626] rounded-md p-4 shadow-2xl font-tech text-xs text-neutral-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-[#E00000]/10 border border-[#E00000]/30 shrink-0 text-[#FF1A1A]">
          <Shield className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>Privacidade & LGPD</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 text-neutral-400 rounded">DEFENSIVE_OPS</span>
          </p>
          <p className="text-neutral-400 text-[11px] leading-relaxed mb-3">
            O E GUI 404 adota o princípio da <b>minimização absoluta de dados</b>. Não comercializamos informações, não rastreamos perfis para publicidade e utilizamos cookies estritamente necessários.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 bg-[#E00000] text-white hover:bg-[#FF1A1A] rounded font-bold transition-colors flex items-center gap-1 text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Entendi e Aceito
            </button>
            {onNavigateLegal && (
              <button
                onClick={() => onNavigateLegal('/privacy')}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white rounded transition-colors flex items-center gap-1 text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                Política de Privacidade
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
