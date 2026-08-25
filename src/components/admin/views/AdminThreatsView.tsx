import React, { useState } from 'react';
import {
  Flame,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  AlertTriangle,
  Shield,
  Layers,
  Terminal,
  Activity,
  Calendar,
  Sparkles
} from 'lucide-react';
import { ThreatItem, ScamCategory, RiskLevel, ThreatStatus } from '../../../types';
import { ThreatService } from '../../../services/dataService';
import { AuditLogService } from '../../../services/adminService';
import { RiskBadge } from '../../ui/RiskBadge';
import { StatusBadge } from '../../ui/StatusBadge';
import { SoundEngine } from '../../../services/audioService';

export const AdminThreatsView: React.FC = () => {
  const [threats, setThreats] = useState<ThreatItem[]>(() => ThreatService.getAllThreats());
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThreat, setEditingThreat] = useState<ThreatItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ThreatItem>>({
    threatCode: '',
    title: '',
    slug: '',
    category: 'PHISHING',
    riskLevel: 'HIGH',
    status: 'ACTIVE',
    severityScore: 85,
    summary: '',
    targetVectors: ['E-mail Corporativo', 'SMS Falso', 'Domínio Clonado'],
    safeIndicators: [
      {
        type: 'DOMAIN_PATTERN',
        value: 'hXXps://auth[.]seguro-login[.]com',
        note: 'Padrão de domínio de typosquatting interceptado'
      }
    ],
    mitigationSummary: 'Bloqueio perimetral de DNS e revogação de tokens de sessão comprometidos.',
    firstObserved: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    sources: [
      {
        organization: 'CERT.br / NIC.br',
        title: 'Boletim Técnico de Ameaças Cibernéticas',
        url: 'https://www.cert.br',
        isOfficial: true
      }
    ]
  });

  const categories: ScamCategory[] = [
    'PHISHING',
    'PIX SCAMS',
    'WHATSAPP FRAUD',
    'FAKE INVESTMENTS',
    'FAKE SUPPORT',
    'SOCIAL ENGINEERING',
    'ACCOUNT TAKEOVER',
    'MALWARE',
    'RANSOMWARE',
    'DATA BREACH',
    'SMISHING',
    'VISHING'
  ];

  const filteredThreats = threats.filter((item) => {
    if (selectedRisk !== 'ALL' && item.riskLevel !== selectedRisk) return false;
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.threatCode.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenNew = () => {
    SoundEngine.playKeyClick();
    const nextCode = `THREAT-${String(threats.length + 1).padStart(3, '0')}`;
    setEditingThreat(null);
    setFormData({
      id: `threat-${Date.now()}`,
      threatCode: nextCode,
      slug: `threat-${nextCode.toLowerCase()}`,
      title: '',
      category: 'PHISHING',
      riskLevel: 'HIGH',
      status: 'ACTIVE',
      severityScore: 80,
      summary: '',
      targetVectors: ['Engenharia Social Direta', 'Página Falsa'],
      safeIndicators: [
        {
          type: 'BEHAVIORAL_TRIGGER',
          value: 'Exigência de validação biométrica em link externo',
          note: 'Gatilho comportamental de roubo de credencial'
        }
      ],
      mitigationSummary: 'Auditoria de sessões e ativação de autenticação multifator forte (WebAuthn/FIDO2).',
      firstObserved: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      sources: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (threat: ThreatItem) => {
    SoundEngine.playKeyClick();
    setEditingThreat(threat);
    setFormData({ ...threat });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) return;

    SoundEngine.playSuccessSound();
    const isEdit = !!editingThreat;
    const finalThreat: ThreatItem = {
      id: formData.id || `threat-${Date.now()}`,
      threatCode: formData.threatCode || `THREAT-${Date.now().toString().slice(-3)}`,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `threat-${Date.now()}`,
      title: formData.title || 'Nova Ameaça Documentada',
      category: formData.category as ScamCategory,
      riskLevel: formData.riskLevel as RiskLevel,
      status: formData.status as ThreatStatus,
      severityScore: Number(formData.severityScore) || 75,
      summary: formData.summary || '',
      targetVectors: formData.targetVectors || ['Vetor de exploração'],
      safeIndicators: formData.safeIndicators || [],
      mitigationSummary: formData.mitigationSummary || 'Mitigação padrão defensiva.',
      firstObserved: formData.firstObserved || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      sources: formData.sources || []
    };

    ThreatService.saveThreat(finalThreat);
    setThreats(ThreatService.getAllThreats());

    AuditLogService.log({
      user: 'admin',
      action: isEdit ? 'UPDATE' : 'CREATE',
      entity: 'THREAT_MATRIX',
      entityId: finalThreat.threatCode,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `${isEdit ? 'Atualizada' : 'Criada'} ameaça na matriz: [${finalThreat.threatCode}] ${finalThreat.title}`
    });

    setIsModalOpen(false);
    setEditingThreat(null);
  };

  const handleDelete = (id: string) => {
    SoundEngine.playAlertSound();
    ThreatService.deleteThreat(id);
    setThreats(ThreatService.getAllThreats());
    AuditLogService.log({
      user: 'admin',
      action: 'DELETE',
      entity: 'THREAT_MATRIX',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Excluída ameaça da matriz ID: ${id}`
    });
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
            Matriz de Ameaças & Indicadores de Comprometimento (IOC)
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Monitoramento tático de vetores de ataque, severidade ponderada e assinaturas defensivas.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Ameaça</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ameaça por código [THREAT-001], nome, vetor..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>

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

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
        >
          <option value="ALL">Todos os Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="MONITORED">MONITORED</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>

      {/* Grid of Threat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThreats.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs font-mono text-[#666666] bg-[#0D0D0D] border border-[#222222] rounded-xl">
            Nenhuma ameaça encontrada com os critérios informados.
          </div>
        ) : (
          filteredThreats.map((threat) => (
            <div
              key={threat.id}
              className="p-4 rounded-xl bg-[#0D0D0D] hover:bg-[#121212] border border-[#222222] hover:border-[#333333] transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">
                    [{threat.threatCode}]
                  </span>
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={threat.riskLevel} />
                    <StatusBadge status={threat.status} />
                  </div>
                </div>

                <h3 className="text-sm font-mono font-bold text-white group-hover:text-[#FF1A1A] transition-colors">
                  {threat.title}
                </h3>
                <p className="text-xs font-mono text-[#888888] mt-1 line-clamp-2">
                  {threat.summary}
                </p>

                {/* Severity Score Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#777777] mb-1">
                    <span>SEVERIDADE TÁTICA</span>
                    <span className="text-white font-bold">{threat.severityScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#222222] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        threat.severityScore > 80
                          ? 'bg-red-500'
                          : threat.severityScore > 60
                          ? 'bg-orange-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${threat.severityScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Target Vectors */}
              <div className="pt-2 border-t border-[#1C1C1C] flex flex-wrap gap-1">
                {threat.targetVectors.slice(0, 3).map((vec, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#161616] text-[#AAAAAA] border border-[#262626]"
                  >
                    {vec}
                  </span>
                ))}
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#666666]">
                  Atualizado: {threat.lastUpdated}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(threat)}
                    className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#222222] transition-colors"
                    title="Editar Ameaça"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(threat.id)}
                    className="p-1.5 rounded text-[#888888] hover:text-red-400 hover:bg-[#222222] transition-colors"
                    title="Remover Ameaça"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: New/Edit Threat */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-[#333333] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            <div className="p-4 border-b border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-mono font-bold text-white">
                  {editingThreat ? `Editar Ameaça [${editingThreat.threatCode}]` : 'Registrar Nova Ameaça na Matriz'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded text-[#777777] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#888888] mb-1">Código da Ameaça *</label>
                  <input
                    type="text"
                    required
                    value={formData.threatCode || ''}
                    onChange={(e) => setFormData({ ...formData, threatCode: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Ex: THREAT-045"
                  />
                </div>
                <div>
                  <label className="block text-[#888888] mb-1">Título da Ameaça *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Ex: Campanha de Phishing via Notificação Judicial"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ScamCategory })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-orange-500 focus:outline-none"
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
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">Severidade ({formData.severityScore}%)</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={formData.severityScore || 70}
                    onChange={(e) => setFormData({ ...formData, severityScore: Number(e.target.value) })}
                    className="w-full accent-orange-500 mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Resumo Executivo da Ameaça *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Síntese da tática do adversário e impacto nos alvos..."
                />
              </div>

              <div>
                <label className="block text-[#888888] mb-1">Diretriz de Mitigação Defensiva</label>
                <textarea
                  rows={2}
                  value={formData.mitigationSummary || ''}
                  onChange={(e) => setFormData({ ...formData, mitigationSummary: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2.5 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Ações imediatas para contenção e isolamento..."
                />
              </div>

              <div className="p-3 border-t border-[#222222] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#181818] hover:bg-[#222222] text-[#CCCCCC] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(234,88,12,0.3)]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Ameaça</span>
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
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-mono font-bold">Confirmar Exclusão de Ameaça</h4>
            </div>
            <p className="text-xs font-mono text-[#AAAAAA]">
              Esta ação removerá a ameaça da matriz ativa e registrará na auditoria.
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
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
