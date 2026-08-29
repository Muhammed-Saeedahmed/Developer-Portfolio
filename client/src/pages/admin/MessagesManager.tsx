import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Message } from '../../types';
import { Mail, MailOpen, Trash2, Reply, Search, CheckCircle2, Clock, X } from 'lucide-react';

export const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      const res = await adminApi.getMessages();
      if (res.success) setMessages(res.data || []);
    } catch (e) {}
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleToggleRead = async (msg: Message, isRead: boolean) => {
    try {
      await adminApi.toggleMessageRead(msg.id, isRead);
      await loadMessages();
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...msg, is_read: isRead ? 1 : 0 });
      }
    } catch (e) {}
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminApi.deleteMessage(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      await loadMessages();
    } catch (e) {}
  };

  const filtered = messages.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === 'all' ? true : (filter === 'unread' ? m.is_read === 0 : m.is_read === 1);
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Client Messages & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review and reply to inquiries sent through the public portfolio contact form.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by sender or text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-[#00F5D4] text-slate-950 shadow-glow-cyan'
                  : 'glass-panel text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Inbox List */}
        <div className="lg:col-span-5 glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-xl divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No messages found.
            </div>
          ) : (
            filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.is_read) handleToggleRead(msg, true);
                }}
                className={`p-4 transition-colors cursor-pointer hover:bg-white/[0.04] flex items-start justify-between gap-3 ${
                  selectedMessage?.id === msg.id ? 'bg-white/[0.06] border-l-4 border-l-[#00F5D4]' : ''
                } ${!msg.is_read ? 'bg-cyan-500/[0.03]' : ''}`}
              >
                <div className="space-y-1 truncate">
                  <div className="flex items-center space-x-2">
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#00F5D4] flex-shrink-0 animate-pulse" />
                    )}
                    <span className={`text-xs font-bold ${!msg.is_read ? 'text-[#00F5D4]' : 'text-white'} truncate`}>
                      {msg.name}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-200 truncate">{msg.subject}</p>
                  <p className="text-[10px] text-slate-400 truncate">{msg.message}</p>
                </div>

                <div className="text-right flex-shrink-0 space-y-1">
                  <p className="text-[10px] text-slate-500 font-mono">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl min-h-[380px] flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">{selectedMessage.subject}</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span>From: <strong className="text-white">{selectedMessage.name}</strong></span>
                    <span>•</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-[#00F5D4] hover:underline font-mono">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage, selectedMessage.is_read === 0)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-[#00F5D4] text-xs flex items-center space-x-1"
                    title={selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                  >
                    {selectedMessage.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                {selectedMessage.message}
              </div>

              {/* Reply Button */}
              <div className="pt-4 flex justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-[#00F5D4] to-cyan-300 shadow-glow-cyan text-xs"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Mail className="w-10 h-10 text-slate-600" />
              <p className="text-sm font-bold text-slate-300">Select a message to view details</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Click any message in the inbox list on the left to read full inquiry contents and reply.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
