# Weather App - Server Restart Tool (PowerShell Version)
# Run this script with: powershell -ExecutionPolicy Bypass -File "restart-servers.ps1"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Weather App - Server Restart Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Stop-ProcessOnPort {
    param([int]$Port)
    
    Write-Host "Checking port $Port..." -ForegroundColor Yellow
    
    # Get processes using the port
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                 Where-Object { $_.State -eq "Listen" } | 
                 ForEach-Object { Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue }
    
    if ($processes) {
        Write-Host "Found processes on port $Port" -ForegroundColor Red
        $processes | ForEach-Object {
            Write-Host "  - PID: $($_.Id), Name: $($_.ProcessName), Path: $($_.Path)" -ForegroundColor Red
        }
        
        # Kill all processes on this port
        $processes | ForEach-Object {
            Write-Host "Killing process $($_.Id) ($($_.ProcessName))..." -ForegroundColor Yellow
            try {
                Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
                Write-Host "Process $($_.Id) killed successfully" -ForegroundColor Green
            }
            catch {
                Write-Host "Failed to kill process $($_.Id): $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        
        # Wait for processes to terminate
        Start-Sleep -Seconds 2
        
        # Verify port is free
        $remainingProcesses = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                             Where-Object { $_.State -eq "Listen" }
        
        if ($remainingProcesses) {
            Write-Host "Port $Port is still in use, trying force kill..." -ForegroundColor Red
            $remainingProcesses | ForEach-Object {
                try {
                    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
                }
                catch {
                    Write-Host "Force kill failed for PID $($_.OwningProcess)" -ForegroundColor Red
                }
            }
        }
    } else {
        Write-Host "Port $Port is free" -ForegroundColor Green
    }
}

function Start-BackendServer {
    Write-Host "[3/4] Starting backend server..." -ForegroundColor Cyan
    
    if (-not (Test-Path "backend")) {
        Write-Host "Error: backend directory not found" -ForegroundColor Red
        return $false
    }
    
    Set-Location "backend"
    
    Write-Host "Building backend..." -ForegroundColor Yellow
    try {
        npm run build | Out-Null
        Write-Host "Backend build completed" -ForegroundColor Green
    }
    catch {
        Write-Host "Warning: Backend build failed, trying to start anyway..." -ForegroundColor Yellow
    }
    
    Write-Host "Starting backend server on port 5000..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd" -ArgumentList "/k", "npm start" -WindowStyle Normal
    
    Set-Location ".."
    
    # Wait for backend to start
    Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    
    # Test backend
    Write-Host "Testing backend connection..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Backend is responding! (Status: $($response.StatusCode))" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Warning: Backend might not be ready yet, continuing..." -ForegroundColor Yellow
        return $false
    }
}

function Start-FrontendServer {
    Write-Host "[4/4] Starting frontend server..." -ForegroundColor Cyan
    
    if (-not (Test-Path "frontend")) {
        Write-Host "Error: frontend directory not found" -ForegroundColor Red
        return $false
    }
    
    Set-Location "frontend"
    
    Write-Host "Starting frontend server on port 5173..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd" -ArgumentList "/k", "yarn dev" -WindowStyle Normal
    
    Set-Location ".."
    
    # Wait for frontend to start
    Write-Host "Waiting for frontend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Test frontend
    Write-Host "Testing frontend connection..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5173/" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "Frontend is responding! (Status: $($response.StatusCode))" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "Warning: Frontend might not be ready yet..." -ForegroundColor Yellow
        return $false
    }
}

# Main execution
try {
    # Step 1: Stop backend server
    Write-Host "[1/4] Checking and killing backend server (port 5000)..." -ForegroundColor Cyan
    Stop-ProcessOnPort -Port 5000
    
    # Step 2: Stop frontend server
    Write-Host "[2/4] Checking and killing frontend server (port 5173)..." -ForegroundColor Cyan
    Stop-ProcessOnPort -Port 5173
    
    # Additional cleanup
    Write-Host "[2.5/4] Additional cleanup..." -ForegroundColor Cyan
    Get-Process -Name "node", "yarn", "npm" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Killing $($_.ProcessName) process (PID: $($_.Id))..." -ForegroundColor Yellow
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
        catch {
            Write-Host "Failed to kill $($_.ProcessName) process" -ForegroundColor Red
        }
    }
    
    Start-Sleep -Seconds 2
    
    # Step 3: Start backend
    $backendStarted = Start-BackendServer
    
    # Step 4: Start frontend
    $frontendStarted = Start-FrontendServer
    
    # Summary
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "           Server Status" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host ""
    
    if ($backendStarted -and $frontendStarted) {
        Write-Host "Both servers are running successfully!" -ForegroundColor Green
    } elseif ($backendStarted) {
        Write-Host "Backend is running, frontend may need more time" -ForegroundColor Yellow
    } elseif ($frontendStarted) {
        Write-Host "Frontend is running, backend may need more time" -ForegroundColor Yellow
    } else {
        Write-Host "Servers may need more time to start up" -ForegroundColor Yellow
    }
    
    Write-Host ""
    
    # Open browser
    Write-Host "Opening the app in your default browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:5173"
    
    Write-Host ""
    Write-Host "Press any key to close this window..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
catch {
    Write-Host "An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Press any key to close this window..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}
