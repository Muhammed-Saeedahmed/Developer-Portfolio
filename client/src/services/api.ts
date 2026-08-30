import axios from 'axios';
import { ProfileSettings, Project, Skill, Experience, Education, Service, SocialLink } from '../types';

function getBaseOrigin(): string {
  if (typeof window === 'undefined') return '';
  const viteEnv = (import.meta as any).env;
  if (viteEnv && viteEnv.VITE_API_URL) return viteEnv.VITE_API_URL;
  // In development, when frontend is on a dev port (e.g. 5173, 3000, etc.), point to backend port 5000 on the same host
  if (window.location.port && window.location.port !== '5000') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return '';
}

const BASE_ORIGIN = getBaseOrigin();
export const API_BASE = `${BASE_ORIGIN}/api`;

export function getAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${BASE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const AUTH_TOKEN_KEY = 'saeed_portfolio_auth_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    localStorage.removeItem('saeed_portfolio_token');
  } catch (e) {}
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  try {
    localStorage.removeItem('saeed_portfolio_token');
  } catch (e) {}
}

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically to every request if available in per-tab session
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to catch 401 Unauthorized responses and trigger clean logout
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeStoredToken();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// Public Endpoints
export const publicApi = {
  getPortfolioData: async () => {
    const res = await apiClient.get('/public/portfolio', {
      params: { _t: Date.now() }
    });
    return res.data;
  },
  sendContactMessage: async (data: { name: string; email: string; subject: string; message: string }) => {
    const res = await apiClient.post('/public/contact', data);
    return res.data;
  },
  trackProjectClick: async (projectId: number, title: string) => {
    try {
      await apiClient.post('/public/track-click', { projectId, title });
    } catch (e) {
      // Non-blocking
    }
  }
};

// Auth Endpoints
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },
  logout: async () => {
    try {
      const res = await apiClient.post('/auth/logout');
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  updatePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const res = await apiClient.put('/auth/password', passwords);
    return res.data;
  }
};

// Admin Endpoints
export const adminApi = {
  // Stats
  getStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  // Settings
  getSettings: async () => {
    const res = await apiClient.get('/admin/settings');
    return res.data;
  },
  updateSettings: async (settings: Partial<ProfileSettings>) => {
    const res = await apiClient.put('/admin/settings', settings);
    return res.data;
  },

  // Projects CRUD
  getProjects: async () => {
    const res = await apiClient.get('/admin/projects');
    return res.data;
  },
  createProject: async (project: Partial<Project>) => {
    const res = await apiClient.post('/admin/projects', project);
    return res.data;
  },
  updateProject: async (id: number, project: Partial<Project>) => {
    const res = await apiClient.put(`/admin/projects/${id}`, project);
    return res.data;
  },
  deleteProject: async (id: number) => {
    const res = await apiClient.delete(`/admin/projects/${id}`);
    return res.data;
  },

  // Skills CRUD
  getSkills: async () => {
    const res = await apiClient.get('/admin/skills');
    return res.data;
  },
  createSkill: async (skill: Partial<Skill>) => {
    const res = await apiClient.post('/admin/skills', skill);
    return res.data;
  },
  updateSkill: async (id: number, skill: Partial<Skill>) => {
    const res = await apiClient.put(`/admin/skills/${id}`, skill);
    return res.data;
  },
  deleteSkill: async (id: number) => {
    const res = await apiClient.delete(`/admin/skills/${id}`);
    return res.data;
  },

  // Experience CRUD
  getExperience: async () => {
    const res = await apiClient.get('/admin/experience');
    return res.data;
  },
  createExperience: async (exp: Partial<Experience>) => {
    const res = await apiClient.post('/admin/experience', exp);
    return res.data;
  },
  updateExperience: async (id: number, exp: Partial<Experience>) => {
    const res = await apiClient.put(`/admin/experience/${id}`, exp);
    return res.data;
  },
  deleteExperience: async (id: number) => {
    const res = await apiClient.delete(`/admin/experience/${id}`);
    return res.data;
  },

  // Education CRUD
  getEducation: async () => {
    const res = await apiClient.get('/admin/education');
    return res.data;
  },
  createEducation: async (edu: Partial<Education>) => {
    const res = await apiClient.post('/admin/education', edu);
    return res.data;
  },
  updateEducation: async (id: number, edu: Partial<Education>) => {
    const res = await apiClient.put(`/admin/education/${id}`, edu);
    return res.data;
  },
  deleteEducation: async (id: number) => {
    const res = await apiClient.delete(`/admin/education/${id}`);
    return res.data;
  },

  // Services CRUD
  getServices: async () => {
    const res = await apiClient.get('/admin/services');
    return res.data;
  },
  createService: async (svc: Partial<Service>) => {
    const res = await apiClient.post('/admin/services', svc);
    return res.data;
  },
  updateService: async (id: number, svc: Partial<Service>) => {
    const res = await apiClient.put(`/admin/services/${id}`, svc);
    return res.data;
  },
  deleteService: async (id: number) => {
    const res = await apiClient.delete(`/admin/services/${id}`);
    return res.data;
  },

  // Social Links CRUD
  getSocialLinks: async () => {
    const res = await apiClient.get('/admin/social');
    return res.data;
  },
  createSocialLink: async (link: Partial<SocialLink>) => {
    const res = await apiClient.post('/admin/social', link);
    return res.data;
  },
  updateSocialLink: async (id: number, link: Partial<SocialLink>) => {
    const res = await apiClient.put(`/admin/social/${id}`, link);
    return res.data;
  },
  deleteSocialLink: async (id: number) => {
    const res = await apiClient.delete(`/admin/social/${id}`);
    return res.data;
  },

  // Messages CRUD
  getMessages: async () => {
    const res = await apiClient.get('/admin/messages');
    return res.data;
  },
  toggleMessageRead: async (id: number, is_read: boolean) => {
    const res = await apiClient.patch(`/admin/messages/${id}`, { is_read });
    return res.data;
  },
  deleteMessage: async (id: number) => {
    const res = await apiClient.delete(`/admin/messages/${id}`);
    return res.data;
  },

  // File Upload
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  deleteUploadedFile: async (fileUrl: string) => {
    const res = await apiClient.post('/admin/delete-file', { fileUrl });
    return res.data;
  }
};
