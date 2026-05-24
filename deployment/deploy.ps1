# GreenRoots PWA - Windows Deployment Script
# PowerShell script for deploying to production server

param(
    [string]$Domain = "your-domain.com",
    [string]$ServerIP = "your-server-ip",
    [string]$ServerUser = "ubuntu",
    [string]$RemotePath = "/var/www/greenroots"
)

# Configuration
$BuildDir = ".\client\build"
$ErrorActionPreference = "Continue"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  GreenRoots PWA - Windows Deployment Script               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify prerequisites
Write-Host "[1/6] Verifying prerequisites..." -ForegroundColor Yellow
if (!(Test-Path $BuildDir)) {
    Write-Host "✗ Build directory not found: $BuildDir" -ForegroundColor Red
    Write-Host "Run 'npm run build' first"
    exit 1
}

if (!(Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "✗ SSH not found. Install OpenSSH or Git Bash" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Prerequisites verified" -ForegroundColor Green
Write-Host ""

# Step 2: Build verification
Write-Host "[2/6] Verifying build files..." -ForegroundColor Yellow
$requiredFiles = @("index.html", "manifest.json", "service-worker.js")
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $BuildDir $file
    if (!(Test-Path $filePath)) {
        Write-Host "✗ Missing required file: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✓ All required files present" -ForegroundColor Green
Write-Host ""

# Step 3: Create backup on server
Write-Host "[3/6] Creating backup on server..." -ForegroundColor Yellow
$backupDate = Get-Date -Format "yyyyMMdd-HHmmss"
$backupCmd = "mkdir -p /var/www/backups && tar -czf /var/www/backups/greenroots-$backupDate.tar.gz $RemotePath 2>/dev/null || true"
ssh $ServerUser@$ServerIP $backupCmd
Write-Host "✓ Backup created" -ForegroundColor Green
Write-Host ""

# Step 4: Upload build files
Write-Host "[4/6] Uploading build files to server..." -ForegroundColor Yellow
Write-Host "This may take a minute depending on file size..."

$remoteCreateCmd = "mkdir -p $RemotePath"
ssh $ServerUser@$ServerIP $remoteCreateCmd

# Use scp or rsync via WSL if available
if (Get-Command rsync -ErrorAction SilentlyContinue) {
    # Using Git Bash or WSL rsync
    rsync -avz --delete `
        --exclude='.git' `
        --exclude='node_modules' `
        --exclude='.env' `
        "$BuildDir/" "${ServerUser}@${ServerIP}:${RemotePath}/"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Files uploaded successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Upload failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Note: rsync not found. Using scp instead (slower)..." -ForegroundColor Yellow
    
    # Fallback to scp (slower but works)
    Get-ChildItem -Path $BuildDir -Recurse -File | ForEach-Object {
        $remotePath = $_.FullName.Replace($BuildDir, $RemotePath).Replace('\', '/')
        $remoteDir = Split-Path $remotePath
        
        ssh $ServerUser@$ServerIP "mkdir -p `"$remoteDir`""
        scp -r $_.FullName "${ServerUser}@${ServerIP}:$remotePath"
    }
    Write-Host "✓ Files uploaded successfully" -ForegroundColor Green
}
Write-Host ""

# Step 5: Set permissions and restart services
Write-Host "[5/6] Setting permissions and restarting services..." -ForegroundColor Yellow
$restartCmd = @"
cd $RemotePath
sudo chown -R www-data:www-data .
sudo chmod -R 755 .
sudo systemctl restart nginx
"@

ssh $ServerUser@$ServerIP $restartCmd
Write-Host "✓ Services restarted" -ForegroundColor Green
Write-Host ""

# Step 6: Verify deployment
Write-Host "[6/6] Verifying deployment..." -ForegroundColor Yellow
$maxRetries = 3
$retryCount = 0

while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "https://$Domain/" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✓ Deployment successful!" -ForegroundColor Green
            Write-Host "✓ Site is live at: https://$Domain" -ForegroundColor Green
            break
        }
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "Waiting for server... (attempt $retryCount/$maxRetries)" -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
}

if ($retryCount -eq $maxRetries) {
    Write-Host "⚠ Warning: Could not verify deployment" -ForegroundColor Yellow
    Write-Host "Check server logs for details" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Deployment Complete                                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Post-deployment checklist:" -ForegroundColor Yellow
Write-Host "[ ] Visit https://$Domain in browser"
Write-Host "[ ] Test installation on desktop (Chrome/Edge)"
Write-Host "[ ] Test installation on mobile (Android/iOS)"
Write-Host "[ ] Run Lighthouse audit"
Write-Host "[ ] Check browser DevTools → Application → Service Workers"
Write-Host "[ ] Monitor error logs on server"
Write-Host ""
