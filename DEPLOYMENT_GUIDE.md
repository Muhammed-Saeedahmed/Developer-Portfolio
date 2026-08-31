# 🚀 Cloud Deployment Guide — Muhammed Saeed Portfolio + Admin CMS

Follow these simple steps to deploy your full-stack application with **persistent cloud database storage** on **Render.com** (or **Railway.app**).

---

## 🌟 Method 1: Deploy on Render.com (Recommended — 100% Free with Persistent Database)

Render allows you to host both the React frontend and Express backend under a single free URL with automatic HTTPS, continuous deployment from GitHub, and a persistent managed PostgreSQL database.

### Step 1: Push Your Code to GitHub

Open a terminal in your project root (`d:\Portfholio`) and run:

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit files
git commit -m "Fix: Render data persistence and database architecture"

# 4. Rename main branch
git branch -M main

# 5. Link to your GitHub repository (create a new repo on github.com first)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Step 2: Deploy on Render (Blueprint Deployment)

1. Go to [https://render.com](https://render.com) and log in with your GitHub account.
2. Click **New +** in the top right corner → select **Blueprint**.
3. Connect your GitHub repository.
4. Render will automatically read `render.yaml` and configure:
   * **Web Service**: `muhammed-saeed-portfolio` (Frontend + Backend)
   * **Database**: `portfolio-db` (Persistent Managed PostgreSQL)
   * **Automatic Link**: `DATABASE_URL` is automatically bound from the database to your web service!
5. Fill in the environment variables when prompted:
   * `ADMIN_EMAIL` = `your_secret_admin_email@example.com`
   * `ADMIN_PASSWORD` = `your_secret_strong_password`
   * `ADMIN_NOTIFICATION_EMAIL` = `patel.muhammed.saeedahmed@gmail.com`
   * *(Optional for live Gmail alerts)*:
     * `SMTP_HOST` = `smtp.gmail.com`
     * `SMTP_PORT` = `587`
     * `SMTP_USER` = `patel.muhammed.saeedahmed@gmail.com`
     * `SMTP_PASS` = `your_16_digit_gmail_app_password`
6. Click **Apply**! 🚀

---

### Step 3: Deploy via Standard Web Service (Alternative)

If you create the Web Service manually on Render:
1. Click **New +** → **PostgreSQL** → Name it `portfolio-db` → Plan: **Free** → Click **Create Database**.
2. Copy the **Internal Database URL** (or External Database URL).
3. Click **New +** → **Web Service** → Connect your repository.
4. Settings:
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Plan**: `Free`
5. In **Environment Variables**, add:
   * `NODE_ENV` = `production`
   * `DATABASE_URL` = paste the Database URL copied in step 2
   * `JWT_SECRET` = `any_random_secure_secret_key_2026`
   * `ADMIN_EMAIL` = `your_admin_email@example.com`
   * `ADMIN_PASSWORD` = `your_admin_password`
   * `ADMIN_NOTIFICATION_EMAIL` = `patel.muhammed.saeedahmed@gmail.com`

---

---

## 🚂 Method 2: Use Free Permanent Cloud Databases (Recommended for Long-Term Hosting)

> [!NOTE]
> **Render Free PostgreSQL databases expire after 30 days**. If you resume your service after 30 days and Render deleted the database, our zero-crash fallback automatically keeps your website online. For a **permanent 100% free cloud database that never expires**, you can use any of these providers:

### Option A: Neon.tech (PostgreSQL — Free Forever)
1. Go to [https://neon.tech](https://neon.tech) and create a free account.
2. Create a project named `portfolio-db`.
3. Copy the **Connection String** (e.g., `postgresql://username:password@ep-xyz.neon.tech/neondb?sslmode=require`).
4. In your Render Dashboard → Web Service → **Environment** tab:
   * Set `DATABASE_URL` = `your_neon_connection_string`
5. Save Changes — Render will automatically redeploy and connect!

### Option B: Supabase (PostgreSQL — Free Forever)
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Go to **Project Settings** → **Database** → **Connection string** (URI).
3. In Render Dashboard → **Environment**, set `DATABASE_URL` = your Supabase URI.

### Option C: TiDB Cloud (MySQL — Free Forever)
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and create a free Serverless MySQL cluster.
2. Copy the MySQL connection string (e.g., `mysql://user:pass@gateway.tidbcloud.com:4000/portfolio_cms_db?ssl={"rejectUnauthorized":true}`).
3. In Render Dashboard → **Environment**, set `DATABASE_URL` = your TiDB connection string.

---

## 🔒 Multi-Engine & Zero-Crash Architecture

- **Automatic Multi-Engine Support**: Supports both **PostgreSQL** (`postgres://...`) and **MySQL** (`mysql://...`) seamlessly with automatic table creation and column migrations.
- **Zero-Crash Guarantee**: If no external database is connected or if a cloud database temporarily goes offline, the server gracefully boots in **Embedded Local Database Mode** (`data/portfolio_db.json`), ensuring your website and admin portal **never crash on startup**.
- **Instant Deployment**: Render will always report your service healthy (200 OK), and all new commits and frontend/backend code updates deploy immediately.
- **Media & Upload Persistence**: Profile avatars and project images are saved as binary records directly inside the database (`uploads` table), keeping them permanent across server restarts.
- **Safe Seeding**: Database tables only seed initial baseline content if they are completely empty (`0 rows`), preserving all your custom edits.

---

## 🔑 Live Admin Portal Access

Once deployed, your admin portal is located at:
* **URL**: `https://your-deployed-url.onrender.com/admin/login`
* **Email**: Whatever you entered in `ADMIN_EMAIL` on your Render dashboard (default: `admin@saeed.dev`)
* **Password**: Whatever you entered in `ADMIN_PASSWORD` on your Render dashboard (default: `Admin@2026!`)
