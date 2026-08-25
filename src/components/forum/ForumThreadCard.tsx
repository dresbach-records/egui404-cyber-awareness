import React from 'react';
import {
  MessageSquare,
  Eye,
  Heart,
  CheckCircle2,
  Pin,
  Flame,
  Award,
  Clock,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { ForumThread } from '../../types';

interface ForumThreadCardProps {
  thread: ForumThread;
  onClick: () => void;
  onTagClick?: (tag: string) => void;
  onBookmarkToggle?: (threadId: string) => void;
}

export const ForumThreadCard: React.FC<ForumThreadCardProps> = ({
  thread,
  onClick,
  onTagClick,
  onBookmarkToggle
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`p-4 sm:p-5 bg-[#0d0d0d] hover:bg-[#121212] border rounded-lg transition-all duration-200 group relative ${
      thread.isPinned
        ? 'border-[#E00000]/40 bg-gradient-to-r from-[#140606] to-[#0d0d0d]'
        : thread.hasSolution
        ? 'border-emerald-500/25 hover:border-emerald-500/50'
        : 'border-[#1f1f1f] hover:border-neutral-700'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          
          {/* Badges & Meta top bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {thread.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#E00000]/15 border border-[#E00000]/50 text-[#FF4D4D] font-mono font-bold text-[10px] uppercase">
                <Pin className="w-3 h-3" /> FIXADO
              </span>
            )}

            {thread.isHot && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-950/40 border border-orange-500/50 text-orange-400 font-mono font-bold text-[10px] uppercase">
                <Flame className="w-3 h-3" /> EM ALTA
              </span>
            )}

            {thread.hasSolution && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/50 text-emerald-400 font-mono font-bold text-[10px] uppercase">
                <CheckCircle2 className="w-3 h-3" /> SOLUCIONADO
              </span>
            )}

            <span className="text-neutral-500 text-[11px] font-tech font-bold uppercase tracking-wider">
              {thread.categoryName}
            </span>
          </div>

          {/* Thread Title */}
          <h3
            onClick={onClick}
            className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-[#FF3333] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {thread.title}
          </h3>

          {/* Thread Excerpt */}
          <p
            onClick={onClick}
            className="text-xs sm:text-sm text-neutral-400 font-sans line-clamp-2 cursor-pointer leading-relaxed"
          >
            {thread.content.replace(/[#*`_]/g, '')}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {thread.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="px-2 py-0.5 bg-[#171717] hover:bg-[#222] border border-[#262626] hover:border-neutral-600 rounded text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors font-mono"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmark Icon */}
        {onBookmarkToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(thread.id);
            }}
            className={`p-1.5 rounded transition-colors shrink-0 ${
              thread.isBookmarkedByMe
                ? 'text-[#E00000] bg-[#E00000]/10'
                : 'text-neutral-600 hover:text-neutral-300 hover:bg-[#1a1a1a]'
            }`}
            title={thread.isBookmarkedByMe ? 'Remover dos salvos' : 'Salvar tópico'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-[#181818] flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
            {thread.author.displayName.slice(0, 2)}
          </div>
          <span className="text-neutral-300 font-medium">{thread.author.displayName}</span>
          {thread.author.role === 'ADMIN' && (
            <span className="px-1.5 py-0.2 bg-[#E00000]/20 text-[#FF4D4D] text-[9px] font-bold rounded">
              ADMIN
            </span>
          )}
          {thread.author.role === 'MODERATOR' && (
            <span className="px-1.5 py-0.2 bg-orange-950 text-orange-400 text-[9px] font-bold rounded">
              MOD
            </span>
          )}
          <span className="text-neutral-600">·</span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-neutral-600" />
            {formatDate(thread.createdAt)}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="flex items-center gap-1 hover:text-neutral-300" title="Respostas">
            <MessageSquare className="w-3.5 h-3.5 text-neutral-500" />
            {thread.repliesCount}
          </span>
          <span className="flex items-center gap-1 hover:text-neutral-300" title="Visualizações">
            <Eye className="w-3.5 h-3.5 text-neutral-500" />
            {thread.viewsCount}
          </span>
          <span className="flex items-center gap-1 text-neutral-400" title="Curtidas">
            <Heart className={`w-3.5 h-3.5 ${thread.isLikedByMe ? 'text-[#E00000] fill-current' : 'text-neutral-500'}`} />
            {thread.likesCount}
          </span>
        </div>
      </div>
    </div>
  );
};
