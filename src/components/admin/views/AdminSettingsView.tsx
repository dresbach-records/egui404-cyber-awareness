import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Save,
  Radio,
  Volume2,
  RefreshCw,
  Trash2,
  CheckCircle,
  Database,
  Smartphone,
  Lock,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { SystemSettings } from '../../../types';
import { AdminSettingsService, AuditLogService } from '../../../services/adminService';
import { SoundEngine } from '../../../services/audioService';

export const AdminSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(() => AdminSettingsService.getSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cacheClearSuccess, setCacheClearSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SoundEngine.playSuccessSound();
    AdminSettingsService.saveSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    AuditLogService.log({
      user: 'super_admin',
      action: 'UPDATE',
      entity: 'SYSTEM_SETTINGS',
      entityId: 'CONFIG_MAIN',
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: 'Configurações globais do sistema atualizadas.'
    });
  };

  const handleClearAppCache = () => {
    SoundEngine.playAlertSound();
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }
    setCacheClearSuccess(true);
    setTimeout(() => setCacheClearSuccess(false), 3000);
    AuditLogService.log({
      user: 'super_admin',
      action: 'SYSTEM_PURGE',
      entity: 'PWA_CACHE',
      entityId: 'ALL_CACHES',
      ip: '127.0.0.1',
      result: 'SUCCESS',
      details: 'Cache de Service Worker PWA e assets estáticos purgados.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-['Bebas_Neue'] tracking-wide text-white flex items-center gap-2">
          Configurações do Sistema & Infraestrutura PWA
        </h1>
        <p className="text-xs font-mono text-[#888888]">
          Parâmetros de operação, política de rate-limiting, gerenciamento de cache offline e controles de emergência.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Configurações salvas com sucesso no armazenamento seguro.</span>
        </div>
      )}

      {cacheClearSuccess && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Cache do Service Worker purgado. Todos os clientes receberão a versão mais recente na próxima requisição.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs font-mono">
        {/* General Settings */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold pb-3 border-b border-[#1C1C1C]">
            <Settings className="w-4 h-4 text-[#E00000]" />
            <h3 className="uppercase">Parâmetros Gerais da Plataforma</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888888] mb-1">Nome da Plataforma</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#888888] mb-1">E-mail Oficial de Contato / DPO</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white focus:border-[#E00000] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Operational Security & Emergency Mode */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold pb-3 border-b border-[#1C1C1C]">
            <Shield className="w-4 h-4 text-orange-400" />
            <h3 className="uppercase">Segurança & Modos de Operação</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#222222]">
              <div>
                <span className="text-white font-bold block">Modo de Alerta / Transmissão de Emergência</span>
                <span className="text-[11px] text-[#777777]">
                  Fixa banner vermelho de perigo crítico no topo de todas as telas públicas.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.emergencyBroadcastActive}
                onChange={(e) => setSettings({ ...settings, emergencyBroadcastActive: e.target.checked })}
                className="w-4 h-4 accent-[#E00000]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#222222]">
              <div>
                <span className="text-white font-bold block">Canal Whistleblower / Denúncias Públicas</span>
                <span className="text-[11px] text-[#777777]">
                  Permite que cidadãos submetam novos incidentes pelo formulário seguro.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowPublicSubmissions}
                onChange={(e) => setSettings({ ...settings, allowPublicSubmissions: e.target.checked })}
                className="w-4 h-4 accent-[#E00000]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#222222]">
              <div>
                <span className="text-white font-bold block">Efeitos Sonoros Cibernéticos Defensivos</span>
                <span className="text-[11px] text-[#777777]">
                  Feedback acústico para cliques táticos, alertas de radar e transições.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEffectsEnabled}
                onChange={(e) => setSettings({ ...settings, soundEffectsEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#E00000]"
              />
            </div>
          </div>
        </div>

        {/* PWA & Cache Management */}
        <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-[#222222] space-y-4">
          <div className="flex items-center gap-2 text-white font-bold pb-3 border-b border-[#1C1C1C]">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <h3 className="uppercase">Gerenciamento PWA & Cache Offline</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#141414] border border-[#222222]">
            <div>
              <span className="text-white font-bold block">Purgar Cache do Service Worker</span>
              <span className="text-[11px] text-[#777777]">
                Força a atualização imediata dos arquivos offline em todos os dispositivos clientes.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearAppCache}
              className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-red-500/20 text-[#CCCCCC] hover:text-red-400 text-xs font-mono font-bold transition-colors shrink-0 cursor-pointer"
            >
              Limpar Cache
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#E00000] hover:bg-[#FF1A1A] text-white font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
