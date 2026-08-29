import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { profile } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#070A0F]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center space-x-2 text-2xl font-black tracking-tight group"
          >
            <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F5D4]/20 to-[#A855F7]/20 border border-white/10 group-hover:border-[#00F5D4]/40 transition-all shadow-inner">
              <span className="bg-gradient-to-r from-[#00F5D4] via-cyan-200 to-[#A855F7] bg-clip-text text-transparent">
                {profile.logo_text || 'MS.dev'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-[#00F5D4] text-sm font-medium transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#00F5D4] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#contact"
              className="relative group px-6 py-2.5 rounded-full text-sm font-semibold text-white overflow-hidden transition-all duration-300 border border-[#A855F7]/40 hover:border-[#00F5D4] bg-slate-900/60 shadow-lg shadow-purple-950/40 hover:shadow-[#00F5D4]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#A855F7]/30 to-[#00F5D4]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>{profile.hire_me_text || 'Hire Me'}</span>
                <span className="inline-block w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse"></span>
              </span>
            </a>

            {/* Admin CMS Access Link */}
            <Link
              to="/admin"
              title="Admin CMS Dashboard"
              className="p-2.5 rounded-full text-slate-400 hover:text-[#00F5D4] hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/admin"
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-[#070A0F]/95 backdrop-blur-2xl border-b border-white/10 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-[#00F5D4] hover:bg-white/5"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-xl font-semibold text-slate-900 bg-gradient-to-r from-[#00F5D4] to-cyan-300 shadow-glow-cyan"
            >
              {profile.hire_me_text || 'Hire Me'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
