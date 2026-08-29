import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { GraduationCap, Calendar, Award } from 'lucide-react';

export const Education: React.FC = () => {
  const { education } = usePortfolio();

  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#A855F7]/30 text-xs font-bold text-[#A855F7] uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & Certifications
          </h2>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#A855F7]/40 transition-all duration-300 hover:shadow-glass-hover space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#A855F7]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                    {edu.start_year} — {edu.end_year}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#A855F7] transition-colors">
                  {edu.degree}
                </h3>
                <p className="text-sm font-semibold text-[#00F5D4]">
                  {edu.course ? `${edu.course} — ` : ''}{edu.institution}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
