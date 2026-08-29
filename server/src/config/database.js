import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbClient = null;
let isMySql = false;

// Fallback JSON-based Relational Store
const dataDir = path.join(__dirname, '../../data');
const jsonDbPath = path.join(dataDir, 'portfolio_db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let memStore = {
  users: [],
  portfolio_settings: [],
  projects: [],
  skills: [],
  experience: [],
  education: [],
  services: [],
  social_links: [],
  messages: [],
  analytics: []
};

function loadJsonDb() {
  if (fs.existsSync(jsonDbPath)) {
    try {
      const content = fs.readFileSync(jsonDbPath, 'utf8');
      memStore = JSON.parse(content);
    } catch (e) {
      console.warn('Failed to parse json db:', e.message);
    }
  }
}

function saveJsonDb() {
  try {
    fs.writeFileSync(jsonDbPath, JSON.stringify(memStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write json db:', e.message);
  }
}

// Initial seed data
const initialProfile = {
  developer_name: 'Muhammed Saeed',
  logo_text: 'MS.dev',
  hero_headline: 'Building Scalable Digital Experiences',
  hero_subtitle: 'Full-Stack Developer & Creative Technologist',
  bio: 'Full-Stack Developer passionate about building modern, scalable and creative digital experiences. I enjoy turning ideas into functional applications and exploring technologies across web development, databases, analytics, IoT and AI.',
  about_heading: 'Engineering Modern, Scalable Web Applications',
  about_bio: 'Full-Stack Developer passionate about building modern, scalable and creative digital experiences. I enjoy turning ideas into functional applications and exploring technologies across web development, databases, analytics, IoT and AI.',
  about_description: 'With a strong foundation in modern frontend architectures, backend APIs, and cloud infrastructure, I build high-performance web products that deliver exceptional user experiences.',
  profile_image: '/uploads/default-avatar.png',
  email: 'patel.muhammed.saeedahmed@gmail.com',
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

const initialProjects = [
  {
    title: 'AI Workflow Studio',
    slug: 'ai-workflow-studio',
    description: 'Autonomous AI agents orchestration dashboard with real-time streaming workflows, node canvas, and model analytics.',
    full_description: 'Comprehensive workflow automation platform built with modern React, TypeScript, and Python AI core. Features real-time multi-agent cooperation, canvas builder, and distributed queue processing.',
    image_url: '/uploads/project-ai-studio.jpg',
    category: 'AI',
    technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    is_featured: 1,
    display_order: 1
  },
  {
    title: 'Nexus FinTech Dashboard',
    slug: 'nexus-fintech-dashboard',
    description: 'High-frequency transaction monitor with live analytics, cryptocurrency swaps, and automated risk scoring.',
    full_description: 'Ultra-low latency financial analytics dashboard with WebGL charts, multi-currency support, and biometric-grade JWT authentication.',
    image_url: '/uploads/project-fintech.jpg',
    category: 'React',
    technologies: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'PostgreSQL'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    is_featured: 1,
    display_order: 2
  },
  {
    title: 'CloudMesh IoT Fleet Manager',
    slug: 'cloudmesh-iot-fleet-manager',
    description: 'Industrial IoT device management platform monitoring 10,000+ smart edge nodes with anomaly detection.',
    full_description: 'Real-time telemetry aggregation platform using MQTT, Node.js microservices, and React glassmorphic telemetry graphs.',
    image_url: '/uploads/project-iot.jpg',
    category: 'IoT',
    technologies: ['Node.js', 'React', 'MQTT', 'MySQL', 'Docker'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    is_featured: 1,
    display_order: 3
  },
  {
    title: 'OmniStore High-Scale E-Commerce',
    slug: 'omnistore-high-scale-ecommerce',
    description: 'Headless e-commerce platform with instant faceted search, Stripe payment webhooks, and sub-100ms load times.',
    full_description: 'Modern headless commerce engine featuring server-side rendering, global caching, inventory synchronization, and custom admin CMS.',
    image_url: '/uploads/project-ecommerce.jpg',
    category: 'Web',
    technologies: ['Next.js', 'React', 'Node.js', 'Tailwind CSS', 'Stripe'],
    github_url: 'https://github.com',
    live_url: 'https://example.com',
    is_featured: 1,
    display_order: 4
  }
];

const initialSkills = [
  { name: 'React', category: 'Frontend', icon: 'Atom', proficiency: 95, display_order: 1 },
  { name: 'TypeScript', category: 'Frontend', icon: 'FileCode2', proficiency: 90, display_order: 2 },
  { name: 'JavaScript', category: 'Frontend', icon: 'Code', proficiency: 95, display_order: 3 },
  { name: 'HTML / CSS', category: 'Frontend', icon: 'Layout', proficiency: 95, display_order: 4 },
  { name: 'Node.js', category: 'Backend', icon: 'Server', proficiency: 92, display_order: 5 },
  { name: 'Python', category: 'Backend', icon: 'Terminal', proficiency: 88, display_order: 6 },
  { name: 'PHP', category: 'Backend', icon: 'Globe', proficiency: 85, display_order: 7 },
  { name: 'MySQL', category: 'Database', icon: 'Database', proficiency: 90, display_order: 8 },
  { name: 'Git & GitHub', category: 'Tools', icon: 'GitBranch', proficiency: 92, display_order: 9 },
  { name: 'WordPress', category: 'CMS', icon: 'Cpu', proficiency: 85, display_order: 10 }
];

const initialExperience = [
  {
    company: 'Vanguard Digital Labs',
    position: 'Senior Full-Stack Engineer',
    location: 'San Francisco, CA (Hybrid)',
    start_date: '2024-01-01',
    end_date: null,
    is_current: 1,
    description: 'Leading the development of enterprise SaaS platforms, modernizing legacy architectures into high-performance React and Node.js microservices.',
    technologies: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Docker'],
    logo_url: '',
    display_order: 1
  },
  {
    company: 'Apex Interactive Systems',
    position: 'Full-Stack Developer',
    location: 'Remote',
    start_date: '2022-03-01',
    end_date: '2023-12-31',
    is_current: 0,
    description: 'Engineered custom web applications, RESTful API gateways, and interactive analytics dashboards with real-time data streaming.',
    technologies: ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind CSS'],
    logo_url: '',
    display_order: 2
  },
  {
    company: 'Quantum Byte Tech',
    position: 'Frontend & UI Developer',
    location: 'New York, NY',
    start_date: '2020-06-01',
    end_date: '2022-02-28',
    is_current: 0,
    description: 'Crafted responsive, high-fidelity user interfaces, design systems, and client-side performance optimizations for global clients.',
    technologies: ['JavaScript', 'React', 'HTML5', 'CSS3', 'WordPress'],
    logo_url: '',
    display_order: 3
  }
];

const initialEducation = [
  {
    institution: 'University of Engineering & Technology',
    degree: 'Bachelor of Science',
    course: 'Computer Science & Software Engineering',
    start_year: 2016,
    end_year: 2020,
    description: 'Specialized in Distributed Systems, Database Management Systems, Data Structures, and Software Architecture.',
    logo_url: '',
    display_order: 1
  },
  {
    institution: 'Tech Institute of Advanced Computing',
    degree: 'Professional Certification',
    course: 'Full-Stack Cloud & Modern Web Architectures',
    start_year: 2021,
    end_year: 2021,
    description: 'Intensive certification covering microservices, cloud deployments, modern frontend frameworks, and security best practices.',
    logo_url: '',
    display_order: 2
  }
];

const initialServices = [
  {
    title: 'Full-Stack Web Development',
    description: 'End-to-end modern web applications built with React, Node.js, and robust relational databases engineered for speed and scale.',
    icon: 'Layers',
    display_order: 1
  },
  {
    title: 'UI/UX Engineering & Design',
    description: 'Pixel-perfect, responsive interfaces featuring dark aesthetics, glassmorphism, micro-animations, and fluid responsive design.',
    icon: 'Layout',
    display_order: 2
  },
  {
    title: 'Database Architecture & APIs',
    description: 'High-performance SQL schema design, query optimization, secure RESTful & GraphQL APIs with JWT authentication.',
    icon: 'Database',
    display_order: 3
  },
  {
    title: 'IoT & Telemetry Dashboards',
    description: 'Connecting smart devices and sensors to real-time interactive monitoring dashboards with instant anomaly alerts.',
    icon: 'Cpu',
    display_order: 4
  },
  {
    title: 'WordPress & Headless CMS',
    description: 'Custom WordPress theme & plugin development, headless CMS integrations with Next.js/React frontends.',
    icon: 'Globe',
    display_order: 5
  },
  {
    title: 'Performance & Security Optimization',
    description: 'Audit and acceleration of web apps, Lighthouse 95+ score delivery, caching strategies, and security hardening.',
    icon: 'ShieldCheck',
    display_order: 6
  }
];

const initialSocialLinks = [
  { platform: 'GitHub', url: 'https://github.com', icon: 'Github', display_order: 1 },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin', display_order: 2 },
  { platform: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', display_order: 3 },
  { platform: 'Twitter / X', url: 'https://x.com', icon: 'Twitter', display_order: 4 }
];

export async function initDatabase() {
  loadJsonDb();

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = process.env.DB_PORT || 3306;
  const dbName = process.env.DB_NAME || 'portfolio_cms_db';

  console.log(`[DB] Attempting MySQL connection on ${host}:${port}...`);
  try {
    const rootConn = await mysql.createConnection({
      host,
      user,
      password,
      port: Number(port),
      connectTimeout: 2000
    });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    dbClient = await mysql.createPool({
      host,
      user,
      password,
      database: dbName,
      port: Number(port),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    isMySql = true;
    console.log(`[DB] Successfully connected to MySQL database "${dbName}".`);
    await createMySqlTables();
    await seedMySqlData();
  } catch (err) {
    console.warn(`[DB] MySQL connection notice (${err.message}). Using high-performance Embedded Database Engine.`);
    isMySql = false;
    await seedJsonStoreData();
  }
}

// Universal query dispatcher
export async function query(sql, params = []) {
  if (isMySql) {
    return await dbClient.query(sql, params);
  } else {
    return executeJsonQuery(sql, params);
  }
}

// High performance JSON Relational SQL emulator
function executeJsonQuery(sql, params = []) {
  const s = sql.trim().replace(/\s+/g, ' ');
  const upper = s.toUpperCase();

  // --- COUNT QUERIES ---
  if (upper.startsWith('SELECT COUNT(*)')) {
    const asMatch = sql.match(/SELECT\s+COUNT\(\*\)\s+(?:AS\s+)?([a-zA-Z0-9_]+)/i);
    const countKey = asMatch ? asMatch[1] : 'count';
    const fromMatch = upper.match(/FROM\s+([A-Z0-9_]+)(?:\s+WHERE\s+(.+))?/i);
    if (fromMatch) {
      const table = fromMatch[1].toLowerCase();
      let rows = memStore[table] || [];
      const whereClause = fromMatch[2];
      if (whereClause) {
        if (whereClause.includes('IS_READ = 0')) rows = rows.filter(r => Number(r.is_read) === 0);
        if (whereClause.includes('EVENT_TYPE = "PAGEVIEW"')) rows = rows.filter(r => r.event_type === 'pageview');
        if (whereClause.includes('EVENT_TYPE = "PROJECT_CLICK"')) rows = rows.filter(r => r.event_type === 'project_click');
      }
      const countVal = rows.length;
      return [[{
        [countKey]: countVal,
        [countKey.toLowerCase()]: countVal,
        [countKey.toUpperCase()]: countVal,
        count: countVal
      }]];
    }
  }

  // --- SELECT QUERIES ---
  if (upper.startsWith('SELECT')) {
    const fromMatch = upper.match(/FROM\s+([A-Z_]+)/i);
    if (!fromMatch) return [[]];
    const table = fromMatch[1].toLowerCase();
    let rows = [...(memStore[table] || [])];

    // WHERE clause
    if (upper.includes('WHERE EMAIL = ?')) {
      rows = rows.filter(r => r.email === params[0]);
    } else if (upper.includes('WHERE ID = ?')) {
      rows = rows.filter(r => String(r.id) === String(params[0]));
    } else if (upper.includes('WHERE IS_FEATURED >=')) {
      rows = rows.filter(r => (Number(r.is_featured) || 0) >= 0);
    }

    // ORDER BY
    if (upper.includes('ORDER BY DISPLAY_ORDER ASC')) {
      rows.sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0));
    } else if (upper.includes('ORDER BY CREATED_AT DESC')) {
      rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    // LIMIT
    if (upper.includes('LIMIT 1')) {
      rows = rows.slice(0, 1);
    } else if (upper.includes('LIMIT 5')) {
      rows = rows.slice(0, 5);
    }

    // Deep clone rows to prevent mutation
    const cloned = JSON.parse(JSON.stringify(rows));
    return [cloned];
  }

  // --- INSERT QUERIES ---
  if (upper.startsWith('INSERT INTO')) {
    const match = upper.match(/INSERT INTO\s+([A-Z_]+)\s*\(([^)]+)\)/i);
    if (match) {
      const table = match[1].toLowerCase();
      const cols = match[2].split(',').map(c => c.trim().toLowerCase());
      const newObj = { id: Date.now() + Math.floor(Math.random() * 1000), created_at: new Date().toISOString() };
      cols.forEach((col, idx) => {
        newObj[col] = params[idx];
      });
      if (!memStore[table]) memStore[table] = [];
      memStore[table].push(newObj);
      saveJsonDb();
      return [{ insertId: newObj.id, affectedRows: 1 }];
    }
  }

  // --- UPDATE QUERIES ---
  if (upper.startsWith('UPDATE')) {
    const match = upper.match(/UPDATE\s+([A-Z_]+)\s+SET\s+(.+)\s+WHERE\s+ID\s*=\s*\?/i);
    if (match) {
      const table = match[1].toLowerCase();
      const setParts = match[2].split(',').map(p => p.trim().split('=')[0].trim().toLowerCase());
      const id = params[params.length - 1];
      const list = memStore[table] || [];
      const item = list.find(r => String(r.id) === String(id));
      if (item) {
        setParts.forEach((col, idx) => {
          item[col] = params[idx];
        });
        item.updated_at = new Date().toISOString();
        saveJsonDb();
        return [{ affectedRows: 1 }];
      }
    }
  }

  // --- DELETE QUERIES ---
  if (upper.startsWith('DELETE FROM')) {
    const match = upper.match(/DELETE FROM\s+([A-Z_]+)\s+WHERE\s+ID\s*=\s*\?/i);
    if (match) {
      const table = match[1].toLowerCase();
      const id = params[0];
      if (memStore[table]) {
        const initialLen = memStore[table].length;
        memStore[table] = memStore[table].filter(r => String(r.id) !== String(id));
        saveJsonDb();
        return [{ affectedRows: initialLen - memStore[table].length }];
      }
    }
  }

  return [{ affectedRows: 0 }];
}

async function createMySqlTables() {
  // MySQL table definitions
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS portfolio_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      developer_name VARCHAR(255) NOT NULL,
      logo_text VARCHAR(100) DEFAULT 'MS.dev',
      hero_headline VARCHAR(255) NOT NULL,
      hero_subtitle VARCHAR(255) NOT NULL,
      bio TEXT NOT NULL,
      about_heading VARCHAR(255),
      about_bio TEXT,
      about_description TEXT,
      profile_image VARCHAR(500),
      email VARCHAR(255),
      phone VARCHAR(100),
      location VARCHAR(255),
      resume_url VARCHAR(500),
      github_url VARCHAR(500),
      linkedin_url VARCHAR(500),
      instagram_url VARCHAR(500),
      hire_me_text VARCHAR(100) DEFAULT 'Hire Me',
      years_experience INT DEFAULT 5,
      projects_completed INT DEFAULT 24,
      satisfied_clients INT DEFAULT 18,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      full_description TEXT,
      image_url VARCHAR(500),
      category VARCHAR(100) DEFAULT 'Web',
      technologies TEXT,
      github_url VARCHAR(500),
      live_url VARCHAR(500),
      is_featured INT DEFAULT 1,
      display_order INT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(100) DEFAULT 'Frontend',
      icon VARCHAR(100) DEFAULT 'Code',
      proficiency INT DEFAULT 90,
      display_order INT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS experience (
      id INT AUTO_INCREMENT PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      position VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      start_date VARCHAR(50),
      end_date VARCHAR(50),
      is_current INT DEFAULT 0,
      description TEXT,
      technologies TEXT,
      logo_url VARCHAR(500),
      display_order INT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS education (
      id INT AUTO_INCREMENT PRIMARY KEY,
      institution VARCHAR(255) NOT NULL,
      degree VARCHAR(255) NOT NULL,
      course VARCHAR(255),
      start_year INT,
      end_year INT,
      description TEXT,
      logo_url VARCHAR(500),
      display_order INT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(100) DEFAULT 'Layers',
      display_order INT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS social_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      url VARCHAR(500) NOT NULL,
      icon VARCHAR(100) DEFAULT 'Globe',
      display_order INT DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_type VARCHAR(100) DEFAULT 'pageview',
      page VARCHAR(255) DEFAULT '/',
      project_id INT,
      referrer VARCHAR(500),
      ip_hash VARCHAR(255),
      user_agent VARCHAR(500),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function seedMySqlData() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saeed.dev';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@2026!';
  const [users] = await dbClient.query('SELECT id FROM users LIMIT 1');
  if (users.length === 0) {
    const hashed = await bcrypt.hash(adminPass, 10);
    await dbClient.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [adminEmail, hashed, 'Muhammed Saeed', 'admin']);
  }
  const [settings] = await dbClient.query('SELECT id FROM portfolio_settings LIMIT 1');
  if (settings.length === 0) {
    await dbClient.query(
      `INSERT INTO portfolio_settings (developer_name, logo_text, hero_headline, hero_subtitle, bio, about_heading, about_bio, about_description, profile_image, email, phone, location, resume_url, github_url, linkedin_url, instagram_url, hire_me_text, years_experience, projects_completed, satisfied_clients)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [initialProfile.developer_name, initialProfile.logo_text, initialProfile.hero_headline, initialProfile.hero_subtitle, initialProfile.bio, initialProfile.about_heading, initialProfile.about_bio, initialProfile.about_description, initialProfile.profile_image, initialProfile.email, initialProfile.phone, initialProfile.location, initialProfile.resume_url, initialProfile.github_url, initialProfile.linkedin_url, initialProfile.instagram_url, initialProfile.hire_me_text, initialProfile.years_experience, initialProfile.projects_completed, initialProfile.satisfied_clients]
    );
  }
  const [projects] = await dbClient.query('SELECT id FROM projects LIMIT 1');
  if (projects.length === 0) {
    for (const p of initialProjects) {
      await dbClient.query(
        `INSERT INTO projects (title, slug, description, full_description, image_url, category, technologies, github_url, live_url, is_featured, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.title, p.slug, p.description, p.full_description, p.image_url, p.category, JSON.stringify(p.technologies), p.github_url, p.live_url, p.is_featured, p.display_order]
      );
    }
  }
  const [skills] = await dbClient.query('SELECT id FROM skills LIMIT 1');
  if (skills.length === 0) {
    for (const s of initialSkills) {
      await dbClient.query('INSERT INTO skills (name, category, icon, proficiency, display_order) VALUES (?, ?, ?, ?, ?)', [s.name, s.category, s.icon, s.proficiency, s.display_order]);
    }
  }
  const [exp] = await dbClient.query('SELECT id FROM experience LIMIT 1');
  if (exp.length === 0) {
    for (const e of initialExperience) {
      await dbClient.query(
        `INSERT INTO experience (company, position, location, start_date, end_date, is_current, description, technologies, logo_url, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.company, e.position, e.location, e.start_date, e.end_date, e.is_current, e.description, JSON.stringify(e.technologies), e.logo_url, e.display_order]
      );
    }
  }
  const [edu] = await dbClient.query('SELECT id FROM education LIMIT 1');
  if (edu.length === 0) {
    for (const ed of initialEducation) {
      await dbClient.query('INSERT INTO education (institution, degree, course, start_year, end_year, description, logo_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [ed.institution, ed.degree, ed.course, ed.start_year, ed.end_year, ed.description, ed.logo_url, ed.display_order]);
    }
  }
  const [services] = await dbClient.query('SELECT id FROM services LIMIT 1');
  if (services.length === 0) {
    for (const sv of initialServices) {
      await dbClient.query('INSERT INTO services (title, description, icon, display_order) VALUES (?, ?, ?, ?)', [sv.title, sv.description, sv.icon, sv.display_order]);
    }
  }
  const [social] = await dbClient.query('SELECT id FROM social_links LIMIT 1');
  if (social.length === 0) {
    for (const sc of initialSocialLinks) {
      await dbClient.query('INSERT INTO social_links (platform, url, icon, display_order) VALUES (?, ?, ?, ?)', [sc.platform, sc.url, sc.icon, sc.display_order]);
    }
  }
}

async function seedJsonStoreData() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saeed.dev';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@2026!';

  if (!memStore.users || memStore.users.length === 0) {
    const hashed = await bcrypt.hash(adminPass, 10);
    memStore.users = [{
      id: 1,
      email: adminEmail,
      password: hashed,
      name: 'Muhammed Saeed',
      role: 'admin',
      created_at: new Date().toISOString()
    }];
  } else if (process.env.ADMIN_PASSWORD) {
    // If custom ADMIN_PASSWORD provided in cloud environment, update user 1
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    memStore.users[0].password = hashed;
    if (process.env.ADMIN_EMAIL) memStore.users[0].email = process.env.ADMIN_EMAIL;
  }

  if (!memStore.portfolio_settings || memStore.portfolio_settings.length === 0) {
    memStore.portfolio_settings = [{
      id: 1,
      ...initialProfile,
      created_at: new Date().toISOString()
    }];
  }

  if (!memStore.projects || memStore.projects.length === 0) {
    memStore.projects = initialProjects.map((p, idx) => ({
      id: idx + 1,
      ...p,
      technologies: JSON.stringify(p.technologies),
      created_at: new Date().toISOString()
    }));
  }

  if (!memStore.skills || memStore.skills.length === 0) {
    memStore.skills = initialSkills.map((s, idx) => ({
      id: idx + 1,
      ...s,
      created_at: new Date().toISOString()
    }));
  }

  if (!memStore.experience || memStore.experience.length === 0) {
    memStore.experience = initialExperience.map((e, idx) => ({
      id: idx + 1,
      ...e,
      technologies: JSON.stringify(e.technologies),
      created_at: new Date().toISOString()
    }));
  }

  if (!memStore.education || memStore.education.length === 0) {
    memStore.education = initialEducation.map((ed, idx) => ({
      id: idx + 1,
      ...ed,
      created_at: new Date().toISOString()
    }));
  }

  if (!memStore.services || memStore.services.length === 0) {
    memStore.services = initialServices.map((sv, idx) => ({
      id: idx + 1,
      ...sv,
      created_at: new Date().toISOString()
    }));
  }

  if (!memStore.social_links || memStore.social_links.length === 0) {
    memStore.social_links = initialSocialLinks.map((sc, idx) => ({
      id: idx + 1,
      ...sc,
      created_at: new Date().toISOString()
    }));
  }

  if (!memStore.messages) {
    memStore.messages = [
      {
        id: 1,
        name: 'David Sterling',
        email: 'david@venturebuild.io',
        subject: 'Full-Stack Architecture Inquiry',
        message: 'Hi Saeed, we love your portfolio. We would love to discuss developing an AI SaaS MVP next month.',
        is_read: 0,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 2,
        name: 'Elena Rostova',
        email: 'elena@novatech.co',
        subject: 'Consulting on IoT Analytics',
        message: 'Looking for a senior consultant to help scale our telemetry pipelines. Are you open to contract projects?',
        is_read: 1,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }

  if (!memStore.analytics) {
    memStore.analytics = [];
  }

  saveJsonDb();
  console.log('[DB Engine] Initialized and seeded data store successfully.');
}
