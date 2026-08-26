import React, { useEffect, useState } from 'react';
import { Bell, Bookmark, ChevronDown, FileText, Flag, Search, Settings, Shield, TrendingUp, Users } from 'lucide-react';
import { authApi } from '../../services/api/authApi';

interface ForumPagesProps { path: string; onNavigate: (path: string) => void; }

const nav = (onNavigate: ForumPagesProps['onNavigate'], path: string) => onNavigate(path);

const PageShell: React.FC<React.PropsWithChildren<{ title: string; eyebrow?: string; onNavigate: ForumPagesProps['onNavigate'] }>> = ({ title, eyebrow, children, onNavigate }) => (
  <div className="min-h-[75vh] bg-[#050505] text-[#F5F5F5]">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => nav(onNavigate, '/forum')} className="mb-8 text-xs font-mono text-[#E00000] hover:underline">← Voltar ao fórum</button>
      {eyebrow && <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#E00000]">{eyebrow}</p>}
      <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <div className="mt-8">{children}</div>
    </div>
  </div>
);

const BackendState: React.FC<{ label: string; icon: React.ReactNode }> = ({ label, icon }) => (
  <section className="rounded-lg border border-[#252525] bg-[#0B0B0B] p-8 text-center">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#333] text-[#E00000]">{icon}</div>
    <h2 className="text-base font-medium text-white">{label}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#A1A1AA]">Este recurso será carregado pela API oficial quando o contrato estiver disponível.</p>
    <span className="mt-5 inline-flex rounded border border-[#442020] bg-[#1b0808] px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#FF5A5A]">Backend pendente</span>
  </section>
);

const Rules: React.FC<ForumPagesProps> = ({ onNavigate }) => <PageShell title="Regras da comunidade" eyebrow="Governança" onNavigate={onNavigate}><div className="grid gap-3 md:grid-cols-2">{['Respeito acima de tudo', 'Proibido spam e autopromoção', 'Não divulgar dados pessoais', 'Não publicar acusações sem evidências', 'Citar fontes quando possível', 'Denunciar conteúdo suspeito', 'Não realizar perseguição ou doxxing', 'Respeitar a legislação vigente'].map((rule, i) => <article key={rule} className="border border-[#252525] bg-[#0B0B0B] p-5"><span className="font-mono text-xs text-[#E00000]">{String(i + 1).padStart(2, '0')}</span><h2 className="mt-3 text-sm font-medium text-white">{rule}</h2><p className="mt-2 text-sm leading-6 text-[#A1A1AA]">Conteúdo e interações devem contribuir para uma comunidade segura, responsável e educativa.</p></article>)}</div></PageShell>;

const Guidelines: React.FC<ForumPagesProps> = ({ onNavigate }) => <PageShell title="Guia de uso" eyebrow="Primeiros passos" onNavigate={onNavigate}><div className="space-y-3">{['Como publicar uma ocorrência', 'Como comentar e responder', 'Como votar e salvar', 'Como citar fontes', 'Como denunciar um conteúdo'].map((item) => <details key={item} className="group border border-[#252525] bg-[#0B0B0B] p-5"><summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">{item}<ChevronDown className="h-4 w-4 text-[#E00000] transition-transform group-open:rotate-180" /></summary><p className="mt-4 max-w-2xl text-sm leading-6 text-[#A1A1AA]">Use as ferramentas da comunidade com responsabilidade. A validação e publicação definitiva dependem da API oficial e das regras de moderação.</p></details>)}</div></PageShell>;

const Create: React.FC<ForumPagesProps> = ({ onNavigate }) => { const [type, setType] = useState('Texto'); return <PageShell title="Criar publicação" eyebrow="Comunidade" onNavigate={onNavigate}><form className="max-w-3xl space-y-5 rounded-lg border border-[#252525] bg-[#0B0B0B] p-5" onSubmit={(e) => e.preventDefault()}><label className="block text-sm">Comunidade<select className="mt-2 w-full rounded border border-[#333] bg-[#050505] p-3 text-sm"><option>Selecione uma comunidade</option></select></label><div className="flex flex-wrap gap-2">{['Texto', 'Imagem', 'Link', 'Enquete', 'Código'].map((item) => <button type="button" key={item} onClick={() => setType(item)} className={`rounded border px-3 py-2 text-xs ${type === item ? 'border-[#E00000] text-[#FF5A5A]' : 'border-[#333] text-[#A1A1AA]'}`}>{item}</button>)}</div><label className="block text-sm">Título<input required className="mt-2 w-full rounded border border-[#333] bg-[#050505] p-3 text-sm outline-none focus:border-[#E00000]" placeholder="Título da publicação" /></label><label className="block text-sm">Conteúdo<textarea required className="mt-2 min-h-40 w-full rounded border border-[#333] bg-[#050505] p-3 text-sm outline-none focus:border-[#E00000]" placeholder="Compartilhe informações com contexto e fontes." /></label><p className="text-xs text-[#777]">Validação definitiva e publicação: API oficial.</p><button type="submit" className="rounded bg-[#E00000] px-5 py-3 text-sm font-semibold text-white">Publicar</button></form></PageShell>; };

export const ForumPages: React.FC<ForumPagesProps> = ({ path, onNavigate }) => {
  const [sessionState, setSessionState] = useState<'checking' | 'authenticated' | 'guest'>('checking');

  useEffect(() => {
    const controller = new AbortController();
    authApi.getSession(controller.signal).then((user) => {
      if (!controller.signal.aborted) setSessionState(user ? 'authenticated' : 'guest');
    });
    return () => controller.abort();
  }, []);

  if (sessionState === 'checking') return <div className="min-h-[75vh] bg-[#050505] p-12 text-center font-mono text-xs text-[#A1A1AA]">Verificando sessão segura...</div>;
  if (sessionState === 'guest') return <PageShell title="Fórum privado" eyebrow="Acesso restrito" onNavigate={onNavigate}><section className="max-w-xl rounded-lg border border-[#252525] bg-[#0B0B0B] p-8"><p className="text-sm leading-6 text-[#A1A1AA]">Entre para participar da comunidade E GUI 404. Nenhum conteúdo privado foi carregado.</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={() => onNavigate('/auth/login')} className="rounded bg-[#E00000] px-4 py-2 text-sm font-semibold text-white">Entrar</button><button onClick={() => onNavigate('/auth/register')} className="rounded border border-[#333] px-4 py-2 text-sm text-white">Criar conta</button></div></section></PageShell>;

  if (path === '/forum/rules') return <Rules onNavigate={onNavigate} path={path} />;
  if (path === '/forum/guidelines') return <Guidelines onNavigate={onNavigate} path={path} />;
  if (path === '/forum/create') return <Create onNavigate={onNavigate} path={path} />;
  if (path === '/forum/popular') return <PageShell title="Publicações populares" eyebrow="Em alta" onNavigate={onNavigate}><BackendState label="Publicações populares da API" icon={<TrendingUp className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/recent') return <PageShell title="Publicações recentes" eyebrow="Atualizações" onNavigate={onNavigate}><BackendState label="Publicações recentes da API" icon={<FileText className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/communities') return <PageShell title="Comunidades" eyebrow="Explorar" onNavigate={onNavigate}><BackendState label="Comunidades da API" icon={<Users className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/search') return <PageShell title="Pesquisa global" eyebrow="Buscar" onNavigate={onNavigate}><div className="mb-5 flex max-w-2xl items-center gap-3 rounded border border-[#333] bg-[#0B0B0B] px-4 py-3"><Search className="h-4 w-4 text-[#E00000]" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Pesquisar posts, comunidades, usuários e tags" /></div><BackendState label="Resultados da API" icon={<Search className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/saved') return <PageShell title="Salvos" eyebrow="Sua biblioteca" onNavigate={onNavigate}><BackendState label="Publicações salvas" icon={<Bookmark className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/notifications') return <PageShell title="Notificações" eyebrow="Atividade" onNavigate={onNavigate}><BackendState label="Notificações da API" icon={<Bell className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/reports') return <PageShell title="Minhas denúncias" eyebrow="Segurança" onNavigate={onNavigate}><BackendState label="Status dos reports" icon={<Flag className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/settings') return <PageShell title="Configurações" eyebrow="Conta" onNavigate={onNavigate}><BackendState label="Preferências da conta" icon={<Settings className="h-5 w-5" />} /></PageShell>;
  if (path.startsWith('/forum/community/')) return <PageShell title={path.split('/').pop()?.replaceAll('-', ' ') || 'Comunidade'} eyebrow="Comunidade" onNavigate={onNavigate}><BackendState label="Dados da comunidade" icon={<Users className="h-5 w-5" />} /></PageShell>;
  if (path.startsWith('/forum/u/')) return <PageShell title={`Perfil @${path.split('/').pop()}`} eyebrow="Membro" onNavigate={onNavigate}><BackendState label="Perfil da API" icon={<Shield className="h-5 w-5" />} /></PageShell>;
  if (path.startsWith('/forum/post/')) return <PageShell title="Publicação" eyebrow="Discussão" onNavigate={onNavigate}><BackendState label="Publicação e comentários" icon={<FileText className="h-5 w-5" />} /></PageShell>;
  if (path === '/forum/moderation') return <PageShell title="Moderação" eyebrow="Área restrita" onNavigate={onNavigate}><BackendState label="Permissões de moderação" icon={<Shield className="h-5 w-5" />} /></PageShell>;
  return null;
};
