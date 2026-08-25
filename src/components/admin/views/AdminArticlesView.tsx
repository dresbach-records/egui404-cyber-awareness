import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  BookOpen,
  CheckCircle,
  Clock,
  Tag,
  Bold,
  Italic,
  List,
  Heading,
  Link,
  Code
} from 'lucide-react';
import { EducationArticle } from '../../../types';
import { ArticleService } from '../../../services/dataService';
import { AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminArticlesView: React.FC = () => {
  const [articles, setArticles] = useState<EducationArticle[]>(() => ArticleService.getAllArticles());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal / Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<EducationArticle | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<EducationArticle>>({
    title: '',
    slug: '',
    category: 'Phishing',
    author: 'Equipe de Inteligência E GUI 404',
    date: new Date().toISOString().split('T')[0],
    readingTimeMinutes: 5,
    excerpt: '',
    contentMarkdown: '',
    keyTakeaways: ['Destaque 1', 'Destaque 2'],
    checklist: ['Ação preventiva 1', 'Ação preventiva 2'],
    sources: []
  });

  const categories = [
    'Cybersecurity Basics',
    'Privacy',
    'Passwords',
    'MFA',
    'Phishing',
    'Social Engineering',
    'Account Security',
    'Device Security',
    'Wi-Fi Security',
    'Financial Security'
  ];

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory !== 'ALL' && a.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match = a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenNew = () => {
    SoundEngine.playKeyClick();
    setEditingArticle(null);
    setFormData({
      id: `art-${Date.now()}`,
      slug: `guia-${Date.now().toString().slice(-4)}`,
      title: '',
      category: 'Phishing',
      author: 'Equipe de Inteligência E GUI 404',
      date: new Date().toISOString().split('T')[0],
      readingTimeMinutes: 4,
      excerpt: '',
      contentMarkdown: '# Introdução à Defesa Cibernética\n\nNeste guia prático, abordamos como blindar suas comunicações...',
      keyTakeaways: ['Validação independente em canais oficiais', 'Não fornecer credenciais por links de terceiros'],
      checklist: ['Ativar autenticação de dois fatores (MFA)', 'Revisar extrato de dispositivos conectados'],
      sources: []
    });
    setPreviewMode(false);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (art: EducationArticle) => {
    SoundEngine.playKeyClick();
    setEditingArticle(art);
    setFormData({ ...art });
    setPreviewMode(false);
    setIsEditorOpen(true);
  };

  const insertMarkdownSyntax = (syntax: string) => {
    const textarea = document.getElementById('article-content-input') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = formData.contentMarkdown || '';
    const selected = current.substring(start, end);
    let replacement = '';

    if (syntax === 'bold') replacement = `**${selected || 'texto em negrito'}**`;
    else if (syntax === 'italic') replacement = `*${selected || 'texto em itálico'}*`;
    else if (syntax === 'h2') replacement = `\n## ${selected || 'Subtítulo'}\n`;
    else if (syntax === 'list') replacement = `\n- ${selected || 'Item de lista'}\n`;
    else if (syntax === 'link') replacement = `[${selected || 'Texto do link'}](https://exemplo.com)`;
    else if (syntax === 'code') replacement = `\`${selected || 'codigo_ou_hash'}\``;

    const newContent = current.substring(0, start) + replacement + current.substring(end);
    setFormData({ ...formData, contentMarkdown: newContent });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt) return;

    SoundEngine.playSuccessSound();
    const isEdit = !!editingArticle;
    const words = (formData.contentMarkdown || '').split(/\s+/).length;
    const estimatedReadingTime = Math.max(1, Math.ceil(words / 180));

    const finalArticle: EducationArticle = {
      id: formData.id || `art-${Date.now()}`,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `art-${Date.now()}`,
      title: formData.title || 'Guia Sem Título',
      category: (formData.category as any) || 'Phishing',
      author: formData.author || 'Equipe E GUI 404',
      date: formData.date || new Date().toISOString().split('T')[0],
      readingTimeMinutes: formData.readingTimeMinutes || estimatedReadingTime,
      excerpt: formData.excerpt || '',
      contentMarkdown: formData.contentMarkdown || '',
      keyTakeaways: formData.keyTakeaways || [],
      checklist: formData.checklist || [],
      sources: formData.sources || []
    };

    ArticleService.saveArticle(finalArticle);
    setArticles(ArticleService.getAllArticles());

    AuditLogService.log({
      user: 'admin',
      action: isEdit ? 'UPDATE' : 'CREATE',
      entity: 'ARTICLE',
      entityId: finalArticle.slug,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `${isEdit ? 'Atualizado' : 'Publicado'} artigo educativo: ${finalArticle.title}`
    });

    setIsEditorOpen(false);
    setEditingArticle(null);
  };

  const handleDelete = (id: string) => {
    SoundEngine.playAlertSound();
    ArticleService.deleteArticle(id);
    setArticles(ArticleService.getAllArticles());
    AuditLogService.log({
      user: 'admin',
      action: 'DELETE',
      entity: 'ARTICLE',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Excluído artigo ID: ${id}`
    });
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
            Gestor de Artigos & Manuais de Segurança
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            CMS completo para redação de cartilhas, boas práticas de proteção e checklists interativos.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Artigo</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título de artigo, categoria, resumo..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
        >
          <option value="ALL">Todas as Categorias</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-[#E00000] bg-[#E00000]/10 px-2 py-0.5 rounded border border-[#E00000]/20">
                  {art.category}
                </span>
                <span className="text-[10px] font-mono text-[#777777] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.readingTimeMinutes} min
                </span>
              </div>

              <h3 className="text-sm font-mono font-bold text-white line-clamp-2">{art.title}</h3>
              <p className="text-xs font-mono text-[#888888] mt-1 line-clamp-2">{art.excerpt}</p>
            </div>

            <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#666666]">
              <span>{art.date}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#222222]"
                  title="Editar Artigo"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(art.id)}
                  className="p-1.5 rounded text-[#888888] hover:text-red-400 hover:bg-[#222222]"
                  title="Excluir Artigo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#333333] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E00000]" />
                <h3 className="text-sm font-mono font-bold text-white">
                  {editingArticle ? 'Editar Artigo Educativo' : 'Novo Artigo / Guia de Segurança'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono border transition-colors ${
                    previewMode
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                      : 'bg-[#181818] text-[#AAAAAA] border-[#2A2A2A]'
                  }`}
                >
                  {previewMode ? 'Modo Editor' : 'Visualizar Preview'}
                </button>
                <button onClick={() => setIsEditorOpen(false)} className="p-1 text-[#777777] hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs font-mono">
              {!previewMode ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#888888] mb-1">Título do Artigo *</label>
                      <input
                        type="text"
                        required
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#888888] mb-1">Slug URL</label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[#888888] mb-1">Categoria</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#888888] mb-1">Autor</label>
                      <input
                        type="text"
                        value={formData.author || ''}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#888888] mb-1">Tempo de Leitura (min)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={formData.readingTimeMinutes || 5}
                        onChange={(e) => setFormData({ ...formData, readingTimeMinutes: Number(e.target.value) })}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#888888] mb-1">Resumo / Excerpt *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                    />
                  </div>

                  {/* Markdown Toolbar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[#888888]">Conteúdo Markdown *</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax('bold')}
                          className="p-1 rounded bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#CCCCCC]"
                          title="Negrito"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax('italic')}
                          className="p-1 rounded bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#CCCCCC]"
                          title="Itálico"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax('h2')}
                          className="p-1 rounded bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#CCCCCC]"
                          title="Título H2"
                        >
                          <Heading className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax('list')}
                          className="p-1 rounded bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#CCCCCC]"
                          title="Lista"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax('link')}
                          className="p-1 rounded bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#CCCCCC]"
                          title="Link"
                        >
                          <Link className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdownSyntax('code')}
                          className="p-1 rounded bg-[#1C1C1C] hover:bg-[#2A2A2A] text-[#CCCCCC]"
                          title="Código"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      id="article-content-input"
                      required
                      rows={10}
                      value={formData.contentMarkdown || ''}
                      onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-3 text-white font-mono focus:border-[#E00000] focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="p-4 bg-[#0A0A0A] border border-[#222222] rounded-xl space-y-4 text-white">
                  <div className="border-b border-[#222222] pb-3">
                    <span className="text-[10px] font-mono text-[#E00000] uppercase font-bold">
                      {formData.category} · {formData.readingTimeMinutes} min de leitura
                    </span>
                    <h2 className="text-xl font-mono font-bold mt-1">{formData.title || 'Título de Exemplo'}</h2>
                    <p className="text-xs text-[#888888] mt-1">{formData.excerpt}</p>
                  </div>
                  <div className="prose prose-invert max-w-none text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    {formData.contentMarkdown}
                  </div>
                </div>
              )}

              <div className="p-3 border-t border-[#222222] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181818] text-[#CCCCCC]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E00000] hover:bg-[#FF1A1A] text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Artigo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-red-500/30 rounded-xl p-5 max-w-sm w-full space-y-3">
            <h4 className="text-sm font-mono font-bold text-red-400">Excluir Artigo?</h4>
            <p className="text-xs font-mono text-[#AAAAAA]">Esta ação removerá o artigo das páginas públicas.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1.5 rounded bg-[#222222] text-xs font-mono text-[#CCCCCC]">
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="px-3 py-1.5 rounded bg-red-600 text-xs font-mono text-white font-bold">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminEducationView: React.FC = () => {
  return <AdminArticlesView />;
};
