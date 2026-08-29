import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Award, Briefcase, Users, Zap, CheckCircle2, Code2, Cpu, Globe } from 'lucide-react';

export const About: React.FC = () => {
  const { profile } = usePortfolio();

  const stats = [
    {
      label: 'Years Experience',
      value: `${profile.years_experience || 5}+`,
      icon: <Briefcase className="w-5 h-5 text-[#00F5D4]" />,
      desc: 'Full-stack engineering & consulting'
    },
    {
      label: 'Projects Delivered',
      value: `${profile.projects_completed || 24}+`,
      icon: <Award className="w-5 h-5 text-[#A855F7]" />,
      desc: 'Web apps, AI agents & dashboards'
    },
    {
      label: 'Happy Clients',
      value: `${profile.satisfied_clients || 18}+`,
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      desc: 'Worldwide startups & enterprises'
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      desc: 'Resilient cloud microservices'
    }
  ];

  const highlights = [
    { title: 'Frontend Mastery', desc: 'React, TypeScript, Next.js, WebGL & Glassmorphism Design Systems' },
    { title: 'Scalable Backends', desc: 'Node.js, Express, Python, MySQL, PostgreSQL & RESTful API Gateways' },
    { title: 'AI & Data Engineering', desc: 'LLM Orchestration, Autonomous Agents, Telemetry & Analytics' },
    { title: 'DevOps & Cloud', desc: 'Docker, CI/CD, AWS/Vercel Deployments & Performance Optimization' }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#00F5D4]/30 text-xs font-bold text-[#00F5D4] uppercase tracking-wider">
            <span>About The Engineer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {profile.about_heading || 'Engineering Modern, Scalable Web Applications'}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            {profile.about_bio || profile.bio}
          </p>
        </div>

        {/* 2-Column Story + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Narrative Box */}
          <div className="lg:col-span-6 glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F5D4]/10 rounded-full blur-3xl pointer-events-none -z-0 group-hover:bg-[#00F5D4]/20 transition-all duration-500" />

            <div className="space-y-4 relative z-10">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <Code2 className="w-6 h-6 text-[#00F5D4]" />
                <span>Crafting Digital Products with Precision</span>
              </h3>
              <p className="text-slate-300 leading-relaxed text-base">
                {profile.about_description ||
                  'With a strong foundation in modern frontend architectures, backend APIs, and cloud infrastructure, I build high-performance web products that deliver exceptional user experiences.'}
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 relative z-10">
              {highlights.map((h, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#00F5D4]" />
                    <span>{h.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 pl-6 leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between hover:border-[#00F5D4]/40 transition-all duration-300 hover:shadow-glass-hover group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-white tracking-tight group-hover:text-[#00F5D4] transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-sm font-bold text-slate-200 mt-1">{stat.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
