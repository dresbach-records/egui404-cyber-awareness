import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Calendar,
  Globe,
  Shield,
  Activity
} from 'lucide-react';
import { CaseFile, ScamCategory } from '../../../types';
import { CaseService } from '../../../services/dataService';
import { AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminCasesView: React.FC = () => {
  const [cases, setCases] = useState<CaseFile[]>(() => CaseService.getAllCases());
  const [search, setSearch] = useState('');
  const [selectedImpact, setSelectedImpact] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseFile | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<CaseFile>>({
    caseNumber: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    country: 'Brasil',
    category: 'PHISHING',
    impactLevel: 'HIGH',
    status: 'ANALYZED',
    summary: '',
    timeline: [
      {
        timestamp: 'Dia 1',
        event: 'Contato Inicial',
        details: 'Vítima recebe comunicação persuasiva.'
      }
    ],
    attackAnatomy: {
      initialContact: 'Mensagem de WhatsApp de falso familiar',
      manipulationTechnique: 'Urgência extrema por suposta emergência médica',
      exploitationStep: 'Transferência Pix imediata para conta de laranja',
      damageVector: 'Prejuízo financeiro direto'
    },
    defensesLearned: [
      'Sempre ligar para o número antigo do familiar para checar identidade',
      'Nunca realizar Pix sob pressão emocional'
    ],
    sources: []
  });

  const categories: ScamCategory[] = [
    'PHISHING',
    'PIX SCAMS',
    'WHATSAPP FRAUD',
    'FAKE INVESTMENTS',
    'SOCIAL ENGINEERING',
    'ACCOUNT TAKEOVER',
    'IDENTITY FRAUD',
    'BANKING FRAUD',
    'MALWARE',
    'RANSOMWARE'
  ];

  const filteredCases = cases.filter((c) => {
    if (selectedImpact !== 'ALL' && c.impactLevel !== selectedImpact) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenNew = () => {
    SoundEngine.playKeyClick();
    const nextNum = `CASO-${String(cases.length + 1).padStart(3, '0')}`;
    setEditingCase(null);
    setFormData({
      id: `case-${Date.now()}`,
      caseNumber: nextNum,
      title: '',
      date: new Date().toISOString().split('T')[0],
      country: 'Brasil',
      category: 'PIX SCAMS',
      impactLevel: 'HIGH',
      status: 'ANALYZED',
      summary: '',
      timeline: [
        { timestamp: '08:30', event: 'Disparo de Phishing', details: 'Vítima clica em link fraudulento.' }
      ],
      attackAnatomy: {
        initialContact: 'SMS com link encurtado',
        manipulationTechnique: 'Ameaça de bloqueio judicial de contas',
        exploitationStep: 'Captura de credenciais bancárias',
        damageVector: 'Transferências não autorizadas'
      },
      defensesLearned: ['Bloqueio do canal e notificação ao banco com pedido de MED.'],
      sources: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CaseFile) => {
    SoundEngine.playKeyClick();
    setEditingCase(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) return;

    SoundEngine.playSuccessSound();
    const isEdit = !!editingCase;
    const finalCase: CaseFile = {
      id: formData.id || `case-${Date.now()}`,
      caseNumber: formData.caseNumber || `CASO-${Date.now().toString().slice(-3)}`,
      title: formData.title || 'Dossiê Sem Título',
      date: formData.date || new Date().toISOString().split('T')[0],
      country: formData.country || 'Brasil',
      category: formData.category as ScamCategory,
      impactLevel: formData.impactLevel as 'EXTREME' | 'HIGH' | 'MODERATE',
      status: formData.status as 'ANALYZED' | 'MONITORED' | 'ARCHIVED',
      summary: formData.summary || '',
      timeline: formData.timeline || [],
      attackAnatomy: formData.attackAnatomy || {
        initialContact: 'Contato inicial',
        manipulationTechnique: 'Engenharia social',
        exploitationStep: 'Extração de dados',
        damageVector: 'Prejuízo'
      },
      defensesLearned: formData.defensesLearned || [],
      sources: formData.sources || []
    };

    CaseService.saveCase(finalCase);
    setCases(CaseService.getAllCases());

    AuditLogService.log({
      user: 'admin',
      action: isEdit ? 'UPDATE' : 'CREATE',
      entity: 'CASE_FILE',
      entityId: finalCase.caseNumber,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `${isEdit ? 'Atualizado' : 'Criado'} dossiê de caso: [${finalCase.caseNumber}] ${finalCase.title}`
    });

    setIsModalOpen(false);
    setEditingCase(null);
  };

  const handleDelete = (id: string) => {
    SoundEngine.playAlertSound();
    CaseService.deleteCase(id);
    setCases(CaseService.getAllCases());
    AuditLogService.log({
      user: 'admin',
      action: 'DELETE',
      entity: 'CASE_FILE',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Excluído dossiê de caso ID: ${id}`
    });
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
            Dossiês de Casos Documentados & Anatomia do Golpe
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Análises aprofundadas de incidentes reais, linhas do tempo de ataques e lições defensivas.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Dossiê</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por caso [CASO-001], título, vetor de impacto..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>

        <select
          value={selectedImpact}
          onChange={(e) => setSelectedImpact(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
        >
          <option value="ALL">Todos os Impactos</option>
          <option value="EXTREME">EXTREME</option>
          <option value="HIGH">HIGH</option>
          <option value="MODERATE">MODERATE</option>
        </select>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                  [{c.caseNumber}]
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    c.impactLevel === 'EXTREME'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : c.impactLevel === 'HIGH'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}
                >
                  IMPACTO {c.impactLevel}
                </span>
              </div>

              <h3 className="text-sm font-mono font-bold text-white line-clamp-1">{c.title}</h3>
              <p className="text-xs font-mono text-[#888888] mt-1 line-clamp-2">{c.summary}</p>
            </div>

            <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-[11px] font-mono text-[#777777]">
              <span>{c.country} · {c.date}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#222222]"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(c.id)}
                  className="p-1.5 rounded text-[#888888] hover:text-red-400 hover:bg-[#222222]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New/Edit Case */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#333333] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <h3 className="text-sm font-mono font-bold text-white">
                {editingCase ? `Editar Dossiê [${editingCase.caseNumber}]` : 'Novo Dossiê de Caso'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-[#777777] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888888] mb-1">Número do Caso *</label>
                  <input
                    type="text"
                    required
                    value={formData.caseNumber || ''}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="CASO-042"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] mb-1">Título do Caso *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Ex: Fraude do Falso Exame Admissional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ScamCategory })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">Nível de Impacto</label>
                  <select
                    value={formData.impactLevel}
                    onChange={(e) => setFormData({ ...formData, impactLevel: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="EXTREME">EXTREME</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">País / Região</label>
                  <input
                    type="text"
                    value={formData.country || 'Brasil'}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Resumo do Caso *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="p-3 border-t border-[#222222] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181818] text-[#CCCCCC]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Dossiê</span>
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
            <h4 className="text-sm font-mono font-bold text-red-400">Excluir Dossiê?</h4>
            <p className="text-xs font-mono text-[#AAAAAA]">Esta ação não pode ser desfeita.</p>
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
