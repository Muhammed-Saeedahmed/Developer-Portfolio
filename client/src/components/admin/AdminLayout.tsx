import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { adminApi } from '../../services/api';

export const AdminLayout: React.FC = () => {
  const { user, token, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      if (token) {
        try {
          const res = await adminApi.getStats();
          if (res.success && res.stats) {
            setUnreadCount(res.stats.unreadMessages || 0);
          }
        } catch (e) {}
      }
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] flex items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-3 border-[#00F5D4]/20 border-t-[#00F5D4] animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadCount={unreadCount}
      />

      {/* Main Panel */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          unreadCount={unreadCount}
        />
        <main className="p-6 sm:p-8 max-w-7xl w-full mx-auto flex-1">
          <Outlet context={{ refreshUnread: () => {} }} />
        </main>
      </div>
    </div>
  );
};
