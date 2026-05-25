# GreenRoots PWA - Local HTTPS Testing Setup (Windows PowerShell)
# Creates a local HTTPS server for testing PWA features

Write-Host ""
Write-Host "🔒 Setting up Local HTTPS Testing Environment..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate self-signed certificate
Write-Host "[1/4] Generating self-signed SSL certificate..." -ForegroundColor Yellow

$buildDir = "client\build"
$certDir = "$buildDir\certs"

# Create certificates directory
if (!(Test-Path $certDir)) {
    New-Item -ItemType Directory -Path $certDir | Out-Null
}

# Check if OpenSSL is available
if (!(Get-Command openssl -ErrorAction SilentlyContinue)) {
    Write-Host "❌ OpenSSL not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install options:" -ForegroundColor Yellow
    Write-Host "  1. Git Bash (comes with OpenSSL)"
    Write-Host "  2. Windows Subsystem for Linux (WSL)"
    Write-Host "  3. Download from: https://slproweb.com/products/Win32OpenSSL.html"
    Write-Host ""
    exit 1
}

# Generate private key and certificate
$certPath = "$certDir\cert.pem"
$keyPath = "$certDir\key.pem"

openssl req -x509 -newkey rsa:4096 -keyout $keyPath -out $certPath `
  -days 365 -nodes `
  -subj "/CN=localhost/O=GreenRoots/C=IN"

if ((Test-Path $certPath) -and (Test-Path $keyPath)) {
    Write-Host "✅ SSL certificate created:" -ForegroundColor Green
    Write-Host "   - Public: $certPath"
    Write-Host "   - Private: $keyPath"
} else {
    Write-Host "❌ Failed to create certificate" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Create HTTPS server
Write-Host "[2/4] Creating HTTPS test server..." -ForegroundColor Yellow

$httpsServerCode = @'
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const BUILD_DIR = __dirname;

// Read SSL certificates
const privateKey = fs.readFileSync(path.join(__dirname, 'certs/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certs/cert.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json'
};

// Request handler
const server = https.createServer(credentials, (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Set PWA headers
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Service Worker - no cache
  if (req.url === '/service-worker.js') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Service-Worker-Allowed', '/');
  }
  // Manifest - no cache
  else if (req.url === '/manifest.json') {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }
  // HTML - no cache
  else if (req.url === '/' || req.url.endsWith('.html')) {
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }
  // Static assets - long cache
  else if (/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/i.test(req.url)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Route handling
  let filePath = path.join(BUILD_DIR, req.url);

  // Prevent directory traversal
  if (!filePath.startsWith(BUILD_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if it's a directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // If file doesn't exist and it's not a known file, serve index.html (SPA routing)
  if (!fs.existsSync(filePath)) {
    // SPA routing: serve index.html for non-existent routes
    filePath = path.join(BUILD_DIR, 'index.html');
  }

  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗`);
  console.log(`║  🔒 HTTPS Test Server Started                          ║`);
  console.log(`╚════════════════════════════════════════════════════════╝\n`);
  console.log(`🌐 URL: https://localhost:${PORT}`);
  console.log(`\n⚠️  WARNING: Self-signed certificate`);
  console.log(`✅ In browser: Click "Advanced" → "Proceed to localhost"`);
  console.log(`✅ Service Worker will register after accepting certificate\n`);
  console.log(`📊 Features to test:`);
  console.log(`   - Service Worker registration (DevTools → Application)`);
  console.log(`   - Offline mode (DevTools → Network → Offline)`);
  console.log(`   - Installation (DevTools or browser menu)`);
  console.log(`   - Cache inspection (DevTools → Application → Cache Storage)\n`);
  console.log(`Press Ctrl+C to stop server\n`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
'@

$serverFile = "$buildDir\https-server.js"
Set-Content -Path $serverFile -Value $httpsServerCode

if (Test-Path $serverFile) {
    Write-Host "✅ HTTPS server created: https-server.js" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create server" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create verification script
Write-Host "[3/4] Creating test verification script..." -ForegroundColor Yellow

$verifyCode = @'
const https = require('https');
const fs = require('fs');

console.log('\n🧪 Verifying HTTPS Server...\n');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'HEAD',
  rejectUnauthorized: false // Allow self-signed cert
};

const req = https.request(options, (res) => {
  console.log('✅ Server responding');
  console.log(`   Status: ${res.statusCode}`);
  console.log(`   Headers: Cache-Control = ${res.headers['cache-control']}`);
  
  // Check service worker
  const swOptions = { ...options, path: '/service-worker.js' };
  const swReq = https.request(swOptions, (swRes) => {
    const cacheControl = swRes.headers['cache-control'];
    if (cacheControl && cacheControl.includes('no-cache')) {
      console.log('\n✅ Service Worker headers: CORRECT');
    } else {
      console.log('\n⚠️  Service Worker cache headers: ' + cacheControl);
    }
    process.exit(0);
  });

  swReq.on('error', (e) => {
    console.error('Error checking SW:', e.message);
    process.exit(1);
  });
  swReq.end();
});

req.on('error', (e) => {
  console.error('❌ Connection failed:', e.message);
  console.log('\nMake sure server is running: npm run https-test');
  process.exit(1);
});

req.setTimeout(3000, () => {
  console.error('❌ Request timeout');
  process.exit(1);
});

req.end();
'@

$verifyFile = "$buildDir\verify-https-server.js"
Set-Content -Path $verifyFile -Value $verifyCode

Write-Host "✅ Verification script created: verify-https-server.js" -ForegroundColor Green
Write-Host ""

# Step 4: Instructions
Write-Host "[4/4] Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  🚀 Local HTTPS Testing Environment Ready              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Add scripts to package.json in client/" -ForegroundColor Cyan
Write-Host "   Open: client\package.json"
Write-Host "   Find: ""scripts"" section"
Write-Host "   Add:"
Write-Host '     "https-test": "node build/https-server.js",'
Write-Host '     "verify-https": "node build/verify-https-server.js"'
Write-Host ""
Write-Host "2. Start HTTPS server (in client directory):" -ForegroundColor Cyan
Write-Host "   npm run https-test"
Write-Host ""
Write-Host "3. In another terminal, verify (in client directory):" -ForegroundColor Cyan
Write-Host "   npm run verify-https"
Write-Host ""
Write-Host "4. Open browser:" -ForegroundColor Cyan
Write-Host "   https://localhost:3001"
Write-Host ""
Write-Host "5. Accept self-signed certificate:" -ForegroundColor Cyan
Write-Host "   Click ""Advanced"" → ""Proceed to localhost"""
Write-Host ""
Write-Host "6. Test PWA features:" -ForegroundColor Cyan
Write-Host "   ✅ DevTools (F12) → Application → Service Workers"
Write-Host "   ✅ DevTools → Network → Offline (checkbox)"
Write-Host "   ✅ DevTools → Application → Cache Storage"
Write-Host "   ✅ Browser menu → Install app"
Write-Host ""
Write-Host "7. After testing locally, deploy to production:" -ForegroundColor Cyan
Write-Host "   ./deployment/deploy.ps1"
Write-Host ""
