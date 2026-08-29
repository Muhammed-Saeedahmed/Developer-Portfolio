import React, { useState, useEffect } from 'react';
import { adminApi, authApi } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { ProfileSettings } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  Save,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  Award,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { profile, refreshData } = usePortfolio();
  const [formData, setFormData] = useState<ProfileSettings>({ ...profile });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await adminApi.updateSettings(formData);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Portfolio settings updated successfully! Public site updated.' });
        await refreshData();
      } else {
        setStatusMsg({ type: 'error', text: res.message || 'Failed to update settings.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Server error updating settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      const res = await authApi.updatePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      if (res.success) {
        setPassStatus({ type: 'success', text: 'Password updated successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPassStatus({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPassStatus({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Portfolio & Profile CMS Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Full centralized control over developer bio, hero imagery, contact channels, and metrics.
        </p>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Section 1: Hero & Profile Image CMS */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
            <ImageIcon className="w-5 h-5 text-[#00F5D4]" />
            <h2 className="text-lg font-bold text-white">Hero & Profile Image CMS</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Uploader */}
            <div className="lg:col-span-4">
              <ImageUploader
                label="Developer Profile Photo"
                currentImageUrl={formData.profile_image}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, profile_image: url }))}
              />
              <p className="text-[11px] text-slate-400 mt-2">
                This image dynamically renders in the public Hero section. If deleted, a clean fallback monogram avatar displays.
              </p>
            </div>

            {/* Hero Headlines */}
            <div className="lg:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Developer Name <span className="text-[#00F5D4]">*</span>
                  </label>
                  <input
                    type="text"
                    name="developer_name"
                    value={formData.developer_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Logo Text (Navbar)
                  </label>
                  <input
                    type="text"
                    name="logo_text"
                    value={formData.logo_text}
                    onChange={handleChange}
                    placeholder="MS.dev"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Hero Headline <span className="text-[#00F5D4]">*</span>
                </label>
                <input
                  type="text"
                  name="hero_headline"
                  value={formData.hero_headline}
                  onChange={handleChange}
                  required
                  placeholder="Building Scalable Digital Experiences"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Hero Subtitle / Tagline
                </label>
                <input
                  type="text"
                  name="hero_subtitle"
                  value={formData.hero_subtitle}
                  onChange={handleChange}
                  placeholder="Full-Stack Developer & Creative Technologist"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Main Bio & Introduction <span className="text-[#00F5D4]">*</span>
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: About Page Narrative & Metrics */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
            <User className="w-5 h-5 text-[#A855F7]" />
            <h2 className="text-lg font-bold text-white">About Section & Highlights</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                About Section Heading
              </label>
              <input
                type="text"
                name="about_heading"
                value={formData.about_heading}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                About Bio
              </label>
              <textarea
                rows={2}
                name="about_bio"
                value={formData.about_bio}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                About Full Description
              </label>
              <textarea
                rows={3}
                name="about_description"
                value={formData.about_description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs resize-none"
              />
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Years Experience
                </label>
                <input
                  type="number"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Projects Completed
                </label>
                <input
                  type="number"
                  name="projects_completed"
                  value={formData.projects_completed}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Satisfied Clients
                </label>
                <input
                  type="number"
                  name="satisfied_clients"
                  value={formData.satisfied_clients}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Social Links */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
            <LinkIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Contact Info & Social Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                "Hire Me" Button Text
              </label>
              <input
                type="text"
                name="hire_me_text"
                value={formData.hire_me_text}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] via-cyan-300 to-[#00F5D4] shadow-glow-cyan transition-all duration-300 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>

      {/* Section 4: Security / Password Change */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <Lock className="w-5 h-5 text-rose-400" />
          <h2 className="text-lg font-bold text-white">Security & Password</h2>
        </div>

        {passStatus && (
          <div className={`p-3.5 rounded-2xl text-xs font-semibold ${
            passStatus.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {passStatus.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white glass-panel hover:bg-white/10 border border-white/20"
          >
            Update Admin Password
          </button>
        </form>
      </div>

    </div>
  );
};
