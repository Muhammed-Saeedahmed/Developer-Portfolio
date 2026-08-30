import React from 'react';
import { Project } from '../../types';
import { X, Github, ExternalLink, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { publicApi, getAssetUrl } from '../../services/api';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const handleLinkClick = (url: string, type: string) => {
    publicApi.trackProjectClick(project.id, `${project.title} (${type})`);
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl glass-panel rounded-3xl border border-white/20 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-950 overflow-hidden">
          <img
            src={getAssetUrl(project.image_url) || '/uploads/project-ai-studio.jpg'}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D131F] via-transparent to-black/40" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00F5D4]/20 border border-[#00F5D4]/40 text-[#00F5D4] uppercase tracking-wider">
                  {project.category}
                </span>
                {project.status && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
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
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {project.title}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tech Stack */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#00F5D4]" />
              <span>Technologies Used</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">
              Case Study & Overview
            </h4>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {project.full_description || project.description}
            </p>
          </div>

          {/* Key Architecture Highlights */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center space-x-2 text-sm font-bold text-[#00F5D4]">
              <Sparkles className="w-4 h-4" />
              <span>Key Features</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 pl-6 list-disc">
              <li>High-performance microservice architecture with sub-second response times.</li>
              <li>Intuitive responsive UI design engineered with glassmorphism and modern design tokens.</li>
              <li>Automated CI/CD deployment pipeline with end-to-end reliability.</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
            {project.github_url && (
              <button
                onClick={() => handleLinkClick(project.github_url, 'GitHub')}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-200 glass-panel hover:bg-white/10 border border-white/20 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
              </button>
            )}

            {project.live_url && (
              <button
                onClick={() => handleLinkClick(project.live_url, 'Live Demo')}
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
