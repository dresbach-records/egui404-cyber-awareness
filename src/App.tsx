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
import { AuthView } from './components/views/AuthView';
import { ForumPages } from './components/views/ForumPages';
import { ForumShell } from './components/forum/ForumShell';
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
    const metadata: Record<string, { title: string; description: string }> = {
      '/': { title: 'E GUI 404 — Conscientização e Segurança Digital', description: 'Informação, educação e conscientização sobre golpes online, fraudes digitais, ameaças cibernéticas e segurança na internet.' },
      '/archive': { title: 'E GUI 404 — Arquivo de Ameaças e Fraudes', description: 'Arquivo público de informação sobre golpes online, fraudes digitais e ameaças cibernéticas.' },
      '/threats': { title: 'E GUI 404 — Ameaças Digitais', description: 'Informação pública para reconhecer e compreender ameaças digitais.' },
      '/cases': { title: 'E GUI 404 — Casos Reais de Fraudes Digitais', description: 'Casos documentados para educação e conscientização sobre fraudes digitais.' },
      '/forum': { title: 'E GUI 404 — Fórum Privado', description: 'Área comunitária privada do E GUI 404.' },
      '/auth/login': { title: 'E GUI 404 — Entrar', description: 'Entre na sua conta E GUI 404.' },
      '/auth/register': { title: 'E GUI 404 — Criar conta', description: 'Crie sua conta gratuita no E GUI 404.' },
      '/auth/login/admin': { title: 'E GUI 404 — Login Administrativo', description: 'Acesso administrativo restrito.' },
      '/education': { title: 'E GUI 404 — Educação em Segurança Digital', description: 'Conteúdos educativos para desenvolver hábitos mais seguros na internet.' },
      '/quiz': { title: 'E GUI 404 — Quiz de Segurança Digital', description: 'Teste seus conhecimentos sobre segurança digital.' },
      '/lab': { title: 'E GUI 404 — Laboratório', description: 'Ferramentas educativas para aprender sobre segurança digital.' },
      '/about': { title: 'E GUI 404 — Sobre o Projeto', description: 'Conheça o projeto E GUI 404 e sua proposta de conscientização digital.' },
      '/report': { title: 'E GUI 404 — Denunciar Golpe ou Fraude', description: 'Envie informações sobre um golpe ou fraude para análise responsável.' },
      '/contact': { title: 'E GUI 404 — Contato', description: 'Entre em contato com o projeto E GUI 404.' },
      '/alerts': { title: 'E GUI 404 — Alertas de Segurança', description: 'Alertas e informações públicas sobre segurança digital.' },
      '/methodology': { title: 'E GUI 404 — Metodologia', description: 'Conheça os critérios e a metodologia do E GUI 404.' },
      '/sources/rnp': { title: 'E GUI 404 — Fonte RNP', description: 'Informações sobre a fonte RNP utilizada pelo projeto.' },
      '/privacy': { title: 'E GUI 404 — Privacidade', description: 'Política de privacidade do E GUI 404.' },
      '/terms': { title: 'E GUI 404 — Termos de Uso', description: 'Termos de uso do E GUI 404.' },
      '/cookies': { title: 'E GUI 404 — Cookies', description: 'Informações sobre o uso de cookies no E GUI 404.' },
      '/editorial-policy': { title: 'E GUI 404 — Política Editorial', description: 'Política editorial do E GUI 404.' },
      '/disclaimer': { title: 'E GUI 404 — Disclaimer', description: 'Avisos e limitações das informações publicadas pelo E GUI 404.' },
      '/admin': { title: 'E GUI 404 — Administração', description: 'Área administrativa.' }
    };
    const fallback = cleanPath.startsWith('/archive/') ? metadata['/archive'] : cleanPath.startsWith('/education/') ? metadata['/education'] : cleanPath.startsWith('/forum/') ? metadata['/forum'] : { title: 'E GUI 404 — Página não encontrada', description: 'A página solicitada não foi encontrada.' };
    const currentMetadata = metadata[cleanPath] || fallback;
    const isPrivate = cleanPath === '/admin' || cleanPath.startsWith('/admin/') || cleanPath === '/forum' || cleanPath.startsWith('/forum/');
    const canonicalUrl = isPrivate ? 'https://egui404.fun/' : `https://egui404.fun${cleanPath === '/' ? '/' : cleanPath}`;
    document.title = currentMetadata.title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    document.querySelector('meta[name="description"]')?.setAttribute('content', currentMetadata.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', currentMetadata.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', currentMetadata.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', currentMetadata.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', currentMetadata.description);
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) robots.setAttribute('content', isPrivate ? 'noindex, nofollow' : 'index, follow');
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

    if (cleanPath === '/auth/login' || cleanPath === '/auth/register') {
      return <AuthView mode={cleanPath === '/auth/register' ? 'register' : 'login'} onNavigate={navigate} onAuthenticated={() => navigate('/forum')} />;
    }

    if (cleanPath === '/auth/login/admin') {
      return <AdminView onNavigate={navigate} language={language} />;
    }

    // Forum subpages are API-ready and intentionally do not invent backend data.
    if (cleanPath !== '/forum' && cleanPath.startsWith('/forum/')) {
      const forumPage = <ForumPages path={cleanPath} onNavigate={navigate} />;
      if (forumPage) return forumPage;
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

    // Admin Control Center: all administrative routes stay outside public navigation.
    if (cleanPath === '/admin' || cleanPath.startsWith('/admin/')) {
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

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/') || currentPath === '/auth/login/admin';
  const isForumRoute = currentPath === '/forum' || currentPath.startsWith('/forum/');

  return (
    <div
      className={`min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#E00000] selection:text-white flex flex-col ${
        reducedMotion ? '' : 'scanline-overlay'
      }`}
    >
      {/* Public shell is intentionally excluded from the Admin Control Center. */}
      {!isAdminRoute && !isForumRoute && <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={toggleReducedMotion}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        language={language}
        onToggleLanguage={toggleLanguage}
      />}

      {/* Main Content Stage */}
      <main className="flex-1">
        {isForumRoute ? <ForumShell currentPath={currentPath} onNavigate={navigate}>{renderView()}</ForumShell> : renderView()}
      </main>

      {/* Global Command Palette (⌘K) */}
      {!isAdminRoute && !isForumRoute && <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />}

      {/* LGPD Cookie & Privacy Banner */}
      {!isAdminRoute && !isForumRoute && <CookieBanner onNavigateLegal={navigate} />}

      {!isAdminRoute && !isForumRoute && <Footer onNavigate={navigate} language={language} />}
    </div>
  );
}
