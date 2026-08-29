import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  Code,
  FileCode2,
  Atom,
  Server,
  Database,
  Terminal,
  Cpu,
  Layers,
  Globe,
  GitBranch,
  Layout,
  Sparkles,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { skills } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'Tools', 'CMS'];

  const getSkillIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'atom':
      case 'react':
        return <Atom className="w-5 h-5 text-cyan-400" />;
      case 'filecode2':
      case 'typescript':
        return <FileCode2 className="w-5 h-5 text-blue-400" />;
      case 'code':
      case 'javascript':
        return <Code className="w-5 h-5 text-amber-400" />;
      case 'server':
      case 'nodejs':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'terminal':
      case 'python':
        return <Terminal className="w-5 h-5 text-yellow-400" />;
      case 'database':
      case 'mysql':
        return <Database className="w-5 h-5 text-sky-400" />;
      case 'gitbranch':
      case 'git':
        return <GitBranch className="w-5 h-5 text-orange-400" />;
      case 'cpu':
      case 'iot':
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case 'layout':
      case 'html':
      case 'css':
        return <Layout className="w-5 h-5 text-pink-400" />;
      default:
        return <Code className="w-5 h-5 text-[#00F5D4]" />;
    }
  };

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#A855F7]/30 text-xs font-bold text-[#A855F7] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Proficiency</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Modern Stack
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Mastered technologies and architectural toolkits utilized across full-stack applications.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#A855F7] to-purple-400 text-white shadow-glow-purple'
                    : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5 border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-[#00F5D4]/40 transition-all duration-300 hover:shadow-glass-hover group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {getSkillIcon(skill.icon || skill.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-[#00F5D4] transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-mono font-bold text-[#00F5D4]">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Progress Indicator Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#A855F7] transition-all duration-1000 group-hover:from-cyan-300 group-hover:to-purple-300 shadow-sm"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
