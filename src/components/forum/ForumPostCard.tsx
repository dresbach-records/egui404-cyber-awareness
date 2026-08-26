import React, { useState } from 'react';
import { Bookmark, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from 'lucide-react';
import { ForumThread } from '../../types';

export const ForumPostCard: React.FC<{ thread: ForumThread; onOpen: () => void }> = ({ thread, onOpen }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const likes = (thread.likesCount ?? 0) + (liked ? 1 : 0);

  return <article className="border-b border-[#24272a] px-4 py-5 transition-colors hover:bg-[#0f1112] sm:px-6" aria-labelledby={`thread-${thread.id}`}>
    <div className="flex items-center justify-between text-xs text-[#858b91]"><span>Comunidade E GUI 404</span><button type="button" aria-label="Mais opções" className="rounded p-1 hover:bg-[#17191b]"><MoreHorizontal className="h-4 w-4" /></button></div>
    <button type="button" onClick={onOpen} className="mt-3 block w-full text-left"><h2 id={`thread-${thread.id}`} className="text-lg font-semibold text-white hover:text-[#FF5A5A]">{thread.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#A1A1AA]">{thread.content}</p></button>
    <div className="mt-4 flex items-center justify-between border-t border-[#24272a] pt-3 text-xs text-[#858b91]"><div className="flex items-center gap-1"><button type="button" onClick={() => setLiked((value) => !value)} aria-pressed={liked} className={`inline-flex items-center gap-1 rounded px-2 py-1.5 hover:bg-[#201012] ${liked ? 'text-[#FF5A5A]' : ''}`}><ThumbsUp className="h-4 w-4" />{likes}</button><button type="button" onClick={onOpen} className="inline-flex items-center gap-1 rounded px-2 py-1.5 hover:bg-[#17191b]"><MessageCircle className="h-4 w-4" />{thread.postsCount ?? 0} comentários</button></div><div className="flex items-center gap-1"><button type="button" onClick={() => setSaved((value) => !value)} aria-pressed={saved} aria-label={saved ? 'Remover dos salvos' : 'Salvar publicação'} className={`rounded p-2 hover:bg-[#17191b] ${saved ? 'text-[#FF5A5A]' : ''}`}><Bookmark className="h-4 w-4" /></button><button type="button" aria-label="Compartilhar publicação" className="rounded p-2 hover:bg-[#17191b]"><Share2 className="h-4 w-4" /></button></div></div>
  </article>;
};
