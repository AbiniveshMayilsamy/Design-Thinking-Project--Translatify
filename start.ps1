$backendPath = "d:\Design - Thinking\backend"
$frontendPath = "d:\Design - Thinking\frontend"

Write-Host "Starting Backend (Flask + ML)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; python app.py"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend (React + Vite)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev"

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "Backend  : http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend : http://localhost:3000" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:3000"
