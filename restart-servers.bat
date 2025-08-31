@echo off
echo ========================================
echo    Weather App - Server Restart Tool
echo ========================================
echo.

:: Function to check and kill processes on a specific port
:checkAndKillPort
set port=%1
echo Checking port %port%...

:: Method 1: Find and kill by PID from netstat
for /f "tokens=5" %%a in ('netstat -aon ^| find ":%port%" ^| find "LISTENING"') do (
    set pid=%%a
    echo Found process %pid% on port %port%
    echo Attempting to kill process %pid%...
    
    :: Try to kill the process
    taskkill /f /pid %pid% >nul 2>&1
    if errorlevel 1 (
        echo Process %pid% killed successfully
    ) else (
        echo Failed to kill process %pid%, trying alternative methods...
        
        :: Method 2: Try to kill by port using netstat again
        for /f "tokens=5" %%b in ('netstat -aon ^| find ":%port%" ^| find "LISTENING"') do (
            echo Trying to kill process %%b...
            taskkill /f /f /pid %%b >nul 2>&1
        )
        
        :: Method 3: Kill all node processes (for backend)
        if %port%==5000 (
            echo Killing all Node.js processes...
            taskkill /f /im node.exe >nul 2>&1
        )
        
        :: Method 4: Kill all yarn processes (for frontend)
        if %port%==5173 (
            echo Killing all Yarn processes...
            taskkill /f /im yarn.exe >nul 2>&1
            taskkill /f /im node.exe >nul 2>&1
        )
    )
)

:: Wait a moment for processes to fully terminate
timeout /t 3 /nobreak >nul

:: Verify port is free
for /f "tokens=5" %%a in ('netstat -aon ^| find ":%port%" ^| find "LISTENING"') do (
    echo Port %port% is still in use by PID %%a, trying force kill...
    taskkill /f /pid %%a >nul 2>&1
)

echo Port %port% should now be free.
goto :eof

:: Check and kill backend server (port 5000)
echo [1/4] Checking and killing backend server (port 5000)...
call :checkAndKillPort 5000

:: Check and kill frontend server (port 5173)
echo [2/4] Checking and killing frontend server (port 5173)...
call :checkAndKillPort 5173

:: Additional cleanup - kill any remaining processes
echo [2.5/4] Additional cleanup...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im yarn.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

:: Wait for cleanup
timeout /t 2 /nobreak >nul

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
echo [3/4] Starting backend server...
cd backend
echo Building backend...
call npm run build >nul 2>&1
if errorlevel 1 (
    echo Warning: Backend build failed, trying to start anyway...
)
echo Starting backend server on port 5000...
start "Backend Server" cmd /k "npm start"
cd ..

:: Wait for backend to initialize
echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

:: Test backend
echo Testing backend connection...
curl -s http://localhost:5000/ >nul 2>&1
if errorlevel 1 (
    echo Warning: Backend might not be ready yet, continuing...
) else (
    echo Backend is responding!
)

:: Start frontend server
echo [4/4] Starting frontend server...
cd frontend
echo Starting frontend server on port 5173...
start "Frontend Server" cmd /k "yarn dev"
cd ..

:: Wait for frontend to initialize
echo Waiting for frontend to start...
timeout /t 10 /nobreak >nul

:: Test frontend
echo Testing frontend connection...
curl -s http://localhost:5173/ >nul 2>&1
if errorlevel 1 (
    echo Warning: Frontend might not be ready yet...
) else (
    echo Frontend is responding!
)

echo.
echo ========================================
echo           Server Status
echo ========================================
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Both servers should now be running!
echo.

:: Open the browser
echo Opening the app in your default browser...
start "" "http://localhost:5173"

echo.
echo Press any key to close this window...
pause >nul
