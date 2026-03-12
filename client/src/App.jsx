import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { getMe } from './redux/slices/authSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/common/Loader';
import SplashScreen from './pages/SplashScreen';
import './styles/global.css';

const Home           = lazy(() => import('./pages/Home'));
const Products       = lazy(() => import('./pages/Products'));
const ProductDetail  = lazy(() => import('./pages/ProductDetail'));
const Cart           = lazy(() => import('./pages/Cart'));
const Checkout       = lazy(() => import('./pages/Checkout'));
const OrderSuccess   = lazy(() => import('./pages/OrderSuccess'));
const OrderHistory   = lazy(() => import('./pages/OrderHistory'));
const OrderDetail    = lazy(() => import('./pages/OrderDetail'));
const Profile        = lazy(() => import('./pages/user/Profile'));
const Wishlist       = lazy(() => import('./pages/user/Wishlist'));
const About          = lazy(() => import('./pages/About'));
const Contact        = lazy(() => import('./pages/Contact'));
const Login          = lazy(() => import('./pages/auth/Login'));
const Register       = lazy(() => import('./pages/auth/Register'));
const OtpVerify      = lazy(() => import('./pages/auth/OtpVerify'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword  = lazy(() => import('./pages/auth/ResetPassword'));
const GoogleSuccess  = lazy(() => import('./pages/auth/GoogleSuccess'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts  = lazy(() => import('./pages/admin/Products'));
const AdminOrders    = lazy(() => import('./pages/admin/Orders'));
const AdminUsers     = lazy(() => import('./pages/admin/Users'));
const NotFound       = lazy(() => import('./pages/NotFound'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector(s => s.auth);
  if (!isAuthenticated)       return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/"     replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(s => s.auth);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// ── App ────────────────────────────────────────────────────────
function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [showSplash, setShowSplash] = React.useState(
    !sessionStorage.getItem('splashDone')
  );

  // Force splash to end after 4 seconds no matter what
  React.useEffect(() => {
    if (showSplash) {
      const t = setTimeout(() => {
        sessionStorage.setItem('splashDone', '1');
        setShowSplash(false);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [showSplash]);

  useEffect(() => {
    if (isAuthenticated) dispatch(getMe());
  }, [dispatch, isAuthenticated]);

  if (showSplash) {
    return (
      <SplashScreen onFinish={() => {
        sessionStorage.setItem('splashDone', '1');
        setShowSplash(false);
      }} />
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.875rem',
              borderRadius: '10px',
              border: '1px solid #E2E8E5',
              color: '#0F2419',
            },
          }}
        />
        <Suspense fallback={<Loader fullPage />}>
          <Routes>
            <Route path="/login"                  element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register"               element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/verify-otp"             element={<OtpVerify />} />
            <Route path="/forgot-password"        element={<AuthRoute><ForgotPassword /></AuthRoute>} />
            <Route path="/reset-password/:token"  element={<ResetPassword />} />
            <Route path="/auth/google/success"    element={<GoogleSuccess />} />
            <Route path="/admin/*"                element={<AdminRoute><AdminLayout /></AdminRoute>} />
            <Route path="/*"                      element={<MainLayout />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

// ── Main Layout (with Navbar + Footer) ─────────────────────────
function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Suspense fallback={<Loader fullPage />}>
          <Routes>
            <Route path="/"                  element={<Home />} />
            <Route path="/products"          element={<Products />} />
            <Route path="/products/:id"      element={<ProductDetail />} />
            <Route path="/cart"              element={<Cart />} />
            <Route path="/about"             element={<About />} />
            <Route path="/contact"           element={<Contact />} />
            <Route path="/checkout"          element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/orders"            element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
            <Route path="/orders/:id"        element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wishlist"          element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="*"                  element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

// ── Admin Layout ───────────────────────────────────────────────
function AdminLayout() {
  return (
    <Suspense fallback={<Loader fullPage />}>
      <Routes>
        <Route path="/"         element={<AdminDashboard />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/orders"   element={<AdminOrders />} />
        <Route path="/users"    element={<AdminUsers />} />
      </Routes>
    </Suspense>
  );
}

export default App;
