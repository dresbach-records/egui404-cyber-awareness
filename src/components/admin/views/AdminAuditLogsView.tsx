import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Trash2
} from 'lucide-react';
import { AuditLogItem } from '../../../types';
import { AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminAuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>(() => AuditLogService.getAll());
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => {
    if (selectedAction !== 'ALL' && l.action !== selectedAction) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        l.details.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.entity.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const exportCSV = () => {
    SoundEngine.playKeyClick();
    const headers = ['ID', 'Timestamp', 'User', 'Action', 'Entity', 'EntityID', 'IP', 'Result', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.user,
      l.action,
      l.entity,
      l.entityId,
      l.ip,
      l.result,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `egui404_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    SoundEngine.playKeyClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `egui404_audit_logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
            Trilha de Auditoria Imutável (Audit Trail)
          </h1>
          <p className="text-xs font-mono text-[#888888]">
            Registro de todas as ações administrativas, publicações, exclusões e alterações de parâmetros do sistema.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#202020] text-[#CCCCCC] text-xs font-mono border border-[#2A2A2A] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#141414] hover:bg-[#202020] text-[#CCCCCC] text-xs font-mono border border-[#2A2A2A] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-[#0D0D0D] border border-[#222222] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por usuário, detalhes, IP ou entidade..."
            className="w-full bg-[#141414] border border-[#262626] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-[#555555] focus:border-[#E00000] focus:outline-none"
          />
        </div>

        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs font-mono text-[#CCCCCC] focus:border-[#E00000] focus:outline-none"
        >
          <option value="ALL">Todas as Ações</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="PUBLISH">PUBLISH</option>
          <option value="MODERATION">MODERATION</option>
          <option value="INTEGRATION_SYNC">INTEGRATION_SYNC</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl bg-[#0D0D0D] border border-[#222222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#141414] text-[#888888] uppercase text-[10px] border-b border-[#222222]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Operador / IP</th>
                <th className="p-3.5">Ação</th>
                <th className="p-3.5">Entidade</th>
                <th className="p-3.5">Detalhes da Operação</th>
                <th className="p-3.5 text-right">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#121212] transition-colors">
                  <td className="p-3.5 text-[#777777] whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-semibold text-white">@{log.user}</div>
                    <div className="text-[10px] text-[#555555]">{log.ip}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'DELETE'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : log.action === 'CREATE' || log.action === 'PUBLISH'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : log.action === 'MODERATION'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#AAAAAA] whitespace-nowrap font-mono">{log.entity}</td>
                  <td className="p-3.5 text-[#CCCCCC] max-w-md">{log.details}</td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <span className="text-emerald-400 font-bold">{log.result}</span>
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
