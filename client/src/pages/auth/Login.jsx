import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { loginUser } from '../../redux/slices/authSlice';

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
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (!result.error) {
      const user = result.payload?.user;
      // Redirect to where they came from, or role-based default
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') { navigate(from, { replace: true }); }
      else if (user?.role === 'admin') { navigate('/admin', { replace: true }); }
      else { navigate('/', { replace: true }); }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <>
      <Helmet><title>Login - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f8fff4 0%, #d1fae5 100%)' }}>
        {/* Left Panel */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }} className="hide-mobile">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌿</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '12px' }}>GreenRoots</h1>
            <p style={{ opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.8 }}>Pure, Natural, Organic<br />From farm to your table 🌱</p>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <motion.div
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '420px' }}
          >
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1B1B1B' }}>Welcome back!</h2>
              <p style={{ color: '#6B7280', marginTop: '6px' }}>Sign in to your GreenRoots account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    value={form.password}
                    style={{ paddingRight: '48px' }}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  />
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>

            <button onClick={handleGoogleLogin} className="btn btn-full"
              style={{ border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontWeight: 600, padding: '12px' }}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px' }} />
              Continue with Google
            </button>

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
