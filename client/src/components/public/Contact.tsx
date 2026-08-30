import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { publicApi } from '../../services/api';

export const Contact: React.FC = () => {
  const { profile } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.type) setStatus({ type: null, message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await publicApi.sendContactMessage(formData);
      if (res.success) {
        setStatus({
          type: 'success',
          message: res.message || 'Thank you! Your message has been sent successfully.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: res.message || 'Failed to send message.' });
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Server error. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00F5D4]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-[#00F5D4]/30 text-xs font-bold text-[#00F5D4] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Initiate Collaboration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Build Something Extraordinary
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have a project in mind, an engineering role to fill, or want to consult on system architecture? Reach out below.
          </p>
        </div>

        {/* 2-Column Contact Info + Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 flex flex-col justify-between space-y-8 min-w-0 overflow-hidden">
            <div className="space-y-6 min-w-0">
              <h3 className="text-2xl font-bold text-white">
                Contact Information
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Feel free to email directly or submit the inquiry form. Messages sync immediately to the admin CMS desk.
              </p>

              {/* Direct Info list */}
              <div className="space-y-5 pt-2 min-w-0">
                <div className="flex items-start sm:items-center space-x-4 min-w-0">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#00F5D4] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</p>
                    <a
                      href={`mailto:${profile.email || 'contact@saeed.dev'}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-[#00F5D4] transition-colors break-all sm:break-words block"
                    >
                      {profile.email || 'contact@saeed.dev'}
                    </a>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-start sm:items-center space-x-4 min-w-0">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#A855F7] flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Phone / WhatsApp</p>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-xs sm:text-sm font-bold text-white hover:text-[#A855F7] transition-colors break-words block"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start sm:items-center space-x-4 min-w-0">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Location</p>
                    <p className="text-xs sm:text-sm font-bold text-white break-words">
                      {profile.location || 'San Francisco, CA & Remote'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Availability Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00F5D4]/10 to-[#A855F7]/10 border border-[#00F5D4]/20">
              <div className="flex items-center space-x-2.5 text-xs font-bold text-[#00F5D4]">
                <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
                <span>Response Time: Usually within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 border border-white/10 relative">
            
            {status.type && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium ${
                  status.type === 'success'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-2">
                    Your Name <span className="text-[#00F5D4]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alexander Vance"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl glass-input text-sm placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-2">
                    Email Address <span className="text-[#00F5D4]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. alex@example.com"
                    required
                    className="w-full px-4 py-3.5 rounded-2xl glass-input text-sm placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-2">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Project Consultation / Full-Stack Role"
                  className="w-full px-4 py-3.5 rounded-2xl glass-input text-sm placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-2">
                  Message <span className="text-[#00F5D4]">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project scope, goals, or timeline..."
                  required
                  className="w-full px-4 py-3.5 rounded-2xl glass-input text-sm placeholder-slate-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] via-cyan-300 to-[#00F5D4] hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Sending Message...</span>
                  </span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>

        </div>
      </div>
    </section>
  );
};
