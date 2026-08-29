import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, getAssetUrl } from '../../services/api';
import { DashboardStats, TrafficDataPoint, Project, Message } from '../../types';
import {
  Eye,
  MousePointerClick,
  Mail,
  FolderGit2,
  TrendingUp,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalSkills: 0,
    totalExperience: 0,
    totalEducation: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalViews: 128400,
    projectClicks: 45200
  });
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getProjects()
        ]);
        if (statsRes.success) {
          setStats(statsRes.stats);
          setTrafficData(statsRes.trafficData || []);
          setRecentMessages(statsRes.recentMessages || []);
        }
        if (projectsRes.success) {
          setProjects(projectsRes.data || []);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const statCards = [
    {
      title: 'Total Views',
      value: (stats.totalViews / 1000).toFixed(1) + 'K',
      trend: '+15%',
      isPositive: true,
      icon: <Eye className="w-5 h-5 text-[#00F5D4]" />,
      accent: 'border-[#00F5D4]/30'
    },
    {
      title: 'Project Clicks',
      value: (stats.projectClicks / 1000).toFixed(1) + 'K',
      trend: '+8%',
      isPositive: true,
      icon: <MousePointerClick className="w-5 h-5 text-[#A855F7]" />,
      accent: 'border-[#A855F7]/30'
    },
    {
      title: 'Inquiries',
      value: stats.totalMessages.toString(),
      trend: `+${stats.unreadMessages} new`,
      isPositive: stats.unreadMessages > 0,
      icon: <Mail className="w-5 h-5 text-cyan-400" />,
      accent: 'border-cyan-500/30'
    },
    {
      title: 'Active Projects',
      value: projects.length.toString(),
      trend: 'Live in Portfolio',
      isPositive: true,
      icon: <FolderGit2 className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/30'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics and dynamic content controls for your portfolio.
          </p>
        </div>
        
        <Link
          to="/admin/projects"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* KPI Stats Cards (Matching Visual Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`glass-panel rounded-3xl p-6 border ${card.accent} hover:border-[#00F5D4]/50 transition-all duration-300 hover:shadow-glass-hover space-y-4`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                {card.title}
              </span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                {card.icon}
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </p>
              <span className="text-xs font-semibold text-[#00F5D4] flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{card.trend}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Analytics + Project Manager Workspace (Matching Design Reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Traffic Analytics Area Chart */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span>Traffic Analytics</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Weekly Views vs. Project Click Interactions</p>
            </div>
            
            <div className="flex items-center space-x-4 text-xs font-semibold">
              <div className="flex items-center space-x-1.5 text-[#00F5D4]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4]" />
                <span>Views</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[#A855F7]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
                <span>Clicks</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="viewsGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F5D4" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="clicksGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D131F',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#00F5D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#viewsGlow)"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#A855F7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#clicksGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Project Management Table (Matching Mockup) */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Project Inventory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Quick status and instant live management</p>
            </div>
            
            <Link
              to="/admin/projects"
              className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center space-x-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Project List */}
          <div className="space-y-3 overflow-y-auto max-h-72">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-white/10">
                    <img
                      src={getAssetUrl(p.image_url) || '/uploads/project-ai-studio.jpg'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{p.title}</p>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-400">{p.category}</span>
                      <span className="text-[10px] text-slate-600">•</span>
                      <span className="text-[10px] text-slate-400">{p.technologies?.[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Published
                  </span>
                  <Link
                    to="/admin/projects"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10">
            <Link
              to="/admin/projects"
              className="w-full py-2.5 rounded-xl glass-panel border border-[#00F5D4]/30 text-xs font-bold text-[#00F5D4] hover:bg-[#00F5D4]/10 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project to Portfolio</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Client Messages Feed */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Client Inquiries</h2>
            <p className="text-xs text-slate-400 mt-0.5">Messages sent via public contact form</p>
          </div>
          <Link
            to="/admin/messages"
            className="text-xs font-bold text-[#00F5D4] hover:underline flex items-center space-x-1"
          >
            <span>View Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-white/5">
          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No recent messages.</p>
          ) : (
            recentMessages.map((msg) => (
              <div key={msg.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="space-y-1 truncate">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{msg.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">({msg.email})</span>
                  </div>
                  <p className="text-xs text-slate-300 truncate">{msg.subject} — <span className="text-slate-500">{msg.message}</span></p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    msg.is_read ? 'bg-white/5 text-slate-400' : 'bg-[#00F5D4]/20 text-[#00F5D4]'
                  }`}>
                    {msg.is_read ? 'Read' : 'New'}
                  </span>
                  <Link
                    to="/admin/messages"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
