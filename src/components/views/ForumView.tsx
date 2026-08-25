import React, { useState, useEffect, useMemo } from 'react';
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
  Tag
} from 'lucide-react';
import {
  ForumCategory,
  ForumThread,
  ForumTag,
  ForumMember,
  ForumNotification
} from '../../types';
import { ForumService } from '../../services/dataService';
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
  const [tags, setTags] = useState<ForumTag[]>([]);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [currentMember, setCurrentMember] = useState<ForumMember>(ForumService.getMembers()[0]);

  // Load Initial Data
  const refreshData = () => {
    const cats = ForumService.getCategories();
    const tgs = ForumService.getTags();
    const notifs = ForumService.getNotifications();
    setCategories(cats);
    setTags(tgs);
    setNotifications(notifs);

    const sortBy = activeTab === 'BOOKMARKS' ? 'LATEST' : activeTab;
    let list = ForumService.getThreads({
      categorySlug: activeCategorySlug !== 'ALL' ? activeCategorySlug : undefined,
      tag: selectedTag || undefined,
      search: searchQuery || undefined,
      sortBy
    });

    if (activeTab === 'BOOKMARKS') {
      list = list.filter((t) => t.isBookmarkedByMe);
    }

    setThreads(list);
  };

  useEffect(() => {
    refreshData();
  }, [activeCategorySlug, selectedTag, searchQuery, activeTab]);

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
    return ForumService.getThreadBySlug(activeThreadSlug);
  }, [activeThreadSlug, threads]);

  const activeThreadPosts = useMemo(() => {
    if (!activeThread) return [];
    return ForumService.getPosts(activeThread.id);
  }, [activeThread]);

  const handleOpenThread = (slug: string) => {
    SoundEngine.playClickSound();
    setActiveThreadSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToThreads = () => {
    SoundEngine.playClickSound();
    setActiveThreadSlug(null);
    refreshData();
  };

  const handleBookmarkToggle = (threadId: string) => {
    ForumService.toggleBookmarkThread(threadId);
    refreshData();
  };

  const handleTagFilter = (tag: string) => {
    SoundEngine.playClickSound();
    setSelectedTag((prev) => (prev === tag ? null : tag));
    setActiveThreadSlug(null);
  };

  const handleOpenUserProfile = (username: string) => {
    const member = ForumService.getMemberByUsername(username);
    if (member) {
      setSelectedMemberForModal(member);
    }
  };

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
                      onClick={() => {
                        ForumService.markAllNotificationsAsRead();
                        refreshData();
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
                          onClick={() => {
                            ForumService.markNotificationAsRead(notif.id);
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
          onRefresh={refreshData}
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
                    {ForumService.getThreads({}).length}
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
              {threads.length === 0 ? (
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
            refreshData();
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
