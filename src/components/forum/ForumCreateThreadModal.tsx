import React, { useState } from 'react';
import {
  X,
  Plus,
  AlertTriangle,
  ShieldCheck,
  Send,
  HelpCircle,
  Hash,
  Link as LinkIcon
} from 'lucide-react';
import { ForumCategory, ForumTag } from '../../types';
import { ForumService, ContentSafetyService } from '../../services/dataService';
import { forumApi } from '../../services/api/forumApi';
import { SoundEngine } from '../../services/audioService';

interface ForumCreateThreadModalProps {
  categories: ForumCategory[];
  tags: ForumTag[];
  initialCategorySlug?: string;
  onClose: () => void;
  onSuccess: (threadSlug: string) => void;
}

export const ForumCreateThreadModal: React.FC<ForumCreateThreadModalProps> = ({
  categories,
  tags,
  initialCategorySlug,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(initialCategorySlug || categories[0]?.id || 'cat-01');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['pix-fraude']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [confirmedSafetyRules, setConfirmedSafetyRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleTag = (tagSlug: string) => {
    if (selectedTags.includes(tagSlug)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagSlug));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tagSlug]);
      }
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = customTagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (clean && !selectedTags.includes(clean) && selectedTags.length < 5) {
        setSelectedTags([...selectedTags, clean]);
        setCustomTagInput('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !confirmedSafetyRules) {
      setErrorMsg('Preencha os campos obrigatórios e confirme as diretrizes de segurança.');
      return;
    }

    if (title.trim().length < 10) {
      setErrorMsg('O título deve ter pelo menos 10 caracteres para ser descritivo.');
      return;
    }

    if (content.trim().length < 30) {
      setErrorMsg('Por favor detalhe sua postagem com mais informações (mínimo de 30 caracteres).');
      return;
    }

    // Safety pre-check
    const safety = ContentSafetyService.analyzeText(title + ' ' + content);
    if (safety.status === 'BLOCK') {
      setErrorMsg(safety.flaggedReasons.join(' ') || 'Conteúdo bloqueado pelos filtros de segurança.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let createdSlug: string | null = null;
      try {
        const res = await forumApi.createThread({
          title,
          categoryId,
          content,
          sourceUrl: sourceUrl || undefined,
          tags: selectedTags
        });
        if (res && res.slug) {
          createdSlug = res.slug;
        }
      } catch {
        // Fallback local service
      }

      const result = ForumService.createThread({
        title,
        categoryId,
        content,
        sourceUrl: sourceUrl || undefined,
        tags: selectedTags
      });

      if (!createdSlug && result.success && result.thread) {
        createdSlug = result.thread.slug;
      }

      if (createdSlug) {
        SoundEngine.playSuccessSound();
        onSuccess(createdSlug);
      } else {
        setErrorMsg(result.error || 'Erro ao criar discussão.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Erro ao processar postagem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0c0c0c] border border-[#262626] rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl font-sans my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white hover:bg-[#1f1f1f] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 font-tech">
          <div className="flex items-center gap-2 text-xs text-[#FF1A1A]">
            <Plus className="w-4 h-4" />
            <span className="font-bold tracking-widest uppercase">NOVA DISCUSSÃO · FÓRUM COMUNITÁRIO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display uppercase tracking-wider">
            CRIAR TÓPICO DE SEGURANÇA
          </h2>
          <p className="text-xs text-neutral-400 font-sans">
            Compartilhe relatos, tire dúvidas sobre proteção digital ou proponha debates técnicos com a comunidade.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase font-tech tracking-wider">
              Categoria Principal: *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#141414] border border-[#282828] focus:border-[#FF1A1A] rounded px-3.5 py-2.5 text-white text-xs focus:outline-none transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase font-tech tracking-wider">
              Título da Discussão: *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Como identificar boletos adulterados antes do pagamento pelo internet banking?"
              className="w-full bg-[#141414] border border-[#282828] focus:border-[#FF1A1A] rounded px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none text-xs sm:text-sm transition-colors"
            />
          </div>

          {/* Content Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-neutral-300 uppercase font-tech tracking-wider">
                Conteúdo / Detalhes: *
              </label>
              <span className="text-[11px] text-neutral-500">{content.length} caracteres</span>
            </div>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva o contexto, os sintomas, as medidas que você já tentou tomar ou as evidências coletadas..."
              className="w-full bg-[#141414] border border-[#282828] focus:border-[#FF1A1A] rounded px-3.5 py-3 text-white placeholder-neutral-600 focus:outline-none text-xs sm:text-sm transition-colors font-sans"
            />
          </div>

          {/* Tags Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-neutral-300 uppercase font-tech tracking-wider">
              Tags Relacionadas (Até 5):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.slug);
                return (
                  <button
                    key={tag.slug}
                    type="button"
                    onClick={() => toggleTag(tag.slug)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#E00000] text-white border border-[#E00000]'
                        : 'bg-[#141414] text-neutral-400 border border-[#262626] hover:text-neutral-200'
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Hash className="w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Adicionar tag personalizada (pressione Enter)"
                className="bg-[#141414] border border-[#262626] rounded px-3 py-1 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#FF1A1A] flex-1 font-mono"
              />
            </div>
          </div>

          {/* Source URL (optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-300 uppercase font-tech tracking-wider">
              Fonte Oficial / Link de Apoio (Opcional):
            </label>
            <input
              type="text"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Ex: https://antifraudes.febraban.org.br/..."
              className="w-full bg-[#141414] border border-[#282828] focus:border-[#FF1A1A] rounded px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
            />
          </div>

          {/* Safety Confirm Checkbox */}
          <div className="p-3.5 bg-[#111] border border-[#222] rounded space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={confirmedSafetyRules}
                onChange={(e) => setConfirmedSafetyRules(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-700 bg-[#141414] text-[#E00000] focus:ring-0"
              />
              <span>
                <strong>Confirmo que não incluí dados pessoais de vítimas nem links de malware ativos.</strong> Este post respeita o propósito defensivo e educativo do E GUI 404.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-[#E00000] rounded text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E00000] shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#141414] hover:bg-[#202020] border border-[#262626] text-neutral-300 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#E00000] hover:bg-[#b00000] text-white rounded text-xs font-tech font-bold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950/30"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR TÓPICO'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
