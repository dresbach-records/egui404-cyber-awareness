import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Flame,
  FileCheck,
  Bell,
  Activity,
  CheckCircle,
  XCircle,
  Lock,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  Database,
  ExternalLink,
  Layers,
  AlertTriangle,
  FileText,
  MessageSquare,
  Users,
  BarChart3,
  Settings,
  Shield,
  Search,
  Filter,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  Radio,
  Wifi,
  WifiOff,
  Menu,
  X,
  ChevronRight,
  Terminal as TerminalIcon,
  HelpCircle,
  Globe,
  Share2,
  FolderLock
} from 'lucide-react';
import { SoundEngine } from '../../services/audioService';
import { AdminNotificationService } from '../../services/adminService';

interface AdminSidebarProps {
  currentSubRoute: string;
  onNavigateSub: (subRoute: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  pendingReportsCount: number;
  activeAlertsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSubRoute,
  onNavigateSub,
  isMobileOpen,
  onCloseMobile,
  pendingReportsCount,
  activeAlertsCount
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      label: 'NÚCLEO & TELEMETRIA',
      items: [
        { id: 'dashboard', label: 'Painel Geral', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      label: 'INTELIGÊNCIA DE AMEAÇAS',
      items: [
        { id: 'archive', label: 'Arquivo de Golpes', icon: ShieldAlert, badge: null },
        { id: 'threats', label: 'Matriz de Ameaças', icon: Flame, badge: null },
        { id: 'cases', label: 'Dossiês de Casos', icon: FileCheck, badge: null },
        { id: 'alerts', label: 'Alertas Ativos', icon: Bell, badge: activeAlertsCount > 0 ? activeAlertsCount : null, badgeColor: 'bg-[#E00000]' }
      ]
    },
    {
      label: 'CONTEÚDO & EDUCAÇÃO',
      items: [
        { id: 'education', label: 'Guias Educativos', icon: BookOpenIcon, badge: null },
        { id: 'articles', label: 'Gestor de Artigos', icon: FileText, badge: null }
      ]
    },
    {
      label: 'COMUNIDADE & TRIAGEM',
      items: [
        { id: 'forum', label: 'Moderação Fórum', icon: MessageSquare, badge: null },
        { id: 'reports', label: 'Denúncias Whistleblower', icon: AlertTriangle, badge: pendingReportsCount > 0 ? pendingReportsCount : null, badgeColor: 'bg-amber-500' },
        { id: 'moderation', label: 'Fila de Moderação', icon: Shield, badge: null },
        { id: 'members', label: 'Gestão de Membros', icon: Users, badge: null }
      ]
    },
    {
      label: 'FONTES & INGESTÃO',
      items: [
        { id: 'sources', label: 'Fontes Oficiais', icon: Database, badge: null },
        { id: 'sources-rnp', label: 'Sincronização RNP/CAIS', icon: RefreshCw, badge: 'OFFICIAL', badgeColor: 'bg-emerald-600' },
        { id: 'imports', label: 'Logs de Importação', icon: Layers, badge: null }
      ]
    },
    {
      label: 'SISTEMA & AUDITORIA',
      items: [
        { id: 'analytics', label: 'Métricas & Buscas', icon: BarChart3, badge: null },
        { id: 'settings', label: 'Configurações', icon: Settings, badge: null },
        { id: 'audit-logs', label: 'Trilha de Auditoria', icon: TerminalIcon, badge: null }
      ]
    }
  ];

  const handleItemClick = (id: string) => {
    SoundEngine.playKeyClick();
    onNavigateSub(id);
    onCloseMobile();
  };

  function BookOpenIcon(props: any) {
    return <FileText {...props} />;
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#0A0A0A] border-r border-[#222222] flex flex-col transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-72'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 border-b border-[#222222] flex items-center justify-between bg-[#080808]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#E00000]/10 border border-[#E00000]/30 flex items-center justify-center shrink-0">
              <FolderLock className="w-4 h-4 text-[#E00000]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-['Bebas_Neue'] tracking-wider text-lg text-white leading-none flex items-center gap-2">
                  E GUI 404 <span className="text-[#E00000] text-xs font-mono px-1.5 py-0.5 bg-[#E00000]/10 border border-[#E00000]/30 rounded">ADMIN</span>
                </span>
                <span className="text-[10px] font-mono text-[#777777] tracking-widest uppercase">
                  Control Center · v3.4
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded text-[#777777] hover:text-white hover:bg-[#1A1A1A] transition-colors"
              title={collapsed ? 'Expandir' : 'Recolher'}
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded text-[#777777] hover:text-white hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Clearance Badge */}
        {!collapsed && (
          <div className="px-4 py-2.5 bg-[#0D0D0D] border-b border-[#1A1A1A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                CLEARANCE LVL-4
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#666666]">OBSERVER_DEF</span>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-[#555555] uppercase">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentSubRoute === item.id;
                return (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono transition-all group relative ${
                      isActive
                        ? 'bg-[#E00000]/15 text-white border border-[#E00000]/40 font-semibold shadow-[0_0_12px_rgba(224,0,0,0.15)]'
                        : 'text-[#AAAAAA] hover:text-white hover:bg-[#141414] border border-transparent'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#FF1A1A]' : 'text-[#777777] group-hover:text-white'
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {item.badge !== null && !collapsed && (
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold text-white ${
                          item.badgeColor || 'bg-[#222222] text-[#AAAAAA]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#E00000] rounded-r"></span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#222222] bg-[#080808]">
          <button
            onClick={() => onNavigateSub('public_site')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-[#161616] hover:bg-[#222222] text-xs font-mono text-[#CCCCCC] hover:text-white border border-[#333333] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E00000]" />
            {!collapsed && <span>Ver Portal Público</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
