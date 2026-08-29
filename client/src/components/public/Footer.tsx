import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowUp, Github, Linkedin, Instagram, Twitter, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { profile, socialLinks } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <Github className="w-4 h-4" />;
    if (p.includes('link')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('insta')) return <Instagram className="w-4 h-4" />;
    if (p.includes('twit') || p.includes('x')) return <Twitter className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <footer className="border-t border-white/10 bg-[#05070B] py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          
          {/* Logo & Headline */}
          <div className="space-y-2 text-center md:text-left">
            <a href="#" className="inline-block text-2xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#00F5D4] via-cyan-200 to-[#A855F7] bg-clip-text text-transparent">
                {profile.logo_text || 'MS.dev'}
              </span>
            </a>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Crafted with modern React, TypeScript, and dark glassmorphic engineering.
            </p>
          </div>

          {/* Nav quick links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <a href="#about" className="hover:text-[#00F5D4] transition-colors">About</a>
            <a href="#projects" className="hover:text-[#00F5D4] transition-colors">Projects</a>
            <a href="#experience" className="hover:text-[#00F5D4] transition-colors">Experience</a>
            <a href="#skills" className="hover:text-[#00F5D4] transition-colors">Skills</a>
            <a href="#contact" className="hover:text-[#00F5D4] transition-colors">Contact</a>
            <Link to="/admin" className="hover:text-[#A855F7] transition-colors flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </Link>
          </div>

          {/* Social Icons & Back to top */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.id || link.platform}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full glass-panel text-slate-400 hover:text-[#00F5D4] hover:border-[#00F5D4]/40 transition-all"
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}

            <button
              onClick={scrollToTop}
              title="Back to Top"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-[#00F5D4] hover:bg-white/10 transition-all"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {profile.developer_name || 'Muhammad Saeed'}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Powered by dynamic</span>
            <span className="text-[#00F5D4] font-semibold">Admin CMS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
