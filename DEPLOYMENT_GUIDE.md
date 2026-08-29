# 🚀 Cloud Deployment Guide — Muhammed Saeed Portfolio + Admin CMS

Follow these simple steps to deploy your full-stack application for **free** on **Render.com** (or **Railway.app**).

---

## 🌟 Method 1: Deploy on Render.com (Recommended — 100% Free)

Render allows you to host both the React frontend and Express backend together under a single free URL with automatic HTTPS and continuous deployment from GitHub.

### Step 1: Push Your Code to GitHub

Open a terminal in your project root (`d:\Portfholio`) and run:

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit files
git commit -m "Deploy: Full-Stack Developer Portfolio + Admin CMS"

# 4. Rename main branch
git branch -M main

# 5. Link to your GitHub repository (create a new repo on github.com first)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git

# 6. Push code to GitHub
git push -u origin main
```

---

### Step 2: Deploy on Render

1. Go to [https://render.com](https://render.com) and sign up/log in with your GitHub account.
2. Click **New +** in the top right corner → select **Web Service**.
3. Connect your GitHub repository (`YOUR_REPOSITORY_NAME`).
4. Configure the service settings (or Render will automatically detect `render.yaml`):
   * **Name**: `muhammed-saeed-portfolio` (or your choice)
   * **Language / Environment**: `Node`
   * **Branch**: `main`
   * **Build Command**: `npm run build`
   * **Start Command**: `npm start`
   * **Plan**: `Free`

5. **Environment Variables**:
   Under **Environment Variables**, add:
   * `NODE_ENV` = `production`
   * `JWT_SECRET` = `any_random_secure_secret_key_2026`
   * `ADMIN_EMAIL` = `your_secret_admin_email@example.com`
   * `ADMIN_PASSWORD` = `your_secret_strong_password`
   * `ADMIN_NOTIFICATION_EMAIL` = `patel.muhammed.saeedahmed@gmail.com`
   * *(Optional for live Gmail forwarding)*:
     * `SMTP_HOST` = `smtp.gmail.com`
     * `SMTP_PORT` = `587`
     * `SMTP_USER` = `patel.muhammed.saeedahmed@gmail.com`
     * `SMTP_PASS` = `your_16_digit_gmail_app_password`

6. Click **Deploy Web Service**! 🚀

Within 2–3 minutes, Render will build your React frontend, initialize your backend server, and give you a live production URL like:
👉 `https://muhammed-saeed-portfolio.onrender.com`

---

## 🚂 Method 2: Deploy on Railway.app

1. Go to [https://railway.app](https://railway.app) and log in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your portfolio repository.
4. Click **Add Variables** and set:
   * `NODE_ENV` = `production`
   * `JWT_SECRET` = `saeed_portfolio_jwt_secret_2026`
   * `ADMIN_NOTIFICATION_EMAIL` = `patel.muhammed.saeedahmed@gmail.com`
5. Go to **Settings** → **Networking** → Click **Generate Domain**.
6. Your site is live instantly!

---

## 🔑 Your Live Production Admin Access

Once deployed, your admin portal is located at:
* **URL**: `https://your-deployed-url.onrender.com/admin/login`
* **Email**: Whatever you entered in `ADMIN_EMAIL` on your Render dashboard
* **Password**: Whatever you entered in `ADMIN_PASSWORD` on your Render dashboard

*(You can also update your password anytime in **Admin CMS → Settings → Security** after logging in).*
