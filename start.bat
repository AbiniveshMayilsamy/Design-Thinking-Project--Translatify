@echo off
echo ============================================
echo   AI Audio ^& Video Translation System
echo ============================================
echo.
echo Starting Backend (Flask + ML)...
start "Backend - Flask ML" cmd /k "cd /d %~dp0backend && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend (React + Vite)...
start "Frontend - React" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 4 /nobreak >nul

echo.
echo  Backend  : http://localhost:5000
echo  Frontend : http://localhost:3000
echo.
start http://localhost:3000
