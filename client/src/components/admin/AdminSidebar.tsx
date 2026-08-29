import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Layers,
  Briefcase,
  GraduationCap,
  Sparkles,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  unreadCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ unreadCount = 0, isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills', path: '/admin/skills', icon: Layers },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Services', path: '/admin/services', icon: Sparkles },
    { name: 'Messages', path: '/admin/messages', icon: Mail, badge: unreadCount },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A0E17]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00F5D4] to-[#A855F7] p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-[#070A0F] rounded-[10px] flex items-center justify-center text-[#00F5D4] font-black text-lg">
                MS
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                MS Admin CMS
              </h2>
              <p className="text-[11px] text-[#00F5D4] font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse"></span>
                <span>Live Management</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00F5D4]/15 to-purple-500/10 text-[#00F5D4] border border-[#00F5D4]/40 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[#00F5D4]' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#00F5D4] text-slate-950">
                      {item.badge}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#070A0F]/60">
          <div className="flex items-center justify-between px-2">
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Muhammad Saeed'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@saeed.dev'}</p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              title="Open Public Site in New Tab"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
