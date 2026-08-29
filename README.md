# 🚀 Muhammed Saeed — Developer Portfolio & Admin CMS (2026 Edition)

A high-performance, full-stack **Developer Portfolio** and centralized **Admin Content Management System (CMS)** built with **React**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, and **MySQL/Relational Database**.

Featuring a modern **2026 dark obsidian aesthetic**, **glassmorphism**, **ambient glowing gradients**, and **real-time dynamic content synchronization**—everything displayed on the public portfolio is 100% manageable through the protected Admin CMS without touching source code.

---

## 📸 Preview & Interfaces

- **Public Portfolio**: Modern developer portfolio with hero personal branding, floating interactive tech badges, categorized project showcase with case studies, skill proficiency meters, career roadmap, services grid, and live contact form.
- **Admin CMS Dashboard**: Secure administrative control center featuring traffic analytics (Recharts), Project CRUD with image uploader, Skills manager, Experience & Education timelines, Services manager, Client inquiries inbox, and central Settings.

---

## ⚡ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Glassmorphism & Glow Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) with JWT interceptors
- **Typography**: Google Fonts (*Outfit* & *JetBrains Mono*)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Authentication**: JWT (JSON Web Tokens) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **File Uploads**: [Multer](https://github.com/expressjs/multer) with secure MIME validation & automatic cleanup
- **Database**: Dual-Engine Architecture:
  - Primary: **MySQL 8.0+** (`mysql2/promise`) connection pool
  - Fallback: Zero-config **Embedded Relational Store** for instant local execution

---

## 🛠️ Features Breakdown

### 🌐 1. Public Portfolio
* **Hero Section**: Dynamic developer headline, customized avatar portrait with ambient glow, *"Explore Projects"* & *"Get In Touch"* CTA buttons, dynamic social links, and floating tech badges (*React 19, Next.js, GitHub, Rust & Node, AI & IoT*).
* **Profile Image CMS**: Managed directly through the CMS with instant preview, replacement, deletion, and fallback avatar support.
* **About Section**: Editable bio, story narrative, and dynamic statistics counters (*Years Experience, Projects Delivered, Happy Clients, System Uptime*).
* **Featured Projects Showcase**:
  * Category filter tabs (*All, Web, React, Backend, AI, IoT, Other*)
  * Rich project cards with technology pills, GitHub and Live Demo buttons
  * Interactive Case Study detail modal
* **Skills Matrix**: Categorized tech stack with animated percentage meters and modern icons.
* **Work Experience & Education Roadmap**: Chronological career timeline and academic certifications.
* **Services Bento Grid**: Offerings for Full-Stack Development, UI/UX Engineering, Database Architecture, and IoT Dashboards.
* **Working Contact Form**: Real-time client-side validation, database persistence, and instant feedback.
* **Footer**: Dynamic social links, copyright, and smooth back-to-top scroll.

---

### 🛡️ 2. Admin CMS Dashboard
* **Authentication**: Protected JWT session management with bcrypt password encryption.
* **Dashboard Overview**: KPI cards (*Total Views, Project Clicks, Inquiries, Active Projects*), interactive Recharts traffic analytics curves, and recent activity log.
* **Project Manager (CRUD)**: Create, edit, reorder, delete, and upload thumbnails with instant public portfolio updates.
* **Skills & Experience CMS**: Manage technical toolkits, proficiency sliders, and career milestones.
* **Education & Services CMS**: Manage degrees, coursework, and service offerings.
* **Messages & Inquiries Inbox**: Read, filter by unread/read, delete, and reply directly via email.
* **Portfolio Settings CMS**: Upload/preview/replace/delete profile photos, edit developer bio, hero headlines, contact info, social links, and update admin credentials.

---

## 📂 Project Directory Structure

```text
Portfholio/
├── client/                     # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin CMS components (Sidebar, Header, ImageUploader, Layout)
│   │   │   ├── public/         # Public portfolio components (Navbar, Hero, About, Projects, etc.)
│   │   ├── context/            # AuthContext & PortfolioContext
│   │   ├── pages/              # PublicPortfolio, AdminLogin, and Admin Manager pages
│   │   ├── services/           # Axios API client & asset URL helpers
│   │   ├── types/              # TypeScript data interfaces
│   │   ├── App.tsx             # Route registry
│   │   ├── index.css           # Glassmorphic utilities & design tokens
│   │   └── main.tsx            # App entry point
│   ├── index.html              # HTML shell & font definitions
│   ├── tailwind.config.js      # Tailwind theme extensions
│   ├── vite.config.ts          # Vite build config & proxy
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── config/             # Database connection (MySQL + Embedded) & Multer upload setup
│   │   ├── controllers/        # Auth, Public Portfolio, and Admin CRUD controllers
│   │   ├── middleware/         # JWT authentication & error handlers
│   │   ├── routes/             # API route definitions
│   │   └── server.js           # Main Express server entry point
│   ├── data/                   # Persistent data store
│   ├── uploads/                # Static image asset uploads directory
│   ├── .env                    # Environment variables
│   └── package.json
│
├── package.json                # Root orchestration scripts
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+)
- *(Optional)* MySQL Server (if not running, the application will automatically run using its embedded engine)

---

### Installation

1. **Clone or open the project repository**:
   ```bash
   cd Portfholio
   ```

2. **Install Server Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

---

### Running the Application

Open two terminal windows (or run simultaneously):

#### Terminal 1 — Start Backend Server (Port 5000)
```bash
cd server
npm start
# Server running at: http://localhost:5000
```

#### Terminal 2 — Start Frontend Client (Port 5173 / 3000)
```bash
cd client
npm run dev
# Frontend running at: http://localhost:5173
```

---

## 🔑 Admin Portal & Security

Your admin credentials are managed privately via environment variables in `server/.env` (and your cloud hosting environment):

- **Admin Login Portal**: `/admin/login`
- **Environment Variables**:
  - `ADMIN_EMAIL`: Your private administrator email (e.g. `admin@saeed.dev` or your personal email)
  - `ADMIN_PASSWORD`: Your secret administrator password

> **Security Note**: Never commit your `.env` file containing your real password to GitHub. When deploying to Render/Railway, set your secret `ADMIN_PASSWORD` and `ADMIN_EMAIL` inside your cloud hosting dashboard under **Environment Variables** where it is encrypted and private.

---

## 🔌 API Endpoints Reference

### Public API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/public/portfolio` | Retrieve full public portfolio data (Profile, Projects, Skills, Timeline, Services, Socials) |
| `POST` | `/api/public/contact` | Submit contact form message |
| `POST` | `/api/public/track-click` | Track project click interaction for analytics |

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Admin login and JWT token generation |
| `GET` | `/api/auth/me` | Verify authenticated session |
| `PUT` | `/api/auth/password` | Update admin password |

### Admin CMS (Protected via `Bearer <JWT_TOKEN>`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Retrieve dashboard KPI counts & traffic time series |
| `GET` / `PUT` | `/api/admin/settings` | Get / update central portfolio settings & profile photo |
| `GET` / `POST` | `/api/admin/projects` | List all projects / create new project |
| `PUT` / `DELETE` | `/api/admin/projects/:id` | Update / delete specific project |
| `GET` / `POST` | `/api/admin/skills` | List / create skills |
| `PUT` / `DELETE` | `/api/admin/skills/:id` | Update / delete specific skill |
| `GET` / `POST` | `/api/admin/experience` | List / add experience timeline entries |
| `PUT` / `DELETE` | `/api/admin/experience/:id` | Update / delete experience entry |
| `GET` / `POST` | `/api/admin/education` | List / add education records |
| `PUT` / `DELETE` | `/api/admin/education/:id` | Update / delete education record |
| `GET` / `POST` | `/api/admin/services` | List / create service offerings |
| `PUT` / `DELETE` | `/api/admin/services/:id` | Update / delete service offering |
| `GET` | `/api/admin/messages` | View client contact messages inbox |
| `PATCH` | `/api/admin/messages/:id` | Mark message as read/unread |
| `DELETE` | `/api/admin/messages/:id` | Delete message |
| `POST` | `/api/admin/upload` | Upload image file (Multer) |

---

## 🎨 Design Tokens & Aesthetic Reference

| Token | Value | Visual Purpose |
| :--- | :--- | :--- |
| **Dark Background** | `#070A0F` | Deep obsidian canvas |
| **Surface Glass** | `rgba(13, 19, 31, 0.65)` | Frosted glass cards (`backdrop-filter: blur(18px)`) |
| **Border Luminous** | `rgba(255, 255, 255, 0.08)` | Subtle translucent card outlines |
| **Primary Cyan** | `#00F5D4` | Primary brand glow, active indicators & CTA buttons |
| **Secondary Violet** | `#A855F7` | Secondary accents, charts & badges |
| **Font Sans** | `Outfit`, `Inter` | Clean modern sans-serif typography |
| **Font Mono** | `JetBrains Mono` | Technical code badges & numeric counters |

---

## 📦 Production Deployment

### Build Frontend
```bash
cd client
npm run build
```
Generates an optimized production bundle in `client/dist/`.

### Run in Production
Deploy the backend with Node.js / PM2 / Docker, and serve the frontend via Vercel, Netlify, or Nginx with API reverse proxy.

---

## 📄 License
MIT License © 2026 **Muhammed Saeed**. All rights reserved.
