import React, { useState, useEffect } from 'react';
import { adminApi, getAssetUrl } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Search,
  Check,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProjectsManager: React.FC = () => {
  const { refreshData } = usePortfolio();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    full_description: '',
    image_url: '',
    category: 'Web',
    technologies: 'React, TypeScript, Node.js',
    github_url: '',
    live_url: '',
    is_featured: 1,
    display_order: 1
  });

  const loadProjects = async () => {
    try {
      const res = await adminApi.getProjects();
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (e) {
      console.error('Error loading projects:', e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      full_description: '',
      image_url: '',
      category: 'Web',
      technologies: 'React, TypeScript, Node.js',
      github_url: '',
      live_url: '',
      is_featured: 1,
      display_order: projects.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      full_description: project.full_description || project.description,
      image_url: project.image_url || '',
      category: project.category || 'Web',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      is_featured: project.is_featured,
      display_order: project.display_order
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setStatusMsg({ type: 'error', text: 'Title and description are required.' });
      return;
    }

    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingProject) {
        const res = await adminApi.updateProject(editingProject.id, payload);
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'Project updated successfully!' });
        }
      } else {
        const res = await adminApi.createProject(payload);
        if (res.success) {
          setStatusMsg({ type: 'success', text: 'Project created successfully!' });
        }
      }
      setIsModalOpen(false);
      await loadProjects();
      await refreshData();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Action failed.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await adminApi.deleteProject(id);
      if (res.success) {
        setStatusMsg({ type: 'success', text: 'Project deleted successfully!' });
        await loadProjects();
        await refreshData();
      }
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Failed to delete project.' });
    }
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === 'All' || p.category?.toLowerCase() === filterCat.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Projects Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, reorder, and upload media for public portfolio projects.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Alert Status */}
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

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['All', 'Web', 'React', 'Backend', 'AI', 'IoT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCat === cat
                  ? 'bg-[#00F5D4] text-slate-950 shadow-glow-cyan'
                  : 'glass-panel text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Data Table (Matching Admin Mockup) */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Tech Stack</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No projects found. Click "+ Add Project" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0">
                          <img
                            src={getAssetUrl(project.image_url) || '/uploads/project-ai-studio.jpg'}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{project.title}</p>
                          <p className="text-slate-400 text-[11px] truncate max-w-xs">{project.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-[#00F5D4]">
                        {project.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.technologies?.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-400">
                      #{project.display_order}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(project)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4] transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Project Image Upload */}
              <ImageUploader
                label="Project Thumbnail Image"
                currentImageUrl={formData.image_url}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Project Title <span className="text-[#00F5D4]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. AI Workflow Studio"
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
                    <option value="Web">Web</option>
                    <option value="React">React</option>
                    <option value="Backend">Backend</option>
                    <option value="AI">AI</option>
                    <option value="IoT">IoT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Short Summary <span className="text-[#00F5D4]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="One sentence description shown on card"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Full Case Study Description
                </label>
                <textarea
                  rows={3}
                  value={formData.full_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_description: e.target.value }))}
                  placeholder="Detailed architecture and achievements shown in detail modal"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, TypeScript, Node.js, Tailwind CSS"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl glass-panel text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan text-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
