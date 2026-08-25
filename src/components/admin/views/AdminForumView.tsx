import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Pin,
  Lock,
  Unlock,
  CheckCircle,
  Trash2,
  Eye,
  AlertTriangle,
  Flame,
  Filter,
  UserCheck,
  Shield
} from 'lucide-react';
import { ForumThread } from '../../../types';
import { FORUM_THREADS, FORUM_CATEGORIES } from '../../../data/forumData';
import { AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminForumView: React.FC = () => {
  const [threads, setThreads] = useState<ForumThread[]>(() => {
    try {
      const stored = localStorage.getItem('egui404_forum_threads');
      return stored ? JSON.parse(stored) : FORUM_THREADS;
    } catch {
      return FORUM_THREADS;
    }
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredThreads = threads.filter((t) => {
    if (selectedCategory !== 'ALL' && t.categorySlug !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.author.displayName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const saveThreads = (list: ForumThread[]) => {
    setThreads(list);
    try {
      localStorage.setItem('egui404_forum_threads', JSON.stringify(list));
    } catch {}
  };

  const handleTogglePin = (id: string) => {
    SoundEngine.playKeyClick();
    const updated = threads.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t));
    saveThreads(updated);
    AuditLogService.log({
      user: 'moderator',
      action: 'MODERATION',
      entity: 'FORUM_THREAD',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: 'Status de fixação do tópico alterado.'
    });
  };

  const handleToggleLock = (id: string) => {
    SoundEngine.playKeyClick();
    const updated = threads.map((t) => {
      if (t.id === id) {
        const nextStatus = t.status === 'LOCKED' ? 'OPEN' : 'LOCKED';
        return { ...t, status: nextStatus as any };
      }
      return t;
    });
    saveThreads(updated);
    AuditLogService.log({
      user: 'moderator',
      action: 'MODERATION',
      entity: 'FORUM_THREAD',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: 'Status de bloqueio do tópico alterado.'
    });
  };

  const handleDeleteThread = (id: string) => {
    SoundEngine.playAlertSound();
    const updated = threads.filter((t) => t.id !== id);
    saveThreads(updated);
    AuditLogService.log({
      user: 'moderator',
      action: 'DELETE',
      entity: 'FORUM_THREAD',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Tópico do fórum ID ${id} excluído por moderação.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Moderação do Fórum da Comunidade
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Gerenciamento de tópicos, fixação de discussões chave, bloqueio por violação e ações preventivas de dados pessoais.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tópico por título, conteúdo ou autor..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
        >
          <option value="ALL">Todas as Categorias</option>
          {FORUM_CATEGORIES.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Threads Table */}
      <div className="rounded-xl bg-[#0D0D0D] border border-[#222222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141414] text-[#888888] uppercase text-[10px] border-b border-[#222222]">
              <tr>
                <th className="p-3.5">Tópico & Autor</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Respostas / Votos</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Última Atividade</th>
                <th className="p-3.5 text-right">Ações de Moderação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredThreads.map((t) => (
                <tr key={t.id} className="hover:bg-[#121212] transition-colors">
                  <td className="p-3.5 max-w-sm">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      {t.isPinned && <Pin className="w-3.5 h-3.5 text-[#E00000] shrink-0" />}
                      {t.status === 'LOCKED' && <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span className="truncate">{t.title}</span>
                    </div>
                    <div className="text-[10px] text-[#777777] mt-0.5 flex items-center gap-1">
                      <span>@{t.author.username}</span>
                      <span>({t.author.role})</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-[#AAAAAA] whitespace-nowrap">{t.categoryName}</td>
                  <td className="p-3.5 text-[#888888] whitespace-nowrap">
                    {t.repliesCount} respostas · {t.likesCount} curtidas
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'SOLVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : t.status === 'LOCKED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-[#222222] text-[#CCCCCC]'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#777777] whitespace-nowrap">{t.lastActivityAt.split('T')[0]}</td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleTogglePin(t.id)}
                        className={`p-1.5 rounded transition-colors ${
                          t.isPinned ? 'bg-red-500/20 text-[#FF1A1A]' : 'text-[#777777] hover:text-white hover:bg-[#222222]'
                        }`}
                        title={t.isPinned ? 'Desafixar' : 'Fixar Tópico'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleLock(t.id)}
                        className={`p-1.5 rounded transition-colors ${
                          t.status === 'LOCKED'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-[#777777] hover:text-white hover:bg-[#222222]'
                        }`}
                        title={t.status === 'LOCKED' ? 'Destrancar' : 'Trancar Tópico'}
                      >
                        {t.status === 'LOCKED' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteThread(t.id)}
                        className="p-1.5 rounded text-[#777777] hover:text-red-400 hover:bg-[#222222]"
                        title="Excluir Tópico"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
