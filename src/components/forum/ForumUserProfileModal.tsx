import React from 'react';
import { X, Award, ShieldCheck, MessageSquare, Heart, CheckCircle2, Calendar, UserCheck } from 'lucide-react';
import { ForumMember, ForumBadge } from '../../types';
import { FORUM_BADGES } from '../../data/forumData';

interface ForumUserProfileModalProps {
  member: ForumMember;
  onClose: () => void;
}

export const ForumUserProfileModal: React.FC<ForumUserProfileModalProps> = ({ member, onClose }) => {
  const memberBadges = FORUM_BADGES.filter((b) => member.badges.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0c0c0c] border border-[#262626] rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border-2 border-[#E00000] flex items-center justify-center font-bold text-white text-xl">
            {member.displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-display uppercase tracking-wide">
                {member.displayName}
              </h2>
              {member.role === 'ADMIN' && (
                <span className="px-2 py-0.5 bg-[#E00000]/20 border border-[#E00000]/50 text-[#FF4D4D] text-[10px] font-bold rounded">
                  ADMIN
                </span>
              )}
              {member.role === 'MODERATOR' && (
                <span className="px-2 py-0.5 bg-orange-950 border border-orange-500/50 text-orange-400 text-[10px] font-bold rounded">
                  MOD
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-mono">@{member.username}</p>
            {member.title && (
              <p className="text-xs text-[#00F0FF] font-tech font-bold uppercase">{member.title}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <p className="text-xs text-neutral-300 bg-[#111] border border-[#1f1f1f] p-3.5 rounded-lg leading-relaxed">
            {member.bio}
          </p>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-[#141414] border border-[#222] rounded-lg">
            <span className="text-[10px] text-neutral-500 block uppercase font-tech">Reputação</span>
            <span className="text-lg font-bold text-white font-mono">{member.reputation}</span>
          </div>
          <div className="p-3 bg-[#141414] border border-[#222] rounded-lg">
            <span className="text-[10px] text-neutral-500 block uppercase font-tech">Tópicos</span>
            <span className="text-lg font-bold text-white font-mono">{member.threadsCount}</span>
          </div>
          <div className="p-3 bg-[#141414] border border-[#222] rounded-lg">
            <span className="text-[10px] text-neutral-500 block uppercase font-tech">Soluções</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{member.solutionsCount}</span>
          </div>
        </div>

        {/* Badges / Conquistas */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-300 uppercase font-tech tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Distintivos & Reconhecimentos ({memberBadges.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {memberBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-2.5 bg-[#111] border border-[#222] rounded-lg flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-neutral-200 block truncate">{badge.name}</span>
                  <span className="text-[10px] text-neutral-500 block truncate">{badge.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>Membro desde: {new Date(member.joinedAt).toLocaleDateString('pt-BR')}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#141414] hover:bg-[#202020] text-neutral-300 rounded font-bold uppercase"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
