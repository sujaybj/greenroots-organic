import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { loginUser } from '../../redux/slices/authSlice';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Detects if running in production — no env var needed
const BACKEND = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://greenroots-backend.onrender.com';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (!result.error) navigate('/');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  return (
    <>
      <Helmet><title>Login - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f8fff4 0%, #d1fae5 100%)' }}>

        {/* Left Panel — hidden on mobile */}
        <div className="hide-mobile" style={{ flex: 1, background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌿</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '12px' }}>GreenRoots</h1>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.8 }}>Pure, Natural, Organic<br />From farm to your table 🌱</p>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '420px' }}>

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1B1B1B' }}>Welcome back!</h2>
              <p style={{ color: '#6B7280', marginTop: '6px' }}>Sign in to your GreenRoots account</p>
            </div>

            {/* Google Button — real SVG icon */}
            <button onClick={handleGoogleLogin} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', padding: '12px 20px', borderRadius: '10px',
              border: '1.5px solid #E5E7EB', background: 'white',
              color: '#374151', fontWeight: 600, fontSize: '0.95rem',
              cursor: 'pointer', marginBottom: '20px', transition: 'box-shadow 0.2s, border-color 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = '#2D6A4F'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span style={{ color: '#9CA3AF', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>or with email</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com" value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password" value={form.password}
                    style={{ paddingRight: '48px' }}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '20px' }}>
                <Link to="/forgot-password" style={{ color: '#2D6A4F', fontSize: '0.875rem', fontWeight: 500 }}>Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Signing in...' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', color: '#6B7280', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2D6A4F', fontWeight: 600 }}>Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
