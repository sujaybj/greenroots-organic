import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, Leaf, Loader2 } from 'lucide-react';
import { loginUser } from '../../redux/slices/authSlice';

// Official Google SVG logo
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const BACKEND = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://greenroots-backend.onrender.com';

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm]                 = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email)              errs.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password)           errs.password = 'Password is required';
    else if (form.password.length < 6)          errs.password = 'Minimum 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;
  const result = await dispatch(loginUser(form));
  if (!result.error) {
    const user = result.payload?.user;
    navigate(user?.role === 'admin' ? '/admin' : '/');
  }
};

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  return (
    <>
      <Helmet><title>Login - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>

        {/* ── Left decorative panel (desktop only) ── */}
        <div className="hide-mobile" style={{ flex: 1, background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(116,198,157,0.1)', border: '1px solid rgba(116,198,157,0.15)' }}/>
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(116,198,157,0.08)', border: '1px solid rgba(116,198,157,0.12)' }}/>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
            {/* Lucide Leaf instead of emoji */}
            <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid rgba(116,198,157,0.3)' }}>
              <Leaf size={38} color="#74C69D" strokeWidth={1.5}/>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', marginBottom: '12px' }}>GreenRoots</h1>
            <p style={{ opacity: 0.75, fontSize: '1rem', lineHeight: 1.9 }}>Pure · Natural · Organic<br/>From farm to your table</p>

            {/* Feature bullets */}
            <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              {[
                { Icon: Leaf,  text: '500+ Certified Organic Products' },
                { Icon: Mail,  text: 'Farm-fresh, delivered to your door' },
                { Icon: Lock,  text: 'Secure & trusted by 50,000+ families' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>
                  <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '6px', padding: '5px', flexShrink: 0 }}>
                    <Icon size={13} color="#74C69D" strokeWidth={2}/>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '420px' }}>

            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1B1B1B', fontFamily: 'Playfair Display, serif' }}>Welcome back!</h2>
              <p style={{ color: '#6B7280', marginTop: '6px', fontSize: '0.9rem' }}>Sign in to your GreenRoots account</p>
            </div>

            {/* ── Email / Password form FIRST ── */}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color="#9CA3AF" strokeWidth={2} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                  <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com" value={form.email}
                    style={{ paddingLeft: '38px' }}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}/>
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color="#9CA3AF" strokeWidth={2} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
                  <input type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password" value={form.password}
                    style={{ paddingLeft: '38px', paddingRight: '48px' }}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                    {showPassword ? <EyeOff size={17} strokeWidth={2}/> : <Eye size={17} strokeWidth={2}/>}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '20px' }}>
                <Link to="/forgot-password" style={{ color: '#2D6A4F', fontSize: '0.85rem', fontWeight: 600 }}>Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader2 size={17} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}/> Signing in...</> : 'Sign In'}
              </button>
            </form>

            {/* ── Divider ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}/>
              <span style={{ color: '#9CA3AF', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}/>
            </div>

            {/* ── Google LAST ── */}
            <button onClick={handleGoogleLogin}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px 20px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.93rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
              <GoogleIcon/>
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '24px', color: '#6B7280', fontSize: '0.88rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2D6A4F', fontWeight: 700 }}>Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Login;
