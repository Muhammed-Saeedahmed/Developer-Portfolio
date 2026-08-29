import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileSettings, Project, Skill, Experience, Education, Service, SocialLink } from '../types';
import { publicApi } from '../services/api';

interface PortfolioContextType {
  profile: ProfileSettings;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  services: Service[];
  socialLinks: SocialLink[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const defaultProfile: ProfileSettings = {
  developer_name: 'Muhammad Saeed',
  logo_text: 'MS.dev',
  hero_headline: 'Building Scalable Digital Experiences',
  hero_subtitle: 'Full-Stack Developer & Creative Technologist',
  bio: 'Full-Stack Developer passionate about building modern, scalable and creative digital experiences. I enjoy turning ideas into functional applications and exploring technologies across web development, databases, analytics, IoT and AI.',
  about_heading: 'Engineering Modern, Scalable Web Applications',
  about_bio: 'Full-Stack Developer passionate about building modern, scalable and creative digital experiences.',
  about_description: 'With a strong foundation in modern frontend architectures, backend APIs, and cloud infrastructure, I build high-performance web products.',
  profile_image: '/uploads/default-avatar.png',
  email: 'contact@saeed.dev',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA & Remote',
  resume_url: '#',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  instagram_url: 'https://instagram.com',
  hire_me_text: 'Hire Me',
  years_experience: 5,
  projects_completed: 24,
  satisfied_clients: 18
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileSettings>(defaultProfile);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const res = await publicApi.getPortfolioData();
      if (res.success && res.data) {
        setProfile(res.data.profile || defaultProfile);
        setProjects(res.data.projects || []);
        setSkills(res.data.skills || []);
        setExperience(res.data.experience || []);
        setEducation(res.data.education || []);
        setServices(res.data.services || []);
        setSocialLinks(res.data.socialLinks || []);
      }
    } catch (err: any) {
      console.warn('Failed to load portfolio data:', err.message);
      setError('Could not connect to backend server. Using local cache.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        skills,
        experience,
        education,
        services,
        socialLinks,
        isLoading,
        error,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};
