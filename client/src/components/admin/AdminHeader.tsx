import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Search, Bell, ExternalLink, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../services/api';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  unreadCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle, unreadCount = 0 }) => {
  const { user } = useAuth();
  const { profile } = usePortfolio();

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#070A0F]/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + Global Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects, skills, messages..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl glass-input text-xs placeholder-slate-500"
          />
        </div>
      </div>

      {/* Right: View Live Site CTA + Notifications + Profile Avatar */}
      <div className="flex items-center space-x-4">
        {/* View Live Site Button (Matching Design Reference) */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all duration-300"
        >
          <span>View Live Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Notifications Icon */}
        <Link
          to="/admin/messages"
          className="relative p-2.5 rounded-full glass-panel text-slate-400 hover:text-white hover:border-[#00F5D4]/40 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00F5D4] text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Admin Avatar Preview */}
        <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center">
            {profile.profile_image ? (
              <img
                src={getAssetUrl(profile.profile_image)}
                alt="Admin Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white leading-tight">
              {user?.name || profile.developer_name || 'Muhammad Saeed'}
            </p>
            <p className="text-[10px] text-slate-400">Master Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
