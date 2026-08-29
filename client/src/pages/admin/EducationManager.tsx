import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Education } from '../../types';
import { Plus, Edit2, Trash2, X, GraduationCap } from 'lucide-react';

export const EducationManager: React.FC = () => {
  const { refreshData } = usePortfolio();
  const [education, setEducation] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    course: '',
    start_year: 2018,
    end_year: 2022,
    description: '',
    logo_url: '',
    display_order: 1
  });

  const loadEdu = async () => {
    try {
      const res = await adminApi.getEducation();
      if (res.success) setEducation(res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadEdu();
  }, []);

  const openCreateModal = () => {
    setEditingEdu(null);
    setFormData({
      institution: '',
      degree: '',
      course: '',
      start_year: 2018,
      end_year: 2022,
      description: '',
      logo_url: '',
      display_order: education.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      course: edu.course || '',
      start_year: edu.start_year,
      end_year: edu.end_year,
      description: edu.description || '',
      logo_url: edu.logo_url || '',
      display_order: edu.display_order
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree) return;

    try {
      if (editingEdu) {
        await adminApi.updateEducation(editingEdu.id, formData);
        setStatusMsg({ type: 'success', text: 'Education updated!' });
      } else {
        await adminApi.createEducation(formData);
        setStatusMsg({ type: 'success', text: 'Education added!' });
      }
      setIsModalOpen(false);
      await loadEdu();
      await refreshData();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Failed to save education.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await adminApi.deleteEducation(id);
      setStatusMsg({ type: 'success', text: 'Entry deleted!' });
      await loadEdu();
      await refreshData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Education & Certifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage academic degrees, institutions, and specializations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-between text-sm">
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-[#00F5D4]/40 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
                  {edu.start_year} — {edu.end_year}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(edu)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">{edu.degree}</h3>
              <p className="text-xs font-semibold text-[#00F5D4]">{edu.course ? `${edu.course} — ` : ''}{edu.institution}</p>
              <p className="text-xs text-slate-400">{edu.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingEdu ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Degree / Certification <span className="text-[#00F5D4]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                  placeholder="e.g. Bachelor of Science"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Field / Course
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Institution Name <span className="text-[#00F5D4]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                  placeholder="e.g. University of Engineering & Technology"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Start Year
                  </label>
                  <input
                    type="number"
                    value={formData.start_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_year: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    End Year
                  </label>
                  <input
                    type="number"
                    value={formData.end_year}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_year: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Specialization, honors, relevant coursework..."
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs resize-none"
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
                  Save Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
