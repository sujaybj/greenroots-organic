import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Loader2, BadgeCheck, Truck, Gift, ShieldCheck, Sprout,
} from 'lucide-react';
import { registerUser } from '../../redux/slices/authSlice';

const BACKEND = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://greenroots-backend.onrender.com';

// Google SVG icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LEFT_FEATURES = [
  { Icon: BadgeCheck, color: '#74C69D', text: '100% Organic Certified Products' },
  { Icon: Truck,      color: '#74C69D', text: 'Free Delivery on orders above ₹500' },
  { Icon: Gift,       color: '#74C69D', text: '10% off your first order — ORGANIC10' },
  { Icon: ShieldCheck,color: '#74C69D', text: 'Secure & private shopping' },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]   = useState({});
  const [agree, setAgree]     = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())               errs.name = 'Name is required';
    else if (form.name.length < 2)       errs.name = 'At least 2 characters';
    if (!form.email)                     errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid Indian phone number';
    if (!form.password)                  errs.password = 'Password is required';
    else if (form.password.length < 8)   errs.password = 'At least 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) errs.password = 'Must include uppercase & number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agree)                          errs.agree = 'You must agree to the terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }));
    if (!result.error) navigate('/verify-otp');
  };

  const handleGoogleSignup = () => {
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return { level: 0, label: '', color: '' };
    let s = 0;
    if (p.length >= 8)        s++;
    if (/[A-Z]/.test(p))     s++;
    if (/[0-9]/.test(p))     s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return [, { label: 'Weak', color: '#EF4444' }, { label: 'Fair', color: '#F59E0B' }, { label: 'Good', color: '#3B82F6' }, { label: 'Strong', color: '#22C55E' }][s] || { level: s, label: '', color: '' };
  })();

  const InputIcon = ({ icon: Icon }) => (
    <Icon size={15} color="#9CA3AF" strokeWidth={2}
      style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}/>
  );

  return (
    <>
      <Helmet><title>Create Account - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>

        {/* ── Left panel ── */}
        <div className="hide-mobile" style={{ flex: 1, background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 60%, #40916C 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(116,198,157,0.08)', border: '1px solid rgba(116,198,157,0.12)' }}/>
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(116,198,157,0.06)', border: '1px solid rgba(116,198,157,0.1)' }}/>

          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '2px solid rgba(116,198,157,0.3)' }}>
              <Sprout size={38} color="#74C69D" strokeWidth={1.5}/>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', marginBottom: '8px' }}>Join GreenRoots</h1>
            <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '36px' }}>Start your organic journey today</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              {LEFT_FEATURES.map(({ Icon, color, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '8px', padding: '7px', flexShrink: 0 }}>
                    <Icon size={15} color={color} strokeWidth={2}/>
                  </div>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', overflowY: 'auto' }}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: '420px', paddingTop: '16px', paddingBottom: '16px' }}>

            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1B1B1B', fontFamily: 'Playfair Display, serif' }}>Create Account</h2>
              <p style={{ color: '#6B7280', marginTop: '6px', fontSize: '0.88rem' }}>Join our organic community</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <InputIcon icon={User}/>
                  <input type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="John Doe" value={form.name} style={{ paddingLeft: '38px' }}
                    onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}/>
                </div>
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <InputIcon icon={Mail}/>
                  <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com" value={form.email} style={{ paddingLeft: '38px' }}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}/>
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
                <div style={{ position: 'relative' }}>
                  <InputIcon icon={Phone}/>
                  <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`}
                    placeholder="9876543210" value={form.phone} style={{ paddingLeft: '38px' }}
                    onChange={e => { setForm({ ...form, phone: e.target.value.replace(/\D/g, '') }); setErrors({ ...errors, phone: '' }); }}/>
                </div>
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <InputIcon icon={Lock}/>
                  <input type={showPass ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Min. 8 characters" style={{ paddingLeft: '38px', paddingRight: '44px' }}
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                    {showPass ? <EyeOff size={17} strokeWidth={2}/> : <Eye size={17} strokeWidth={2}/>}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(strength.level / 4) * 100}%`, background: strength.color, transition: 'all 0.3s', borderRadius: '2px' }}/>
                    </div>
                    <p style={{ color: strength.color, fontSize: '0.75rem', marginTop: '4px', fontWeight: 500 }}>
                      Strength: {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <InputIcon icon={Lock}/>
                  <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm your password" style={{ paddingLeft: '38px' }}
                    value={form.confirmPassword}
                    onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}/>
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                <input type="checkbox" id="agree" checked={agree}
                  onChange={e => { setAgree(e.target.checked); setErrors({ ...errors, agree: '' }); }}
                  style={{ width: '16px', height: '16px', marginTop: '3px', accentColor: '#2D6A4F' }}/>
                <label htmlFor="agree" style={{ fontSize: '0.83rem', color: '#374151', lineHeight: 1.6, cursor: 'pointer' }}>
                  I agree to the <a href="#" style={{ color: '#2D6A4F', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: '#2D6A4F', fontWeight: 600 }}>Privacy Policy</a>
                </label>
              </div>
              {errors.agree && <p className="form-error" style={{ marginTop: '-14px', marginBottom: '12px' }}>{errors.agree}</p>}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading
                  ? <><Loader2 size={17} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}/> Creating account...</>
                  : <><Sprout size={16} strokeWidth={2}/> Create Account</>
                }
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}/>
              <span style={{ color: '#9CA3AF', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>or sign up with</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}/>
            </div>

            {/* Google signup — bottom */}
            <button onClick={handleGoogleSignup}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontWeight: 600, fontSize: '0.93rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}>
              <GoogleIcon/> Continue with Google
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#6B7280', fontSize: '0.88rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2D6A4F', fontWeight: 700 }}>Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Register;
