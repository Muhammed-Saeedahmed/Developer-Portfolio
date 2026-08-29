import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { usePortfolio } from '../../context/PortfolioContext';
import { Service } from '../../types';
import { Plus, Edit2, Trash2, X, Sparkles, Layers } from 'lucide-react';

export const ServicesManager: React.FC = () => {
  const { refreshData } = usePortfolio();
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Layers',
    display_order: 1
  });

  const loadServices = async () => {
    try {
      const res = await adminApi.getServices();
      if (res.success) setServices(res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'Layers',
      display_order: services.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (svc: Service) => {
    setEditingService(svc);
    setFormData({
      title: svc.title,
      description: svc.description,
      icon: svc.icon || 'Layers',
      display_order: svc.display_order
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    try {
      if (editingService) {
        await adminApi.updateService(editingService.id, formData);
        setStatusMsg({ type: 'success', text: 'Service updated!' });
      } else {
        await adminApi.createService(formData);
        setStatusMsg({ type: 'success', text: 'Service created!' });
      }
      setIsModalOpen(false);
      await loadServices();
      await refreshData();
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Failed to save service.' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await adminApi.deleteService(id);
      setStatusMsg({ type: 'success', text: 'Service deleted!' });
      await loadServices();
      await refreshData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Services & Offerings Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure consultation offerings, development specializations, and icons.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 hover:from-cyan-300 hover:to-[#00F5D4] shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-between text-sm">
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="glass-panel rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-[#00F5D4]/40 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00F5D4] font-bold">
                  Icon: {svc.icon}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(svc)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4]"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white">{svc.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{svc.description}</p>
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
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Service Title <span className="text-[#00F5D4]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Full-Stack Web Development"
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Icon Identifier
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs bg-slate-900"
                >
                  <option value="Layers">Layers</option>
                  <option value="Layout">Layout</option>
                  <option value="Database">Database</option>
                  <option value="Cpu">Cpu / IoT</option>
                  <option value="Globe">Globe / Web</option>
                  <option value="ShieldCheck">Shield / Security</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-bold mb-1.5">
                  Description <span className="text-[#00F5D4]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details regarding your technical offering..."
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
