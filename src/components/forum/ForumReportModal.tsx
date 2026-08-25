import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ForumService } from '../../services/dataService';
import { forumApi } from '../../services/api/forumApi';
import { reportsApi } from '../../services/api/reportsApi';
import { SoundEngine } from '../../services/audioService';

interface ForumReportModalProps {
  targetType: 'THREAD' | 'POST';
  targetId: string;
  targetTitle?: string;
  onClose: () => void;
}

export const ForumReportModal: React.FC<ForumReportModalProps> = ({
  targetType,
  targetId,
  targetTitle,
  onClose
}) => {
  const [reason, setReason] = useState<'SPAM' | 'HARASSMENT' | 'MISINFORMATION' | 'PERSONAL_DATA' | 'MALICIOUS_CONTENT' | 'ILLEGAL_REQUEST' | 'OTHER'>('PERSONAL_DATA');
  const [details, setDetails] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    SoundEngine.playClickSound();

    try {
      if (targetType === 'THREAD') {
        await forumApi.reportThread(targetId, reason, details).catch(() => {});
      } else {
        await reportsApi.submitReport({
          targetType: 'FORUM_POST',
          targetId,
          targetTitle: targetTitle || 'Post do Fórum',
          reason,
          details
        }).catch(() => {});
      }
    } catch {}

    ForumService.submitForumReport({
      targetType,
      targetId,
      targetTitle,
      reporterUsername: 'current_user',
      reason,
      details
    });

    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0c0c0c] border border-[#262626] rounded-xl max-w-lg w-full p-6 space-y-5 relative shadow-2xl font-sans">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 font-tech">
          <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
            <Flag className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">CANAL DE MODERAÇÃO & SEGURANÇA</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display uppercase tracking-wider">
            DENUNCIAR CONTEÚDO
          </h2>
          {targetTitle && (
            <p className="text-xs text-neutral-400 truncate">
              Alvo: <span className="text-neutral-200">{targetTitle}</span>
            </p>
          )}
        </div>

        {isSent ? (
          <div className="p-6 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-emerald-300 text-sm">Denúncia enviada à moderação</h3>
            <p className="text-xs text-neutral-400">
              Obrigado por ajudar a manter a comunidade do E GUI 404 segura e livre de abusos.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-neutral-300 uppercase font-tech">
                Motivo Principal da Denúncia: *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#FF1A1A] rounded px-3 py-2 text-white focus:outline-none"
              >
                <option value="PERSONAL_DATA">Vazamento de dados pessoais (CPF, telefone, documentos)</option>
                <option value="MALICIOUS_CONTENT">Link malicioso ativo / Phishing sem defang / Malware</option>
                <option value="ILLEGAL_REQUEST">Pedido de invasão, doxxing ou serviços ilegais</option>
                <option value="MISINFORMATION">Desinformação / Conteúdo falso prejudicial</option>
                <option value="HARASSMENT">Ofensa, assédio ou desrespeito à vítima</option>
                <option value="SPAM">Spam / Propaganda comercial não autorizada</option>
                <option value="OTHER">Outro motivo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-neutral-300 uppercase font-tech">
                Detalhes Adicionais para os Moderadores:
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explique resumidamente onde está a irregularidade..."
                className="w-full bg-[#141414] border border-[#282828] focus:border-[#FF1A1A] rounded px-3 py-2 text-white placeholder-neutral-600 focus:outline-none font-sans"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#141414] hover:bg-[#202020] text-neutral-300 rounded uppercase font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#E00000] hover:bg-[#b00000] text-white rounded font-tech font-bold uppercase tracking-wider"
              >
                Enviar Denúncia
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
