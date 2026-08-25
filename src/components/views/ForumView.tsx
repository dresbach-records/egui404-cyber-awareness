import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Flame,
  Clock,
  Sparkles,
  ShieldAlert,
  Bell,
  Bookmark,
  Award,
  Users,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
  Tag,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  ForumCategory,
  ForumThread,
  ForumTag,
  ForumMember,
  ForumPost,
  ForumNotification
} from '../../types';
import { forumApi } from '../../services/api/forumApi';
import { notificationsApi } from '../../services/api/notificationsApi';
import { authApi } from '../../services/api/authApi';
import { getAccessLabel, type AuthenticatedAccessUser } from '../../services/api/access';
import { SoundEngine } from '../../services/audioService';
import { ForumThreadCard } from '../forum/ForumThreadCard';
import { ForumThreadDetail } from '../forum/ForumThreadDetail';
import { ForumCreateThreadModal } from '../forum/ForumCreateThreadModal';
import { ForumReportModal } from '../forum/ForumReportModal';
import { ForumGuidelinesModal } from '../forum/ForumGuidelinesModal';
import { ForumUserProfileModal } from '../forum/ForumUserProfileModal';

interface ForumViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
  initialThreadSlug?: string;
}

export const ForumView: React.FC<ForumViewProps> = ({
  onNavigate,
  language,
  initialThreadSlug
}) => {
  // Navigation & Active States
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'LATEST' | 'HOT' | 'POPULAR' | 'UNSOLVED' | 'BOOKMARKS'>('LATEST');
  const [activeThreadSlug, setActiveThreadSlug] = useState<string | null>(initialThreadSlug || null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<ForumMember | null>(null);
  const [reportModalData, setReportModalData] = useState<{
    isOpen: boolean;
    targetType: 'THREAD' | 'POST';
    targetId: string;
    targetTitle?: string;
  }>({
    isOpen: false,
    targetType: 'THREAD',
    targetId: ''
  });

  // Notifications dropdown state
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ForumNotification[]>([]);

  // Service Data State
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [activeThreadPosts, setActiveThreadPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthenticatedAccessUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const currentMember = useMemo<ForumMember | null>(() => {
    if (!currentUser) return null;
    return {
      id: currentUser.id,
      username: currentUser.username || currentUser.email || currentUser.id,
      displayName: currentUser.name || currentUser.username || currentUser.email || 'Usuário autenticado',
      role: currentUser.role || 'MEMBER',
      bio: '',
      joinedDate: currentUser.createdAt || new Date().toISOString(),
      reputation: 0,
      threadsCount: 0,
      repliesCount: 0,
      solutionsCount: 0,
      badges: []
    };
  }, [currentUser]);

  const tags = useMemo<ForumTag[]>(() => {
    const counts = new Map<string, number>();
    threads.forEach((thread) => thread.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return Array.from(counts, ([slug, count]) => ({ slug, name: slug, count }));
  }, [threads]);

  // Dados operacionais do fórum vêm exclusivamente da API oficial.
  const fetchForumData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const cats = await forumApi.getCategories(signal);
      setCategories(cats);

      // Tags são derivadas dos tópicos retornados pelo backend; notificações vêm da API.
      const fetchedNotifications = await notificationsApi.getNotifications(signal);
      setNotifications(fetchedNotifications);

      // Fetch threads
      const sortParam = activeTab === 'POPULAR' ? 'popular' : activeTab === 'UNSOLVED' ? 'unanswered' : 'recent';
      const categorySlugParam = activeCategorySlug !== 'ALL' ? activeCategorySlug : undefined;

      const res = await forumApi.getThreads(
        {
          categorySlug: categorySlugParam,
          tag: selectedTag || undefined,
          search: searchQuery.trim() || undefined,
          sort: sortParam
        },
        signal
      );
      let fetchedThreads = res.data || [];

      if (activeTab === 'BOOKMARKS') {
        fetchedThreads = fetchedThreads.filter((t) => t.isBookmarkedByMe);
      }

      setThreads(fetchedThreads);
    } catch (err) {
      if (!(err instanceof Error && err.name === 'AbortError')) {
        setError('Não foi possível sincronizar o fórum com o servidor.');
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [activeCategorySlug, selectedTag, searchQuery, activeTab]);

  useEffect(() => {
    const controller = new AbortController();
    authApi.getSession(controller.signal).then((user) => {
      if (controller.signal.aborted) return;
      setCurrentUser(user as AuthenticatedAccessUser | null);
      setIsCheckingSession(false);
      if (user) void fetchForumData(controller.signal);
      else setLoading(false);
    });
    return () => controller.abort();
  }, [fetchForumData]);

  useEffect(() => {
    if (initialThreadSlug) {
      setActiveThreadSlug(initialThreadSlug);
    }
  }, [initialThreadSlug]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Active Thread Data for Detail View
  const activeThread = useMemo(() => {
    if (!activeThreadSlug) return null;
    return threads.find((t) => t.slug === activeThreadSlug) || null;
  }, [activeThreadSlug, threads]);

  useEffect(() => {
    const controller = new AbortController();
    if (!activeThread) {
      setActiveThreadPosts([]);
      return () => controller.abort();
    }
    forumApi.getPosts(activeThread.id, undefined, controller.signal)
      .then((response) => setActiveThreadPosts(response.data))
      .catch((requestError) => {
        if (requestError instanceof Error && requestError.name !== 'AbortError') {
          setError('Não foi possível carregar as respostas deste tópico.');
        }
      });
    return () => controller.abort();
  }, [activeThread]);

  const handleOpenThread = (slug: string) => {
    SoundEngine.playClickSound();
    setActiveThreadSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToThreads = () => {
    SoundEngine.playClickSound();
    setActiveThreadSlug(null);
    fetchForumData();
  };

  const handleBookmarkToggle = async (threadId: string) => {
    try {
      await forumApi.toggleBookmark(threadId);
      fetchForumData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível salvar o tópico.');
    }
  };

  const handleTagFilter = (tag: string) => {
    SoundEngine.playClickSound();
    setSelectedTag((prev) => (prev === tag ? null : tag));
    setActiveThreadSlug(null);
  };

  const handleOpenUserProfile = (username: string) => {
    const member = threads
      .flatMap((thread) => [thread.author, ...activeThreadPosts.map((post) => post.author)])
      .find((candidate) => candidate.username === username);
    if (member) setSelectedMemberForModal(member);
  };

  if (isCheckingSession) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-mono text-xs text-neutral-400">Verificando sessão segura...</div>;
  }

  if (!currentUser) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4"><ShieldCheck className="mx-auto h-10 w-10 text-[#E00000]" /><h1 className="text-xl font-mono text-white">Fórum privado</h1><p className="text-sm text-neutral-400">Faça login para acessar discussões, posts, perfis e notificações.</p><div className="flex flex-wrap justify-center gap-3"><button type="button" onClick={() => onNavigate('/auth/login')} className="rounded-md bg-[#E00000] px-4 py-2 text-sm font-semibold text-white">Entrar</button><button type="button" onClick={() => onNavigate('/auth/register')} className="rounded-md border border-[#333] px-4 py-2 text-sm text-neutral-200">Criar conta</button></div></div>;
  }

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Top Banner / Header */}
      <div className="border-b border-[#1f1f1f] pb-6 space-y-3 font-tech">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
            <MessageSquare className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">
              E GUI 404 // DEFENSIVE COMMUNITY & THREAT EXCHANGE
            </span>
            {getAccessLabel(currentUser, language) && (
              <span className="border border-[#333] px-2 py-0.5 text-[10px] text-neutral-400 tracking-wider">
                {getAccessLabel(currentUser, language)}
              </span>
            )}
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-3">
            {/* Guidelines Button */}
            <button
              type="button"
              onClick={() => setIsGuidelinesModalOpen(true)}
              className="px-3 py-1.5 bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] rounded text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Diretrizes</span>
            </button>

            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifsOpen(!isNotifsOpen)}
                className="p-1.5 bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] rounded text-neutral-300 relative transition-colors cursor-pointer"
                title="Notificações"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E00000] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              {isNotifsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0d0d0d] border border-[#262626] rounded-lg shadow-2xl p-3 z-50 space-y-2 font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1f1f1f] text-xs">
                    <span className="font-bold text-white uppercase font-tech">Notificações</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await notificationsApi.markAllAsRead();
                        const refreshed = await notificationsApi.getNotifications();
                        setNotifications(refreshed);
                      }}
                      className="text-[10px] text-neutral-500 hover:text-neutral-300"
                    >
                      Marcar todas como lidas
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-4">Nenhuma notificação.</p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={async () => {
                            if (!notif.read) {
                              await notificationsApi.markAsRead(notif.id);
                              setNotifications((current) => current.map((item) => item.id === notif.id ? { ...item, read: true } : item));
                            }
                            setIsNotifsOpen(false);
                            if (notif.threadSlug) handleOpenThread(notif.threadSlug);
                          }}
                          className={`p-2.5 rounded text-xs cursor-pointer transition-colors ${
                            notif.read ? 'bg-[#121212] text-neutral-400' : 'bg-[#1a1414] border-l-2 border-[#E00000] text-white'
                          }`}
                        >
                          <p className="font-semibold text-neutral-200">{notif.title}</p>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">{notif.message}</p>
                          <span className="text-[9px] text-neutral-600 font-mono mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Create Thread Primary CTA */}
            <button
              type="button"
              onClick={() => {
                SoundEngine.playClickSound();
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-1.5 bg-[#E00000] hover:bg-[#b00000] text-white text-xs font-tech font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/30"
            >
              <Plus className="w-4 h-4" />
              NOVO TÓPICO
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-wider uppercase">
            FÓRUM DA COMUNIDADE DEFENSIVA
          </h1>
          <p className="text-neutral-400 font-sans text-xs sm:text-sm max-w-3xl">
            Troca de inteligência, análise comunitária de golpes recentes, suporte a vítimas de engenharia social e esclarecimento técnico sobre mecanismos de proteção (MED Pix, B.O. Digital e segurança de contas).
          </p>
        </div>
      </div>

      {/* Main Content Branch: Detail View or Thread Explorer */}
      {activeThread ? (
        <ForumThreadDetail
          thread={activeThread}
          posts={activeThreadPosts}
          currentMember={currentMember}
          onBack={handleBackToThreads}
          onRefresh={fetchForumData}
          onOpenReportModal={(type, id, title) =>
            setReportModalData({ isOpen: true, targetType: type, targetId: id, targetTitle: title })
          }
          onViewAuthor={handleOpenUserProfile}
          onTagClick={handleTagFilter}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left / Sidebar Column: Categories & Active Tags */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Category Navigation */}
            <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg space-y-3 font-tech">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-[#E00000]" />
                  CATEGORIAS
                </span>
              </div>

              <div className="space-y-1 font-sans text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategorySlug('ALL');
                    setSelectedTag(null);
                  }}
                  className={`w-full p-2.5 rounded text-left flex items-center justify-between transition-colors ${
                    activeCategorySlug === 'ALL'
                      ? 'bg-[#E00000]/15 text-[#FF4D4D] font-bold border-l-2 border-[#E00000]'
                      : 'text-neutral-400 hover:bg-[#141414] hover:text-white'
                  }`}
                >
                  <span>Todas as Categorias</span>
                  <span className="font-mono text-[11px] opacity-60">
                    {threads.length}
                  </span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setActiveCategorySlug(cat.slug);
                      setSelectedTag(null);
                    }}
                    className={`w-full p-2.5 rounded text-left flex items-center justify-between transition-colors ${
                      activeCategorySlug === cat.slug
                        ? 'bg-[#E00000]/15 text-[#FF4D4D] font-bold border-l-2 border-[#E00000]'
                        : 'text-neutral-400 hover:bg-[#141414] hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.title}</span>
                    <span className="font-mono text-[11px] opacity-60 shrink-0">{cat.threadsCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags Box */}
            <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg space-y-3 font-tech">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#00F0FF]" />
                  TAGS EM DESTAQUE
                </span>
                {selectedTag && (
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className="text-[10px] text-[#FF4D4D] hover:underline normal-case font-sans"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {tags.map((tag) => (
                  <button
                    key={tag.slug}
                    type="button"
                    onClick={() => handleTagFilter(tag.slug)}
                    className={`px-2 py-1 rounded text-[11px] transition-colors ${
                      selectedTag === tag.slug
                        ? 'bg-[#00F0FF] text-black font-bold'
                        : 'bg-[#141414] text-neutral-400 border border-[#222] hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="p-4 bg-gradient-to-br from-[#120808] to-[#0a0a0a] border border-[#E00000]/30 rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#FF4D4D] font-bold font-tech uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>FILTRO DEFENSIVO ATIVO</span>
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Todas as publicações passam por triagem preventiva contra vazamento de dados de vítimas e links de malware.
              </p>
            </div>
          </div>

          {/* Right / Main Stream: Search, Sort Tabs & Threads Feed */}
          <div className="space-y-6 lg:col-span-3">
            
            {/* Search and Filter Row */}
            <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar discussões, dúvidas sobre Pix, relatos de golpes..."
                  className="w-full bg-[#111] border border-[#262626] focus:border-[#FF1A1A] rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Sorting Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#161616]">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('LATEST')}
                    className={`px-3 py-1.5 rounded font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'LATEST'
                        ? 'bg-[#1a1a1a] text-white border border-neutral-700'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Recentes
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('HOT')}
                    className={`px-3 py-1.5 rounded font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'HOT'
                        ? 'bg-[#1a1a1a] text-white border border-neutral-700'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Em Alta
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('POPULAR')}
                    className={`px-3 py-1.5 rounded font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'POPULAR'
                        ? 'bg-[#1a1a1a] text-white border border-neutral-700'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Populares
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('UNSOLVED')}
                    className={`px-3 py-1.5 rounded font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'UNSOLVED'
                        ? 'bg-[#1a1a1a] text-white border border-neutral-700'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500" />
                    Sem Solução
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('BOOKMARKS')}
                    className={`px-3 py-1.5 rounded font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'BOOKMARKS'
                        ? 'bg-[#1a1a1a] text-[#FF4D4D] border border-[#E00000]/40'
                        : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Salvos
                  </button>
                </div>

                <span className="text-xs text-neutral-500 font-mono">
                  {threads.length} {threads.length === 1 ? 'tópico' : 'tópicos'}
                </span>
              </div>
            </div>

            {/* Active Filters Pill Bar if any */}
            {(activeCategorySlug !== 'ALL' || selectedTag || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span>Filtros aplicados:</span>
                {activeCategorySlug !== 'ALL' && (
                  <span className="px-2 py-0.5 bg-[#1a1a1a] border border-neutral-800 rounded text-neutral-300">
                    Categoria: {categories.find((c) => c.slug === activeCategorySlug)?.title}
                  </span>
                )}
                {selectedTag && (
                  <span className="px-2 py-0.5 bg-[#00F0FF]/15 border border-[#00F0FF]/30 text-[#00F0FF] rounded">
                    Tag: #{selectedTag}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 bg-neutral-800 rounded text-neutral-200">
                    Busca: "{searchQuery}"
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategorySlug('ALL');
                    setSelectedTag(null);
                    setSearchQuery('');
                  }}
                  className="text-xs text-[#E00000] hover:underline cursor-pointer ml-2"
                >
                  Limpar todos
                </button>
              </div>
            )}

            {/* Threads List Stream */}
            <div className="space-y-3">
              {loading ? (
                <div className="p-12 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-center space-y-3 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#E00000]" />
                  <p className="text-xs text-neutral-400 font-mono">Carregando discussões do fórum...</p>
                </div>
              ) : error ? (
                <div className="p-8 bg-[#0a0a0a] border border-red-900/40 rounded-lg text-center space-y-3">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                  <p className="text-xs text-red-400 font-mono">{error}</p>
                  <button
                    type="button"
                    onClick={() => fetchForumData()}
                    className="px-4 py-1.5 bg-[#1a1a1a] border border-neutral-700 text-xs rounded text-white hover:bg-neutral-800 cursor-pointer flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tentar Novamente</span>
                  </button>
                </div>
              ) : threads.length === 0 ? (
                <div className="p-12 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg text-center space-y-3">
                  <FileText className="w-10 h-10 text-neutral-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">Nenhum tópico encontrado</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Não encontramos discussões para os filtros selecionados. Seja o primeiro a criar um tópico nesta categoria!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-2 px-4 py-2 bg-[#E00000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded"
                  >
                    CRIAR NOVO TÓPICO
                  </button>
                </div>
              ) : (
                threads.map((thread) => (
                  <ForumThreadCard
                    key={thread.id}
                    thread={thread}
                    onClick={() => handleOpenThread(thread.slug)}
                    onTagClick={handleTagFilter}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      
      {/* Create Thread Modal */}
      {isCreateModalOpen && (
        <ForumCreateThreadModal
          categories={categories}
          tags={tags}
          initialCategorySlug={activeCategorySlug !== 'ALL' ? activeCategorySlug : undefined}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={(newSlug) => {
            setIsCreateModalOpen(false);
            fetchForumData();
            handleOpenThread(newSlug);
          }}
        />
      )}

      {/* Guidelines Modal */}
      {isGuidelinesModalOpen && (
        <ForumGuidelinesModal onClose={() => setIsGuidelinesModalOpen(false)} />
      )}

      {/* User Profile Modal */}
      {selectedMemberForModal && (
        <ForumUserProfileModal
          member={selectedMemberForModal}
          onClose={() => setSelectedMemberForModal(null)}
        />
      )}

      {/* Report Modal */}
      {reportModalData.isOpen && (
        <ForumReportModal
          targetType={reportModalData.targetType}
          targetId={reportModalData.targetId}
          targetTitle={reportModalData.targetTitle}
          onClose={() =>
            setReportModalData({ isOpen: false, targetType: 'THREAD', targetId: '' })
          }
        />
      )}
    </div>
  );
};
