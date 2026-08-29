import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Skill } from '../../types';
import { Plus, Edit2, Trash2, X, Sparkles, Layers, Check } from 'lucide-react';

export const SkillsManager: React.FC = () => {
  const { refreshData } = usePortfolio();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: 'Code',
    proficiency: 90,
    display_order: 1
  });

  const loadSkills = async () => {
    try {
      const res = await adminApi.getSkills();
      if (res.success) setSkills(res.data || []);
    } catch (e) {
      console.error('Error loading skills:', e);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Frontend',
      icon: 'Code',
      proficiency: 90,
      display_order: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Skill) => {
    setEditingSkill(s);
    setFormData({
      name: s.name,
      category: s.category,
      icon: s.icon,
      proficiency: s.proficiency,
      display_order: s.display_order
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingSkill) {
        await adminApi.updateSkill(editingSkill.id, formData);
        setStatusMsg({ type: 'success', text: 'Skill updated successfully!' });
      } else {
        await adminApi.createSkill(formData);
        setStatusMsg({ type: 'success', text: 'Skill created successfully!' });
      }
      setIsModalOpen(false);
      await loadSkills();
      await refreshData();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Failed to save skill.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await adminApi.deleteSkill(id);
      setStatusMsg({ type: 'success', text: 'Skill deleted!' });
      await loadSkills();
      await refreshData();
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Failed to delete skill.' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skills & Tech Stack Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your technical toolkits, categories, and proficiency meters.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl flex items-center justify-between text-sm font-medium ${
          statusMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-[#00F5D4]/40 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-[#00F5D4] uppercase">
                  {skill.category}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(skill)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{skill.name}</h3>
              <p className="text-xs text-slate-400 font-mono">Icon: {skill.icon}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-400">Mastery</span>
                <span className="text-[#00F5D4] font-mono">{skill.proficiency}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#A855F7]"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
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
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Skill Name <span className="text-[#00F5D4]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. React, Node.js, Python"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs bg-slate-900"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Database">Database</option>
                  <option value="Tools">Tools</option>
                  <option value="CMS">CMS</option>
                  <option value="AI">AI</option>
                  <option value="IoT">IoT</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold">
                    Proficiency ({formData.proficiency}%)
                  </label>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={formData.proficiency}
                  onChange={(e) => setFormData(prev => ({ ...prev, proficiency: Number(e.target.value) }))}
                  className="w-full accent-[#00F5D4] cursor-pointer"
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
