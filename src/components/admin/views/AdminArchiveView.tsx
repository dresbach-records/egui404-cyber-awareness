import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ScamItem, ScamCategory, RiskLevel, ThreatStatus, VerificationStatus, SourceProvider } from '../../../types';
import { ScamService } from '../../../services/dataService';
import { AuditLogService } from '../../../services/adminService';
import { RiskBadge } from '../../ui/RiskBadge';
import { StatusBadge } from '../../ui/StatusBadge';
import { SoundEngine } from '../../../services/audioService';

export const AdminArchiveView: React.FC = () => {
  const [scams, setScams] = useState<ScamItem[]>(() => ScamService.getAllScams());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');

  // Modal State
  const [editingItem, setEditingItem] = useState<ScamItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<ScamItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State for create/edit
  const [formData, setFormData] = useState<Partial<ScamItem>>({
    title: '',
    slug: '',
    category: 'PHISHING',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    summary: '',
    overview: '',
    warningSigns: ['Solicitação de dados bancários', 'Pressão psicológica por urgência'],
    howToProtect: ['Nunca informe senhas por mensagem', 'Valide no app oficial'],
    victimActions: ['Contatar o banco imediatamente', 'Registrar Boletim de Ocorrência'],
    howItWorks: ['Contato inicial via mensagem falsa', 'Redirecionamento para link clonado'],
    commonTactics: ['Engenharia Social', 'Clonagem de Identidade Visual'],
    affectedPlatforms: ['WhatsApp', 'SMS', 'Web'],
    sources: [
      {
        organization: 'E GUI 404 Research Lab',
        title: 'Análise Defensiva de Engenharia Social',
        url: 'https://egui404.org/lab',
        isOfficial: false
      }
    ]
  });

  const categories: ScamCategory[] = [
    'PHISHING',
    'PIX SCAMS',
    'WHATSAPP FRAUD',
    'FAKE INVESTMENTS',
    'FAKE LOANS',
    'SOCIAL ENGINEERING',
    'ACCOUNT TAKEOVER',
    'IDENTITY FRAUD',
    'FAKE SUPPORT',
    'FAKE JOBS',
    'BANKING FRAUD',
    'MALWARE',
    'DATA BREACH',
    'SMISHING',
    'QR CODE SCAMS'
  ];

  const filteredScams = scams.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedRisk !== 'ALL' && item.riskLevel !== selectedRisk) return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (selectedSource !== 'ALL') {
      if (selectedSource === 'RNP_CAIS' && item.sourceProvider !== 'RNP_CAIS' && !item.originalRecordId?.startsWith('RNP_CAIS')) return false;
      if (selectedSource === 'EGUI_404' && item.sourceProvider !== 'EGUI_404' && item.originalRecordId) return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.originalRecordId && item.originalRecordId.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const handleOpenNew = () => {
    SoundEngine.playKeyClick();
    setFormData({
      id: `EGUI-SCAM-${Date.now().toString().slice(-4)}`,
      slug: `scam-${Date.now().toString().slice(-4)}`,
      title: '',
      category: 'PHISHING',
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      date: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      summary: '',
      overview: '',
      warningSigns: ['Contato não solicitado', 'Oferta excessivamente vantajosa'],
      howToProtect: ['Desconfie de contatos imediatos', 'Verifique a autenticidade'],
      victimActions: ['Bloquear remetente', 'Notificar a instituição envolvida'],
      howItWorks: ['Iniciação por mensagem persuasiva', 'Coleta indevida de dados'],
      commonTactics: ['Urgência simulada', 'Falsa autoridade'],
      affectedPlatforms: ['WhatsApp', 'Instagram', 'E-mail'],
      sourceProvider: 'EGUI_404',
      verificationStatus: 'DOCUMENTED',
      sources: [
        {
          organization: 'E GUI 404 Intelligence',
          title: 'Documentação Heurística',
          url: 'https://egui404.org',
          isOfficial: false
        }
      ]
    });
    setEditingItem(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEdit = (item: ScamItem) => {
    SoundEngine.playKeyClick();
    setEditingItem(item);
    setFormData({ ...item });
    setIsNewModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) return;

    SoundEngine.playSuccessSound();
    const isEdit = !!editingItem;
    const finalScam: ScamItem = {
      id: formData.id || `EGUI-SCAM-${Date.now().toString().slice(-4)}`,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `scam-${Date.now()}`,
      title: formData.title || 'Golpe Sem Título',
      category: formData.category as ScamCategory,
      riskLevel: formData.riskLevel as RiskLevel,
      status: formData.status as ThreatStatus,
      date: formData.date || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      summary: formData.summary || '',
      overview: formData.overview || formData.summary || '',
      howItWorks: formData.howItWorks || ['Processo não detalhado'],
      warningSigns: formData.warningSigns || ['Sinais suspeitos genéricos'],
      commonTactics: formData.commonTactics || ['Engenharia social'],
      howToProtect: formData.howToProtect || ['Mantenha cautela'],
      victimActions: formData.victimActions || ['Registre Boletim de Ocorrência'],
      affectedPlatforms: formData.affectedPlatforms || ['Web'],
      sourceProvider: formData.sourceProvider || 'EGUI_404',
      verificationStatus: formData.verificationStatus || 'DOCUMENTED',
      sources: formData.sources || []
    };

    ScamService.saveScam(finalScam);
    setScams(ScamService.getAllScams());

    AuditLogService.log({
      user: 'admin',
      action: isEdit ? 'UPDATE' : 'CREATE',
      entity: 'SCAM_ARCHIVE',
      entityId: finalScam.id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `${isEdit ? 'Atualizado' : 'Criado'} registro de golpe: ${finalScam.title}`
    });

    setIsNewModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    SoundEngine.playAlertSound();
    ScamService.deleteScam(id);
    setScams(ScamService.getAllScams());
    AuditLogService.log({
      user: 'admin',
      action: 'DELETE',
      entity: 'SCAM_ARCHIVE',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Removido registro de golpe ID: ${id}`
    });
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
            Arquivo de Golpes & Inteligência
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Catálogo completo de fraudes documentadas, registros do Catálogo RNP/CAIS e heurísticas da comunidade.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Golpe</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, resumo, tag, ID RNP..."
              className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
          >
            <option value="ALL">Todas Categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Select Risk */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
          >
            <option value="ALL">Todos os Riscos</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>

          {/* Select Source */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
          >
            <option value="ALL">Todas as Fontes</option>
            <option value="RNP_CAIS">Catálogo RNP/CAIS</option>
            <option value="EGUI_404">E GUI 404 Labs</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#777777] pt-1">
          <span>Mostrando {filteredScams.length} de {scams.length} registros</span>
          {(selectedCategory !== 'ALL' || selectedRisk !== 'ALL' || selectedSource !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedRisk('ALL');
                setSelectedSource('ALL');
                setSearch('');
              }}
              className="text-[#E00000] hover:underline"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block rounded-xl bg-[#0D0D0D] border border-[#222222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141414] border-b border-[#222222] text-[#888888] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Título & ID</th>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Risco</th>
                <th className="p-3.5">Fonte / Proveniência</th>
                <th className="p-3.5">Data</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredScams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-mono text-[#666666]">
                    Nenhum registro de golpe encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredScams.map((scam) => (
                  <tr key={scam.id} className="hover:bg-[#121212] transition-colors group">
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-white truncate">{scam.title}</div>
                      <div className="text-[10px] text-[#666666] truncate mt-0.5 font-mono">
                        {scam.originalRecordId || scam.id}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#AAAAAA] whitespace-nowrap">
                      {scam.category}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <RiskBadge level={scam.riskLevel} />
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {scam.sourceProvider === 'RNP_CAIS' || scam.originalRecordId?.startsWith('RNP_CAIS') ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          RNP/CAIS
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-[#222222] text-[#AAAAAA] text-[10px]">
                          E GUI 404
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-[#777777] whitespace-nowrap">
                      {scam.date}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingItem(scam)}
                          className="p-1.5 rounded text-[#777777] hover:text-white hover:bg-[#1F1F1F] transition-colors"
                          title="Inspecionar Dossiê"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(scam)}
                          className="p-1.5 rounded text-[#777777] hover:text-white hover:bg-[#1F1F1F] transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(scam.id)}
                          className="p-1.5 rounded text-[#777777] hover:text-[#E00000] hover:bg-[#1F1F1F] transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Structured Cards View */}
      <div className="md:hidden space-y-3">
        {filteredScams.map((scam) => (
          <div
            key={scam.id}
            className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xs font-mono font-bold text-white line-clamp-1">{scam.title}</h3>
                <span className="text-[10px] font-mono text-[#666666]">{scam.originalRecordId || scam.id}</span>
              </div>
              <RiskBadge level={scam.riskLevel} />
            </div>

            <p className="text-[11px] font-mono text-[#999999] line-clamp-2">{scam.summary}</p>

            <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C] text-[10px] font-mono text-[#777777]">
              <span>{scam.category}</span>
              <span>{scam.date}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setViewingItem(scam)}
                className="px-2.5 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-xs font-mono text-[#CCCCCC]"
              >
                Ver
              </button>
              <button
                onClick={() => handleOpenEdit(scam)}
                className="px-2.5 py-1 rounded bg-[#181818] border border-[#2A2A2A] text-xs font-mono text-[#CCCCCC]"
              >
                Editar
              </button>
              <button
                onClick={() => setDeleteConfirmId(scam.id)}
                className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New/Edit Scam */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#333333] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#E00000]" />
                <h3 className="text-sm font-mono font-bold text-white">
                  {editingItem ? 'Editar Registro de Golpe' : 'Registrar Novo Golpe no Arquivo'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded text-[#777777] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888888] mb-1">Título do Golpe *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                    placeholder="Ex: Falso Suporte Telefônico Banco Inter"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                    placeholder="falso-suporte-banco-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ScamCategory })}
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
                  <label className="block text-[#888888] mb-1">Nível de Risco</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as RiskLevel })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ThreatStatus })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MONITORED">MONITORED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Resumo Executivo *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                  placeholder="Síntese defensiva do golpe e vetor principal de exploração..."
                />
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Visão Geral / Funcionamento</label>
                <textarea
                  rows={3}
                  value={formData.overview || ''}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
                  placeholder="Descrição passo a passo da mecânica da fraude..."
                />
              </div>

              <div className="p-3 border-t border-[#222222] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#CCCCCC] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#E00000] hover:bg-[#FF1A1A] text-white font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(224,0,0,0.3)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Golpe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Details */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#333333] rounded-2xl w-full max-w-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-[#222222] pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <RiskBadge level={viewingItem.riskLevel} />
                  <span className="text-[10px] font-mono text-[#777777]">{viewingItem.originalRecordId || viewingItem.id}</span>
                </div>
                <h3 className="text-base font-mono font-bold text-white">{viewingItem.title}</h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1 rounded text-[#777777] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono text-[#CCCCCC] max-h-80 overflow-y-auto scrollbar-thin">
              <div>
                <span className="text-[#777777] uppercase text-[10px] block">Resumo:</span>
                <p className="mt-0.5">{viewingItem.summary}</p>
              </div>

              {viewingItem.warningSigns && viewingItem.warningSigns.length > 0 && (
                <div>
                  <span className="text-[#777777] uppercase text-[10px] block">Sinais de Alerta:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-amber-300">
                    {viewingItem.warningSigns.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {viewingItem.howToProtect && viewingItem.howToProtect.length > 0 && (
                <div>
                  <span className="text-[#777777] uppercase text-[10px] block">Como se Proteger:</span>
                  <ul className="list-disc pl-4 mt-1 space-y-0.5 text-emerald-400">
                    {viewingItem.howToProtect.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#222222] flex justify-end">
              <button
                onClick={() => setViewingItem(null)}
                className="px-4 py-1.5 rounded-lg bg-[#222222] text-white text-xs font-mono"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-red-500/30 rounded-xl p-5 max-w-sm w-full space-y-3">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-mono font-bold">Confirmar Exclusão</h4>
            </div>
            <p className="text-xs font-mono text-[#AAAAAA]">
              Tem certeza que deseja remover este golpe do arquivo? Esta ação é irreversível e gerará log de auditoria.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded bg-[#222222] text-xs font-mono text-[#CCCCCC]"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-xs font-mono text-white font-bold"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
