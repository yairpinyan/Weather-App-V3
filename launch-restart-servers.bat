@echo off
echo ========================================
echo    Weather App - Server Restart Tool
echo ========================================
echo.
echo Launching PowerShell script...
echo.

:: Launch PowerShell with execution policy bypass
powershell -ExecutionPolicy Bypass -File "restart-servers.ps1"

:: Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo An error occurred. Press any key to close...
    pause >nul
)
