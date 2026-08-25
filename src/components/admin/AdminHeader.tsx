import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  Plus,
  Radio,
  Wifi,
  WifiOff,
  Terminal,
  Shield,
  CheckCircle2,
  ExternalLink,
  X,
  RefreshCw,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { AdminNotification } from '../../types';
import { AdminNotificationService } from '../../services/adminService';
import { SoundEngine } from '../../services/audioService';

interface AdminHeaderProps {
  currentSubRoute: string;
  onOpenMobileMenu: () => void;
  onNavigateSub: (subRoute: string) => void;
  isOnline: boolean;
  onQuickAction: (action: 'NEW_THREAT' | 'NEW_ALERT' | 'NEW_SCAM' | 'SYNC_RNP') => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSubRoute,
  onOpenMobileMenu,
  onNavigateSub,
  isOnline,
  onQuickAction
}) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    AdminNotificationService.getNotifications()
  );
  const [showNotifs, setShowNotifs] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    SoundEngine.playKeyClick();
    AdminNotificationService.markAllAsRead();
    setNotifications(AdminNotificationService.getNotifications());
  };

  const getBreadcrumbTitle = (sub: string) => {
    const map: Record<string, string> = {
      dashboard: 'Painel Geral & Telemetria',
      archive: 'Arquivo de Golpes (CRUD)',
      threats: 'Matriz de Ameaças & IOCs',
      cases: 'Dossiês de Casos Documentados',
      alerts: 'Broadcast de Alertas Urgentes',
      education: 'Guias Educativos & Checklists',
      articles: 'Gestor & Editor de Artigos',
      forum: 'Moderação de Fórum & Tópicos',
      reports: 'Denúncias Whistleblower',
      moderation: 'Fila Unificada de Moderação',
      members: 'Gestão de Membros & Cargos',
      sources: 'Fontes Oficiais & Conectores',
      'sources-rnp': 'Sincronização RNP/CAIS (Catálogo de Fraudes)',
      imports: 'Logs de Importação & Sincronia',
      analytics: 'Métricas, Buscas & Heatmaps',
      settings: 'Configurações do Sistema',
      'audit-logs': 'Trilha de Auditoria Operacional'
    };
    return map[sub] || 'Centro de Controle';
  };

  return (
    <header className="h-16 border-b border-[#222222] bg-[#0A0A0A]/95 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between gap-3">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[#141414] border border-[#262626] text-[#AAAAAA] hover:text-white"
          aria-label="Abrir Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-[#888888] overflow-hidden">
          <span className="text-[#555555] hidden sm:inline">ADMIN</span>
          <span className="text-[#444444] hidden sm:inline">/</span>
          <span className="text-white font-semibold truncate tracking-wide">
            {getBreadcrumbTitle(currentSubRoute)}
          </span>
        </div>
      </div>

      {/* Right: Actions & System Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA / Network Status */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
          title={isOnline ? 'Online - Sincronizado' : 'Offline - Cache PWA Ativo'}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">LIVE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-amber-400" />
              <span>OFFLINE PWA</span>
            </>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              setShowQuickMenu(!showQuickMenu);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E00000] hover:bg-[#FF1A1A] text-white text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(224,0,0,0.3)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ação Rápida</span>
            <ChevronDown className="w-3 h-3 opacity-75" />
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#333333] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('NEW_THREAT');
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono rounded-lg hover:bg-[#222222] text-[#E0E0E0] hover:text-white flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-[#E00000]" />
                <span>Nova Ameaça Matrix</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('NEW_ALERT');
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono rounded-lg hover:bg-[#222222] text-[#E0E0E0] hover:text-white flex items-center gap-2"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Broadcast de Alerta</span>
              </button>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('NEW_SCAM');
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono rounded-lg hover:bg-[#222222] text-[#E0E0E0] hover:text-white flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Registrar Golpe no Arquivo</span>
              </button>
              <div className="my-1 border-t border-[#222222]"></div>
              <button
                onClick={() => {
                  setShowQuickMenu(false);
                  onQuickAction('SYNC_RNP');
                }}
                className="w-full text-left px-3 py-2 text-xs font-mono rounded-lg hover:bg-[#222222] text-[#E0E0E0] hover:text-white flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sincronizar RNP/CAIS</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => {
              SoundEngine.playKeyClick();
              setShowNotifs(!showNotifs);
            }}
            className="relative p-2 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] border border-[#262626] text-[#AAAAAA] hover:text-white transition-colors"
            title="Notificações Administrativas"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E00000] text-[9px] font-mono text-white flex items-center justify-center font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111111] border border-[#333333] rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#222222]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#E00000]" />
                  <span className="text-xs font-mono font-bold text-white uppercase">
                    Notificações do Sistema
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-mono text-[#888888] hover:text-white"
                  >
                    Marcar lidas
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 scrollbar-thin">
                {notifications.length === 0 ? (
                  <p className="text-xs font-mono text-[#666666] text-center py-4">
                    Nenhuma notificação recente.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link) onNavigateSub(n.link.replace('/admin/', ''));
                        setShowNotifs(false);
                      }}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        n.read
                          ? 'bg-[#141414] border-[#222222] text-[#888888]'
                          : 'bg-[#1B1212] border-[#E00000]/30 text-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-mono font-semibold line-clamp-1">
                          {n.title}
                        </span>
                        <span className="text-[9px] font-mono text-[#777777] shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-[#AAAAAA] mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Clearance Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] border border-[#262626] text-left transition-colors"
          >
            <div className="w-6 h-6 rounded bg-[#E00000] text-white flex items-center justify-center font-mono font-bold text-xs">
              Ω
            </div>
            <div className="hidden sm:flex flex-col text-[10px] font-mono leading-none">
              <span className="text-white font-bold">OBSERVER</span>
              <span className="text-[#E00000]">LVL 4</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-[#333333] rounded-xl shadow-2xl p-2 z-50">
              <div className="px-2 py-1.5 border-b border-[#222222] mb-1">
                <div className="text-xs font-mono font-bold text-white">Observer Security</div>
                <div className="text-[10px] font-mono text-[#777777]">root@egui404.def</div>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigateSub('settings');
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs font-mono text-[#CCCCCC] hover:text-white hover:bg-[#222222] rounded"
              >
                Configurações
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigateSub('audit-logs');
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs font-mono text-[#CCCCCC] hover:text-white hover:bg-[#222222] rounded"
              >
                Trilha de Auditoria
              </button>
              <div className="my-1 border-t border-[#222222]"></div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigateSub('public_site');
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs font-mono text-rose-400 hover:bg-rose-500/10 rounded flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair do Painel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
