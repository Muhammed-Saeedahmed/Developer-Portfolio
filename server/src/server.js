import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Copy default placeholder assets if they don't exist
const defaultAvatarPath = path.join(uploadsDir, 'default-avatar.png');
if (!fs.existsSync(defaultAvatarPath)) {
  // If root generated image exists, copy as high-res initial photo
  const rootImg = path.join(__dirname, '../../public_portfolio_ui_1788012489015.jpg');
  if (fs.existsSync(rootImg)) {
    try {
      fs.copyFileSync(rootImg, path.join(uploadsDir, 'default-avatar.png'));
      fs.copyFileSync(rootImg, path.join(uploadsDir, 'project-ai-studio.jpg'));
      fs.copyFileSync(rootImg, path.join(uploadsDir, 'project-fintech.jpg'));
      fs.copyFileSync(rootImg, path.join(uploadsDir, 'project-iot.jpg'));
      fs.copyFileSync(rootImg, path.join(uploadsDir, 'project-ecommerce.jpg'));
    } catch (e) {
      console.warn('Failed to copy initial assets:', e.message);
    }
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend build if it exists (for single-service deployment on Render/Railway/VPS)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Initialize database & start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  Portfolio CMS Server running on http://localhost:${PORT}`);
      console.log(`  API Base: http://localhost:${PORT}/api`);
      console.log(`  Uploads:  http://localhost:${PORT}/uploads`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to initialize database and server:', err);
    process.exit(1);
  }
}

startServer();
