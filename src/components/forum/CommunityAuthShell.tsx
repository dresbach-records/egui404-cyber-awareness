import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface CommunityAuthShellProps {
  title: string;
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const CommunityAuthShell: React.FC<CommunityAuthShellProps> = ({ title, children, onNavigate }) => (
  <div className="min-h-screen bg-[#070809] text-[#F5F5F5] font-sans">
    <header className="border-b border-[#24272a] bg-[#090a0b]" aria-label="E GUI 404 Community">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <button type="button" onClick={() => onNavigate('/auth/login')} className="flex items-center gap-3" aria-label="E GUI 404 Community">
          <span className="font-mono text-lg font-black tracking-tight"><span className="text-white">E GUI </span><span className="text-[#E00000]">404</span></span>
          <span className="border-l border-[#3a3a3a] pl-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[#E00000]">Community</span>
        </button>
        <a href="https://www.egui404.fun/" className="flex items-center gap-2 text-sm text-[#A1A1AA] hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Voltar ao E GUI 404
        </a>
      </div>
    </header>
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-10">
      <section className="w-full max-w-md" aria-labelledby="community-auth-title">
        <p className="mb-3 text-center text-[10px] font-mono uppercase tracking-[0.28em] text-[#E00000]">E GUI 404 / COMMUNITY</p>
        <h1 id="community-auth-title" className="mb-7 text-center text-3xl font-semibold tracking-tight text-white">{title}</h1>
        {children}
      </section>
    </main>
  </div>
);
