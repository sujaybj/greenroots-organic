# Local HTTPS Testing Setup - Windows

Quick setup guide to test PWA with HTTPS locally before production deployment.

## Step 1: Generate Self-Signed SSL Certificate

### Option A: Using mkcert (Recommended - Easiest)

```powershell
# 1. Install mkcert using Chocolatey
choco install mkcert

# 2. Create certs directory
mkdir client\build\certs

# 3. Generate certificate
cd client\build\certs
mkcert localhost

# 4. You should now have:
#    - localhost.pem (certificate)
#    - localhost-key.pem (private key)

# 5. Rename to standard names
Rename-Item localhost.pem cert.pem
Rename-Item localhost-key.pem key.pem
```

### Option B: Using OpenSSL (if already installed)

```powershell
# 1. Open Git Bash or OpenSSL terminal

# 2. Navigate to build directory
cd c:\Users\sujay\Desktop\organic-app\client\build

# 3. Generate certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem `
  -days 365 -nodes `
  -subj "/CN=localhost/O=GreenRoots/C=IN"
```

### Option C: Install OpenSSL on Windows

```powershell
# Using Chocolatey
choco install openssl

# Or download from: https://slproweb.com/products/Win32OpenSSL.html
```

## Step 2: Verify Certificate Files

After generating, you should have:
```
client/build/certs/
├── cert.pem      (public certificate)
└── key.pem       (private key)
```

Verify they exist:
```powershell
ls client\build\certs\
```

## Step 3: Start HTTPS Test Server

Open PowerShell in the `client` directory:

```powershell
# Navigate to client directory
cd client

# Start the HTTPS server
node build/https-server.js
```

You should see:
```
╔════════════════════════════════════════════════════════╗
║  🔒 HTTPS Test Server Started                          ║
╚════════════════════════════════════════════════════════╝

🌐 URL: https://localhost:3001

⚠️  WARNING: Self-signed certificate
✅ In browser: Click "Advanced" → "Proceed to localhost"
```

## Step 4: Test in Browser

### In Chrome/Edge:

1. Open: `https://localhost:3001`
2. See security warning about self-signed certificate
3. Click "Advanced" 
4. Click "Proceed to localhost"
5. You're in! 🎉

### Verify Service Worker is Working:

1. Press `F12` to open DevTools
2. Go to `Application` tab
3. Click `Service Workers`
4. You should see:
   - Status: "activated and running"
   - Scope: https://localhost:3001/

### Test Offline Mode:

1. In DevTools → `Application` → `Service Workers`
2. Check the "Offline" checkbox
3. Refresh the page
4. The app should still load from cache!

### Test Installation:

1. Look for install button in address bar (⬇️ icon)
2. Or use browser menu → "Install app"
3. App installs to your computer
4. Runs in standalone mode (no address bar)

## Step 5: Verify HTTPS Headers

Open PowerShell in `client` directory:

```powershell
# Check Service Worker cache headers
$uri = "https://localhost:3001/service-worker.js"
$response = Invoke-WebRequest -Uri $uri -SkipCertificateCheck
$response.Headers | Format-Table

# Should show: Cache-Control = no-cache, no-store, must-revalidate
```

Or verify using Node.js:

```powershell
# In client directory
node build/verify-https-server.js

# Should output:
# ✅ Server responding
# ✅ Service Worker headers: CORRECT
```

## Step 6: Test PWA Features

While running locally on HTTPS:

✅ **Service Worker**
- Registers and activates
- Shows in DevTools → Application → Service Workers
- Status: "activated and running"

✅ **Offline Support**
- Go to DevTools → Network → check Offline
- Refresh page
- App still loads from cache

✅ **Installation**
- Install button appears in address bar
- Can add to home screen on mobile
- Creates standalone app

✅ **Caching**
- Static assets cached for 1 year
- Service Worker never cached
- Manifest revalidated on each load

✅ **Performance**
- All resources load quickly
- Check Network tab in DevTools
- View Cache Storage for cached files

## Step 7: After Testing - Deploy to Production

Once everything works locally on HTTPS, deploy to production:

```powershell
# Commit changes
git add -A
git commit -m "test: Verify PWA works on local HTTPS"
git push origin main

# Deploy to production (from project root)
./deployment/deploy.ps1

# Or on Linux/macOS:
./deployment/deploy.sh
```

## Troubleshooting

### Certificate Issues

**Problem:** "certificate not trusted" or "SSL_ERROR_RX_RECORD_TOO_LONG"

**Solution:**
1. Delete old certificates: `rm client\build\certs\*`
2. Regenerate: `mkcert localhost` or `openssl` command
3. Restart server
4. Clear browser cache (DevTools → Application → Clear site data)

### Service Worker Not Installing

**Problem:** Service Worker shows "waiting to activate" or "redundant"

**Solution:**
1. Check DevTools → Application → Service Workers
2. Look for errors in DevTools → Console
3. Try: DevTools → Application → Clear site data
4. Refresh page
5. Service Worker should reinstall

### "Cannot find module" Error

**Problem:** `Error: Cannot find module 'https-server.js'`

**Solution:**
1. Make sure you're in `client` directory
2. Check that `build/https-server.js` exists
3. Run: `ls build/https-server.js` to verify

### Port 3001 Already in Use

**Problem:** `Error: listen EADDRINUSE :::3001`

**Solution:**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port - edit https-server.js line:
# const PORT = 3002;  (instead of 3001)
```

## Quick Commands Reference

```powershell
# Generate certificates (using mkcert)
mkcert localhost
Move-Item localhost.pem client\build\certs\cert.pem
Move-Item localhost-key.pem client\build\certs\key.pem

# Start HTTPS server
cd client
node build/https-server.js

# Verify server
node build/verify-https-server.js

# Clear Service Worker and cache
# DevTools → Application → Clear site data (check all boxes)

# Check if certificates exist
Test-Path client\build\certs\cert.pem
Test-Path client\build\certs\key.pem
```

## Next Steps

✅ Test locally on HTTPS (this guide)
✅ Verify PWA features work
✅ Deploy to production (see deployment/README.md)
✅ Run production tests
✅ Monitor in production

---

**For production deployment:** See [deployment/README.md](../deployment/README.md)

**For HTTPS setup on production server:** See [deployment/HTTPS_SETUP_GUIDE.md](../deployment/HTTPS_SETUP_GUIDE.md)
