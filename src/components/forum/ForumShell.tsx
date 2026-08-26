import React, { useEffect, useRef, useState } from 'react';
import { Bell, Bookmark, Camera, Compass, Home, LogOut, Menu, Search, Settings, Shield, TrendingUp, User, Users, X } from 'lucide-react';
import { authApi } from '../../services/api/authApi';
import { AuthSessionUser } from '../../services/api/types';

interface ForumShellProps { currentPath: string; onNavigate: (path: string) => void; children: React.ReactNode; }

const links = [
  { label: 'Início', path: '/forum', Icon: Home },
  { label: 'For You', path: '/forum/for-you', Icon: Compass },
  { label: 'Populares', path: '/forum/popular', Icon: TrendingUp },
  { label: 'Recentes', path: '/forum/recent', Icon: Compass },
  { label: 'Em alta', path: '/forum/trending', Icon: TrendingUp },
  { label: 'Explorar', path: '/forum/explore', Icon: Compass },
  { label: 'Comunidades', path: '/forum/communities', Icon: Users },
  { label: 'Criar comunidade', path: '/forum/community/create', Icon: Users },
  { label: 'Salvos', path: '/forum/saved', Icon: Bookmark },
  { label: 'Histórico', path: '/forum/history', Icon: Compass },
  { label: 'Notificações', path: '/forum/notifications', Icon: Bell },
  { label: 'Denúncias', path: '/forum/reports', Icon: Shield },
];

export const ForumShell: React.FC<ForumShellProps> = ({ currentPath, onNavigate, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<AuthSessionUser | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [sessionState, setSessionState] = useState<'checking' | 'authenticated' | 'guest'>('checking');
  useEffect(() => {
    const controller = new AbortController();
    authApi.getSession(controller.signal).then((user) => {
      if (!controller.signal.aborted) { setProfileUser(user); setSessionState(user ? 'authenticated' : 'guest'); }
    });
    return () => controller.abort();
  }, []);
  if (sessionState !== 'authenticated') return <>{children}</>;
  const go = (path: string) => { setDrawerOpen(false); onNavigate(path); };
  return (
    <div className="min-h-screen bg-[#070809] text-[#F5F5F5] font-sans">
      <header className="sticky top-0 z-40 border-b border-[#24272a] bg-[#090a0b]/95 backdrop-blur" aria-label="Navegação da comunidade">
        <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
          <button type="button" className="rounded p-2 text-[#A1A1AA] hover:bg-[#17191b] lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Abrir menu"><Menu className="h-5 w-5" /></button>
          <button type="button" onClick={() => go('/forum')} className="flex min-w-[190px] items-center gap-3 text-left">
            <span className="font-mono text-lg font-black tracking-tight"><span className="text-white">E GUI </span><span className="text-[#E00000]">404</span></span>
            <span className="border-l border-[#3a3a3a] pl-3 text-[10px] font-mono uppercase tracking-[0.22em] text-[#E00000]">Community</span>
          </button>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">{links.slice(0, 3).map(({ label, path }) => <button key={path} type="button" onClick={() => go(path)} className={`rounded px-3 py-2 text-sm ${currentPath === path ? 'bg-[#201012] text-[#FF5A5A]' : 'text-[#A1A1AA] hover:bg-[#17191b] hover:text-white'}`}>{label}</button>)}</nav>
          <label className="ml-auto flex max-w-xl flex-1 items-center gap-2 rounded-md border border-[#2b2e31] bg-[#111315] px-3 py-2 text-sm text-[#A1A1AA] focus-within:border-[#E00000]"><Search className="h-4 w-4 shrink-0" /><input aria-label="Pesquisar na comunidade" className="w-full bg-transparent outline-none placeholder:text-[#71757a]" placeholder="Pesquisar no Fórum E GUI 404" onKeyDown={(event) => { if (event.key === 'Enter') go(`/forum/search?q=${encodeURIComponent(event.currentTarget.value)}`); }} /></label>
          <button type="button" onClick={() => go('/forum/notifications')} className="rounded p-2 text-[#A1A1AA] hover:bg-[#17191b] hover:text-white" aria-label="Notificações"><Bell className="h-5 w-5" /></button>
          <button type="button" onClick={() => go('/forum/create')} className="hidden rounded-md bg-[#E00000] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b80000] sm:block">Criar publicação</button>
          <div className="relative">
            <button type="button" onClick={() => setProfileOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-[#733030] bg-[#260d0d] p-1 pr-2 text-left hover:border-[#E00000]" aria-haspopup="menu" aria-expanded={profileOpen} aria-label="Abrir menu do perfil"><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[#3a1111] font-mono text-xs text-[#FF5A5A]">{avatarPreview || profileUser?.avatarUrl ? <img src={avatarPreview || profileUser?.avatarUrl} alt="Foto do perfil" className="h-full w-full object-cover" /> : (profileUser?.name || 'EG').slice(0, 2).toUpperCase()}</span><span className="hidden max-w-28 truncate text-xs text-white sm:block">{profileUser?.name || 'Meu perfil'}</span></button>
            {profileOpen && <div role="menu" className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-[#2b2e31] bg-[#111315] p-2 shadow-2xl"><div className="border-b border-[#24272a] px-3 py-3"><p className="truncate text-sm font-semibold text-white">{profileUser?.name || 'Meu perfil'}</p><p className="truncate text-xs text-[#85898e]">{profileUser?.email || 'Conta Community'}</p></div><button type="button" role="menuitem" onClick={() => { setProfileOpen(false); go('/forum/me'); }} className="mt-2 flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-[#d5d7da] hover:bg-[#1b1e20]"><User className="h-4 w-4" />Ver perfil</button><button type="button" role="menuitem" onClick={() => avatarInputRef.current?.click()} className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-[#d5d7da] hover:bg-[#1b1e20]"><Camera className="h-4 w-4" />Alterar foto</button><button type="button" role="menuitem" onClick={() => { setProfileOpen(false); go('/forum/settings'); }} className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-[#d5d7da] hover:bg-[#1b1e20]"><Settings className="h-4 w-4" />Configurações</button><button type="button" role="menuitem" onClick={() => { setProfileOpen(false); void authApi.logout().then(() => go('/auth/login')); }} className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-[#FF7777] hover:bg-[#2a1515]"><LogOut className="h-4 w-4" />Sair</button></div>}
            <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) { event.target.value = ''; return; } setAvatarPreview(URL.createObjectURL(file)); setProfileOpen(false); }} />
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1600px]">
        <aside className={`fixed inset-y-16 left-0 z-30 w-72 border-r border-[#24272a] bg-[#090a0b] p-4 transition-transform lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-4 flex items-center justify-between lg:hidden"><span className="font-mono text-xs text-[#A1A1AA]">NAVEGAÇÃO</span><button type="button" onClick={() => setDrawerOpen(false)} aria-label="Fechar menu"><X className="h-5 w-5" /></button></div>
          <p className="mb-3 px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#71757a]">Comunidade</p>
          <nav className="space-y-1">{links.map(({ label, path, Icon }) => <button key={path} type="button" onClick={() => go(path)} className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm ${currentPath === path ? 'bg-[#201012] font-medium text-[#FF5A5A]' : 'text-[#A1A1AA] hover:bg-[#17191b] hover:text-white'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav>
          <div className="my-6 border-t border-[#24272a]" />
          <p className="mb-3 px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-[#71757a]">Segurança</p>
          <nav className="space-y-1"><button type="button" onClick={() => go('/forum/rules')} className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[#A1A1AA] hover:bg-[#17191b] hover:text-white">Regras da comunidade</button><button type="button" onClick={() => go('/forum/guidelines')} className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[#A1A1AA] hover:bg-[#17191b] hover:text-white">Guia de uso</button></nav>
          <div className="my-6 border-t border-[#24272a]" />
          <section aria-labelledby="categories-title" className="px-3">
            <div className="flex items-center justify-between"><p id="categories-title" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71757a]">Categorias</p><button type="button" onClick={() => go('/forum/categories/create')} className="text-[10px] font-semibold text-[#FF5A5A] hover:underline">Criar nova</button></div>
            <div className="mt-3 space-y-1"><button type="button" onClick={() => go('/forum/category/all')} className="flex w-full items-center justify-between rounded px-2 py-2 text-left text-sm text-[#A1A1AA] hover:bg-[#17191b] hover:text-white"><span>Todas as categorias</span><span className="text-xs text-[#71757a]">0</span></button><button type="button" onClick={() => go('/forum/category/security')} className="w-full rounded px-2 py-2 text-left text-sm text-[#A1A1AA] hover:bg-[#17191b] hover:text-white">Segurança digital</button><button type="button" onClick={() => go('/forum/category/scams')} className="w-full rounded px-2 py-2 text-left text-sm text-[#A1A1AA] hover:bg-[#17191b] hover:text-white">Golpes e fraudes</button></div>
          </section>
          <section aria-labelledby="tags-title" className="mt-5 px-3"><p id="tags-title" className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#71757a]">Tags em destaque</p><div className="mt-3 flex flex-wrap gap-1.5"><button type="button" onClick={() => go('/forum/search?q=phishing')} className="rounded-full border border-[#333] px-2 py-1 text-[11px] text-[#A1A1AA] hover:border-[#E00000] hover:text-white">#phishing</button><button type="button" onClick={() => go('/forum/search?q=malware')} className="rounded-full border border-[#333] px-2 py-1 text-[11px] text-[#A1A1AA] hover:border-[#E00000] hover:text-white">#malware</button><button type="button" onClick={() => go('/forum/search?q=privacidade')} className="rounded-full border border-[#333] px-2 py-1 text-[11px] text-[#A1A1AA] hover:border-[#E00000] hover:text-white">#privacidade</button></div></section>
          <div className="mt-5 rounded-md border border-[#332020] bg-[#160b0b] p-3 text-xs leading-5 text-[#A1A1AA]"><strong className="text-[#FF5A5A]">Filtro defensivo ativo</strong><br />Todas as publicações passam por triagem preventiva contra vazamento de dados de vítimas e links de malware.</div>
        </aside>
        {drawerOpen && <button type="button" aria-label="Fechar menu" className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setDrawerOpen(false)} />}
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="hidden w-72 shrink-0 border-l border-[#24272a] xl:block" aria-hidden="true" />
      </div>
    </div>
  );
};
