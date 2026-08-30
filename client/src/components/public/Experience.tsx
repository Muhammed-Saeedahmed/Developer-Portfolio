import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Briefcase, Calendar, MapPin, Sparkles, Building2 } from 'lucide-react';

export const Experience: React.FC = () => {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#00F5D4]/30 text-xs font-bold text-[#00F5D4] uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Proven track record of engineering robust software solutions across high-impact engineering teams.
          </p>
        </div>

        {/* Timeline Roadmap */}
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-32 space-y-12">
          {experience.map((exp, idx) => (
            <div key={exp.id || idx} className="relative pl-8 sm:pl-12 group">
              
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#070A0F] border-2 border-[#00F5D4] group-hover:bg-[#00F5D4] group-hover:scale-125 transition-all shadow-glow-cyan" />

              {/* Date Badge on the Left (Desktop) */}
              <div className="sm:absolute sm:-left-32 sm:top-0 text-left sm:text-right sm:w-24 mb-2 sm:mb-0">
                <span className="text-xs font-mono font-bold text-[#00F5D4]">
                  {exp.start_date ? (exp.start_date.length > 7 ? exp.start_date.slice(0, 4) : exp.start_date) : '2024'} — {exp.is_current ? 'Present' : (exp.end_date ? (exp.end_date.length > 7 ? exp.end_date.slice(0, 4) : exp.end_date) : 'Past')}
                </span>
              </div>

              {/* Experience Card */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#00F5D4]/30 transition-all duration-300 hover:shadow-glass-hover space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00F5D4] transition-colors">
                      {exp.position}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300 mt-1">
                      <span className="font-semibold text-[#A855F7] flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4" />
                        <span>{exp.company}</span>
                      </span>
                      {exp.location && (
                        <span className="text-slate-400 flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {exp.is_current ? (
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                      Current Role
                    </span>
                  ) : null}
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {exp.description}
                </p>

                {/* Tech Badges */}
                {(() => {
                  const techList = Array.isArray(exp.technologies)
                    ? exp.technologies
                    : (typeof exp.technologies === 'string' ? (exp.technologies as string).split(',').map(t => t.trim()).filter(Boolean) : []);
                  return techList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {techList.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null;
                })()}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
