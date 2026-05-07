# Production Deployment Guide

This guide covers all aspects of deploying the Organic App to production.

## Environment Setup

### 1. Environment Variables

Create production environment files based on examples:

```bash
cp server/.env.example server/.env.production
cp client/.env.example client/.env.production
```

**Required Server Variables** (`.env.production`):
- `MONGO_URI`: Production MongoDB connection string
- `JWT_SECRET`: Long random secret (min 32 chars)
- `REFRESH_TOKEN_SECRET`: Long random secret (min 32 chars)
- `CLIENT_URL`: Your production domain (e.g., https://yourdomain.com)
- Payment gateway keys (Stripe/Razorpay)
- Cloudinary credentials for image hosting

**Required Client Variables** (`.env.production`):
- `REACT_APP_API_URL`: Production API endpoint

### 2. Secrets Management

Store sensitive values in your hosting platform's secrets manager:
- GitHub Actions Secrets
- Docker/Kubernetes Secrets
- Environment variable managers (e.g., HashiCorp Vault)

**Never commit `.env.production` to version control.**

## Docker Deployment

### Build Docker Image

```bash
docker build -t organic-app:latest .
```

### Run Container

```bash
docker run -p 5000:5000 \
  -e MONGO_URI="your_mongo_uri" \
  -e JWT_SECRET="your_secret" \
  -e CLIENT_URL="https://yourdomain.com" \
  organic-app:latest
```

### Docker Compose (for local testing)

```bash
docker-compose up -d
```

## CI/CD Pipeline

The repository includes GitHub Actions workflows (`.github/workflows/ci-cd.yml`) that:

1. **Lint & Test**: Runs on all PRs and pushes
2. **Build**: Compiles client and server
3. **Security Check**: npm audit and Snyk analysis
4. **Docker Build**: Creates Docker image on main branch
5. **Deploy**: Triggers deployment webhook

### Setup CI/CD Secrets

Add these secrets to your GitHub repository:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token
- `DEPLOY_WEBHOOK_URL`: Deployment service webhook
- `REACT_APP_API_URL`: Production API URL

## Testing Before Deployment

```bash
# Run all tests
npm test

# Run server tests only
npm test --workspace server

# Run client tests only
npm test --workspace client

# Generate coverage report
npm test -- --coverage
```

## Performance Optimization

### Compression
- ✅ Gzip compression middleware is enabled
- ✅ HTTPS redirect enforced in production

### Caching
Add cache headers in your reverse proxy (Nginx/Apache):

```nginx
location /static/ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location /api/ {
  expires -1;
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### CDN Setup

Recommended: Cloudflare, AWS CloudFront, or similar
- Cache static assets
- Serve from edge locations
- DDOS protection

## Monitoring & Error Tracking

### Error Tracking (Sentry)

1. Create Sentry account and project
2. Set environment variables:
   ```bash
   ERROR_TRACKING_SERVICE=sentry
   SENTRY_DSN=your_sentry_dsn
   ```
3. Errors will automatically be tracked

### Application Monitoring

Monitor these metrics:
- Server response times
- Error rates
- Database connection health
- Memory/CPU usage
- Request rates

## Database Backup

### MongoDB Atlas (Recommended)
- Automatic daily backups
- Point-in-time recovery
- Replication

### Manual Backup

```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname" --out ./backups
```

## Security Checklist

- [ ] All environment variables are stored securely
- [ ] HTTPS enforced on all connections
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] MongoDB sanitization active
- [ ] Helmet security headers enabled
- [ ] Dependencies updated and audited
- [ ] `.env` files not committed
- [ ] API keys rotated periodically
- [ ] Database backups configured

## Deployment Steps (Manual)

1. **Build & Test**
   ```bash
   npm install
   npm test
   npm run build --workspace client
   ```

2. **Create Docker Image**
   ```bash
   docker build -t organic-app:v1.0.0 .
   docker push yourusername/organic-app:v1.0.0
   ```

3. **Deploy to Server**
   ```bash
   ssh user@production-server
   docker pull yourusername/organic-app:v1.0.0
   docker stop organic-app || true
   docker run -d --name organic-app \
     -p 80:5000 \
     --env-file .env.production \
     yourusername/organic-app:v1.0.0
   ```

## Rollback Procedure

If something goes wrong:

```bash
# View running containers
docker ps -a

# Stop current container
docker stop organic-app

# Start previous version
docker run -d --name organic-app \
  -p 80:5000 \
  --env-file .env.production \
  yourusername/organic-app:v<previous_version>
```

## Monitoring Health

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "uptime": 3600
}
```

## Support & Troubleshooting

### Common Issues

**Port Already in Use**
```bash
sudo lsof -i :5000
sudo kill -9 <PID>
```

**Database Connection Failed**
- Verify MongoDB URI
- Check network connectivity
- Ensure IP whitelist in MongoDB Atlas

**CORS Errors**
- Verify `CLIENT_URL` in `.env.production`
- Check allowed origins in `server.js`

**Static Files Not Serving**
- Ensure `client/build/` exists
- Check file permissions

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Production Checklist](https://docs.mongodb.com/manual/administration/production-checklist/)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Production Build](https://create-react-app.dev/docs/production-build/)

---

**Last Updated**: May 2026
**Maintainer**: Development Team
