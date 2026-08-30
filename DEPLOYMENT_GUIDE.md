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

## 🚂 Method 2: Use External Cloud Databases (Supabase / Neon / TiDB Cloud)

You can also use any free cloud database provider with Render:
- **Supabase / Neon** (PostgreSQL): Set `DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require`
- **TiDB Cloud / Aiven / Railway** (MySQL): Set `DATABASE_URL=mysql://user:pass@host:3306/dbname`

---

## 🔒 Data Persistence & Restart Guarantee

- **Database Source of Truth**: All CMS changes (Bio, Experience, Skills, Projects, Status, Services, Settings) are saved directly into the persistent PostgreSQL/MySQL database.
- **Render Restarts**: When Render spins down or restarts, the application reconnects to the database and preserves all user content with zero loss.
- **Media / Image Uploads**: Uploaded profile images and project photos are saved directly into the persistent database `uploads` table, ensuring they survive container restarts seamlessly.
- **Safe Seeding**: Seeding only runs once on empty tables (`count === 0`). Existing CMS data is never dropped, truncated, or overwritten.

---

## 🔑 Live Admin Portal Access

Once deployed, your admin portal is located at:
* **URL**: `https://your-deployed-url.onrender.com/admin/login`
* **Email**: Whatever you entered in `ADMIN_EMAIL` on your Render dashboard
* **Password**: Whatever you entered in `ADMIN_PASSWORD` on your Render dashboard
