import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { loginUser } from '../../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser(form));
    if (!result.error) navigate('/');
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <>
      <Helmet><title>Login - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg,#f8fff4 0%,#d1fae5 100%)' }}>

        {/* Left decorative panel — hidden on mobile */}
        <div className="hide-mobile" style={{ flex: 1, background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌿</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '12px' }}>GreenRoots</h1>
            <p style={{ opacity: 0.8, fontSize: '1.05rem', lineHeight: 1.9 }}>Pure, Natural, Organic<br />From farm to your table 🌱</p>
          </div>
        </div>

        {/* Right form panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px,5vw,40px) clamp(16px,4vw,40px)', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>

            {/* Mobile logo */}
            <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '2.5rem' }}>🌿</span>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#2D6A4F', marginTop: '6px' }}>GreenRoots</p>
            </div>

            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem,4vw,1.8rem)', color: '#1B1B1B' }}>Welcome back!</h2>
              <p style={{ color: '#6B7280', marginTop: '6px', fontSize: 'clamp(0.85rem,2vw,0.95rem)' }}>Sign in to your GreenRoots account</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className={`form-input ${errors.email?'error':''}`} placeholder="you@example.com"
                  value={form.email} onChange={e => { setForm({...form,email:e.target.value}); setErrors({...errors,email:''}); }} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword?'text':'password'} className={`form-input ${errors.password?'error':''}`}
                    placeholder="Enter your password" value={form.password} style={{ paddingRight: '48px' }}
                    onChange={e => { setForm({...form,password:e.target.value}); setErrors({...errors,password:''}); }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}>
                    {showPassword?'🙈':'👁️'}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-6px', marginBottom: '18px' }}>
                <Link to="/forgot-password" style={{ color: '#2D6A4F', fontSize: '0.875rem', fontWeight: 500 }}>Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>

            <button onClick={handleGoogleLogin} className="btn btn-full"
              style={{ border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontWeight: 600 }}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '18px', height: '18px', display: 'inline' }} />
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '22px', color: '#6B7280', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#2D6A4F', fontWeight: 600 }}>Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
