import React from 'react';
import { Lock } from 'lucide-react';
import { FaInstagram, FaYoutube, FaTiktok, FaLinkedinIn, FaTelegram, FaXTwitter } from 'react-icons/fa6';
import { ApiHealthBadge } from './ui/ApiHealthBadge';

interface FooterProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {

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
                Fontes & Redes Oficiais:
              </span>
              <div className="flex flex-wrap items-center gap-2.5" aria-label="Redes sociais oficiais">
                {[
                  { label: 'Instagram', Icon: FaInstagram },
                  { label: 'YouTube', Icon: FaYoutube },
                  { label: 'TikTok', Icon: FaTiktok },
                  { label: 'LinkedIn', Icon: FaLinkedinIn },
                  { label: 'Telegram', Icon: FaTelegram },
                  { label: 'X', Icon: FaXTwitter },
                ].map(({ label, Icon }) => (
                  <span
                    key={label}
                    title={`${label} — canal oficial em configuração`}
                    aria-label={`${label} — canal oficial em configuração`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#292929] bg-[#0b0b0b] text-[#E00000] opacity-80"
                  >
                    <span className="[&>svg]:h-4 [&>svg]:w-4" aria-hidden="true"><Icon /></span>
                  </span>
                ))}
                <span className="ml-1 text-[10px] text-neutral-600">Canais oficiais em configuração.</span>
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
                <button onClick={() => onNavigate('/archive')} className="hover:text-white transition-colors cursor-pointer">
                  Scam Archive (Arquivo de Golpes)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/threats')} className="hover:text-white transition-colors cursor-pointer">
                  Threat Intelligence Matrix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cases')} className="hover:text-white transition-colors cursor-pointer">
                  Investigative Cases (Dossiês)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/forum')} className="hover:text-white text-[#FF4D4D] transition-colors cursor-pointer font-bold">
                  Comunidade / Fórum Defensivo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/alerts')} className="hover:text-white transition-colors cursor-pointer">
                  Boletim de Alertas Ativos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/education')} className="hover:text-white transition-colors cursor-pointer">
                  Cyber Education & Guias
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/quiz')} className="hover:text-white transition-colors cursor-pointer">
                  Simulador de Reconhecimento
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/lab')} className="hover:text-white transition-colors cursor-pointer">
                  Cyber Lab Interativo
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-neutral-700 pl-2">
              {language === 'pt' ? 'Fontes & Governança' : 'Sources & Governance'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/methodology')} className="hover:text-white text-[#FF7777] font-bold transition-colors cursor-pointer flex items-center gap-1">
                  <span>Metodologia & Fontes</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/archive/sources/rnp-cais')} className="hover:text-white text-neutral-300 transition-colors cursor-pointer flex items-center gap-1">
                  <span>Fonte: Catálogo RNP/CAIS</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors cursor-pointer">
                  Sobre O Observador
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/report')} className="hover:text-white transition-colors cursor-pointer text-amber-400">
                  Denunciar Golpe / Correção
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/editorial-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Política Editorial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacidade & LGPD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors cursor-pointer">
                  Termos de Uso & Responsabilidade
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contato Seguro & Chave PGP
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-neutral-600 hover:text-neutral-400 transition-colors text-[10px] cursor-pointer">
                  [Cockpit / Triagem Admin]
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-neutral-700 pl-2">
              Contato institucional
            </h4>
            <div className="flex flex-col gap-2 text-xs font-sans">
              <a href="mailto:contato@egui404.fun" className="hover:text-white transition-colors">contato@egui404.fun</a>
              <a href="mailto:suporte@egui404.fun" className="hover:text-white transition-colors">suporte@egui404.fun</a>
              <a href="mailto:seguranca@egui404.fun" className="hover:text-white transition-colors">seguranca@egui404.fun</a>
              <a href="mailto:denuncias@egui404.fun" className="hover:text-white transition-colors">denuncias@egui404.fun</a>
              <a href="mailto:privacidade@egui404.fun" className="hover:text-white transition-colors">privacidade@egui404.fun</a>
            </div>
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
            <p className="text-xs text-neutral-300 font-sans">
              Acompanhe o E GUI 404 pelo SIGNAL: <strong className="text-white">@egui404.fun</strong>
            </p>

            <div className="p-3 rounded bg-[#090909] border border-[#1e1e1e] text-xs text-neutral-400">
              <p className="font-mono text-[10px] tracking-wider text-amber-400">NEWSLETTER — BACKEND PENDENTE</p>
              <p className="mt-1 font-sans leading-relaxed">A inscrição será disponibilizada quando o endpoint oficial estiver configurado.</p>
            </div>
          </div>
        </div>

        {/* Legal & Educational Disclaimer */}
        <div className="py-6 border-b border-[#181818] text-[11px] text-[#777777] font-sans leading-relaxed space-y-2">
          <p>
            <strong className="text-[#AAAAAA]">Aviso Institucional & Educativo:</strong> Esta página tem função informativa e educativa. O conteúdo apresentado é exemplificativo e não exaustivo, uma vez que não é possível contemplar todos os casos de fraudes existentes. A ausência de determinado exemplar neste catálogo não significa que ele não seja válido ou real.
          </p>
          <p className="text-[10px] text-[#666666]">
            O E GUI 404 é uma plataforma independente de pesquisa e conscientização e não representa institucionalmente a RNP/CAIS ou outros órgãos governamentais citados.
          </p>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-sans">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E00000]" />
              <span>
                Finalidade estritamente defensiva e educativa. Em conformidade com a LGPD.
              </span>
            </div>
            <ApiHealthBadge />
          </div>
          <p className="font-tech text-[11px]">
            © {new Date().getFullYear()} E GUI 404 (恶鬼) · Cyber Awareness Platform.
          </p>
        </div>
      </div>
    </footer>
  );
};
