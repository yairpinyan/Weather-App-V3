@echo off
echo Starting Weather App Servers...

:: Kill any existing processes on ports 5000 and 5173 (if any)
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

:: Check if directories exist
if not exist "backend" (
    echo Error: backend directory not found
    echo Please make sure you're running this script from the correct location
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend directory not found
    echo Please make sure you're running this script from the correct location
    pause
    exit /b 1
)

:: Start backend server
echo Starting backend server...
cd backend
start cmd /k "npm run dev"

:: Wait for backend to initialize
timeout /t 5 /nobreak

:: Start frontend server
echo Starting frontend server...
cd ../frontend
start cmd /k "npm run dev"

:: Wait a bit for the frontend to start
timeout /t 8 /nobreak

echo.
echo Servers are starting...
echo Backend should be available at http://localhost:5000
echo Frontend should be available at http://localhost:5173
echo.

:: Open the browser in a new window
echo Opening the app in your default browser (new window)...
start "" /max "http://localhost:5173"

echo Press any key to close this window...
pause >nul 