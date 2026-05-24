# PWA Quick Reference Guide

## 📱 What is a PWA?

A Progressive Web App (PWA) combines the best of web and native apps:
- **Works offline** - Service workers cache content
- **Installable** - Can be installed like a native app
- **App-like experience** - Full-screen, fast, responsive
- **Progressive** - Works on all browsers, enhanced on modern ones
- **Engaging** - Push notifications, offline access, home screen icon

---

## 🚀 How Your PWA Works

### Installation Flow
1. **User opens app in browser**
   - Service worker registers in background
   - Web app manifest loads

2. **Browser offers installation**
   - Chrome/Edge: Shows install icon in address bar
   - Android: Shows install popup
   - iOS: Via Share → Add to Home Screen

3. **User installs app**
   - Creates home screen icon
   - Allows offline access
   - Can send push notifications

### Offline Flow
1. **App shell cached** - Basic UI and assets cached
2. **Service worker intercepts requests** - Returns cached content
3. **API calls queued** - Requests queued when offline
4. **Sync when online** - Automatic retry when connection restored

---

## 📂 Key PWA Files

### Configuration Files
- **`manifest.json`** - App metadata, icons, display settings
- **`service-worker.js`** - Offline support, caching strategies
- **`index.html`** - PWA meta tags and links
- **`.env.production`** - Production configuration

### Components
- **`NetworkStatus.jsx`** - Shows online/offline status
- **`InstallAppPrompt.jsx`** - Handles install prompts
- **`pwaUtils.js`** - PWA utility functions
- **`serviceWorkerRegistration.js`** - SW registration logic

### Directories
- **`/public`** - Static files served as-is
- **`/public/icons`** - App icons (192x192, 512x512)
- **`/build`** - Production build output

---

## 🔧 Using PWA Utilities

### Check PWA Support
```javascript
import { PWAUtils } from './utils/pwaUtils';

// Check if device is standalone
if (PWAUtils.isStandalone()) {
  console.log('App is running in standalone mode');
}

// Get platform info
const platform = PWAUtils.getPlatform(); // 'iOS', 'Android', 'Desktop'
```

### Manage Service Worker
```javascript
import { 
  registerServiceWorker,
  skipWaitingServiceWorker,
  clearAllCaches,
  getServiceWorkerRegistration 
} from './serviceWorkerRegistration';

// Force service worker update
const registration = getServiceWorkerRegistration();
await registration?.update();

// Clear all caches
clearAllCaches();

// Skip waiting and reload
skipWaitingServiceWorker();
```

### Cache Management
```javascript
// Request persistent storage
const isPersistent = await PWAUtils.requestPersistentStorage();

// Get cache size
const cacheInfo = await PWAUtils.getCacheSize();
console.log(`Cache usage: ${cacheInfo.percentage}%`);

// Clear all caches
await PWAUtils.clearAllCaches();
```

---

## 🎯 Installation Instructions

### For Users

#### **Chrome/Edge on Desktop**
1. Visit the website
2. Look for install icon (⬇️) in address bar
3. Click install
4. App appears in Start Menu or Applications

#### **Chrome on Android**
1. Open website in Chrome
2. Tap menu (⋮) → "Install app"
3. Confirm installation
4. App added to home screen

#### **Safari on iOS**
1. Open website in Safari
2. Tap Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Name the app and add it
5. App appears on home screen

---

## 🔍 Testing Your PWA

### Lighthouse Audit (Recommended)
```
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Analyze page load"
5. Review results (target: 90+)
```

### Manual Testing Checklist
```
□ Service worker registered (DevTools → Application → Service Workers)
□ Manifest loaded (DevTools → Application → Manifest)
□ Icons appear correctly
□ Install button works
□ Offline mode works (DevTools → Network → Offline)
□ Cache populated (DevTools → Application → Cache Storage)
□ Network status indicator works
□ App works in standalone mode
```

### Performance Testing
```bash
# Build and test locally
npm run build
serve -s build

# Or use HTTPS server
npx local-web-server --https
```

---

## 🎨 Manifest.json Configuration

Your manifest.json includes:
```json
{
  "short_name": "GreenRoots",
  "name": "GreenRoots Organics",
  "description": "Fresh organic groceries...",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2D6A4F",
  "background_color": "#F8FFF4",
  "icons": [...],
  "shortcuts": [
    { "name": "Browse Products", "url": "/products" },
    { "name": "View Cart", "url": "/cart" },
    { "name": "Order History", "url": "/orders" }
  ]
}
```

**Key fields:**
- `display: "standalone"` - Runs like a native app (no address bar)
- `theme_color` - Color of system UI (top bar, status bar)
- `background_color` - Splash screen background
- `start_url` - Page to open when app is launched
- `shortcuts` - Quick action shortcuts
- `icons` - App icons for home screen

---

## 💾 Caching Strategies

### Strategy: Cache First (Images, CSS, JS)
1. Check cache first
2. If not found, fetch from network
3. Store in cache
4. Great for static assets that don't change often

### Strategy: Network First (API, HTML)
1. Try fetching from network
2. If offline, use cached version
3. Great for dynamic content that needs to be fresh

### Strategy: Stale While Revalidate (Default)
1. Return cached version immediately
2. Fetch fresh version in background
3. Update cache for next time
4. Great balance between speed and freshness

---

## 🔐 Security Notes

1. **HTTPS Required** - Service workers only work over HTTPS
2. **API Security** - All API calls should use HTTPS
3. **Token Storage** - Use HttpOnly cookies for sensitive tokens
4. **Cache Security** - Don't cache sensitive user data
5. **CSP Headers** - Configure Content Security Policy correctly

---

## 📊 Monitoring & Analytics

Track in your analytics:
- Service worker registration success rate
- Install prompt acceptance rate
- Installation source (iOS, Android, Desktop)
- Offline usage frequency
- App launch frequency
- Cache effectiveness
- Performance metrics (LCP, FID, CLS)

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] HTTPS enabled
- [ ] Service worker cache versions updated
- [ ] Manifest.json all paths correct
- [ ] Icons optimized and served correctly
- [ ] API endpoints verified
- [ ] Environment variables set
- [ ] Lighthouse audit passing (90+)
- [ ] Tested on multiple devices
- [ ] Server configured for PWA (caching headers)

---

## 🐛 Troubleshooting

### Service Worker Not Registering?
```javascript
// Check in console:
navigator.serviceWorker.getRegistration()
  .then(r => console.log(r ? 'Registered' : 'Not registered'));

// Check for errors:
navigator.serviceWorker.ready
  .catch(e => console.error('Error:', e));
```

### App Not Installable?
- Check manifest.json is linked correctly
- Verify all required manifest fields
- Ensure HTTPS (except localhost)
- Run Lighthouse audit for details

### Offline Not Working?
- Verify service worker is active
- Check fetch event listener
- Look at Cache Storage in DevTools
- Check network requests are being intercepted

### Icons Not Showing?
- Verify icon files exist in `/public/icons/`
- Check manifest.json paths are correct
- Ensure icons are accessible
- Try different image formats (SVG, PNG)

---

## 📚 Resources

- [Web.dev PWA Documentation](https://web.dev/progressive-web-apps/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Manifest Specification](https://www.w3.org/TR/appmanifest/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Can I Use PWA Features](https://caniuse.com/)

---

## 💡 Tips & Best Practices

1. **Always test offline** - Simulate offline mode in DevTools
2. **Monitor cache size** - Large caches can slow down apps
3. **Plan updates** - Communicate new features to users
4. **Use analytics** - Track what users do and where they go offline
5. **Optimize images** - Use WebP with PNG fallback
6. **Update regularly** - Keep service worker cache versions current
7. **Test on devices** - Chrome DevTools isn't always perfect
8. **Use HTTPS everywhere** - Security is critical for PWAs
9. **Handle errors gracefully** - Show fallback pages when needed
10. **Keep it simple** - Don't cache everything, be selective

---

## Quick Commands

```bash
# Build production version
npm run build

# Test production build
serve -s build

# Clear browser caches (in DevTools console)
caches.keys().then(names => 
  Promise.all(names.map(n => caches.delete(n)))
);

# Check service worker
navigator.serviceWorker.getRegistration().then(r => console.log(r));

# Force service worker update
navigator.serviceWorker.controller.postMessage({ 
  type: 'SKIP_WAITING' 
});
```
