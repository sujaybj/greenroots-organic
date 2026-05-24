# HTTPS Setup Guide for GreenRoots PWA

Complete step-by-step guide to setup HTTPS using Let's Encrypt for your production server.

## Prerequisites

- Ubuntu/Debian server (18.04+)
- Domain name pointing to your server
- Sudo access to the server
- Nginx or Apache already installed

---

## Method 1: Using Certbot with Nginx (Recommended)

### Step 1: Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Step 2: Obtain SSL Certificate

```bash
# For single domain
sudo certbot certonly --nginx -d your-domain.com

# For multiple domains
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

When prompted:
- Enter your email address
- Accept the terms
- Choose automatic HTTPS setup (recommended)

### Step 3: Verify Certificate Installation

```bash
# List certificates
sudo certbot certificates

# Show certificate details
openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -text -noout
```

### Step 4: Update Nginx Configuration

Use the provided `nginx.conf` and replace:
- `your-domain.com` with your actual domain
- Paths to certificate files (usually correct automatically)

```bash
# Create symlink or copy config
sudo cp deployment/nginx.conf /etc/nginx/sites-available/greenroots
sudo ln -s /etc/nginx/sites-available/greenroots /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup Auto-Renewal

Certbot automatically sets up a systemd timer:

```bash
# Verify auto-renewal is set up
sudo systemctl status certbot.timer

# Test renewal (dry run)
sudo certbot renew --dry-run
```

---

## Method 2: Using Certbot with Apache

### Step 1: Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-apache
```

### Step 2: Obtain SSL Certificate

```bash
# For single domain
sudo certbot certonly --apache -d your-domain.com

# For multiple domains  
sudo certbot certonly --apache -d your-domain.com -d www.your-domain.com
```

### Step 3: Update Apache Configuration

Use the provided `apache.conf`:

```bash
# Create symlink
sudo cp deployment/apache.conf /etc/apache2/sites-available/greenroots.conf
sudo a2ensite greenroots

# Enable required modules
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod deflate
sudo a2enmod headers
sudo a2enmod ssl

# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

### Step 4: Setup Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Auto-renewal is automatic with systemd
sudo systemctl status certbot.timer
```

---

## Method 3: Using Docker with Let's Encrypt

### Step 1: Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Step 2: Setup Environment Variables

Create `.env.prod`:
```bash
DOMAIN=your-domain.com
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
# ... other env vars
```

### Step 3: Deploy with Docker Compose

```bash
# Build and start containers
docker-compose -f deployment/docker-compose.prod.yml up -d

# Check logs
docker-compose -f deployment/docker-compose.prod.yml logs -f nginx
```

---

## Verification Steps

### 1. Check Certificate Details

```bash
# View certificate expiration
curl https://your-domain.com -I | grep -i "Strict"

# View full certificate info
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### 2. Test SSL Configuration

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

Expected: A+ or A rating

### 3. Browser Test

```bash
# Open in browser
curl -v https://your-domain.com/

# Check response headers
curl -I https://your-domain.com/
```

Should show:
```
HTTP/2 200
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
```

### 4. Test Service Worker

```bash
# Verify service worker is served with correct headers
curl -I https://your-domain.com/service-worker.js

# Check response headers
Cache-Control: no-cache, no-store, must-revalidate
Service-Worker-Allowed: /
```

---

## Common Issues & Solutions

### Issue 1: Certificate Not Found

```bash
# Check if certificate exists
ls -la /etc/letsencrypt/live/your-domain.com/

# If missing, regenerate:
sudo certbot certonly --nginx -d your-domain.com --force-renewal
```

### Issue 2: "mixed content" Warning

Ensure all resources use HTTPS:

```bash
# Check for HTTP resources
curl https://your-domain.com | grep -i "http://"

# Should return nothing (only HTTPS)
```

### Issue 3: Service Worker Not Registering

Check headers:
```bash
curl -I https://your-domain.com/service-worker.js | grep -i "cache-control"

# Should show: no-cache, no-store, must-revalidate
```

### Issue 4: HTTPS Connection Refused

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Check if port 443 is open
sudo netstat -tlnp | grep 443

# Allow through firewall
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
```

---

## Auto-Renewal Configuration

Certbot automatically renews certificates 30 days before expiration.

### Check Renewal Status

```bash
# View renewal schedule
sudo systemctl list-timers certbot

# Check renewal logs
sudo journalctl -u certbot.service
```

### Manual Renewal (if needed)

```bash
# Renew all certificates
sudo certbot renew

# Renew specific certificate
sudo certbot renew --cert-name your-domain.com

# Force renewal
sudo certbot renew --force-renewal
```

---

## Security Best Practices

### 1. Set Strong SSL Protocols

```nginx
# In nginx.conf (already configured in provided config)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

### 2. Enable HSTS

```nginx
# Already configured in provided nginx.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Optional: Enable HSTS preload (after testing thoroughly)
# add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

### 3. Enable Security Headers

All provided in the nginx.conf:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: limits browser features

### 4. Redirect HTTP to HTTPS

Already configured in provided nginx.conf:
```nginx
# Redirect HTTP to HTTPS
return 301 https://$server_name$request_uri;
```

---

## Performance Optimization

### 1. Enable OCSP Stapling

```nginx
# In nginx.conf
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/your-domain.com/chain.pem;
```

### 2. Enable Session Caching

```nginx
# Already configured in provided nginx.conf
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

### 3. Use HTTP/2

```nginx
# Already configured in provided nginx.conf
listen 443 ssl http2;
listen [::]:443 ssl http2;
```

---

## Deployment Checklist

- [ ] Certificate obtained and verified
- [ ] Nginx/Apache configured with SSL
- [ ] HTTP redirects to HTTPS
- [ ] Service worker served with no-cache headers
- [ ] Security headers configured
- [ ] Auto-renewal working
- [ ] Domain accessible via HTTPS
- [ ] Browser shows lock icon
- [ ] No mixed content warnings
- [ ] SSL Labs grade A+ or A

---

## Support Resources

- Let's Encrypt: https://letsencrypt.org/
- Certbot: https://certbot.eff.org/
- OWASP SSL Configuration: https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.md
- Mozilla SSL Configuration Generator: https://ssl-config.mozilla.org/

---

**Next Step:** After HTTPS is setup, run the deployment script to upload build files and configure server headers.

```bash
# On your local machine
./deployment/deploy.sh

# Or on Windows:
powershell ./deployment/deploy.ps1
```
