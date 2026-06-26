@echo off
echo Starting backend server and Cloudflare tunnel...
echo.

start "Backend Server" cmd /k "cd /d d:\Projects Phase 3\YouTube-Video-Summarizer\backend && uvicorn app:app --reload"

timeout /t 3 /nobreak > nul

echo Backend started. Starting Cloudflare tunnel...
echo.

"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:8000

pause
