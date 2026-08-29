import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';

// Public Pages
import { PublicPortfolio } from './pages/PublicPortfolio';

// Admin Pages
import { AdminLogin } from './pages/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProjectsManager } from './pages/admin/ProjectsManager';
import { SkillsManager } from './pages/admin/SkillsManager';
import { ExperienceManager } from './pages/admin/ExperienceManager';
import { EducationManager } from './pages/admin/EducationManager';
import { ServicesManager } from './pages/admin/ServicesManager';
import { MessagesManager } from './pages/admin/MessagesManager';
import { SettingsManager } from './pages/admin/SettingsManager';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<PublicPortfolio />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin CMS Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="skills" element={<SkillsManager />} />
              <Route path="experience" element={<ExperienceManager />} />
              <Route path="education" element={<EducationManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="messages" element={<MessagesManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </AuthProvider>
  );
};

export default App;
