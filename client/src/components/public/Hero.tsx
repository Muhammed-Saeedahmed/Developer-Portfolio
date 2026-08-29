import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { ArrowRight, Mail, Github, Linkedin, Instagram, Twitter, ExternalLink, Sparkles } from 'lucide-react';
import { getAssetUrl } from '../../services/api';

export const Hero: React.FC = () => {
  const { profile, socialLinks } = usePortfolio();

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <Github className="w-5 h-5" />;
    if (p.includes('link')) return <Linkedin className="w-5 h-5" />;
    if (p.includes('insta')) return <Instagram className="w-5 h-5" />;
    if (p.includes('twit') || p.includes('x')) return <Twitter className="w-5 h-5" />;
    return <ExternalLink className="w-5 h-5" />;
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Ambient Glow Meshes */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-br from-[#00F5D4]/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/3 -translate-y-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-[#A855F7]/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            {/* Status Pill */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full glass-panel border border-[#00F5D4]/30 shadow-lg shadow-cyan-950/20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#00F5D4]">
                Available for New Projects & Roles
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              {profile.hero_headline || 'Building Scalable Digital Experiences'}
              <span className="block mt-2 bg-gradient-to-r from-[#00F5D4] via-teal-200 to-[#A855F7] bg-clip-text text-transparent">
                — {profile.developer_name || 'Muhammad Saeed'}
              </span>
            </h1>

            {/* Subtitle / Bio */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              {profile.bio ||
                'Full-Stack Developer passionate about building modern, scalable and creative digital experiences. I enjoy turning ideas into functional applications and exploring technologies across web development, databases, analytics, IoT and AI.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-full font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] via-cyan-300 to-[#00F5D4] hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan hover:shadow-cyan-400/60 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-full font-semibold text-white glass-panel hover:bg-white/10 border border-white/20 hover:border-[#00F5D4]/60 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-black/40"
              >
                <Mail className="w-5 h-5 text-[#00F5D4]" />
                <span>Get In Touch</span>
              </a>
            </div>

            {/* Social Links Row */}
            <div className="pt-4 flex items-center space-x-4">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-medium mr-2">
                Connect:
              </span>
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <a
                    key={link.id || link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.platform}
                    className="p-3 rounded-full glass-panel text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4]/50 hover:bg-white/10 transition-all duration-200 transform hover:scale-110 shadow-md shadow-black/30"
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))
              ) : (
                <>
                  <a href={profile.github_url || '#'} target="_blank" rel="noreferrer" className="p-3 rounded-full glass-panel text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href={profile.linkedin_url || '#'} target="_blank" rel="noreferrer" className="p-3 rounded-full glass-panel text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={profile.instagram_url || '#'} target="_blank" rel="noreferrer" className="p-3 rounded-full glass-panel text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4]/50 transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Developer Profile Photo with Floating Glass Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Multi-layer Glow Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#A855F7]/35 via-[#00F5D4]/20 to-transparent rounded-full filter blur-3xl scale-95 -z-10" />

            {/* Profile Avatar Frame */}
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 rounded-3xl p-1.5 bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl shadow-black/80">
              <div className="w-full h-full rounded-[22px] overflow-hidden relative bg-slate-900 border border-white/10 group">
                <img
                  src={getAssetUrl(profile.profile_image) || '/uploads/default-avatar.png'}
                  alt={profile.developer_name || 'Developer Avatar'}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Clean fallback avatar if image load errors
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent && !parent.querySelector('.fallback-avatar')) {
                      const div = document.createElement('div');
                      div.className = 'fallback-avatar w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-400 p-6 text-center';
                      div.innerHTML = `
                        <div class="w-24 h-24 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-center text-[#00F5D4] text-3xl font-black mb-3">
                          ${(profile.developer_name || 'MS').split(' ').map(n => n[0]).join('')}
                        </div>
                        <p class="font-bold text-white text-lg">${profile.developer_name}</p>
                        <p class="text-xs text-slate-400 mt-1">${profile.hero_subtitle || 'Full-Stack Developer'}</p>
                      `;
                      parent.appendChild(div);
                    }
                  }}
                />
                {/* Subtle glass gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F]/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Tech Badges (Matching Design Reference) */}
              {/* Badge 1: React / Cyan Glow (Top Left) */}
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 px-3.5 py-3 rounded-2xl glass-panel border border-[#00F5D4]/40 shadow-glow-cyan animate-float-slow">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#00F5D4]/15 flex items-center justify-center text-[#00F5D4]">
                    <span className="font-mono text-sm font-black">⚛</span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] text-slate-400 leading-tight">Framework</p>
                    <p className="text-xs font-bold text-white">React 19</p>
                  </div>
                </div>
              </div>

              {/* Badge 2: Next.js / Violet Glow (Top Right) */}
              <div className="absolute -top-2 -right-4 sm:-top-4 sm:-right-6 px-3.5 py-3 rounded-2xl glass-panel border border-[#A855F7]/40 shadow-glow-purple animate-float-reverse">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#A855F7]/15 flex items-center justify-center text-[#A855F7] font-black text-sm">
                    N
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] text-slate-400 leading-tight">Architecture</p>
                    <p className="text-xs font-bold text-white">Next.js</p>
                  </div>
                </div>
              </div>

              {/* Badge 3: GitHub / Mid Right */}
              <div className="absolute top-1/2 -right-6 sm:-right-8 -translate-y-1/2 p-3 rounded-2xl glass-panel border border-white/20 shadow-xl animate-float-slow">
                <Github className="w-6 h-6 text-slate-200" />
              </div>

              {/* Badge 4: Rust / Node / Backend (Bottom Right) */}
              <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 px-3.5 py-2.5 rounded-2xl glass-panel border border-[#A855F7]/40 shadow-lg shadow-purple-900/30 animate-float-reverse">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold">
                    🦀
                  </div>
                  <span className="text-xs font-semibold text-slate-200">Rust & Node</span>
                </div>
              </div>

              {/* Badge 5: Full-Stack Core (Bottom Left) */}
              <div className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-4 px-3 py-2 rounded-2xl glass-panel border border-[#00F5D4]/40 shadow-lg shadow-cyan-900/30 animate-float-slow">
                <div className="flex items-center space-x-1.5 text-[#00F5D4] text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI & IoT Stack</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
