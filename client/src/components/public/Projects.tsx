import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { Github, Play, ExternalLink, Sparkles, Eye } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { publicApi, getAssetUrl } from '../../services/api';

export const Projects: React.FC = () => {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Web', 'React', 'Backend', 'AI', 'IoT', 'Other'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase());

  const handleLinkClick = (e: React.MouseEvent, project: Project, url: string, type: string) => {
    e.stopPropagation();
    publicApi.trackProjectClick(project.id, `${project.title} (${type})`);
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#00F5D4]/30 text-xs font-bold text-[#00F5D4] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portfolio Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-base max-w-xl">
              Selected production applications, AI systems, and cloud architectures built with precision.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#00F5D4] to-cyan-300 text-slate-950 shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid (Matching Reference Design Layout) */}
        {filteredProjects.length === 0 ? (
          <div className="glass-panel rounded-3xl p-16 text-center border border-white/10 space-y-4">
            <p className="text-xl text-slate-300 font-bold">No projects found in this category</p>
            <p className="text-sm text-slate-500">Add new projects from the Admin CMS to populate this view.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group glass-panel rounded-3xl border border-white/10 hover:border-[#00F5D4]/40 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Project Image Box */}
                <div className="relative h-56 w-full bg-slate-950 overflow-hidden border-b border-white/10">
                  <img
                    src={getAssetUrl(project.image_url) || '/uploads/project-ai-studio.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-transparent to-black/30 pointer-events-none" />

                  {/* Category & Status Badges */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#070A0F]/80 backdrop-blur-md border border-white/10 text-[#00F5D4] uppercase tracking-wider">
                      {project.category}
                    </span>
                    {project.status && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md border ${
                        project.status === 'In Progress'
                          ? 'bg-[#00F5D4]/20 text-[#00F5D4] border-[#00F5D4]/40'
                          : project.status === 'Planning'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : project.status === 'On Hold'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : project.status === 'Archived'
                          ? 'bg-slate-700/80 text-slate-300 border-slate-600'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {project.status}
                      </span>
                    )}
                  </div>

                  {/* Hover Quick View Trigger */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <span className="px-4 py-2 rounded-full glass-panel border border-[#00F5D4]/50 text-[#00F5D4] text-xs font-bold flex items-center space-x-1.5 shadow-glow-cyan">
                      <Eye className="w-4 h-4" />
                      <span>View Case Study</span>
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00F5D4] transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills (Matching Design Style) */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies?.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 border border-white/10 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 4 && (
                      <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-white/5 border border-white/10 text-slate-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Row (GitHub & Demo buttons from design) */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    {project.github_url && (
                      <button
                        onClick={(e) => handleLinkClick(e, project, project.github_url, 'GitHub')}
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
                      </button>
                    )}

                    {project.live_url ? (
                      <button
                        onClick={(e) => handleLinkClick(e, project, project.live_url, 'Live Demo')}
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-sm hover:shadow-glow-cyan transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Demo</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#00F5D4] bg-[#00F5D4]/10 hover:bg-[#00F5D4]/20 border border-[#00F5D4]/30 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
