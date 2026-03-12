# 🌿 GreenRoots Organics - Full Stack E-Commerce App

A production-ready full-stack organic products e-commerce application built with React, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
organic-app/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── assets/             # Images, icons
│   │   ├── components/
│   │   │   ├── common/         # Loader, Modal, etc.
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── product/        # ProductCard
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Register, OTP, ForgotPassword, ResetPassword
│   │   │   ├── user/           # Profile, Wishlist
│   │   │   ├── admin/          # Dashboard, Products, Orders, Users
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/         # authSlice, cartSlice, productSlice, uiSlice
│   │   ├── utils/
│   │   │   └── api.js          # Axios instance with interceptors
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── cloudinary.js       # Cloudinary + Multer
│   │   └── passport.js         # Google OAuth
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect, adminOnly
│   │   └── errorMiddleware.js  # Global error handler
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   └── tokenUtils.js       # JWT, Email utilities
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── package.json                # Root - concurrently scripts
└── README.md
```

---

## 🚀 Quick Start in VS Code

### Step 1: Clone and Install Dependencies
```bash
# Navigate to project
cd organic-app

# Install all dependencies
npm run install-all
```

### Step 2: Set Up Environment Variables

**Server config:**
```bash
cd server
cp .env.example .env
# Edit .env with your actual credentials
```

**Client config:**
```bash
# Create client/.env
echo "REACT_APP_API_URL=http://localhost:5000" > client/.env
```

### Step 3: Set Up External Services

#### 📊 MongoDB Atlas (Free)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free cluster → Connect → Copy connection string
3. Add to `.env`: `MONGO_URI=mongodb+srv://...`

#### ☁️ Cloudinary (Free)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up → Dashboard → Copy credentials
3. Add cloud name, API key, API secret to `.env`

#### 📧 Gmail SMTP
1. Enable 2-factor auth on Gmail
2. Go to App Passwords → Generate password
3. Add to `.env`: `EMAIL_USER`, `EMAIL_PASS`

#### 💳 Razorpay (Test Mode)
1. Sign up at [razorpay.com](https://razorpay.com)
2. Dashboard → Settings → API Keys → Generate Test Keys
3. Add Key ID and Secret to `.env`

#### 🔐 Google OAuth
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 credentials
4. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Add Client ID and Secret to `.env`

### Step 4: Run the Application
```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run separately:
npm run server    # Backend on port 5000
npm run client    # Frontend on port 3000
```

### Step 5: Create Admin User
```javascript
// In MongoDB Atlas, find your user document and update:
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🌐 API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/verify-otp` | Verify email OTP | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/google` | Google OAuth | Public |
| POST | `/api/auth/forgot-password` | Request reset | Public |
| POST | `/api/auth/reset-password/:token` | Reset password | Public |
| GET | `/api/auth/me` | Current user | Protected |
| GET | `/api/products` | List products | Public |
| GET | `/api/products/:id` | Product detail | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/orders/my-orders` | User orders | Protected |
| POST | `/api/orders/create` | Place order | Protected |
| POST | `/api/payment/create-order` | Razorpay order | Protected |
| POST | `/api/payment/verify` | Verify payment | Protected |
| GET | `/api/admin/dashboard` | Admin stats | Admin |
| GET | `/api/admin/orders` | All orders | Admin |
| GET | `/api/admin/users` | All users | Admin |

---

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT stored in httpOnly cookies
- ✅ Refresh token rotation
- ✅ Rate limiting (100 req/15min, 20 auth/15min)
- ✅ Helmet.js security headers
- ✅ MongoDB injection prevention
- ✅ CORS restricted to frontend origin
- ✅ Razorpay signature verification
- ✅ Input validation on all forms
- ✅ Admin role-based access control
- ✅ XSS protection

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Framer Motion |
| Styling | CSS Modules, Custom CSS variables |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt, Google OAuth 2.0 |
| Payments | Razorpay |
| Storage | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| State | Redux Persist |

---

## 📱 Features

### Customer Features
- 🌿 Animated splash screen
- 👤 Email OTP registration & Google OAuth
- 🛒 Persistent cart (works without login)
- ❤️ Wishlist management
- 🔍 Search, filter, sort products
- 💳 Razorpay + COD payment
- 📦 Order tracking with status timeline
- 👤 Profile management & password change
- 📍 Multiple saved addresses

### Admin Features
- 📊 Dashboard with revenue & stats
- 📦 Product management (CRUD + images)
- 🛒 Order management with status updates
- 👥 User management
- 🎟️ Coupon creation & management
- ⚠️ Low stock alerts

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client && npm run build
# Deploy to Vercel - set REACT_APP_API_URL to your backend URL
```

### Backend (Render/Railway)
```bash
# Push to GitHub → Connect to Render
# Add all .env variables in Render dashboard
# Build command: npm install
# Start command: node server.js
```

---

## 📝 VS Code Extensions Recommended
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- MongoDB for VS Code
- REST Client (for testing APIs)
- GitLens

---

Made with 💚 by GreenRoots Dev Team
