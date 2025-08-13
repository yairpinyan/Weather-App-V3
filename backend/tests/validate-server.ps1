# Check if server is running
$serverCheck = $null
try {
    $serverCheck = Invoke-WebRequest -Uri "http://localhost:5000/api/weather/London" -Method GET -TimeoutSec 5
} catch {
    Write-Host "Server is not running. Starting server..."
    Start-Process powershell -ArgumentList "cd $PSScriptRoot\..; npm run dev" -NoNewWindow
    
    # Wait for server to start (max 30 seconds)
    $attempts = 0
    $maxAttempts = 6
    do {
        Start-Sleep -Seconds 5
        $attempts++
        try {
            $serverCheck = Invoke-WebRequest -Uri "http://localhost:5000/api/weather/London" -Method GET -TimeoutSec 5
            break
        } catch {
            Write-Host "Waiting for server to start... Attempt $attempts of $maxAttempts"
        }
    } while ($attempts -lt $maxAttempts)
}

if ($serverCheck.StatusCode -eq 200) {
    Write-Host "Server is running! Starting tests..."
    # Run the tests
    npm test
} else {
    Write-Host "Failed to start server. Please check for errors and try again."
    exit 1
} 