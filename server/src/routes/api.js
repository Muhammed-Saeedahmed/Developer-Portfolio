import express from 'express';
import fs from 'fs';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload, deleteFileSafely } from '../config/upload.js';
import { saveUploadedFileToDb } from '../config/database.js';
import * as authController from '../controllers/authController.js';
import * as portfolioController from '../controllers/portfolioController.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// --- Public Endpoints ---
router.get('/public/portfolio', portfolioController.getPublicData);
router.post('/public/contact', portfolioController.submitContactMessage);
router.post('/public/track-click', portfolioController.trackProjectClick);

// --- Auth Endpoints ---
router.post('/auth/login', authController.login);
router.post('/auth/logout', authenticateToken, authController.logout);
router.get('/auth/me', authenticateToken, authController.getMe);
router.put('/auth/password', authenticateToken, authController.updatePassword);

// --- Upload Endpoint (Protected) ---
router.post('/admin/upload', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    // Read uploaded file buffer and persist to database for permanent storage across container restarts
    const fileBuffer = fs.readFileSync(req.file.path);
    await saveUploadedFileToDb(
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      fileBuffer,
      req.file.size
    );

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('File upload save error:', err);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  }
});

// Delete uploaded file endpoint
router.post('/admin/delete-file', authenticateToken, async (req, res) => {
  const { fileUrl } = req.body;
  if (fileUrl) {
    await deleteFileSafely(fileUrl);
  }
  res.json({ success: true, message: 'File deleted if existed' });
});

// --- Admin Protected Endpoints ---
// Stats & Settings
router.get('/admin/stats', authenticateToken, adminController.getDashboardStats);
router.get('/admin/settings', authenticateToken, adminController.getSettings);
router.put('/admin/settings', authenticateToken, adminController.updateSettings);

// Projects
router.get('/admin/projects', authenticateToken, adminController.getProjects);
router.post('/admin/projects', authenticateToken, adminController.createProject);
router.put('/admin/projects/:id', authenticateToken, adminController.updateProject);
router.delete('/admin/projects/:id', authenticateToken, adminController.deleteProject);

// Skills
router.get('/admin/skills', authenticateToken, adminController.getSkills);
router.post('/admin/skills', authenticateToken, adminController.createSkill);
router.put('/admin/skills/:id', authenticateToken, adminController.updateSkill);
router.delete('/admin/skills/:id', authenticateToken, adminController.deleteSkill);

// Experience
router.get('/admin/experience', authenticateToken, adminController.getExperience);
router.post('/admin/experience', authenticateToken, adminController.createExperience);
router.put('/admin/experience/:id', authenticateToken, adminController.updateExperience);
router.delete('/admin/experience/:id', authenticateToken, adminController.deleteExperience);

// Education
router.get('/admin/education', authenticateToken, adminController.getEducation);
router.post('/admin/education', authenticateToken, adminController.createEducation);
router.put('/admin/education/:id', authenticateToken, adminController.updateEducation);
router.delete('/admin/education/:id', authenticateToken, adminController.deleteEducation);

// Services
router.get('/admin/services', authenticateToken, adminController.getServices);
router.post('/admin/services', authenticateToken, adminController.createService);
router.put('/admin/services/:id', authenticateToken, adminController.updateService);
router.delete('/admin/services/:id', authenticateToken, adminController.deleteService);

// Social Links
router.get('/admin/social', authenticateToken, adminController.getSocialLinks);
router.post('/admin/social', authenticateToken, adminController.createSocialLink);
router.put('/admin/social/:id', authenticateToken, adminController.updateSocialLink);
router.delete('/admin/social/:id', authenticateToken, adminController.deleteSocialLink);

// Messages
router.get('/admin/messages', authenticateToken, adminController.getMessages);
router.patch('/admin/messages/:id', authenticateToken, adminController.toggleMessageRead);
router.delete('/admin/messages/:id', authenticateToken, adminController.deleteMessage);

export default router;
