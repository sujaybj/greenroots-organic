# GreenRoots PWA - Deployment Guide

Complete production deployment guide for the GreenRoots Organics Progressive Web App.

## 📁 Deployment Files Overview

```
deployment/
├── README.md .......................... This file
├── HTTPS_SETUP_GUIDE.md .............. Step-by-step HTTPS setup
├── DEPLOYMENT_CHECKLIST.md ........... Pre & post-deployment checklist
├── nginx.conf ........................ Nginx server configuration
├── apache.conf ....................... Apache server configuration
├── Dockerfile.prod ................... Docker production image
├── docker-compose.prod.yml ........... Docker Compose orchestration
├── deploy.sh ......................... Linux/macOS deployment script
└── deploy.ps1 ....................... Windows PowerShell script
```

## 🚀 Quick Start (5 Minutes)

### For Linux/macOS:
```bash
# 1. Read the guides first
cat deployment/HTTPS_SETUP_GUIDE.md

# 2. Setup HTTPS certificate
sudo certbot certonly --nginx -d your-domain.com

# 3. Run deployment script
./deployment/deploy.sh
```

### For Windows:
```powershell
# 1. Read the guides first
Get-Content deployment/HTTPS_SETUP_GUIDE.md

# 2. Setup HTTPS on server
# (Use the guide to setup on your Linux server)

# 3. Run deployment script
powershell ./deployment/deploy.ps1
```

## 📋 Step-by-Step Deployment

### Step 1: Setup HTTPS (30 minutes) ⚠️ CRITICAL
Follow: [HTTPS_SETUP_GUIDE.md](./HTTPS_SETUP_GUIDE.md)

**Why it's critical:** Service Workers only work over HTTPS (except localhost)

```bash
# Quick reference:
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Step 2: Configure Server (20 minutes)
Choose your server:

**Option A: Nginx (Recommended)**
```bash
# Copy configuration
sudo cp deployment/nginx.conf /etc/nginx/sites-available/greenroots
sudo ln -s /etc/nginx/sites-available/greenroots /etc/nginx/sites-enabled/

# Update domain name in file
sudo sed -i 's/your-domain.com/actual-domain.com/g' /etc/nginx/sites-available/greenroots

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

**Option B: Apache**
```bash
# Copy configuration
sudo cp deployment/apache.conf /etc/apache2/sites-available/greenroots.conf
sudo a2ensite greenroots

# Update domain name
sudo sed -i 's/your-domain.com/actual-domain.com/g' /etc/apache2/sites-available/greenroots.conf

# Enable modules
sudo a2enmod rewrite proxy proxy_http deflate headers ssl

# Test and restart
sudo apache2ctl configtest
sudo systemctl restart apache2
```

**Option C: Docker (Advanced)**
```bash
# Setup .env.prod
cp .env.example .env.prod
# Edit .env.prod with your values

# Deploy
docker-compose -f deployment/docker-compose.prod.yml up -d
```

### Step 3: Deploy Build (10 minutes)

**Option A: Using Script (Recommended)**
```bash
# Linux/macOS
./deployment/deploy.sh

# Windows PowerShell
powershell ./deployment/deploy.ps1
```

**Option B: Manual Deployment**
```bash
# Build locally
npm run build

# Upload via rsync (fastest)
rsync -avz --delete client/build/ user@server:/var/www/greenroots/

# Or via scp
scp -r client/build/* user@server:/var/www/greenroots/
```

### Step 4: Verify Deployment (15 minutes)

```bash
# 1. Check HTTPS
curl -I https://your-domain.com/

# 2. Check Service Worker
curl -I https://your-domain.com/service-worker.js

# 3. Check Manifest
curl -I https://your-domain.com/manifest.json

# 4. Run Lighthouse
# Open browser → DevTools → Lighthouse → PWA
# Target: 90+ score
```

Follow: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] SSL certificate valid (Let's Encrypt recommended)
- [ ] Auto-renewal configured
- [ ] Security headers configured:
  - [ ] Strict-Transport-Security
  - [ ] X-Content-Type-Options
  - [ ] X-Frame-Options
- [ ] Gzip compression enabled
- [ ] Service Worker cache headers correct
- [ ] Environment variables secured

## 🧪 Testing Checklist

- [ ] Site loads over HTTPS
- [ ] No mixed content warnings
- [ ] Service Worker installs
- [ ] Offline mode works
- [ ] Installation works on:
  - [ ] Windows (Chrome/Edge)
  - [ ] macOS (Chrome/Firefox)
  - [ ] Android
  - [ ] iOS
- [ ] Lighthouse score 90+
- [ ] All functionality tested

## 📊 Deployment Options Comparison

| Method | Difficulty | Time | Recommended |
|--------|-----------|------|-------------|
| Nginx | Easy | 20 min | ✅ Yes |
| Apache | Easy | 20 min | ✅ Yes |
| Docker | Medium | 30 min | For scalability |
| Manual | Easy | 15 min | For simple setups |

## 🆘 Common Issues

### Issue: Service Worker not registering
**Solution:** Verify HTTPS setup. Service Workers require HTTPS (except localhost).
```bash
curl -I https://your-domain.com/service-worker.js
```

### Issue: Mixed content warning
**Solution:** Check HTML for HTTP resources. Update to HTTPS.
```bash
curl https://your-domain.com | grep -i "http://"
```

### Issue: Installation button not appearing
**Solution:** Run Lighthouse audit to find issues. Usually manifest or icons.
```bash
# DevTools → Lighthouse → PWA
```

### Issue: Cache not working
**Solution:** Verify cache headers are correct.
```bash
curl -I https://your-domain.com/static/js/main.*.js | grep "Cache-Control"
# Should show: public, max-age=31536000, immutable
```

## 📈 Performance Optimization

### Server-Side
```nginx
# Already configured in nginx.conf:
gzip on;                           # Enable compression
gzip_types text/plain text/css application/javascript;  # Compressible types
ssl_session_cache shared:SSL:10m;  # Cache SSL sessions
```

### Browser Caching
```nginx
# Already configured:
# Static assets: cache for 1 year
# Service Worker: never cache
# HTML: always revalidate
```

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy PWA

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run build
      - run: rsync -avz client/build/ ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }}:/var/www/greenroots/
```

## 📞 Getting Help

### Documentation
- [HTTPS Setup](./HTTPS_SETUP_GUIDE.md) - For SSL issues
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - For verification
- [Nginx Config](./nginx.conf) - For Nginx setup
- [Apache Config](./apache.conf) - For Apache setup

### Server Access
```bash
# SSH into server
ssh user@your-server-ip

# View logs
tail -f /var/log/nginx/greenroots-error.log

# Check build files
ls -la /var/www/greenroots/
```

### Troubleshooting
```bash
# Check HTTPS
curl -v https://your-domain.com/

# Check Service Worker
curl -I https://your-domain.com/service-worker.js

# Check Server Status
systemctl status nginx

# Check Firewall
sudo ufw status
```

## ✅ Success Criteria

### Technical ✅
- HTTPS working with A+ rating
- Service Worker registered (90%+)
- Lighthouse PWA score 90+
- All tests passing

### User ✅
- Installation works on devices
- Offline mode functional
- App performs well
- No major errors

## 🎉 Go Live!

Once all checks pass:

1. ✅ HTTPS setup complete
2. ✅ Build deployed
3. ✅ Tests passing
4. ✅ Lighthouse 90+
5. ✅ Installation working
6. ✅ Monitoring setup

**You're ready for production!**

## 📅 Post-Deployment

### First 24 Hours
- Monitor error logs
- Check service worker registration rate
- Test on real devices
- Gather initial metrics

### Weekly
- Review logs
- Monitor performance
- Check SSL certificate renewal

### Monthly
- Full Lighthouse audit
- Security assessment
- Performance optimization

## 📞 Support

For issues or questions:
1. Check the relevant guide in this directory
2. Review server logs
3. Run Lighthouse audit
4. Check browser DevTools

---

**Status:** Production Ready ✅  
**Last Updated:** May 24, 2026  
**Next Step:** Start with [HTTPS_SETUP_GUIDE.md](./HTTPS_SETUP_GUIDE.md)
