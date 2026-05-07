# Environment Management & Local Development Setup

## Quick Start

### 1. Setup Environment Files

```bash
# Copy example files to create local env files
cp server/.env.example server/.env.development
cp client/.env.example client/.env.development
```

### 2. Configure Development Environment

Edit `server/.env.development`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/organic-app-dev
JWT_SECRET=your-dev-secret-key
# ... other keys
```

Edit `client/.env.development`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### 3. Load Environment on Startup

The app uses `dotenv` to automatically load `.env.development` in development mode.

**For manual environment selection** (advanced):

```bash
# Set NODE_ENV before starting
export NODE_ENV=development  # macOS/Linux
set NODE_ENV=development     # Windows

npm start
```

### 4. Production Environment

For production builds, use `.env.production`:

```bash
export NODE_ENV=production
npm run build --workspace client
npm start
```

## Environment File Priority

The application loads environment variables in this order:

1. System environment variables
2. `.env.{NODE_ENV}` file (e.g., `.env.development`, `.env.production`)
3. `.env` file (fallback)
4. Default values in code

## Using Different Environments

### Development
```bash
npm run dev
# Loads: .env.development, morgan logging, error tracking disabled
```

### Production
```bash
npm run build --workspace client
NODE_ENV=production npm start
# Loads: .env.production, compression enabled, HTTPS redirect active
```

### Staging
```bash
NODE_ENV=staging npm run dev
# Loads: .env.staging (create if needed)
```

## Running Tests in Different Environments

```bash
# Development (watch mode)
npm run test:server
npm run test:client

# CI/Production (coverage)
npm run test:ci

# Specific environment
NODE_ENV=test npm test
```

## Available Environment Variables

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode (development, production, test) |
| `PORT` | 5000 | Server port |
| `MONGO_URI` | - | MongoDB connection string (required) |
| `JWT_SECRET` | - | JWT signing secret (required) |
| `REFRESH_TOKEN_SECRET` | - | Refresh token secret (required) |
| `CLIENT_URL` | - | Allowed client origin (required) |
| `ERROR_TRACKING_SERVICE` | console | Error tracking (sentry, console, custom) |
| `SENTRY_DSN` | - | Sentry project DSN (if using Sentry) |

### Client

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | - | Backend API URL (required) |
| `REACT_APP_ENV` | development | Environment mode |
| `PUBLIC_URL` | / | Base URL for public assets |

## Docker Environment

When running in Docker, pass environment variables:

```bash
# Development
docker run -e NODE_ENV=development \
  -e MONGO_URI=mongodb://mongo:27017/organic-app-dev \
  -p 5000:5000 organic-app

# Production
docker run -e NODE_ENV=production \
  --env-file .env.production \
  -p 5000:5000 organic-app
```

## Troubleshooting Environment Issues

### Environment variables not loading?

1. Verify file exists: `ls -la server/.env.development`
2. Check file format: No spaces around `=`
3. Restart development server after editing `.env` file
4. Check `NODE_ENV` value: `echo $NODE_ENV` (macOS/Linux) or `echo %NODE_ENV%` (Windows)

### Getting "undefined" for variables?

Make sure:
- Variable name is correct in code
- Variable is defined in correct `.env` file
- Prefix is correct: `REACT_APP_*` for client, no prefix for server
- File is in correct location (root of workspace)

### Switching environments causes issues?

Clear cache and restart:
```bash
# Clear node_modules cache
npm cache clean --force

# Restart development server
npm run dev
```

## Secure Environment Setup

### DO NOT:
- ❌ Commit `.env` files to git
- ❌ Put production secrets in code
- ❌ Share `.env.production` files
- ❌ Use same secrets across environments

### DO:
- ✅ Use `.env.example` as template
- ✅ Store production secrets in secure manager
- ✅ Rotate secrets periodically
- ✅ Use strong random secrets (min 32 chars for JWT)

## Generate Secure Secrets

```bash
# Linux/macOS
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Online generator (for local dev only)
# https://www.random.org/strings/
```

---

For deployment details, see [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)
