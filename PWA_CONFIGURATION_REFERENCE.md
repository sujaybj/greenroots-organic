# PWA Configuration Reference

## Environment Variables

### Production (.env.production)
```env
# API Configuration
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production

# PWA Configuration
REACT_APP_PWA_ENABLED=true
REACT_APP_SW_UPDATE_CHECK_INTERVAL=3600000  # 1 hour in milliseconds

# Feature Flags
REACT_APP_OFFLINE_ENABLED=true
REACT_APP_INSTALL_PROMPT_ENABLED=true
REACT_APP_NETWORK_STATUS_ENABLED=true
```

### Development (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development

# PWA Configuration
REACT_APP_PWA_ENABLED=true
REACT_APP_SW_UPDATE_CHECK_INTERVAL=300000  # 5 minutes for faster testing

# Feature Flags
REACT_APP_OFFLINE_ENABLED=true
REACT_APP_INSTALL_PROMPT_ENABLED=true
REACT_APP_NETWORK_STATUS_ENABLED=true
```

---

## Manifest.json Configuration

### Display Modes
- `fullscreen` - Full screen, no browser UI
- `standalone` - App-like experience (current)
- `minimal-ui` - Minimal browser UI
- `browser` - Standard browser window

### Orientation
- `portrait-primary` - Default portrait
- `landscape-primary` - Default landscape
- `portrait` - Any portrait orientation
- `landscape` - Any landscape orientation
- `portrait-secondary` - Secondary portrait
- `landscape-secondary` - Secondary landscape
- `any` - Any orientation

### Current Configuration
```json
{
  "display": "standalone",           // App-like experience
  "orientation": "portrait-primary", // Prefer portrait
  "start_url": "/",                  // App starts at root
  "scope": "/",                      // All routes within scope
  "theme_color": "#2D6A4F",         // Top bar color
  "background_color": "#F8FFF4"     // Splash screen color
}
```

---

## Service Worker Cache Versions

Update these when deploying new versions:

```javascript
// In service-worker.js
const STATIC_CACHE = 'greenroots-static-v1';      // v1 → v2 for new deployment
const RUNTIME_CACHE = 'greenroots-runtime-v1';    // Update version number
const API_CACHE = 'greenroots-api-v1';            // Update version number
const IMAGE_CACHE = 'greenroots-images-v1';       // Update version number
```

**Versioning Strategy:**
- Major version bump when making breaking changes
- Minor version bump when updating content
- Always test after updating versions
- Old caches are auto-deleted on activation

---

## Server Configuration

### Critical Cache Headers

#### For Service Worker and Manifest
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

These files must NOT be cached by browser or CDN.

#### For Static Assets (CSS, JS)
```
Cache-Control: public, max-age=31536000, immutable
```

Cache for 1 year (immutable means content hash changes invalidate).

#### For Images
```
Cache-Control: public, max-age=2592000
```

Cache for 30 days.

#### For HTML
```
Cache-Control: no-cache, must-revalidate
```

Don't cache, but revalidate.

### CORS Headers
```
Access-Control-Allow-Origin: https://your-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Security Headers
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Content Security Policy (CSP)
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.your-domain.com https://checkout.razorpay.com;
  worker-src 'self';
  frame-src 'self' https://checkout.razorpay.com;
```

---

## Manifest.json Fields Reference

### Required Fields
```json
{
  "name": "GreenRoots Organics",      // Full app name (255 char max)
  "short_name": "GreenRoots",         // Home screen text (12 char max)
  "icons": [...]                       // At least one icon (192x192+)
}
```

### Important Optional Fields
```json
{
  "start_url": "/",                   // URL to open when launched
  "scope": "/",                       // URL scope for PWA
  "display": "standalone",            // Display mode
  "theme_color": "#2D6A4F",          // System UI color
  "background_color": "#F8FFF4",     // Splash screen color
  "orientation": "portrait-primary",  // Preferred orientation
  "description": "...",               // App description
  "categories": ["shopping"],         // App categories
  "screenshots": [...],               // Screenshots for stores
  "shortcuts": [...],                 // App shortcuts
  "share_target": {...}              // Share target configuration
}
```

---

## Icon Configuration

### Recommended Icon Sizes
- 192x192 - Minimum for PWA
- 512x512 - Recommended for splash screens
- 144x144 - Windows tiles
- 96x96 - Android Chrome
- 72x72 - iPad
- 180x180 - iPhone

### Current Setup
```json
{
  "icons": [
    {
      "src": "/icons/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"  // maskable = allows safe zone cropping
    },
    {
      "src": "/icons/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

**Tips:**
- Use SVG for scalability
- Include PNG versions for better compatibility
- Test icons on different devices
- Use `maskable` purpose for safe icon cropping

---

## Caching Strategies

### Strategy Selection
```
URL Pattern          Strategy              Cache Time
────────────────────────────────────────────────────────
/api/*               Network First         Until updated
*.html               Network First         No cache
*.js, *.css          Cache First           1 year
*.jpg, *.png, etc    Cache First           30 days
Other                Stale-While-Reval.    Until background fetch
```

### Cache Names
- `greenroots-static-v1` - App shell and critical assets
- `greenroots-runtime-v1` - Dynamic content
- `greenroots-api-v1` - API responses
- `greenroots-images-v1` - Images

---

## Service Worker Lifecycle

### Install Phase
1. Download service worker file
2. Parse and execute
3. Fire install event
4. Cache app shell files
5. Call skipWaiting() to activate immediately (or wait for page reload)

### Activation Phase
1. Delete old cache versions
2. Take control of all pages
3. Service worker ready for fetch events

### Fetch Phase
1. Intercept all requests
2. Apply caching strategy
3. Return cached or fresh content
4. Handle offline scenarios

---

## Common Configuration Issues

### Issue: Icons not appearing
**Solution:**
- Verify icon files exist in `/public/icons/`
- Check manifest.json icon paths
- Ensure `src` paths are absolute (e.g., `/icons/icon-192.svg`)
- Verify MIME type matches file extension

### Issue: Service worker not registering
**Solution:**
- Verify file is at `/public/service-worker.js`
- Check HTTPS is enabled (except localhost)
- Verify serviceWorkerRegistration.js is called
- Check browser console for errors
- Clear cache and reload

### Issue: Cache not being used
**Solution:**
- Verify fetch event is firing (DevTools → Network)
- Check Cache Storage has entries
- Verify offline mode is enabled
- Check cache strategy for URL pattern

### Issue: App not installable
**Solution:**
- Run Lighthouse audit (DevTools → Lighthouse)
- Verify manifest.json is valid
- Check all required fields in manifest
- Ensure HTTPS (except localhost)
- Test with fresh browser profile

---

## Testing Configuration

### Localhost Development
```bash
# Service workers work on localhost
# Access at http://localhost:3000

# No HTTPS needed for development
# Install prompts may not work on localhost (that's normal)
```

### Local HTTPS Testing
```bash
# For testing HTTPS features locally
# Install mkcert or similar

# Then serve with HTTPS
# local-web-server --https
```

### Production Testing
```bash
# Always test production build
npm run build
serve -s build

# Run Lighthouse audit
# DevTools → Lighthouse → Progressive Web App
```

---

## Monitoring Configuration

### Recommended Metrics to Track
1. **Service Worker**
   - Registration success rate
   - Error rates
   - Update frequency

2. **Installation**
   - Install prompt impressions
   - Install prompt acceptance rate
   - Installation success rate
   - Source (iOS, Android, Desktop)

3. **Usage**
   - Daily active users (DAU)
   - Monthly active users (MAU)
   - Session duration
   - Feature usage

4. **Performance**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)
   - Cache hit rate

### Recommended Tools
- Google Analytics - Usage tracking
- Sentry - Error tracking
- Lighthouse - Performance audits
- WebVitals - Performance monitoring
- Rollbar - Error reporting

---

## Version Management

### Cache Version Updates
When deploying new build:
```javascript
// Update in service-worker.js
const STATIC_CACHE = 'greenroots-static-v1';    // Change to v2
const RUNTIME_CACHE = 'greenroots-runtime-v1';  // Change to v2
const API_CACHE = 'greenroots-api-v1';          // Change to v2
const IMAGE_CACHE = 'greenroots-images-v1';     // Change to v2
```

### Manifest Version
Update in `manifest.json`:
```json
{
  // Update version in comment for tracking
  "name": "GreenRoots Organics v2.0",
  // Update description if needed
  "description": "Fresh organic groceries - v2.0"
}
```

### Service Worker Version
Update in HTML comments:
```html
<!-- Service Worker v2.0 -->
<script src="/service-worker.js"></script>
```

---

## Rollback Procedure

If deployment has issues:

1. **Check Service Worker Status**
   - DevTools → Application → Service Workers
   - Should show registered and running

2. **Clear Old Caches**
   - DevTools → Application → Cache Storage
   - Delete old cache versions if newer one fails

3. **Reset Service Worker**
   ```javascript
   // In DevTools console
   navigator.serviceWorker.getRegistration().then(r => r.unregister());
   ```

4. **Clear All Caches**
   ```javascript
   // In DevTools console
   caches.keys().then(names => 
     Promise.all(names.map(n => caches.delete(n)))
   );
   ```

5. **Reload Page**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Quick Reference

| Task | Command |
|------|---------|
| Build production | `npm run build` |
| Test production | `serve -s build` |
| View service worker | DevTools → Application → Service Workers |
| View manifest | DevTools → Application → Manifest |
| View cache | DevTools → Application → Cache Storage |
| Clear all caches | `caches.keys().then(n => Promise.all(n.map(c => caches.delete(c))))` |
| Check SW | `navigator.serviceWorker.getRegistration()` |
| Unregister SW | `navigator.serviceWorker.getRegistration().then(r => r.unregister())` |
