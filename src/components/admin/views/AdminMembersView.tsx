import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Shield,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Lock,
  Mail
} from 'lucide-react';
import { AdminMemberItem, AdminSourceItem } from '../../../types';
import { AdminMemberService, AdminSourcesService, AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminMembersView: React.FC = () => {
  const [members, setMembers] = useState<AdminMemberItem[]>(() => AdminMemberService.getAll());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminMemberItem | null>(null);

  const [formData, setFormData] = useState<Partial<AdminMemberItem>>({
    name: '',
    email: '',
    role: 'ANALYST',
    status: 'ACTIVE',
    mfaEnabled: true
  });

  const filteredMembers = members.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenNew = () => {
    SoundEngine.playKeyClick();
    setEditingMember(null);
    setFormData({
      id: `usr-${Date.now()}`,
      name: '',
      email: '',
      role: 'ANALYST',
      status: 'ACTIVE',
      mfaEnabled: true,
      lastLogin: 'Nunca'
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    SoundEngine.playSuccessSound();
    const finalMember: AdminMemberItem = {
      id: formData.id || `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as any,
      status: formData.status as any,
      mfaEnabled: !!formData.mfaEnabled,
      lastLogin: formData.lastLogin || 'Nunca'
    };

    AdminMemberService.save(finalMember);
    setMembers(AdminMemberService.getAll());

    AuditLogService.log({
      user: 'super_admin',
      action: editingMember ? 'UPDATE' : 'CREATE',
      entity: 'SECURITY_STAFF',
      entityId: finalMember.id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Permissões de membro salvas: ${finalMember.name} (${finalMember.role})`
    });

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    SoundEngine.playAlertSound();
    AdminMemberService.delete(id);
    setMembers(AdminMemberService.getAll());
    AuditLogService.log({
      user: 'super_admin',
      action: 'DELETE',
      entity: 'SECURITY_STAFF',
      entityId: id,
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: `Membro ID ${id} removido da equipe.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
            Equipe de Inteligência & Controle de Acesso (RBAC)
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Gerenciamento de analistas, pesquisadores de ameaças, moderadores e administradores de sistema.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Operador</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou cargo..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-xl bg-[#0D0D0D] border border-[#222222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141414] text-[#888888] uppercase text-[10px] border-b border-[#222222]">
              <tr>
                <th className="p-3.5">Nome & E-mail</th>
                <th className="p-3.5">Papel / Nível</th>
                <th className="p-3.5">MFA (2FA)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Último Acesso</th>
                <th className="p-3.5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#121212] transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className="text-[10px] text-[#777777]">{m.email}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.role === 'SUPER_ADMIN'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : m.role === 'ADMIN'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          : m.role === 'ANALYST'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {m.mfaEnabled ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Ativo
                      </span>
                    ) : (
                      <span className="text-amber-400 flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Inativo
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-[#222222] text-[#888888]'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#777777]">{m.lastLogin}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingMember(m);
                          setFormData({ ...m });
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#222222]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 rounded text-[#888888] hover:text-red-400 hover:bg-[#222222]"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#333333] rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingMember ? 'Editar Operador' : 'Cadastrar Novo Operador'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#777777] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[#888888] mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#888888] mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#888888] mb-1">Nível de Permissão</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                  >
                    <option value="ANALYST">ANALYST</option>
                    <option value="MODERATOR">MODERATOR</option>
                    <option value="RESEARCHER">RESEARCHER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#888888] mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A2A2A] rounded-lg p-2 text-white focus:border-[#E00000] focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mfa-check"
                  checked={formData.mfaEnabled}
                  onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
                  className="accent-[#E00000]"
                />
                <label htmlFor="mfa-check" className="text-[#AAAAAA] cursor-pointer">
                  Exigir Autenticação em Dois Fatores (FIDO2 / TOTP)
                </label>
              </div>

              <div className="pt-3 border-t border-[#222222] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-[#181818] text-[#CCCCCC]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#E00000] hover:bg-[#FF1A1A] text-white font-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminSourcesView: React.FC = () => {
  const [sources, setSources] = useState<AdminSourceItem[]>(() => AdminSourcesService.getAll());

  const handleToggle = (id: string) => {
    SoundEngine.playKeyClick();
    AdminSourcesService.toggleSource(id);
    setSources(AdminSourcesService.getAll());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Fontes Oficiais & Conectores de Inteligência
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Integrações ativas com diretórios de segurança da informação, centros de resposta a incidentes e órgãos reguladores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((s) => (
          <div
            key={s.id}
            className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-mono font-bold text-white">{s.name}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    s.status === 'ONLINE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : s.status === 'SYNCING'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <p className="text-xs font-mono text-[#888888]">{s.description}</p>
              <div className="text-[11px] font-mono text-cyan-400 truncate mt-2">{s.url}</div>
            </div>

            <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between text-xs font-mono">
              <span className="text-[#666666]">Registros Importados: {s.itemsCount}</span>
              <button
                onClick={() => handleToggle(s.id)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                  s.status === 'ONLINE' || s.status === 'SYNCING'
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {s.status === 'ONLINE' || s.status === 'SYNCING' ? 'Pausar Conector' : 'Ativar Conector'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
