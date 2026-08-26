import React from 'react';
import { MessageCircle, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { ForumThread } from '../../types';

export const ForumPostCard: React.FC<{ thread: ForumThread; onOpen: () => void }> = ({ thread, onOpen }) => (
  <article className="border-b border-[#24272a] px-4 py-5 sm:px-6" aria-labelledby={`thread-${thread.id}`}>
    <div className="flex items-center justify-between text-xs text-[#858b91]"><span>Comunidade E GUI 404</span><button type="button" aria-label="Mais opções" className="rounded p-1 hover:bg-[#17191b]"><MoreHorizontal className="h-4 w-4" /></button></div>
    <button type="button" onClick={onOpen} className="mt-3 block w-full text-left"><h2 id={`thread-${thread.id}`} className="text-lg font-semibold text-white hover:text-[#FF5A5A]">{thread.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#A1A1AA]">{thread.content}</p></button>
    <div className="mt-4 flex items-center gap-5 text-xs text-[#858b91]"><span className="inline-flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{thread.likesCount ?? 0}</span><span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" />{thread.postsCount ?? 0} comentários</span></div>
  </article>
);
