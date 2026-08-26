import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../admin/AdminSidebar';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminDashboardView } from '../admin/views/AdminDashboardView';
import { AdminArchiveView } from '../admin/views/AdminArchiveView';
import { AdminThreatsView } from '../admin/views/AdminThreatsView';
import { AdminCasesView } from '../admin/views/AdminCasesView';
import { AdminAlertsView } from '../admin/views/AdminAlertsView';
import { AdminArticlesView, AdminEducationView } from '../admin/views/AdminArticlesView';
import { AdminForumView } from '../admin/views/AdminForumView';
import { AdminReportsView, AdminModerationView } from '../admin/views/AdminReportsView';
import { AdminSourcesView, AdminMembersView } from '../admin/views/AdminMembersView';
import { AdminRnpSyncView, AdminImportsView } from '../admin/views/AdminRnpSyncView';
import { AdminAnalyticsView } from '../admin/views/AdminAnalyticsView';
import { AdminSettingsView } from '../admin/views/AdminSettingsView';
import { AdminAuditLogsView } from '../admin/views/AdminAuditLogsView';
import { AdminLoginView } from '../admin/views/AdminLoginView';
import { ScamReportService, AlertService } from '../../services/dataService';
import { SoundEngine } from '../../services/audioService';
import { authApi } from '../../services/api/authApi';
import type { AuthenticatedAccessUser } from '../../services/api/access';

interface AdminViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, language }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthenticatedAccessUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    authApi.getSession(controller.signal).then((user) => {
      if (controller.signal.aborted) return;
      const hasAdminRole = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MODERATOR';
      setCurrentUser(hasAdminRole ? user : null);
      setAccessDenied(Boolean(user) && !hasAdminRole);
      setIsCheckingSession(false);
    });
    return () => controller.abort();
  }, []);

  // Current Subroute State
  const routeToSub = (pathname: string) => {
    const segments = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
    if (segments.length === 0 || segments[0] === 'dashboard') return 'dashboard';
    const routeMap: Record<string, string> = {
      users: 'members', communities: 'forum', posts: 'forum', comments: 'moderation',
      reports: 'reports', moderation: 'moderation', bans: 'moderation', restrictions: 'moderation',
      threats: 'threats', scams: 'archive', indicators: 'threats', cases: 'cases', articles: 'articles',
      alerts: 'alerts', sources: 'sources', analytics: 'analytics', audit: 'audit-logs',
      roles: 'members', permissions: 'members', settings: 'settings', system: 'settings'
    };
    return routeMap[segments[0]] || 'dashboard';
  };

  const [currentSubRoute, setCurrentSubRoute] = useState<string>(() => routeToSub(window.location.pathname));
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Counters for Header/Sidebar badges
  const [pendingReportsCount, setPendingReportsCount] = useState(
    () => ScamReportService.getPendingReports().length
  );
  const [activeAlertsCount, setActiveAlertsCount] = useState(
    () => AlertService.getActiveAlerts().length
  );

  const handleLoginSuccess = (user: AuthenticatedAccessUser) => {
    setCurrentUser(user);
    setAccessDenied(false);
  };

  const handleLogout = () => {
    SoundEngine.playKeyClick();
    setCurrentUser(null);
    void authApi.logout();
  };

  const handleNavigateSub = (sub: string) => {
    if (sub === 'public_site') {
      onNavigate('/');
      return;
    }
    setCurrentSubRoute(sub);
    onNavigate(sub === 'dashboard' ? '/admin' : `/admin/${sub}`);
  };

  if (isCheckingSession) {
    return <div className="min-h-[85vh] flex items-center justify-center p-6 font-mono text-xs text-[#888888]">Verificando sessão segura...</div>;
  }

  if (accessDenied) {
    return <div className="min-h-[85vh] flex items-center justify-center p-6 font-mono text-center text-xs text-red-300">403 — Acesso administrativo negado.</div>;
  }

  if (!currentUser) {
    return <AdminLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] flex flex-col font-mono selection:bg-[#E00000] selection:text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentSubRoute={currentSubRoute}
        onNavigateSub={handleNavigateSub}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        pendingReportsCount={pendingReportsCount}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all duration-300">
        {/* Admin Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
          onNavigateSub={handleNavigateSub}
          currentSubRoute={currentSubRoute}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Subview Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentSubRoute === 'dashboard' && (
            <AdminDashboardView
            onNavigateSub={handleNavigateSub}
            onQuickAction={(action) => {
              const routes = { NEW_THREAT: 'threats', NEW_ALERT: 'alerts', NEW_SCAM: 'archive', SYNC_RNP: 'sources-rnp' } as const;
              handleNavigateSub(routes[action]);
            }}
          />
          )}

          {currentSubRoute === 'archive' && <AdminArchiveView />}

          {currentSubRoute === 'threats' && <AdminThreatsView />}

          {currentSubRoute === 'cases' && <AdminCasesView />}

          {currentSubRoute === 'alerts' && <AdminAlertsView />}

          {currentSubRoute === 'education' && <AdminEducationView />}

          {currentSubRoute === 'articles' && <AdminArticlesView />}

          {currentSubRoute === 'forum' && <AdminForumView />}

          {currentSubRoute === 'reports' && <AdminReportsView />}

          {currentSubRoute === 'moderation' && <AdminModerationView />}

          {currentSubRoute === 'members' && <AdminMembersView />}

          {currentSubRoute === 'sources' && <AdminSourcesView />}

          {currentSubRoute === 'sources-rnp' && <AdminRnpSyncView />}

          {currentSubRoute === 'imports' && <AdminImportsView />}

          {currentSubRoute === 'analytics' && <AdminAnalyticsView />}

          {currentSubRoute === 'settings' && <AdminSettingsView />}

          {currentSubRoute === 'audit-logs' && <AdminAuditLogsView />}
        </main>
      </div>
    </div>
  );
};
