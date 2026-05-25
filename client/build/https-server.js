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
  console.log(`   ✅ Service Worker registration (DevTools → Application)`);
  console.log(`   ✅ Offline mode (DevTools → Network → Offline)`);
  console.log(`   ✅ Installation (DevTools or browser menu)`);
  console.log(`   ✅ Cache inspection (DevTools → Application → Cache Storage)\n`);
  console.log(`Press Ctrl+C to stop server\n`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
