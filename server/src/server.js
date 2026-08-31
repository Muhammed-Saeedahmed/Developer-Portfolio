import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initDatabase, getUploadedFileFromDb, getDatabaseStatus } from './config/database.js';
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

// Copy default placeholder assets if they don't exist
const defaultAvatarPath = path.join(uploadsDir, 'default-avatar.png');
if (!fs.existsSync(defaultAvatarPath)) {
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

// Uploads route with database-backed persistence for ephemeral environments (e.g. Render)
app.get('/uploads/:filename', async (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(uploadsDir, filename);

  // 1. If file exists in local disk cache, serve directly
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  // 2. If missing on disk (e.g. after Render restart), restore from persistent database
  try {
    const fileRecord = await getUploadedFileFromDb(filename);
    if (fileRecord && fileRecord.buffer) {
      try {
        fs.writeFileSync(filePath, fileRecord.buffer);
      } catch (e) {
        // Non-blocking disk write
      }
      res.setHeader('Content-Type', fileRecord.mimeType || 'application/octet-stream');
      return res.send(fileRecord.buffer);
    }
  } catch (err) {
    console.warn(`[Uploads] Could not restore ${filename} from database:`, err.message);
  }

  res.status(404).json({ success: false, message: 'File not found' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: getDatabaseStatus(),
    timestamp: new Date().toISOString()
  });
});

// No-cache headers for API routes to prevent stale browser / proxy caching
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
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
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`  Portfolio CMS Server running on port ${PORT}`);
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
