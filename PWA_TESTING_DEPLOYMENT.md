# PWA Testing & Deployment Guide

## Local Testing Setup

### 1. Build for Production

```bash
# Navigate to client directory
cd client

# Build the React app
npm run build

# This creates an optimized production build in the build/ directory
```

### 2. Test Locally with HTTPS

Since service workers require HTTPS (except on localhost), test locally:

```bash
# Option 1: Using serve (simple)
npm install -g serve
serve -s build

# Option 2: Using local-web-server (with HTTPS)
npm install -g local-web-server
ws --https

# Option 3: Using Node.js with self-signed certificate
# See Node.js HTTPS server setup below
```

### 3. Testing Checklist

#### Basic Installation
- [ ] Open DevTools (F12)
- [ ] Go to Application → Service Workers
- [ ] Verify service worker is registered and active
- [ ] Check manifest is loaded: Application → Manifest
- [ ] Verify all required icons appear in manifest

#### Install Prompt Testing
- **Chrome/Edge:**
  1. Look for install icon in address bar
  2. Click to install
  3. Verify app appears in Start Menu (Windows) or Applications (Mac)

- **Android:**
  1. Open in Chrome
  2. Tap menu → "Install app"
  3. Verify app appears in home screen

- **iOS:**
  1. Open in Safari
  2. Tap Share button
  3. Select "Add to Home Screen"
  4. Verify app appears on home screen

#### Offline Functionality Testing
1. Open DevTools → Network tab
2. Click the throttling dropdown (usually "No throttling")
3. Select "Offline"
4. Navigate around the app
5. Should still work with cached content
6. Try navigating to new pages (should show app shell or fallback)

#### Cache Testing
1. Open DevTools → Application → Cache Storage
2. Verify caches are created:
   - `greenroots-static-v1` (app shell)
   - `greenroots-runtime-v1` (dynamic content)
   - `greenroots-images-v1` (images)

#### Network Status Testing
1. Ensure network status indicator works
2. Toggle offline/online mode
3. Should show notification when status changes
4. Notification should auto-dismiss when online

#### Performance Testing
1. Open DevTools → Lighthouse
2. Run PWA audit
3. Target scores:
   - PWA: 90+
   - Performance: 85+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+

---

## Lighthouse Audit Details

### How to Run Lighthouse
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Analyze page load"
5. Wait for results

### Common Issues & Fixes

#### Issue: "Installable - No manifest found"
**Fix:** Ensure manifest.json is properly linked in index.html:
```html
<link rel="manifest" href="/manifest.json" />
```

#### Issue: "HTTPS - Does not use HTTPS"
**Fix:** Deploy on HTTPS domain. For localhost, service workers work fine.

#### Issue: "Viewport - Not set"
**Fix:** Verify viewport meta tag in index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### Issue: "Icons - Icon not found"
**Fix:** 
- Verify icon files exist in `/public/icons/`
- Check manifest.json icon paths
- Ensure icon files are accessible

#### Issue: "Service Worker - Service worker not registered"
**Fix:**
- Check service worker file is at `/public/service-worker.js`
- Verify serviceWorkerRegistration.js is called in index.js
- Check browser console for errors

---

## Deployment Checklist

### Pre-Deployment

```bash
# 1. Update environment variables
# .env.production should have:
# REACT_APP_API_URL=https://your-api-domain.com/api
# REACT_APP_ENV=production

# 2. Update service worker version
# In service-worker.js, increment cache versions:
# const STATIC_CACHE = 'greenroots-static-v2'; // was v1
# const RUNTIME_CACHE = 'greenroots-runtime-v2';

# 3. Update manifest.json if needed
# Update screenshots, shortcuts, icons paths if changed

# 4. Build for production
npm run build

# 5. Run Lighthouse audit on build
serve -s build
# Then run Lighthouse audit in DevTools
```

### Server Configuration

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Enable GZIP compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json;

    # Service Worker: No caching (must always get latest)
    location = /service-worker.js {
        root /path/to/build;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Content-Type "application/javascript";
    }

    # Manifest: No caching
    location = /manifest.json {
        root /path/to/build;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Content-Type "application/manifest+json";
    }

    # Static assets: Cache for 1 year (with hash in filename)
    location ~ ^/static/(.+)$ {
        root /path/to/build;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Images: Cache for 30 days
    location ~ \.(jpg|jpeg|png|gif|svg|webp)$ {
        root /path/to/build;
        add_header Cache-Control "public, max-age=2592000";
    }

    # HTML files: No caching (except index.html - no-cache)
    location ~ \.html?$ {
        root /path/to/build;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Root path returns index.html
    location / {
        root /path/to/build;
        try_files $uri /index.html;
    }
}
```

#### Apache Configuration
```apache
<VirtualHost *:443>
    ServerName your-domain.com

    DocumentRoot /path/to/build

    # Enable HTTPS/HTTP2
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    Protocols h2 http/1.1

    # Enable GZIP
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain text/css text/javascript application/javascript application/json
    </IfModule>

    # Service Worker: No caching
    <FilesMatch "^service-worker\.js$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Content-Type "application/javascript"
    </FilesMatch>

    # Manifest: No caching
    <FilesMatch "^manifest\.json$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Content-Type "application/manifest+json"
    </FilesMatch>

    # Static assets: Cache for 1 year
    <FilesMatch "^static/">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    # Images: Cache for 30 days
    <FilesMatch "\.(jpg|jpeg|png|gif|svg|webp)$">
        Header set Cache-Control "public, max-age=2592000"
    </FilesMatch>

    # HTML: No caching
    <FilesMatch "\.html?$">
        Header set Cache-Control "no-cache, must-revalidate"
    </FilesMatch>

    # SPA routing
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
</VirtualHost>
```

---

## Post-Deployment Testing

### 1. Production PWA Verification
```bash
# 1. Open production URL
# 2. Open DevTools → Application → Service Workers
# 3. Verify service worker is registered
# 4. Go to Lighthouse tab
# 5. Run PWA audit
# 6. Verify score > 90
```

### 2. Monitor in Production
- Set up error tracking (e.g., Sentry)
- Monitor service worker registration rates
- Track install prompt acceptance
- Monitor offline usage patterns
- Track performance metrics

### 3. User Communication
- Add in-app notification about PWA capability
- Create help documentation
- Share installation instructions for different platforms
- Collect user feedback on PWA experience

---

## Troubleshooting

### Service Worker Not Registering
```javascript
// Check in browser console:
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) console.log('SW registered:', reg);
  else console.log('SW not registered');
});

// Check for errors:
navigator.serviceWorker.ready.catch(err => console.error('SW error:', err));
```

### Manifest Not Found
```javascript
// Check in browser console:
fetch('/manifest.json').then(r => r.json()).then(m => console.log('Manifest:', m));
```

### Cache Issues
```javascript
// Clear all caches:
caches.keys().then(names => 
  Promise.all(names.map(n => caches.delete(n)))
);

// View cache contents:
caches.keys().then(names => {
  names.forEach(name => {
    caches.open(name).then(cache => 
      cache.keys().then(keys => console.log(name, keys))
    );
  });
});
```

### Icon Not Appearing
```javascript
// Verify icons are accessible:
fetch('/icons/icon-192.svg').then(r => console.log('Icon status:', r.status));
```

---

## Performance Optimization Tips

1. **Minimize Initial Load:**
   - Use code splitting (already done with lazy loading)
   - Optimize bundle size
   - Use dynamic imports for non-critical routes

2. **Optimize Images:**
   - Use WebP format with PNG fallback
   - Compress images before uploading
   - Use appropriate image sizes

3. **Cache Strategy:**
   - Cache static assets aggressively
   - Use network-first for dynamic content
   - Implement cache versioning for updates

4. **Network:**
   - Use HTTP/2 or HTTP/3
   - Enable compression (gzip, brotli)
   - Use CDN for static assets

5. **Monitoring:**
   - Track Core Web Vitals (LCP, FID, CLS)
   - Monitor service worker registration
   - Track cache effectiveness

---

## References

- [Web.dev PWA Documentation](https://web.dev/progressive-web-apps/)
- [Lighthouse PWA Audits](https://web.dev/pwa-checklist/)
- [Service Worker Caching Strategies](https://developers.google.com/web/tools/workbox/modules/workbox-strategies)
- [Manifest Specification](https://www.w3.org/TR/appmanifest/)
