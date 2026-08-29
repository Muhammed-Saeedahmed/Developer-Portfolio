import React from 'react';
import { Navbar } from '../components/public/Navbar';
import { Hero } from '../components/public/Hero';
import { About } from '../components/public/About';
import { Projects } from '../components/public/Projects';
import { Skills } from '../components/public/Skills';
import { Experience } from '../components/public/Experience';
import { Education } from '../components/public/Education';
import { Services } from '../components/public/Services';
import { Contact } from '../components/public/Contact';
import { Footer } from '../components/public/Footer';
import { usePortfolio } from '../context/PortfolioContext';

export const PublicPortfolio: React.FC = () => {
  const { isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070A0F] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#00F5D4]/20 border-t-[#00F5D4] animate-spin shadow-glow-cyan" />
        <p className="text-sm font-semibold tracking-widest uppercase text-slate-400">
          Loading Portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="relative bg-[#070A0F] min-h-screen text-slate-100 selection:bg-[#00F5D4]/20 selection:text-[#00F5D4]">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};
