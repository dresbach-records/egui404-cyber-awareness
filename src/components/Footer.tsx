import React, { useState } from 'react';
import {
  Shield,
  Send,
  Lock,
  ExternalLink,
  CheckCircle,
  Radio,
  Terminal,
  FileCheck
} from 'lucide-react';
import { NewsletterService } from '../services/dataService';
import { SoundEngine } from '../services/audioService';

interface FooterProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    SoundEngine.playSuccessSound();
    const res = NewsletterService.subscribe(email, 'WEEKLY_DIGEST');
    if (res.success) {
      setSubscribed(true);
      setSubMsg(
        language === 'pt'
          ? 'Inscrição confirmada. Você receberá o Signal Report semanal.'
          : 'Subscription confirmed. You will receive the weekly Signal Report.'
      );
      setEmail('');
    }
  };

  return (
    <footer id="footer-section" className="bg-[#030303] border-t border-[#1a1a1a] font-tech text-neutral-400 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#181818]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="w-8 h-8 rounded bg-[#0d0d0d] border border-[#E00000] flex items-center justify-center">
                <span className="text-white font-black text-sm">恶鬼</span>
              </div>
              <span className="font-display text-2xl text-white tracking-wider">E GUI 404</span>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm">
              Plataforma independente de <b>Cyber Crime Awareness</b>, <b>Scam Intelligence</b> e <b>Digital Safety</b>.
              Transformando sinais de ameaças em conhecimento defensivo acessível para toda a sociedade.
            </p>

            <div className="p-3 rounded bg-[#090909] border border-[#1e1e1e] inline-block text-[11px] text-neutral-300">
              <p className="font-bold text-[#FF1A1A] tracking-wider uppercase mb-0.5">EXPOSE. EDUCATE. PROTECT.</p>
              <p className="text-neutral-500 font-sans italic">"Conheça o golpe antes que ele conheça você."</p>
            </div>

            {/* Social Channels */}
            <div className="pt-2">
              <span className="text-[10px] uppercase text-neutral-500 tracking-wider block mb-2 font-bold">
                Canais Oficiais:
              </span>
              <div className="flex items-center gap-3 text-neutral-400 text-xs">
                {['YouTube', 'Instagram', 'TikTok', 'X (Twitter)', 'LinkedIn', 'Telegram'].map((net) => (
                  <span
                    key={net}
                    className="hover:text-[#FF1A1A] transition-colors cursor-pointer text-[11px]"
                    title={`Canal E GUI 404 no ${net}`}
                  >
                    {net}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#E00000] pl-2">
              {language === 'pt' ? 'Plataforma' : 'Platform'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/archive')} className="hover:text-white transition-colors">
                  Scam Archive
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/threats')} className="hover:text-white transition-colors">
                  Threat Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cases')} className="hover:text-white transition-colors">
                  Investigative Cases
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/education')} className="hover:text-white transition-colors">
                  Cyber Education
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/quiz')} className="hover:text-white transition-colors">
                  Simulador de Golpes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/lab')} className="hover:text-white transition-colors">
                  Cyber Lab
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-neutral-700 pl-2">
              {language === 'pt' ? 'Institucional' : 'Institutional'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  Sobre O Observador
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/editorial-policy')} className="hover:text-white transition-colors">
                  Política Editorial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Privacidade & LGPD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cookies')} className="hover:text-white transition-colors">
                  Política de Cookies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contato Seguro
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-neutral-600 hover:text-neutral-400 transition-colors text-[10px]">
                  [Admin Preview]
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signal Report */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-[#E00000] pl-2 flex items-center gap-1.5">
              <span>SIGNAL REPORT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1A1A] animate-pulse" />
            </h4>
            <p className="text-xs text-neutral-400 font-sans">
              Receba alertas de novos golpes e boletins de inteligência digital.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{subMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@dominio.com"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#E00000]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-2.5 bg-[#E00000] text-white rounded hover:bg-[#FF1A1A] transition-colors flex items-center justify-center"
                    title="Assinar"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 font-sans leading-tight">
                  Zero spam. Seus dados nunca serão compartilhados. Consentimento LGPD garantido.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#E00000]" />
            <span>
              Finalidade estritamente defensiva e educativa. Nenhum dado pessoal sensível é coletado.
            </span>
          </div>
          <p className="font-tech text-[11px]">
            © {new Date().getFullYear()} E GUI 404 (恶鬼) · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
