import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { Search, Bell, ExternalLink, Menu, User, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAssetUrl, adminApi } from '../../services/api';
import { Message } from '../../types';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  unreadCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuToggle, unreadCount = 0 }) => {
  const { user } = useAuth();
  const { profile } = usePortfolio();
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchRecentMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await adminApi.getMessages();
      if (res.success && res.data) {
        setRecentMessages(res.data.slice(0, 5));
      }
    } catch (e) {
      console.error('Failed to load recent notifications:', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleToggleNotification = () => {
    if (!notificationOpen) {
      fetchRecentMessages();
    }
    setNotificationOpen(prev => !prev);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#070A0F]/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile menu toggle + Global Search */}
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 max-w-lg">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white lg:hidden"
          title="Toggle Menu"
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
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* View Live Site Button */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center space-x-2 px-3.5 sm:px-5 py-2 rounded-full text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all duration-300"
        >
          <span className="hidden xs:inline">View Live Site</span>
          <span className="xs:hidden">Live</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Notifications Icon & Popover Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleToggleNotification}
            aria-label="Notifications"
            className={`relative p-2.5 rounded-full glass-panel text-slate-400 hover:text-white transition-colors ${
              notificationOpen ? 'border-[#00F5D4]/60 text-[#00F5D4] bg-white/10' : 'hover:border-[#00F5D4]/40'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00F5D4] text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Viewport-Safe Notification Dropdown Panel */}
          {notificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm z-50 bg-[#0A0E17]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#00F5D4]" />
                  <h4 className="text-sm font-bold text-white">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/30">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
                {loadingMessages ? (
                  <div className="p-6 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#00F5D4] border-t-transparent animate-spin" />
                    <span>Loading inquiries...</span>
                  </div>
                ) : recentMessages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#00F5D4] mx-auto opacity-80" />
                    <p className="text-xs font-semibold text-slate-300">All caught up!</p>
                    <p className="text-[11px] text-slate-500">No unread client messages or inquiries.</p>
                  </div>
                ) : (
                  recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => {
                        setNotificationOpen(false);
                        navigate('/admin/messages');
                      }}
                      className={`p-3.5 hover:bg-white/5 transition-colors cursor-pointer text-left ${
                        !msg.is_read ? 'bg-[#00F5D4]/[0.03]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          {!msg.is_read && (
                            <span className="w-2 h-2 rounded-full bg-[#00F5D4] flex-shrink-0 animate-pulse" />
                          )}
                          <p className="text-xs font-bold text-white truncate">
                            {msg.name}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-500 flex-shrink-0">
                          {msg.created_at ? new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#00F5D4] mt-0.5 truncate">
                        {msg.subject || 'Portfolio Inquiry'}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-white/[0.02] border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate('/admin/messages');
                  }}
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#00F5D4] hover:bg-[#00F5D4]/10 transition-colors"
                >
                  <span>View All Messages in CMS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar Preview */}
        <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-slate-800 flex items-center justify-center flex-shrink-0">
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
