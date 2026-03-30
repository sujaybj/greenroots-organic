const express        = require('express');
const mongoose       = require('mongoose');
const cors           = require('cors');
const helmet         = require('helmet');
const morgan         = require('morgan');
const cookieParser   = require('cookie-parser');
const mongoSanitize  = require('express-mongo-sanitize');
const rateLimit      = require('express-rate-limit');
const compression    = require('compression');       // ← gzip all responses
const passport       = require('passport');
require('dotenv').config();
require('./config/passport');

const authRoutes    = require('./routes/authRoutes');
const userRoutes    = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ── COMPRESSION — reduces response size up to 70% ─────────────
app.use(compression({ level: 6, threshold: 1024 }));

// ── SECURITY ──────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(mongoSanitize());

// ── RATE LIMITING — prevents abuse + protects free tier ───────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min window
  max: 200,                    // ↑ increased from 100 (real users need more)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  skip: (req) => req.path === '/api/health',   // never rate-limit health checks
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
});

// ── CORS ───────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  /\.vercel\.app$/,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);   // allow curl/Postman
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    cb(allowed ? null : new Error('CORS blocked'), allowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── BODY PARSING ───────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── IN-MEMORY CACHE for products (simple, no Redis needed) ────
// Products change rarely — cache for 2 minutes to drastically
// reduce MongoDB calls and speed up page loads
const cache = new Map();
const CACHE_TTL = 2 * 60 * 1000;   // 2 minutes

const withCache = (key) => (req, res, next) => {
  const cacheKey = `${key}:${req.url}`;
  const cached   = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return res.json(cached.data);
  }
  // Intercept res.json to store in cache
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    if (res.statusCode === 200) cache.set(cacheKey, { data, ts: Date.now() });
    return originalJson(data);
  };
  next();
};

// ── API ROUTES ─────────────────────────────────────────────────
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/user',     userRoutes);
app.use('/api/products', withCache('products'), productRoutes); // ← cached
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/payment',  paymentRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/contact',  contactRoutes);

// ── HEALTH CHECK — always fast ─────────────────────────────────
app.get('/api/health', (req, res) => res.json({
  status:   'OK',
  uptime:   Math.floor(process.uptime()),
  memory:   `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  env:      process.env.NODE_ENV,
}));

// ── ERROR HANDLING ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── DATABASE ───────────────────────────────────────────────────
const MONGO_OPTS = {
  maxPoolSize:        10,   // max concurrent connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS:    45000,
};

mongoose.connect(process.env.MONGO_URI, MONGO_OPTS)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));

    // Keep HTTP connections alive — reduces TCP handshake overhead
    server.keepAliveTimeout = 65000;
    server.headersTimeout   = 66000;

    // ── Keep-alive ping for Render free tier (prevents 50s cold start) ──
    if (process.env.NODE_ENV === 'production') {
      const https = require('https');
      setInterval(() => {
        const url = process.env.BACKEND_URL || 'https://greenroots-backend.onrender.com';
        try {
          https.get(`${url}/api/health`, r => console.log(`🏓 Keep-alive: ${r.statusCode}`));
        } catch {}
      }, 14 * 60 * 1000);   // every 14 minutes
    }
  })
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });

// ── GRACEFUL SHUTDOWN ─────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received — closing gracefully');
  mongoose.connection.close(false, () => process.exit(0));
});

module.exports = app;
