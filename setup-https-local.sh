#!/bin/bash

# GreenRoots PWA - Local HTTPS Testing Setup
# Creates a local HTTPS server for testing PWA features

echo "🔒 Setting up Local HTTPS Testing Environment..."
echo ""

# Step 1: Generate self-signed certificate
echo "[1/4] Generating self-signed SSL certificate..."
cd client/build

# Create certificates directory
mkdir -p certs

# Generate private key and certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem \
  -days 365 -nodes \
  -subj "/CN=localhost/O=GreenRoots/C=IN"

if [ -f "certs/cert.pem" ] && [ -f "certs/key.pem" ]; then
  echo "✅ SSL certificate created:"
  echo "   - Public: certs/cert.pem"
  echo "   - Private: certs/key.pem"
else
  echo "❌ Failed to create certificate"
  exit 1
fi

echo ""

# Step 2: Create HTTPS server
echo "[2/4] Creating HTTPS test server..."

cat > https-server.js << 'EOF'
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
EOF

if [ -f "https-server.js" ]; then
  echo "✅ HTTPS server created: https-server.js"
else
  echo "❌ Failed to create server"
  exit 1
fi

echo ""

# Step 3: Create test script
echo "[3/4] Creating test verification script..."

cat > verify-https-server.js << 'EOF'
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
EOF

echo "✅ Verification script created: verify-https-server.js"
echo ""

# Step 4: Instructions
echo "[4/4] Setup Complete!"
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🚀 Local HTTPS Testing Environment Ready              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Add this to package.json in client/:"
echo "   \"https-test\": \"node build/https-server.js\","
echo "   \"verify-https\": \"node build/verify-https-server.js\""
echo ""
echo "2. Start HTTPS server:"
echo "   npm run https-test"
echo ""
echo "3. In another terminal, verify:"
echo "   npm run verify-https"
echo ""
echo "4. Open browser:"
echo "   https://localhost:3001"
echo ""
echo "5. Accept self-signed certificate:"
echo "   Click \"Advanced\" → \"Proceed to localhost\""
echo ""
echo "6. Test PWA features:"
echo "   ✅ DevTools → Application → Service Workers"
echo "   ✅ DevTools → Network → Offline"
echo "   ✅ DevTools → Application → Cache Storage"
echo "   ✅ Try installation (browser menu)"
echo ""
echo "7. Check service worker cache headers:"
echo "   curl -I https://localhost:3001/service-worker.js"
echo ""
echo "8. After testing locally, deploy to production:"
echo "   ../deployment/deploy.sh"
echo ""
