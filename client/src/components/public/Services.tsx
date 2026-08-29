import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Layers, Layout, Database, Cpu, Globe, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';

export const Services: React.FC = () => {
  const { services } = usePortfolio();

  const getServiceIcon = (icon: string) => {
    switch (icon?.toLowerCase()) {
      case 'layout':
        return <Layout className="w-6 h-6 text-[#00F5D4]" />;
      case 'database':
        return <Database className="w-6 h-6 text-sky-400" />;
      case 'cpu':
        return <Cpu className="w-6 h-6 text-[#A855F7]" />;
      case 'globe':
        return <Globe className="w-6 h-6 text-emerald-400" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-6 h-6 text-amber-400" />;
      case 'layers':
      default:
        return <Layers className="w-6 h-6 text-[#00F5D4]" />;
    }
  };

  return (
    <section id="services" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#00F5D4]/30 text-xs font-bold text-[#00F5D4] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineering Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Services & Solutions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            High-caliber full-stack engineering tailored for ambitious startups, tech teams, and digital products.
          </p>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => (
            <div
              key={svc.id || idx}
              className="glass-panel rounded-3xl p-8 border border-white/10 hover:border-[#00F5D4]/40 transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {getServiceIcon(svc.icon)}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-[#00F5D4] transition-colors" />
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#00F5D4] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {svc.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <a
                  href="#contact"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-[#00F5D4] transition-colors flex items-center space-x-1"
                >
                  <span>Request Consultation</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
