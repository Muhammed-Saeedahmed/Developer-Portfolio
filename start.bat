@echo off
title Portfolio + Admin CMS Launcher
echo ===================================================
echo   Starting Developer Portfolio + Admin CMS
echo ===================================================
echo.

start "Portfolio Backend Server (Port 5000)" cmd /k "cd server && npm start"
start "Portfolio Frontend Client (Port 5173)" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting up:
echo   - Public Portfolio: http://localhost:5173
echo   - Admin CMS Login:  http://localhost:5173/admin/login
echo.
echo Press any key to open the portfolio in your browser...
pause >nul
start http://localhost:5173
