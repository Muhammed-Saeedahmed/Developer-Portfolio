import mysql from 'mysql2/promise';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Pool: PgPool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbClient = null;
let dbDriver = 'json'; // 'postgres' | 'mysql' | 'json'

// --- Fallback JSON-based Store (for offline local development) ---
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
  analytics: [],
  sessions: [],
  uploads: []
};

function loadJsonDb() {
  if (fs.existsSync(jsonDbPath)) {
    try {
      const content = fs.readFileSync(jsonDbPath, 'utf8');
      if (content && content.trim()) {
        const parsed = JSON.parse(content);
        memStore = { ...memStore, ...parsed };
        if (!memStore.sessions) memStore.sessions = [];
        if (!memStore.uploads) memStore.uploads = [];
      }
    } catch (e) {
      console.warn('[DB File] Warning reading json db file:', e.message);
    }
  }
}

function saveJsonDb() {
  try {
    const tmpPath = `${jsonDbPath}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpPath, JSON.stringify(memStore, null, 2), 'utf8');
    fs.renameSync(tmpPath, jsonDbPath);
  } catch (e) {
    console.error('[DB File] Error saving json db file:', e.message);
  }
}

loadJsonDb();

// Baseline initial seed data (used ONLY when database tables are empty)
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
    status: 'In Progress',
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
    status: 'Completed',
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
    status: 'Completed',
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
    status: 'Completed',
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

/**
 * Mask sensitive connection info for secure logging
 */
function maskConnectionString(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return `${parsed.protocol}//${parsed.username ? parsed.username + ':****@' : ''}${parsed.host}${parsed.pathname}`;
  } catch (e) {
    return 'configured database';
  }
}

/**
 * Try connecting to PostgreSQL with adaptive SSL negotiation & timeout guards
 */
async function tryConnectPostgres(databaseUrl, host, port, user, password, dbName) {
  const cleanUrl = databaseUrl ? databaseUrl.trim() : null;
  const isInternal = Boolean(
    (cleanUrl && (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1') || cleanUrl.includes('.internal') || (cleanUrl.includes('@dpg-') && !cleanUrl.includes('.render.com')))) ||
    (host && (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.internal') || (host.startsWith('dpg-') && !host.includes('.render.com'))))
  );

  const sslModesToTry = isInternal
    ? [{ rejectUnauthorized: false }, false]
    : [{ rejectUnauthorized: false }, false, true];

  let lastError = null;

  for (const sslSetting of sslModesToTry) {
    let pool = null;
    try {
      const config = cleanUrl
        ? {
            connectionString: cleanUrl,
            ssl: sslSetting,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 20
          }
        : {
            host: host || process.env.PGHOST || 'localhost',
            port: Number(port || process.env.PGPORT || 5432),
            user: user || process.env.PGUSER || 'postgres',
            password: password || process.env.PGPASSWORD || '',
            database: dbName || process.env.PGDATABASE || 'postgres',
            ssl: sslSetting,
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 20
          };

      pool = new PgPool(config);
      pool.on('error', (err) => {
        console.error('[PostgreSQL Pool Error]', err.message);
      });

      const res = await pool.query('SELECT current_database(), current_user, version()');
      console.log(`[DB] Connected successfully to PostgreSQL (Database: "${res.rows[0].current_database}", User: "${res.rows[0].current_user}", SSL: ${Boolean(sslSetting)}).`);
      return pool;
    } catch (err) {
      lastError = err;
      if (pool) {
        try { await pool.end(); } catch (e) {}
      }
    }
  }

  throw lastError;
}

/**
 * Try connecting to MySQL with adaptive SSL negotiation, auto-reconnect, and timeout guards
 */
async function tryConnectMySql(databaseUrl, host, port, user, password, dbName) {
  let mysqlHost = host;
  let mysqlPort = Number(port || 3306);
  let mysqlUser = user || 'root';
  let mysqlPassword = password || '';
  let mysqlDb = dbName || 'portfolio_cms_db';

  if (databaseUrl && (databaseUrl.startsWith('mysql://') || databaseUrl.startsWith('mysql2://'))) {
    try {
      const parsed = new URL(databaseUrl);
      mysqlHost = parsed.hostname;
      mysqlPort = Number(parsed.port || 3306);
      mysqlUser = decodeURIComponent(parsed.username || 'root');
      mysqlPassword = decodeURIComponent(parsed.password || '');
      mysqlDb = parsed.pathname.replace(/^\//, '') || 'portfolio_cms_db';
    } catch (e) {
      console.warn('[DB Warning] Failed to parse DATABASE_URL as URL:', e.message);
    }
  }

  const isInternal = Boolean(
    !mysqlHost ||
    mysqlHost === 'localhost' ||
    mysqlHost === '127.0.0.1' ||
    mysqlHost.endsWith('.internal')
  );

  const sslCandidates = process.env.DB_SSL === 'false'
    ? [undefined]
    : (process.env.DB_SSL === 'true' || !isInternal)
      ? [{ rejectUnauthorized: false }, undefined]
      : [undefined, { rejectUnauthorized: false }];

  let lastError = null;

  for (const sslSetting of sslCandidates) {
    let pool = null;
    try {
      if (isInternal) {
        try {
          const rootConn = await mysql.createConnection({
            host: mysqlHost || 'localhost',
            user: mysqlUser,
            password: mysqlPassword,
            port: mysqlPort,
            connectTimeout: 5000,
            ssl: sslSetting
          });
          await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${mysqlDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
          await rootConn.end();
        } catch (e) {
          // Ignored if user lacks root/create db permission on managed cloud MySQL
        }
      }

      pool = mysql.createPool({
        host: mysqlHost || 'localhost',
        user: mysqlUser,
        password: mysqlPassword,
        database: mysqlDb,
        port: mysqlPort,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 15000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        ssl: sslSetting
      });

      // Verify connection
      await pool.query('SELECT 1');
      console.log(`[DB] Connected successfully to MySQL Database (Host: "${mysqlHost || 'localhost'}:${mysqlPort}", Database: "${mysqlDb}", SSL: ${Boolean(sslSetting)}).`);
      return { pool, mysqlHost, mysqlPort, mysqlUser, mysqlDb };
    } catch (err) {
      lastError = err;
      if (pool) {
        try { await pool.end(); } catch (e) {}
      }
    }
  }

  throw lastError;
}

/**
 * Safe, non-destructive schema evolution for MySQL.
 * Checks INFORMATION_SCHEMA.COLUMNS and adds missing columns without altering or resetting existing data.
 */
async function ensureMySqlColumns() {
  const schemaUpdates = [
    {
      table: 'portfolio_settings',
      columns: [
        { name: 'years_experience', type: 'INT DEFAULT 5' },
        { name: 'projects_completed', type: 'INT DEFAULT 24' },
        { name: 'satisfied_clients', type: 'INT DEFAULT 18' },
        { name: 'about_heading', type: 'VARCHAR(255)' },
        { name: 'about_bio', type: 'TEXT' },
        { name: 'about_description', type: 'TEXT' },
        { name: 'hire_me_text', type: "VARCHAR(100) DEFAULT 'Hire Me'" },
        { name: 'logo_text', type: "VARCHAR(100) DEFAULT 'MS.dev'" }
      ]
    },
    {
      table: 'projects',
      columns: [
        { name: 'status', type: "VARCHAR(50) DEFAULT 'Completed'" },
        { name: 'full_description', type: 'TEXT' },
        { name: 'is_featured', type: 'INT DEFAULT 1' },
        { name: 'display_order', type: 'INT DEFAULT 1' }
      ]
    },
    {
      table: 'experience',
      columns: [
        { name: 'is_current', type: 'INT DEFAULT 0' },
        { name: 'technologies', type: 'TEXT' },
        { name: 'logo_url', type: 'VARCHAR(500)' },
        { name: 'display_order', type: 'INT DEFAULT 1' }
      ]
    },
    {
      table: 'education',
      columns: [
        { name: 'course', type: 'VARCHAR(255)' },
        { name: 'logo_url', type: 'VARCHAR(500)' },
        { name: 'display_order', type: 'INT DEFAULT 1' }
      ]
    },
    {
      table: 'uploads',
      columns: [
        { name: 'original_name', type: 'VARCHAR(255)' },
        { name: 'mime_type', type: 'VARCHAR(100)' },
        { name: 'file_data', type: 'LONGTEXT' },
        { name: 'size', type: 'INT DEFAULT 0' }
      ]
    }
  ];

  for (const update of schemaUpdates) {
    try {
      const [existing] = await dbClient.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
        [update.table]
      );
      const existingCols = new Set((existing || []).map(c => (c.COLUMN_NAME || c.column_name || '').toLowerCase()));
      for (const col of update.columns) {
        if (!existingCols.has(col.name.toLowerCase())) {
          try {
            await dbClient.query(`ALTER TABLE \`${update.table}\` ADD COLUMN \`${col.name}\` ${col.type}`);
            console.log(`[DB Schema Migration] Added column "${col.name}" to table "${update.table}".`);
          } catch (e) {
            console.warn(`[DB Schema Migration] Note adding column "${col.name}":`, e.message);
          }
        }
      }
    } catch (err) {
      console.warn(`[DB Schema Migration] Table check for "${update.table}" skipped:`, err.message);
    }
  }
}

/**
 * Get active database engine status
 */
export function getDatabaseStatus() {
  return {
    driver: dbDriver,
    connected: Boolean(dbClient || dbDriver === 'json'),
    isPersistent: dbDriver === 'postgres' || dbDriver === 'mysql',
    timestamp: new Date().toISOString()
  };
}

/**
 * Initialize Database connection and verify tables
 */
export async function initDatabase() {
  loadJsonDb();

  const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  const databaseUrl = (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.MYSQL_URL ||
    process.env.CLEARDB_DATABASE_URL ||
    process.env.JAWSDB_URL ||
    ''
  ).trim();

  const isPostgresUrl = databaseUrl && (databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://'));
  const isMysqlUrl = databaseUrl && (databaseUrl.startsWith('mysql://') || databaseUrl.startsWith('mysql2://'));

  const host = process.env.DB_HOST || process.env.MYSQLHOST;
  const user = process.env.DB_USER || process.env.MYSQLUSER;
  const password = process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
  const port = process.env.DB_PORT || process.env.MYSQLPORT;
  const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'portfolio_cms_db';

  const forcePostgres = process.env.DB_TYPE === 'postgres' || Boolean(process.env.PGHOST);
  const forceMysql = process.env.DB_TYPE === 'mysql';

  let lastConnectionError = null;

  // --- 1. PostgreSQL Connection (Render Managed DB / Neon / Supabase / Railway) ---
  if (isPostgresUrl || forcePostgres || (databaseUrl && !isMysqlUrl && !forceMysql)) {
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[DB] Connecting to PostgreSQL Database (${databaseUrl ? maskConnectionString(databaseUrl) : (host || 'localhost')}) [Attempt ${attempt}/${maxRetries}]...`);
        const pool = await tryConnectPostgres(databaseUrl, host, port, user, password, dbName);
        dbClient = pool;
        dbDriver = 'postgres';

        await createPostgresTables();
        await seedDatabaseTables();
        return;
      } catch (err) {
        lastConnectionError = err;
        console.warn(`[DB Warning] PostgreSQL attempt ${attempt} failed: ${err.message}`);
        if (attempt < maxRetries) {
          const delayMs = attempt * 1200;
          await new Promise(r => setTimeout(r, delayMs));
        }
      }
    }
  }

  // --- 2. MySQL Connection (TiDB Cloud / Aiven / Railway MySQL / Local MySQL) ---
  const shouldTryMysql = isMysqlUrl || forceMysql || (host && host !== 'localhost') || (!isProduction && !databaseUrl);
  if (shouldTryMysql) {
    const maxRetries = (isMysqlUrl || host) ? 3 : 1;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[DB] Connecting to MySQL Database (${databaseUrl ? maskConnectionString(databaseUrl) : `${host || 'localhost'}:${port || 3306}`}) [Attempt ${attempt}/${maxRetries}]...`);
        const { pool } = await tryConnectMySql(databaseUrl, host, port, user, password, dbName);
        dbClient = pool;
        dbDriver = 'mysql';

        await createMySqlTables();
        await ensureMySqlColumns();
        await seedDatabaseTables();
        return;
      } catch (err) {
        lastConnectionError = err;
        console.warn(`[DB Warning] MySQL attempt ${attempt} failed: ${err.message}`);
        if (attempt < maxRetries) {
          const delayMs = attempt * 1200;
          await new Promise(r => setTimeout(r, delayMs));
        }
      }
    }
  }

  // --- 3. Embedded Local Database Engine (Zero-Crash & 100% Uptime Guarantee) ---
  console.log('========================================================================');
  if (databaseUrl || host) {
    console.warn(`[DB Notice] External database connection was not established: ${lastConnectionError ? lastConnectionError.message : 'unreachable'}`);
    console.warn(`[DB Notice] Starting in Embedded Local Database Mode to ensure 100% uptime and immediate deployment.`);
    console.warn(`[DB Notice] Tip: If your Render PostgreSQL database expired (Render 30-day limit), create a new PostgreSQL database on Render or use a free permanent cloud DB (Neon.tech / Supabase / TiDB Cloud) and set DATABASE_URL.`);
  } else {
    console.log(`[DB Info] Running with Embedded Local Database Engine (Data file: ${jsonDbPath}).`);
  }
  console.log('========================================================================');

  dbDriver = 'json';
  await seedJsonStoreData();
}

/**
 * Universal Query Dispatcher
 * Normalizes queries and results across PostgreSQL, MySQL, and JSON store
 */
export async function query(sql, params = []) {
  if (dbDriver === 'postgres') {
    return await executePostgresQuery(sql, params);
  } else if (dbDriver === 'mysql') {
    return await executeMySqlQuery(sql, params);
  } else {
    return executeJsonQuery(sql, params);
  }
}

/**
 * Execute query on PostgreSQL
 */
async function executePostgresQuery(sql, params = []) {
  let paramIdx = 1;
  // Convert ? placeholders to $1, $2...
  let pgSql = sql.replace(/\?/g, () => `$${paramIdx++}`);
  
  // Replace double quotes in standard SQL values (e.g., event_type = "pageview") to single quotes
  pgSql = pgSql.replace(/=\s*"([^"]+)"/g, "='$1'");

  const trimmed = pgSql.trim().toUpperCase();
  const isInsert = trimmed.startsWith('INSERT INTO');
  const isUpdateOrDelete = trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE');

  if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }

  // Sanitize params: ensure NaN is converted to 0, undefined to null
  const cleanParams = params.map(p => {
    if (typeof p === 'number' && Number.isNaN(p)) return 0;
    if (p === undefined) return null;
    return p;
  });

  const result = await dbClient.query(pgSql, cleanParams);

  if (isInsert) {
    const insertId = result.rows && result.rows[0] ? result.rows[0].id : Date.now();
    return [{ insertId, affectedRows: result.rowCount }];
  }

  if (isUpdateOrDelete) {
    return [{ affectedRows: result.rowCount }];
  }

  // SELECT query: normalize row keys so count aliases (e.g. totalProjects) are accessible in all common casings
  const rows = result.rows.map(row => {
    const copy = { ...row };
    for (const key of Object.keys(row)) {
      const lower = key.toLowerCase();
      if (lower !== key && !(lower in copy)) {
        copy[lower] = row[key];
      }
      if (lower === 'totalprojects') copy.totalProjects = Number(row[key]);
      if (lower === 'totalskills') copy.totalSkills = Number(row[key]);
      if (lower === 'totalexperience') copy.totalExperience = Number(row[key]);
      if (lower === 'totaleducation') copy.totalEducation = Number(row[key]);
      if (lower === 'totalmessages') copy.totalMessages = Number(row[key]);
      if (lower === 'unreadmessages') copy.unreadMessages = Number(row[key]);
      if (lower === 'totalviews') copy.totalViews = Number(row[key]);
      if (lower === 'projectclicks') copy.projectClicks = Number(row[key]);
      if (lower === 'count') copy.count = Number(row[key]);
    }
    return copy;
  });

  return [rows];
}

/**
 * Execute query on MySQL
 */
async function executeMySqlQuery(sql, params = []) {
  const normalizedSql = sql.replace(/=\s*"([^"]+)"/g, "='$1'");
  const [result, fields] = await dbClient.query(normalizedSql, params);

  if (Array.isArray(result)) {
    const normalizedRows = result.map(row => {
      const copy = { ...row };
      if ('count' in copy) copy.count = Number(copy.count);
      if ('totalProjects' in copy) copy.totalProjects = Number(copy.totalProjects);
      if ('totalSkills' in copy) copy.totalSkills = Number(copy.totalSkills);
      if ('totalExperience' in copy) copy.totalExperience = Number(copy.totalExperience);
      if ('totalEducation' in copy) copy.totalEducation = Number(copy.totalEducation);
      if ('totalMessages' in copy) copy.totalMessages = Number(copy.totalMessages);
      if ('unreadMessages' in copy) copy.unreadMessages = Number(copy.unreadMessages);
      if ('totalViews' in copy) copy.totalViews = Number(copy.totalViews);
      if ('projectClicks' in copy) copy.projectClicks = Number(copy.projectClicks);
      return copy;
    });
    return [normalizedRows, fields];
  }

  return [result, fields];
}

/**
 * High performance JSON Relational SQL emulator for offline mode
 */
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
        if (whereClause.includes('EVENT_TYPE = \'PAGEVIEW\'') || whereClause.includes('EVENT_TYPE = "PAGEVIEW"')) {
          rows = rows.filter(r => r.event_type === 'pageview');
        }
        if (whereClause.includes('EVENT_TYPE = \'PROJECT_CLICK\'') || whereClause.includes('EVENT_TYPE = "PROJECT_CLICK"')) {
          rows = rows.filter(r => r.event_type === 'project_click');
        }
      }
      const countVal = rows.length;
      return [[{
        [countKey]: countVal,
        [countKey.toLowerCase()]: countVal,
        [countKey.toUpperCase()]: countVal,
        totalProjects: countVal,
        totalSkills: countVal,
        totalExperience: countVal,
        totalEducation: countVal,
        totalMessages: countVal,
        unreadMessages: countVal,
        totalViews: countVal,
        projectClicks: countVal,
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
    } else if (upper.includes('WHERE FILENAME = ?')) {
      rows = rows.filter(r => String(r.filename) === String(params[0]));
    } else if (upper.includes('WHERE IS_FEATURED >=')) {
      rows = rows.filter(r => (Number(r.is_featured) || 0) >= 0);
    }

    // ORDER BY
    if (upper.includes('ORDER BY DISPLAY_ORDER ASC')) {
      rows.sort((a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0));
    } else if (upper.includes('ORDER BY CREATED_AT DESC') || upper.includes('ORDER BY START_DATE DESC') || upper.includes('ORDER BY START_YEAR DESC')) {
      rows.sort((a, b) => new Date(b.created_at || b.start_date || b.start_year || 0) - new Date(a.created_at || a.start_date || a.start_year || 0));
    }

    // LIMIT
    if (upper.includes('LIMIT 1')) {
      rows = rows.slice(0, 1);
    } else if (upper.includes('LIMIT 5')) {
      rows = rows.slice(0, 5);
    }

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

// --- Schema Initializers ---

async function createPostgresTables() {
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS portfolio_settings (
      id SERIAL PRIMARY KEY,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      full_description TEXT,
      image_url VARCHAR(500),
      category VARCHAR(100) DEFAULT 'Web',
      status VARCHAR(50) DEFAULT 'Completed',
      technologies TEXT,
      github_url VARCHAR(500),
      live_url VARCHAR(500),
      is_featured INT DEFAULT 1,
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      category VARCHAR(100) DEFAULT 'Frontend',
      icon VARCHAR(100) DEFAULT 'Code',
      proficiency INT DEFAULT 90,
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS education (
      id SERIAL PRIMARY KEY,
      institution VARCHAR(255) NOT NULL,
      degree VARCHAR(255) NOT NULL,
      course VARCHAR(255),
      start_year INT,
      end_year INT,
      description TEXT,
      logo_url VARCHAR(500),
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(100) DEFAULT 'Layers',
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS social_links (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(100) NOT NULL,
      url VARCHAR(500) NOT NULL,
      icon VARCHAR(100) DEFAULT 'Globe',
      display_order INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(100) DEFAULT 'pageview',
      page VARCHAR(255) DEFAULT '/',
      project_id INT,
      referrer VARCHAR(500),
      ip_hash VARCHAR(255),
      user_agent VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      user_agent VARCHAR(500),
      ip_address VARCHAR(100),
      expires_at VARCHAR(100) NOT NULL,
      last_active_at VARCHAR(100),
      is_revoked INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS uploads (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      original_name VARCHAR(255),
      mime_type VARCHAR(100) NOT NULL,
      file_data TEXT NOT NULL,
      size INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe non-destructive column additions for existing persistent databases
  try {
    await dbClient.query(`
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS logo_text VARCHAR(100) DEFAULT 'MS.dev';
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS years_experience INT DEFAULT 5;
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS projects_completed INT DEFAULT 24;
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS satisfied_clients INT DEFAULT 18;
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS about_heading VARCHAR(255);
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS about_bio TEXT;
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS about_description TEXT;
      ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS hire_me_text VARCHAR(100) DEFAULT 'Hire Me';
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Completed';
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS full_description TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured INT DEFAULT 1;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS is_current INT DEFAULT 0;
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS technologies TEXT;
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
      ALTER TABLE experience ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
      ALTER TABLE education ADD COLUMN IF NOT EXISTS course VARCHAR(255);
      ALTER TABLE education ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
      ALTER TABLE education ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
      ALTER TABLE social_links ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 1;
    `);
  } catch (e) {
    // Non-blocking schema evolution
  }
}

async function createMySqlTables() {
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
      status VARCHAR(50) DEFAULT 'Completed',
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
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      user_agent VARCHAR(500),
      ip_address VARCHAR(100),
      expires_at VARCHAR(100) NOT NULL,
      last_active_at VARCHAR(100),
      is_revoked INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      original_name VARCHAR(255),
      mime_type VARCHAR(100) NOT NULL,
      file_data LONGTEXT NOT NULL,
      size INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/**
 * Idempotent Seed Logic for PostgreSQL / MySQL
 * Only seeds when table has 0 rows. Never overwrites or resets existing data.
 */
async function seedDatabaseTables() {
  console.log('[DB Seed] Checking database tables for initial setup...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saeed.dev';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@2026!';

  // 1. Users
  const [users] = await query('SELECT id FROM users LIMIT 1');
  if (!users || users.length === 0) {
    console.log(`[DB Seed] Initializing default admin user (${adminEmail})...`);
    const hashed = await bcrypt.hash(adminPass, 10);
    await query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [adminEmail, hashed, 'Muhammed Saeed', 'admin']);
  } else {
    console.log(`[DB Seed] Table "users" has ${users.length} user(s). Preserving existing credentials.`);
  }

  // 2. Portfolio Settings
  const [settings] = await query('SELECT id FROM portfolio_settings LIMIT 1');
  if (!settings || settings.length === 0) {
    console.log('[DB Seed] Table "portfolio_settings" is empty. Inserting baseline profile...');
    await query(
      `INSERT INTO portfolio_settings (
        developer_name, logo_text, hero_headline, hero_subtitle, bio,
        about_heading, about_bio, about_description, profile_image, email,
        phone, location, resume_url, github_url, linkedin_url, instagram_url,
        hire_me_text, years_experience, projects_completed, satisfied_clients
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        initialProfile.developer_name, initialProfile.logo_text, initialProfile.hero_headline, initialProfile.hero_subtitle, initialProfile.bio,
        initialProfile.about_heading, initialProfile.about_bio, initialProfile.about_description, initialProfile.profile_image, initialProfile.email,
        initialProfile.phone, initialProfile.location, initialProfile.resume_url, initialProfile.github_url, initialProfile.linkedin_url, initialProfile.instagram_url,
        initialProfile.hire_me_text, initialProfile.years_experience, initialProfile.projects_completed, initialProfile.satisfied_clients
      ]
    );
  } else {
    console.log('[DB Seed] Table "portfolio_settings" has existing data. Preserving without reset.');
  }

  // 3. Projects
  const [projects] = await query('SELECT id FROM projects LIMIT 1');
  if (!projects || projects.length === 0) {
    console.log(`[DB Seed] Table "projects" is empty. Seeding ${initialProjects.length} initial projects...`);
    for (const p of initialProjects) {
      await query(
        `INSERT INTO projects (title, slug, description, full_description, image_url, category, status, technologies, github_url, live_url, is_featured, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.title, p.slug, p.description, p.full_description, p.image_url, p.category, p.status || 'Completed', JSON.stringify(p.technologies), p.github_url, p.live_url, p.is_featured, p.display_order]
      );
    }
  } else {
    console.log('[DB Seed] Table "projects" has existing projects. Preserving without reset.');
  }

  // 4. Skills
  const [skills] = await query('SELECT id FROM skills LIMIT 1');
  if (!skills || skills.length === 0) {
    console.log(`[DB Seed] Table "skills" is empty. Seeding ${initialSkills.length} initial skills...`);
    for (const s of initialSkills) {
      await query('INSERT INTO skills (name, category, icon, proficiency, display_order) VALUES (?, ?, ?, ?, ?)', [s.name, s.category, s.icon, s.proficiency, s.display_order]);
    }
  } else {
    console.log('[DB Seed] Table "skills" has existing skills. Preserving without reset.');
  }

  // 5. Experience
  const [exp] = await query('SELECT id FROM experience LIMIT 1');
  if (!exp || exp.length === 0) {
    console.log(`[DB Seed] Table "experience" is empty. Seeding ${initialExperience.length} initial entries...`);
    for (const e of initialExperience) {
      await query(
        `INSERT INTO experience (company, position, location, start_date, end_date, is_current, description, technologies, logo_url, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.company, e.position, e.location, e.start_date, e.end_date, e.is_current, e.description, JSON.stringify(e.technologies), e.logo_url, e.display_order]
      );
    }
  } else {
    console.log('[DB Seed] Table "experience" has existing data. Preserving without reset.');
  }

  // 6. Education
  const [edu] = await query('SELECT id FROM education LIMIT 1');
  if (!edu || edu.length === 0) {
    console.log(`[DB Seed] Table "education" is empty. Seeding ${initialEducation.length} entries...`);
    for (const ed of initialEducation) {
      await query('INSERT INTO education (institution, degree, course, start_year, end_year, description, logo_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [ed.institution, ed.degree, ed.course, ed.start_year, ed.end_year, ed.description, ed.logo_url, ed.display_order]);
    }
  } else {
    console.log('[DB Seed] Table "education" has existing data. Preserving without reset.');
  }

  // 7. Services
  const [services] = await query('SELECT id FROM services LIMIT 1');
  if (!services || services.length === 0) {
    console.log(`[DB Seed] Table "services" is empty. Seeding ${initialServices.length} entries...`);
    for (const sv of initialServices) {
      await query('INSERT INTO services (title, description, icon, display_order) VALUES (?, ?, ?, ?)', [sv.title, sv.description, sv.icon, sv.display_order]);
    }
  } else {
    console.log('[DB Seed] Table "services" has existing data. Preserving without reset.');
  }

  // 8. Social Links
  const [social] = await query('SELECT id FROM social_links LIMIT 1');
  if (!social || social.length === 0) {
    console.log(`[DB Seed] Table "social_links" is empty. Seeding ${initialSocialLinks.length} entries...`);
    for (const sc of initialSocialLinks) {
      await query('INSERT INTO social_links (platform, url, icon, display_order) VALUES (?, ?, ?, ?)', [sc.platform, sc.url, sc.icon, sc.display_order]);
    }
  } else {
    console.log('[DB Seed] Table "social_links" has existing data. Preserving without reset.');
  }

  console.log('[DB Seed] All database tables verified successfully.');
}

/**
 * Idempotent Seed Logic for JSON File Store (Offline fallback)
 */
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
      status: p.status || 'Completed',
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

  if (!memStore.analytics) memStore.analytics = [];
  if (!memStore.sessions) memStore.sessions = [];
  if (!memStore.uploads) memStore.uploads = [];

  saveJsonDb();
  console.log('[DB File] Embedded database loaded and verified.');
}

/**
 * Persist uploaded file binary to database (upsert support)
 */
export async function saveUploadedFileToDb(filename, originalName, mimeType, buffer, size) {
  try {
    const base64Data = buffer.toString('base64');
    const [existing] = await query('SELECT id FROM uploads WHERE filename = ? LIMIT 1', [filename]);
    if (existing && existing.length > 0) {
      await query(
        'UPDATE uploads SET original_name = ?, mime_type = ?, file_data = ?, size = ? WHERE filename = ?',
        [originalName || filename, mimeType, base64Data, size || buffer.length, filename]
      );
    } else {
      await query(
        'INSERT INTO uploads (filename, original_name, mime_type, file_data, size) VALUES (?, ?, ?, ?, ?)',
        [filename, originalName || filename, mimeType, base64Data, size || buffer.length]
      );
    }
    console.log(`[Uploads Store] Persisted media file "${filename}" (${size || buffer.length} bytes) into persistent database.`);
  } catch (err) {
    console.error(`[Uploads Store] Failed to persist image to database:`, err.message);
  }
}

/**
 * Retrieve uploaded file binary from database
 */
export async function getUploadedFileFromDb(filename) {
  try {
    const [rows] = await query('SELECT filename, mime_type, file_data FROM uploads WHERE filename = ? LIMIT 1', [filename]);
    if (rows && rows.length > 0) {
      const mimeType = rows[0].mime_type || rows[0].mimetype || 'image/jpeg';
      const fileData = rows[0].file_data || rows[0].filedata;
      if (fileData) {
        return {
          filename: rows[0].filename,
          mimeType,
          buffer: Buffer.from(fileData, 'base64')
        };
      }
    }
  } catch (err) {
    console.warn(`[Uploads Store] Could not retrieve "${filename}" from database:`, err.message);
  }
  return null;
}

/**
 * Delete uploaded file record from database
 */
export async function deleteUploadedFileFromDb(filename) {
  try {
    await query('DELETE FROM uploads WHERE filename = ?', [filename]);
  } catch (err) {
    // Non-blocking
  }
}
