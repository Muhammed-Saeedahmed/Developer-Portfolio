export interface ProfileSettings {
  id?: number;
  developer_name: string;
  logo_text: string;
  hero_headline: string;
  hero_subtitle: string;
  bio: string;
  about_heading: string;
  about_bio: string;
  about_description: string;
  profile_image: string;
  email: string;
  phone: string;
  location: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  hire_me_text: string;
  years_experience: number;
  projects_completed: number;
  satisfied_clients: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  full_description?: string;
  image_url: string;
  category: string;
  status?: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  is_featured: number;
  display_order: number;
  created_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  proficiency: number;
  display_order: number;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: number;
  description: string;
  technologies: string[];
  logo_url: string;
  display_order: number;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  course: string;
  start_year: number;
  end_year: number;
  description: string;
  logo_url: string;
  display_order: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  display_order: number;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalExperience: number;
  totalEducation: number;
  totalMessages: number;
  unreadMessages: number;
  totalViews: number;
  projectClicks: number;
}

export interface TrafficDataPoint {
  name: string;
  views: number;
  clicks: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}
