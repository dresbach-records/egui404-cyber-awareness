import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  Heart,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ShieldCheck,
  Award,
  Send,
  CornerDownRight,
  Clock,
  Sparkles,
  Lock,
  Pin
} from 'lucide-react';
import { ForumThread, ForumPost, ForumMember } from '../../types';
import { ForumService, ContentSafetyService } from '../../services/dataService';
import { forumApi } from '../../services/api/forumApi';
import { SoundEngine } from '../../services/audioService';

interface ForumThreadDetailProps {
  thread: ForumThread;
  posts: ForumPost[];
  currentMember: ForumMember;
  onBack: () => void;
  onRefresh: () => void;
  onOpenReportModal: (targetType: 'THREAD' | 'POST', targetId: string, title: string) => void;
  onViewAuthor: (username: string) => void;
  onTagClick: (tag: string) => void;
}

export const ForumThreadDetail: React.FC<ForumThreadDetailProps> = ({
  thread,
  posts,
  currentMember,
  onBack,
  onRefresh,
  onOpenReportModal,
  onViewAuthor,
  onTagClick
}) => {
  const [replyText, setReplyText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [quotingPost, setQuotingPost] = useState<ForumPost | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isThreadAuthor = thread.authorId === currentMember.id;
  const isModOrAdmin = currentMember.role === 'ADMIN' || currentMember.role === 'MODERATOR';

  const handleLikeThread = async () => {
    SoundEngine.playClickSound();
    try {
      await forumApi.toggleLike(thread.id);
    } catch {}
    ForumService.toggleLikeThread(thread.id);
    onRefresh();
  };

  const handleBookmarkThread = async () => {
    SoundEngine.playClickSound();
    try {
      await forumApi.toggleBookmark(thread.id);
    } catch {}
    ForumService.toggleBookmarkThread(thread.id);
    onRefresh();
  };

  const handleLikePost = (postId: string) => {
    SoundEngine.playClickSound();
    ForumService.toggleLikePost(thread.id, postId);
    onRefresh();
  };

  const handleMarkSolution = async (postId: string) => {
    SoundEngine.playSuccessSound();
    try {
      await forumApi.markSolution(thread.id, postId);
    } catch {}
    ForumService.markPostAsSolution(thread.id, postId);
    onRefresh();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Content Safety check
    const check = ContentSafetyService.analyzeText(replyText);
    if (check.status === 'BLOCK') {
      setErrorMsg(check.flaggedReasons.join(' ') || 'Conteúdo bloqueado por segurança.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      try {
        await forumApi.createPost(thread.id, {
          content: replyText,
          quotedPostId: quotingPost ? quotingPost.id : undefined,
          sourceUrl: sourceUrl || undefined
        });
      } catch {}

      const result = ForumService.createPost(thread.id, {
        content: replyText,
        sourceUrl: sourceUrl || undefined,
        quotedPostId: quotingPost ? quotingPost.id : undefined
      });

      if (result.success) {
        SoundEngine.playSuccessSound();
        setReplyText('');
        setSourceUrl('');
        setQuotingPost(null);
        onRefresh();
      } else {
        setErrorMsg(result.error || 'Erro ao enviar resposta.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao enviar resposta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const solutionPost = posts.find((p) => p.isSolution);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1f1f1f]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#111] hover:bg-[#1c1c1c] border border-[#262626] rounded text-xs text-neutral-300 font-tech font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> VOLTAR AO FÓRUM
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBookmarkThread}
            className={`px-3 py-1.5 border rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              thread.isBookmarkedByMe
                ? 'bg-[#E00000]/15 border-[#E00000] text-[#FF4D4D]'
                : 'bg-[#111] border-[#262626] text-neutral-300 hover:bg-[#1a1a1a]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            {thread.isBookmarkedByMe ? 'Salvo' : 'Salvar'}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-[#111] hover:bg-[#1a1a1a] border border-[#262626] rounded text-xs text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copiedLink ? 'Link Copiado!' : 'Compartilhar'}
          </button>

          <button
            type="button"
            onClick={() => onOpenReportModal('THREAD', thread.id, thread.title)}
            className="px-3 py-1.5 bg-[#111] hover:bg-red-950/40 border border-[#262626] hover:border-red-800 rounded text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Denunciar conteúdo irregular"
          >
            <Flag className="w-3.5 h-3.5" />
            Denunciar
          </button>
        </div>
      </div>

      {/* Main Thread Content Card */}
      <div className={`p-6 sm:p-8 bg-[#0a0a0a] border rounded-lg space-y-6 ${
        thread.isPinned
          ? 'border-[#E00000]/50 shadow-lg shadow-red-950/20'
          : 'border-[#1f1f1f]'
      }`}>
        {/* Badges and Category Line */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {thread.isPinned && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#E00000]/20 border border-[#E00000] text-[#FF4D4D] font-mono font-bold text-[10px] uppercase">
              <Pin className="w-3 h-3" /> TÓPICO FIXADO PELA MODERAÇÃO
            </span>
          )}
          {thread.hasSolution && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-500 text-emerald-400 font-mono font-bold text-[10px] uppercase">
              <CheckCircle2 className="w-3 h-3" /> RESOLVIDO
            </span>
          )}
          <span className="px-2 py-0.5 bg-[#171717] border border-[#262626] text-neutral-400 font-tech font-bold text-[11px] rounded uppercase">
            {thread.categoryName}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight font-display tracking-wide">
          {thread.title}
        </h1>

        {/* Author Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#181818] text-xs">
          <div
            onClick={() => onViewAuthor(thread.author.username)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white group-hover:border-[#E00000] transition-colors">
              {thread.author.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-200 group-hover:text-[#FF3333] transition-colors text-sm">
                  {thread.author.displayName}
                </span>
                {thread.author.role === 'ADMIN' && (
                  <span className="px-1.5 py-0.2 bg-[#E00000]/20 border border-[#E00000]/50 text-[#FF4D4D] text-[9px] font-bold rounded">
                    ADMIN
                  </span>
                )}
                {thread.author.role === 'MODERATOR' && (
                  <span className="px-1.5 py-0.2 bg-orange-950 border border-orange-500/50 text-orange-400 text-[9px] font-bold rounded">
                    MOD
                  </span>
                )}
                {thread.author.verifiedSource && (
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" title="Pesquisador Verificado" />
                )}
              </div>
              <span className="text-neutral-500 text-[11px]">
                @{thread.author.username} · {thread.author.reputation} pontos de reputação
              </span>
            </div>
          </div>

          <div className="text-right text-neutral-500 text-xs font-mono">
            <p>{new Date(thread.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p className="text-[11px] text-neutral-600">{thread.viewsCount} visualizações</p>
          </div>
        </div>

        {/* Post Markdown Body */}
        <div className="prose prose-invert max-w-none text-neutral-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
          {thread.content}
        </div>

        {/* Source URL if present */}
        {thread.sourceUrl && (
          <div className="p-3 bg-[#111] border border-[#222] rounded flex items-center justify-between text-xs text-neutral-400">
            <span className="truncate mr-2">Fonte / Referência: {thread.sourceUrl}</span>
            <a
              href={thread.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF4D4D] hover:underline shrink-0"
            >
              Abrir
            </a>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {thread.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagClick(tag)}
              className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] border border-[#262626] rounded text-xs text-neutral-300 font-mono transition-colors cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Thread Bottom Actions */}
        <div className="pt-4 border-t border-[#181818] flex items-center justify-between">
          <button
            type="button"
            onClick={handleLikeThread}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-colors cursor-pointer ${
              thread.isLikedByMe
                ? 'bg-[#E00000]/20 text-[#FF4D4D] border border-[#E00000]'
                : 'bg-[#141414] hover:bg-[#202020] text-neutral-300 border border-[#262626]'
            }`}
          >
            <Heart className={`w-4 h-4 ${thread.isLikedByMe ? 'fill-current' : ''}`} />
            <span>{thread.likesCount} Curtidas</span>
          </button>

          <span className="text-xs text-neutral-500 font-mono">
            {posts.length} {posts.length === 1 ? 'resposta' : 'respostas'}
          </span>
        </div>
      </div>

      {/* Highlighted Solution Box if Thread has Solution */}
      {solutionPost && (
        <div className="p-6 bg-gradient-to-br from-[#0b1710] to-[#0a0a0a] border border-emerald-500/50 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-tech font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>SOLUÇÃO DESTACADA PELA COMUNIDADE</span>
          </div>
          <div className="text-xs text-neutral-400">
            Postada por <strong className="text-neutral-200">@{solutionPost.author.username}</strong> ({solutionPost.author.displayName}):
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-line font-sans">
            {solutionPost.content}
          </p>
        </div>
      )}

      {/* Replies List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#E00000]" />
          RESPOSTAS & CONTRIBUIÇÕES ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <div className="p-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg text-center text-neutral-500 text-sm">
            Nenhuma resposta ainda. Seja o primeiro a contribuir com esta discussão de segurança!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className={`p-5 sm:p-6 bg-[#0a0a0a] border rounded-lg space-y-4 transition-all ${
                post.isSolution
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-[#1a1a1a] hover:border-neutral-800'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between text-xs pb-3 border-b border-[#141414]">
                <div
                  onClick={() => onViewAuthor(post.author.username)}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-xs group-hover:border-[#E00000] transition-colors">
                    {post.author.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-neutral-200 group-hover:text-[#FF3333] transition-colors">
                        {post.author.displayName}
                      </span>
                      {post.author.role === 'ADMIN' && (
                        <span className="px-1 py-0.2 bg-[#E00000]/20 text-[#FF4D4D] text-[9px] font-bold rounded">
                          ADMIN
                        </span>
                      )}
                      {post.author.role === 'MODERATOR' && (
                        <span className="px-1 py-0.2 bg-orange-950 text-orange-400 text-[9px] font-bold rounded">
                          MOD
                        </span>
                      )}
                      {post.isSolution && (
                        <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Solução
                        </span>
                      )}
                    </div>
                    <span className="text-neutral-500 text-[10px]">
                      @{post.author.username} · {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-neutral-600 text-xs">#{post.postNumber}</span>
              </div>

              {/* Quoted Post Box if present */}
              {post.quotedPostId && (
                <div className="p-3 bg-[#111] border-l-2 border-[#E00000] text-xs text-neutral-400 italic rounded-r">
                  Respondendo a uma contribuição anterior da discussão...
                </div>
              )}

              {/* Post Content */}
              <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-sans">
                {post.content}
              </div>

              {/* Post Source URL if any */}
              {post.sourceUrl && (
                <div className="text-xs text-neutral-400">
                  <span className="text-neutral-500">Fonte: </span>
                  <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#FF4D4D] hover:underline">
                    {post.sourceUrl}
                  </a>
                </div>
              )}

              {/* Post Footer Actions */}
              <div className="pt-3 border-t border-[#141414] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                      post.isLikedByMe
                        ? 'bg-[#E00000]/20 text-[#FF4D4D]'
                        : 'bg-[#141414] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.isLikedByMe ? 'fill-current' : ''}`} />
                    <span>{post.likesCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setQuotingPost(post);
                      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }}
                    className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    Citar
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {(isThreadAuthor || isModOrAdmin) && !post.isSolution && (
                    <button
                      type="button"
                      onClick={() => handleMarkSolution(post.id)}
                      className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-xs rounded transition-colors flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Marcar como Solução
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenReportModal('POST', post.id, `Post #${post.postNumber}`)}
                    className="p-1 text-neutral-600 hover:text-red-400 transition-colors"
                    title="Denunciar post"
                  >
                    <Flag className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Box Composer */}
      <div className="p-6 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg space-y-4">
        <h3 className="text-base font-bold text-white font-tech uppercase tracking-wider flex items-center gap-2">
          <Send className="w-4 h-4 text-[#E00000]" />
          PUBLICAR UMA RESPOSTA
        </h3>

        {quotingPost && (
          <div className="p-3 bg-[#141414] border border-[#262626] rounded flex items-center justify-between text-xs text-neutral-300">
            <span>Citando @{quotingPost.author.username} (Post #{quotingPost.postNumber})</span>
            <button
              type="button"
              onClick={() => setQuotingPost(null)}
              className="text-neutral-500 hover:text-white"
            >
              Cancelar citação
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitReply} className="space-y-4">
          <div>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva sua análise, orientação preventiva ou compartilhe sua experiência técnica de forma respeitosa..."
              className="w-full bg-[#111] border border-[#262626] focus:border-[#FF1A1A] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Link de fonte oficial / alerta relacionado (opcional, ex: https://bcb.gov.br/...)"
              className="w-full bg-[#111] border border-[#262626] focus:border-[#FF1A1A] rounded px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-[#E00000] rounded text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E00000] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Proteção automática contra vazamento de senhas e CPFs ativada.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !replyText.trim()}
              className="px-6 py-2.5 bg-[#E00000] hover:bg-[#b00000] disabled:bg-neutral-800 text-white text-xs font-tech font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'PUBLICANDO...' : 'ENVIAR RESPOSTA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
