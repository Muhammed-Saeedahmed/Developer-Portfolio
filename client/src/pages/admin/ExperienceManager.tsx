import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Experience } from '../../types';
import { Plus, Edit2, Trash2, X, Briefcase, Building2, MapPin, Check } from 'lucide-react';

export const ExperienceManager: React.FC = () => {
  const { refreshData } = usePortfolio();
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '2023-01-01',
    end_date: '',
    is_current: 0,
    description: '',
    technologies: 'React, Node.js, TypeScript',
    logo_url: '',
    display_order: 1
  });

  const loadExp = async () => {
    try {
      const res = await adminApi.getExperience();
      if (res.success) setExperience(res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadExp();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      position: '',
      location: '',
      start_date: '2023-01-01',
      end_date: '',
      is_current: 0,
      description: '',
      technologies: 'React, Node.js, TypeScript',
      logo_url: '',
      display_order: experience.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies,
      logo_url: exp.logo_url || '',
      display_order: exp.display_order
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingExp) {
        await adminApi.updateExperience(editingExp.id, payload);
        setStatusMsg({ type: 'success', text: 'Experience updated!' });
      } else {
        await adminApi.createExperience(payload);
        setStatusMsg({ type: 'success', text: 'Experience added!' });
      }
      setIsModalOpen(false);
      await loadExp();
      await refreshData();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Failed to save experience.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await adminApi.deleteExperience(id);
      setStatusMsg({ type: 'success', text: 'Entry deleted!' });
      await loadExp();
      await refreshData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Work Experience Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your career timeline, milestones, roles, and accomplishments.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-between text-sm">
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#00F5D4]/40 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-bold text-white">{exp.position}</h3>
                <span className="text-xs font-semibold text-[#A855F7]">@ {exp.company}</span>
                {exp.is_current ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date} {exp.location ? `• ${exp.location}` : ''}
              </p>
              <p className="text-xs text-slate-300 max-w-2xl">{exp.description}</p>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={() => openEditModal(exp)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingExp ? 'Edit Role' : 'Add New Role'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Job Title / Role <span className="text-[#00F5D4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Company Name <span className="text-[#00F5D4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. Vanguard Labs"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Remote / City"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    placeholder="YYYY-MM"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={formData.is_current === 1}
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    placeholder="YYYY-MM / Present"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_current"
                  checked={formData.is_current === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_current: e.target.checked ? 1 : 0 }))}
                  className="rounded accent-[#00F5D4]"
                />
                <label htmlFor="is_current" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Role Description & Achievements
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Key contributions and architecture built..."
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Technologies Used (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, TypeScript, Node.js, Docker"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl glass-panel text-xs font-semibold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 shadow-glow-cyan text-xs"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
