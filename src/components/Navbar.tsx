import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  ShieldAlert,
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
  Eye,
  Flag,
  Globe,
  Radio
} from 'lucide-react';
import { SoundEngine } from '../services/audioService';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  language: 'pt' | 'en';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  reducedMotion,
  onToggleReducedMotion,
  soundEnabled,
  onToggleSound,
  language,
  onToggleLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: language === 'pt' ? 'ARQUIVO' : 'ARCHIVE', path: '/archive' },
    { label: language === 'pt' ? 'AMEAÇAS' : 'THREATS', path: '/threats' },
    { label: language === 'pt' ? 'CASOS' : 'CASES', path: '/cases' },
    { label: language === 'pt' ? 'EDUCAÇÃO' : 'EDUCATION', path: '/education' },
    { label: language === 'pt' ? 'SIMULADOR' : 'SIMULATOR', path: '/quiz' },
    { label: language === 'pt' ? 'LAB' : 'LAB', path: '/lab' },
    { label: language === 'pt' ? 'SOBRE' : 'ABOUT', path: '/about' }
  ];

  const handleNavClick = (path: string) => {
    SoundEngine.playKeyClick();
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation"
      className={`sticky top-0 z-40 transition-all duration-200 font-tech ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#1f1f1f] shadow-lg shadow-black/60'
          : 'bg-[#050505]/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Logo Glyph */}
            <div className="w-9 h-9 rounded bg-[#0e0e0e] border border-[#E00000]/60 group-hover:border-[#FF1A1A] flex items-center justify-center relative overflow-hidden transition-all shadow-[0_0_12px_rgba(224,0,0,0.2)]">
              <span className="font-tech font-black text-sm text-[#F5F5F5] group-hover:text-white">
                恶鬼
              </span>
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#E00000]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl text-white tracking-wider">
                  E GUI 404
                </span>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 bg-[#E00000]/20 text-[#FF5555] border border-[#E00000]/40 rounded uppercase font-bold">
                  DEFENSIVE
                </span>
              </div>
              <span className="block text-[9px] text-[#777777] font-tech tracking-widest uppercase -mt-1 group-hover:text-neutral-300 transition-colors">
                CYBER CRIME AWARENESS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-all relative ${
                    isActive
                      ? 'text-[#FF1A1A] bg-[#E00000]/10 border border-[#E00000]/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#E00000] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Search, Sound, Reduce Motion, Language, Report */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Live Signal Beacon */}
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-neutral-900/80 border border-neutral-800 rounded text-[10px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 radar-beacon" />
              <span>SIGNAL: ACTIVE</span>
            </div>

            {/* Quick Search */}
            <button
              onClick={() => {
                SoundEngine.playKeyClick();
                onOpenSearch();
              }}
              title="Pesquisa Global (Cmd+K)"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-[#444] transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5 text-[#FF1A1A]" />
              <span className="hidden md:inline text-neutral-400 text-[11px]">Buscar</span>
              <kbd className="hidden md:inline text-[9px] px-1 bg-neutral-800 rounded text-neutral-500">
                ⌘K
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
              }}
              title={soundEnabled ? 'Desativar Sons' : 'Ativar Efeitos Sonoros'}
              className={`p-1.5 rounded border transition-colors ${
                soundEnabled
                  ? 'bg-[#E00000]/15 border-[#E00000]/40 text-[#FF5555]'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reduced Motion */}
            <button
              onClick={onToggleReducedMotion}
              title={reducedMotion ? 'Ativar Animações' : 'Modo Movimento Reduzido'}
              className={`p-1.5 rounded border transition-colors ${
                reducedMotion
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-400'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              title="Alterar Idioma (PT / EN)"
              className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-[11px] font-bold uppercase transition-colors flex items-center gap-1"
            >
              <Globe className="w-3 h-3 text-[#FF1A1A]" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Report CTA */}
            <button
              onClick={() => handleNavClick('/report')}
              className="px-3.5 py-1.5 rounded bg-[#E00000] text-white hover:bg-[#FF1A1A] transition-all font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(224,0,0,0.3)] hover:shadow-[0_0_18px_rgba(224,0,0,0.5)]"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'DENUNCIAR' : 'REPORT'}</span>
            </button>
          </div>

          {/* Mobile Menu & Search Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => {
                SoundEngine.playKeyClick();
                onOpenSearch();
              }}
              className="p-2 rounded bg-neutral-900 text-neutral-300 border border-neutral-800"
              title="Buscar"
            >
              <Search className="w-4 h-4 text-[#FF1A1A]" />
            </button>

            <button
              onClick={() => {
                SoundEngine.playKeyClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded bg-neutral-900 text-neutral-300 border border-neutral-800"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a] border-b border-[#222222] px-4 py-4 space-y-2 font-tech animate-in fade-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-2 rounded text-left text-xs font-bold tracking-wider border transition-colors ${
                    isActive
                      ? 'bg-[#E00000]/15 border-[#E00000] text-[#FF5555]'
                      : 'bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2 flex-wrap">
            <button
              onClick={() => handleNavClick('/report')}
              className="w-full py-2.5 rounded bg-[#E00000] text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Flag className="w-4 h-4" />
              <span>{language === 'pt' ? 'DENUNCIAR GOLPE' : 'REPORT A SCAM'}</span>
            </button>

            <div className="flex items-center justify-between w-full pt-2 text-xs text-neutral-400">
              <button
                onClick={onToggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded"
              >
                <Globe className="w-3.5 h-3.5 text-[#FF1A1A]" />
                <span>IDIOMA: {language.toUpperCase()}</span>
              </button>

              <button
                onClick={onToggleSound}
                className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#FF1A1A]" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>SOM: {soundEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
