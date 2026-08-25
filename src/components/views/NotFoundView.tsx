import React from 'react';
import { ShieldAlert, ArrowLeft, Home, FileText } from 'lucide-react';
import { GlitchText } from '../ui/GlitchText';
import { SoundEngine } from '../../services/audioService';

interface NotFoundViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate, language }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 font-tech">
      <div className="max-w-md w-full bg-[#090909] border-2 border-[#E00000] p-8 rounded-lg shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Tag */}
        <div className="flex items-center justify-between text-xs text-neutral-500 border-b border-[#1c1c1c] pb-3">
          <span className="text-[#FF1A1A] font-bold">ERROR // 404</span>
          <span>THE_VOID</span>
        </div>

        {/* Big 404 Number */}
        <div>
          <GlitchText text="404" className="font-display text-8xl sm:text-9xl text-white tracking-widest leading-none" />
          <p className="text-[#FF1A1A] font-bold text-sm uppercase tracking-widest mt-2">
            SIGNAL LOST IN THE VOID
          </p>
        </div>

        <div className="p-3 bg-[#110707] border border-[#2b0d0d] rounded text-xs text-neutral-300 font-sans space-y-1">
          <p>A coordenada digital solicitada não foi encontrada ou foi classificada pelo Observador.</p>
          <p className="font-tech text-neutral-500 text-[10px]">IDENTITY: UNKNOWN · TRACE: NOT FOUND</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              onNavigate('/');
            }}
            className="flex-1 py-3 bg-[#E00000] hover:bg-[#FF1A1A] text-white rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)]"
          >
            <Home className="w-4 h-4" />
            <span>RETORNAR À SUPERFÍCIE</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              onNavigate('/archive');
            }}
            className="flex-1 py-3 bg-neutral-900 border border-neutral-700 hover:border-white text-white rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>ACESSAR O ARQUIVO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
