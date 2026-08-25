import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CommandPalette } from './components/ui/CommandPalette';
import { CookieBanner } from './components/ui/CookieBanner';
import { HomeView } from './components/views/HomeView';
import { ArchiveView } from './components/views/ArchiveView';
import { ThreatsView } from './components/views/ThreatsView';
import { CasesView } from './components/views/CasesView';
import { ForumView } from './components/views/ForumView';
import { EducationView } from './components/views/EducationView';
import { QuizView } from './components/views/QuizView';
import { LabView } from './components/views/LabView';
import { AboutView } from './components/views/AboutView';
import { ReportView } from './components/views/ReportView';
import { ContactView } from './components/views/ContactView';
import { AlertsView } from './components/views/AlertsView';
import { AdminView } from './components/views/AdminView';
import { LegalView } from './components/views/LegalViews';
import { RnpSourceView } from './components/views/RnpSourceView';
import { MethodologyView } from './components/views/MethodologyView';
import { NotFoundView } from './components/views/NotFoundView';
import { SoundEngine } from './services/audioService';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname || '/';
      return path === '' ? '/' : path;
    }
    return '/';
  });

  // Global App State
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // SEO title and robots metadata for the client-side routes.
  useEffect(() => {
    const cleanPath = currentPath.split('?')[0];
    const titles: Record<string, string> = {
      '/': 'E GUI 404 — Conscientização e Segurança Digital',
      '/archive': 'E GUI 404 — Arquivo de Ameaças',
      '/threats': 'E GUI 404 — Inteligência de Ameaças',
      '/cases': 'E GUI 404 — Casos Reais',
      '/forum': 'E GUI 404 — Fórum',
      '/education': 'E GUI 404 — Educação',
      '/quiz': 'E GUI 404 — Quiz de Segurança Digital',
      '/lab': 'E GUI 404 — Laboratório',
      '/about': 'E GUI 404 — Sobre o Projeto',
      '/report': 'E GUI 404 — Denunciar Golpe',
      '/contact': 'E GUI 404 — Contato',
      '/alerts': 'E GUI 404 — Alertas',
      '/methodology': 'E GUI 404 — Metodologia',
      '/sources/rnp': 'E GUI 404 — Fonte RNP',
      '/privacy': 'E GUI 404 — Privacidade',
      '/terms': 'E GUI 404 — Termos de Uso',
      '/cookies': 'E GUI 404 — Cookies',
      '/editorial-policy': 'E GUI 404 — Política Editorial',
      '/disclaimer': 'E GUI 404 — Disclaimer',
      '/admin': 'E GUI 404 — Administração'
    };
    const title = titles[cleanPath] || (cleanPath.startsWith('/archive/') ? 'E GUI 404 — Arquivo de Ameaças' : cleanPath.startsWith('/education/') ? 'E GUI 404 — Educação' : cleanPath.startsWith('/forum/') ? 'E GUI 404 — Fórum' : 'E GUI 404 — Página não encontrada');
    const canonicalUrl = `https://egui404.fun${cleanPath === '/' ? '/' : cleanPath}`;
    document.title = title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', cleanPath === '/admin' || cleanPath.startsWith('/admin/') ? 'noindex, nofollow' : 'index, follow');
  }, [currentPath]);

  // Sync with browser history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        SoundEngine.playKeyClick();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    SoundEngine.setEnabled(nextState);
    if (nextState) {
      SoundEngine.playSuccessSound();
    }
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  const toggleLanguage = () => {
    SoundEngine.playKeyClick();
    setLanguage((prev) => (prev === 'pt' ? 'en' : 'pt'));
  };

  // Route Resolver
  const renderView = () => {
    const cleanPath = currentPath.split('?')[0];

    // Home
    if (cleanPath === '/' || cleanPath === '') {
      return <HomeView onNavigate={navigate} language={language} />;
    }

    // RNP / CAIS Dedicated Source Profile
    if (cleanPath === '/archive/sources/rnp-cais' || cleanPath === '/archive/sources/rnp' || cleanPath === '/sources/rnp') {
      return <RnpSourceView onNavigate={navigate} language={language} />;
    }

    // Scam Archive with potential slug: /archive or /archive/:slug
    if (cleanPath === '/archive' || cleanPath.startsWith('/archive/')) {
      const slug = cleanPath.startsWith('/archive/') ? cleanPath.replace('/archive/', '') : undefined;
      return <ArchiveView initialSlug={slug} onNavigate={navigate} language={language} />;
    }

    // Methodology & Standards
    if (cleanPath === '/methodology') {
      return <MethodologyView onNavigate={navigate} language={language} />;
    }

    // Threat Intelligence Matrix
    if (cleanPath === '/threats') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id') || undefined;
      return <ThreatsView initialThreatId={id} onNavigate={navigate} language={language} />;
    }

    // Case Files Dossiers
    if (cleanPath === '/cases') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id') || undefined;
      return <CasesView initialCaseId={id} onNavigate={navigate} language={language} />;
    }

    // Community Forum: /forum or /forum/topic/:slug
    if (cleanPath === '/forum' || cleanPath.startsWith('/forum/')) {
      let slug: string | undefined = undefined;
      if (cleanPath.startsWith('/forum/topic/')) {
        slug = cleanPath.replace('/forum/topic/', '');
      } else if (cleanPath.startsWith('/forum/')) {
        const seg = cleanPath.replace('/forum/', '');
        if (seg && !seg.startsWith('category/')) {
          slug = seg;
        }
      }
      return <ForumView initialThreadSlug={slug} onNavigate={navigate} language={language} />;
    }

    // Cyber Education with potential slug: /education or /education/:slug
    if (cleanPath === '/education' || cleanPath.startsWith('/education/')) {
      const slug = cleanPath.startsWith('/education/') ? cleanPath.replace('/education/', '') : undefined;
      return <EducationView initialSlug={slug} onNavigate={navigate} language={language} />;
    }

    // Interactive Quiz / Simulator
    if (cleanPath === '/quiz') {
      return <QuizView onNavigate={navigate} language={language} />;
    }

    // Cyber Lab
    if (cleanPath === '/lab') {
      return <LabView onNavigate={navigate} language={language} />;
    }

    // About & Philosophy
    if (cleanPath === '/about') {
      return <AboutView onNavigate={navigate} language={language} />;
    }

    // Whistleblower / Incident Report
    if (cleanPath === '/report') {
      return <ReportView onNavigate={navigate} language={language} />;
    }

    // Contact
    if (cleanPath === '/contact') {
      return <ContactView onNavigate={navigate} language={language} />;
    }

    // Scam Alerts Feed
    if (cleanPath === '/alerts') {
      return <AlertsView onNavigate={navigate} language={language} />;
    }

    // Admin Cockpit Preview
    if (cleanPath === '/admin') {
      return <AdminView onNavigate={navigate} language={language} />;
    }

    // Legal & Governance Pages
    if (cleanPath === '/privacy') {
      return <LegalView type="privacy" onNavigate={navigate} language={language} />;
    }
    if (cleanPath === '/terms') {
      return <LegalView type="terms" onNavigate={navigate} language={language} />;
    }
    if (cleanPath === '/cookies') {
      return <LegalView type="cookies" onNavigate={navigate} language={language} />;
    }
    if (cleanPath === '/editorial-policy') {
      return <LegalView type="editorial-policy" onNavigate={navigate} language={language} />;
    }
    if (cleanPath === '/disclaimer') {
      return <LegalView type="disclaimer" onNavigate={navigate} language={language} />;
    }

    // 404 Fallback
    return <NotFoundView onNavigate={navigate} language={language} />;
  };

  return (
    <div
      className={`min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#E00000] selection:text-white flex flex-col ${
        reducedMotion ? '' : 'scanline-overlay'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        language={language}
        onToggleLanguage={toggleLanguage}
      />

      {/* Main Content Stage */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* LGPD Cookie & Privacy Banner */}
      <CookieBanner onNavigateLegal={navigate} />

      {/* Footer */}
      <Footer onNavigate={navigate} language={language} />
    </div>
  );
}
