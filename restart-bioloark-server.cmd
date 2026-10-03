@echo off
setlocal

title Bioloark Server Launcher
set "PROJECT_DIR=C:\Users\AVIDAM\Documents\ChatGPT\bioloark site\bioloark"
set "NODE_DIR=C:\Users\AVIDAM\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "VINEXT_CMD=%PROJECT_DIR%\node_modules\.bin\vinext.cmd"
set "PATH=%NODE_DIR%;%PATH%"

cd /d "%PROJECT_DIR%"

echo Restarting Bioloark development server...

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$connections = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue;" ^
  "$processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique;" ^
  "foreach ($processId in $processIds) { Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue }"

timeout /t 2 /nobreak >nul

start "Bioloark Dev Server" cmd.exe /k call "%VINEXT_CMD%" dev

echo Waiting for the site to start...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000/"

echo Bioloark server was restarted.
timeout /t 2 /nobreak >nul
endlocal
