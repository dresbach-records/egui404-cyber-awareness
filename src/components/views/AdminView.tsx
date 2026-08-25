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

interface AdminViewProps {
  onNavigate: (path: string) => void;
  language: 'pt' | 'en';
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate, language }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: string } | null>(() => {
    try {
      const stored = localStorage.getItem('egui404_admin_session');
      return stored ? JSON.parse(stored) : { name: 'Comandante de Operações', role: 'SUPER_ADMIN' };
    } catch {
      return { name: 'Comandante de Operações', role: 'SUPER_ADMIN' };
    }
  });

  // Current Subroute State
  const [currentSubRoute, setCurrentSubRoute] = useState<string>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Counters for Header/Sidebar badges
  const [pendingReportsCount, setPendingReportsCount] = useState(
    () => ScamReportService.getPendingReports().length
  );
  const [activeAlertsCount, setActiveAlertsCount] = useState(
    () => AlertService.getActiveAlerts().length
  );

  const handleLoginSuccess = (user: { name: string; role: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('egui404_admin_session', JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    SoundEngine.playKeyClick();
    setCurrentUser(null);
    try {
      localStorage.removeItem('egui404_admin_session');
    } catch {}
  };

  const handleNavigateSub = (sub: string) => {
    if (sub === 'public_site') {
      onNavigate('/');
      return;
    }
    setCurrentSubRoute(sub);
  };

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
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          onNavigateSub={handleNavigateSub}
          currentSubRoute={currentSubRoute}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Subview Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentSubRoute === 'dashboard' && (
            <AdminDashboardView onNavigateSub={handleNavigateSub} />
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
