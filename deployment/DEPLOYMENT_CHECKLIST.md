# GreenRoots PWA - Production Deployment Checklist

## Pre-Deployment Phase (Before going live)

### Environment Preparation
- [ ] Production server provisioned (Ubuntu 20.04 LTS recommended)
- [ ] Domain name configured to point to server IP
- [ ] SSH access setup and tested
- [ ] Firewall configured (allow ports 80, 443)
- [ ] Node.js v18+ installed on server
- [ ] Nginx or Apache installed on server

### Code & Build Verification
- [ ] All source code changes committed and pushed
- [ ] Latest code pulled on server
- [ ] Production build created: `npm run build`
- [ ] Build directory verified: `client/build/`
- [ ] All required files present:
  - [ ] `index.html`
  - [ ] `manifest.json`
  - [ ] `service-worker.js`
  - [ ] `static/js/` directory
  - [ ] `static/css/` directory
  - [ ] `icons/` directory

### Configuration
- [ ] Environment variables configured on server
- [ ] Database connection tested
- [ ] Backend API verified working
- [ ] Cloudinary credentials configured
- [ ] Razorpay credentials configured
- [ ] WhatsApp integration tested

---

## HTTPS Setup Phase (Critical - Do first!)

### SSL Certificate
- [ ] SSL certificate obtained (Let's Encrypt recommended)
  - [ ] Run certbot: `sudo certbot certonly --nginx -d your-domain.com`
- [ ] Certificate paths verified:
  - [ ] `/etc/letsencrypt/live/your-domain.com/fullchain.pem`
  - [ ] `/etc/letsencrypt/live/your-domain.com/privkey.pem`
- [ ] Auto-renewal configured
  - [ ] Run: `sudo certbot renew --dry-run`

### Nginx/Apache Configuration
- [ ] Server configuration file copied from `deployment/nginx.conf` or `deployment/apache.conf`
- [ ] Domain name replaced in config file
- [ ] Certificate paths correct in config
- [ ] Config syntax verified:
  - [ ] Nginx: `sudo nginx -t`
  - [ ] Apache: `sudo apache2ctl configtest`
- [ ] Server restarted:
  - [ ] Nginx: `sudo systemctl restart nginx`
  - [ ] Apache: `sudo systemctl restart apache2`

### HTTPS Verification
- [ ] HTTPS accessible: `https://your-domain.com`
- [ ] HTTP redirects to HTTPS
- [ ] SSL Labs test passed (Grade A or better)
  - [ ] Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
- [ ] Security headers present:
  - [ ] Strict-Transport-Security
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options

---

## Deployment Phase

### Build Deployment
- [ ] Production build uploaded to server:
  - [ ] Using script: `./deployment/deploy.sh`
  - [ ] Or manually: `rsync -avz client/build/ server:/var/www/greenroots/`
- [ ] Files verified on server:
  - [ ] Run: `ls -la /var/www/greenroots/`
  - [ ] Check for service-worker.js, manifest.json, index.html

### Permissions
- [ ] Directory ownership set: `sudo chown -R www-data:www-data /var/www/greenroots`
- [ ] Directory permissions set: `sudo chmod -R 755 /var/www/greenroots`
- [ ] Files readable by web server

### Server Headers
- [ ] Service Worker cache headers verified:
  - [ ] `curl -I https://your-domain.com/service-worker.js`
  - [ ] Should show: `Cache-Control: no-cache, no-store, must-revalidate`
- [ ] Manifest cache headers verified:
  - [ ] `curl -I https://your-domain.com/manifest.json`
  - [ ] Should show: `Cache-Control: no-cache, must-revalidate`
- [ ] Static asset headers verified:
  - [ ] `curl -I https://your-domain.com/static/js/main.*.js`
  - [ ] Should show: `Cache-Control: public, max-age=31536000, immutable`

### Gzip Compression
- [ ] Gzip enabled on server
- [ ] Test: `curl -I -H "Accept-Encoding: gzip" https://your-domain.com/ | grep -i encoding`

---

## Testing Phase

### Browser Testing
- [ ] Site loads in Chrome/Firefox/Safari
- [ ] No mixed content warnings
- [ ] No console errors
- [ ] All images load correctly
- [ ] API calls work (check network tab)
- [ ] Responsive design works on mobile

### Service Worker Testing
- [ ] Service Worker registers:
  - [ ] DevTools → Application → Service Workers
  - [ ] Status: "activated and running"
- [ ] Offline functionality works:
  - [ ] Go to DevTools → Network → Offline
  - [ ] Site still loads cached content
- [ ] Service Worker update detection works
- [ ] Cache size visible in DevTools

### Installation Testing
- [ ] **Desktop (Windows/macOS/Linux):**
  - [ ] Install button appears in address bar
  - [ ] App installs successfully
  - [ ] App launches from Start Menu / Applications
  - [ ] App works in standalone mode (no address bar)

- [ ] **Android:**
  - [ ] Chrome menu → "Install app"
  - [ ] App adds to home screen
  - [ ] App launches in full-screen mode
  - [ ] Offline access works

- [ ] **iOS:**
  - [ ] Safari → Share → "Add to Home Screen"
  - [ ] App icon appears on home screen
  - [ ] App launches in standalone mode
  - [ ] Note: Limited offline support on iOS

### Lighthouse Audit
- [ ] Run Lighthouse audit:
  - [ ] Open DevTools → Lighthouse
  - [ ] Select "Progressive Web App"
  - [ ] Click "Analyze page load"
- [ ] PWA Score: 90+ (Target)
- [ ] Performance Score: 85+
- [ ] Accessibility Score: 90+
- [ ] Best Practices Score: 90+
- [ ] SEO Score: 90+

### Functionality Testing
- [ ] Home page loads and displays products
- [ ] Product search works
- [ ] Add to cart works
- [ ] Checkout process works
- [ ] Payment integration works (Razorpay)
- [ ] User login/signup works
- [ ] Order history displays
- [ ] Admin panel accessible
- [ ] Contact form sends emails

---

## Monitoring & Analytics Phase

### Error Tracking
- [ ] Sentry or similar error tracking configured
- [ ] Error monitoring dashboard accessible
- [ ] Alerts configured for critical errors
- [ ] Stack traces captured

### Performance Monitoring
- [ ] Google Analytics configured
- [ ] Event tracking setup:
  - [ ] App installations
  - [ ] Offline usage
  - [ ] Page performance metrics
- [ ] Real User Monitoring (RUM) enabled
- [ ] Performance dashboard setup

### Server Monitoring
- [ ] Server uptime monitoring configured
- [ ] CPU/Memory alerts setup
- [ ] Disk space monitoring enabled
- [ ] Network traffic monitored

### Logging
- [ ] Nginx/Apache logs accessible:
  - [ ] `tail -f /var/log/nginx/greenroots-access.log`
  - [ ] `tail -f /var/log/nginx/greenroots-error.log`
- [ ] Application logs accessible
- [ ] Log rotation configured

---

## Post-Deployment Phase (First 24-48 hours)

### Initial Monitoring
- [ ] Monitor error logs for issues
- [ ] Check service worker registration success rate
- [ ] Monitor offline usage patterns
- [ ] Check installation funnel
- [ ] Monitor performance metrics

### User Communication
- [ ] Announcement posted about new PWA features
- [ ] Installation instructions shared with users
- [ ] Support channels prepared for user questions

### Performance Baseline
- [ ] Record initial Lighthouse scores
- [ ] Record initial performance metrics
- [ ] Record initial installation count
- [ ] Establish baseline metrics for comparison

---

## Ongoing Maintenance Phase

### Weekly Tasks
- [ ] Check SSL certificate renewal status
  - [ ] `sudo certbot certificates`
- [ ] Review error logs for patterns
- [ ] Monitor performance metrics
- [ ] Check storage usage on server

### Monthly Tasks
- [ ] Full Lighthouse audit run
- [ ] Security headers audit
- [ ] Performance optimization review
- [ ] Update dependencies for security patches
- [ ] Review user feedback and issues

### Quarterly Tasks
- [ ] Security assessment
- [ ] Performance profiling
- [ ] Capacity planning review
- [ ] Feature enhancement planning

---

## Rollback Plan (If Issues Occur)

### Quick Rollback
```bash
# Restore previous build from backup
sudo cp /var/www/backups/greenroots-<date>.tar.gz /var/www/
sudo tar -xzf /var/www/greenroots-<date>.tar.gz
sudo systemctl restart nginx
```

### Rollback Triggers
- [ ] If Lighthouse score drops below 85
- [ ] If error rate exceeds 1%
- [ ] If service worker registration rate below 80%
- [ ] If multiple user complaints about functionality

---

## Success Criteria

### Must Have ✅
- [ ] HTTPS working (A+ SSL rating)
- [ ] Service Worker registered (90%+)
- [ ] Lighthouse PWA score 90+
- [ ] No console errors
- [ ] Offline mode working
- [ ] Installation working on major platforms

### Should Have 📋
- [ ] Lighthouse performance 85+
- [ ] Lighthouse accessibility 90+
- [ ] Google Analytics tracking
- [ ] Error tracking setup
- [ ] Performance monitoring

### Nice to Have 🎁
- [ ] HSTS preload enabled
- [ ] Analytics custom events
- [ ] Advanced monitoring dashboards
- [ ] Automated performance alerts

---

## Contact & Support

### In Case of Issues
- [ ] Check HTTPS_SETUP_GUIDE.md for SSL issues
- [ ] Check PWA_TESTING_DEPLOYMENT.md for testing
- [ ] Check nginx.conf or apache.conf for server config
- [ ] Review server logs:
  - [ ] `tail -100 /var/log/nginx/greenroots-error.log`

### Deployment Support
- GitHub Issues: Report issues here
- Deployment Script: `./deployment/deploy.sh`
- Documentation: See `deployment/` directory

---

**Status:** Ready for Production ✅  
**Last Updated:** May 24, 2026  
**Next Step:** Execute HTTPS setup using deployment/HTTPS_SETUP_GUIDE.md
