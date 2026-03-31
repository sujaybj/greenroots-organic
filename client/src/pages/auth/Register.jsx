import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { registerUser } from '../../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid Indian phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) errs.password = 'Must include uppercase letter and number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agree) errs.agree = 'You must agree to terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }));
    if (!result.error) navigate('/verify-otp');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [, { label: 'Weak', color: '#EF4444' }, { label: 'Fair', color: '#F59E0B' }, { label: 'Good', color: '#3B82F6' }, { label: 'Strong', color: '#22C55E' }];
    return { level: score, ...levels[score] };
  };

  const strength = passwordStrength();

  return (
    <>
      <Helmet><title>Create Account - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f8fff4 0%, #d1fae5 100%)' }}>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #1B4332, #2D6A4F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }} className="hide-mobile">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌱</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '12px' }}>Join GreenRoots</h1>
            <p style={{ opacity: 0.8, fontSize: '1.05rem', lineHeight: 1.9 }}>
              ✅ Fresh Natural Products<br />
              🚚 Free Delivery on ₹500+<br />
              🎁 10% off your first order<br />
              🔒 Secure & private shopping
            </p>
          </motion.div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowY: 'auto' }}>
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#1B1B1B' }}>Create Account</h2>
              <p style={{ color: '#6B7280', marginTop: '6px' }}>Join our community</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="John Doe"
                  value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="you@example.com"
                  value={form.email} onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number <span style={{ color: '#9CA3AF' }}>(optional)</span></label>
                <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+91 9876543210"
                  value={form.phone} onChange={e => { setForm({ ...form, phone: e.target.value.replace(/\D/g, '') }); setErrors({ ...errors, phone: '' }); }} />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Min. 8 characters" style={{ paddingRight: '48px' }}
                    value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(strength.level / 4) * 100}%`, background: strength.color, transition: 'all 0.3s', borderRadius: '2px' }} />
                    </div>
                    <p style={{ color: strength.color, fontSize: '0.78rem', marginTop: '4px' }}>Password strength: {strength.label}</p>
                  </div>
                )}
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  value={form.confirmPassword} onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }} />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                <input type="checkbox" id="agree" checked={agree} onChange={e => { setAgree(e.target.checked); setErrors({ ...errors, agree: '' }); }}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: '#2D6A4F' }} />
                <label htmlFor="agree" style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5, cursor: 'pointer' }}>
                  I agree to the <a href="#" style={{ color: '#2D6A4F' }}>Terms of Service</a> and <a href="#" style={{ color: '#2D6A4F' }}>Privacy Policy</a>
                </label>
              </div>
              {errors.agree && <p className="form-error" style={{ marginTop: '-12px', marginBottom: '12px' }}>{errors.agree}</p>}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Creating account...' : 'Create Account 🌱'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#6B7280', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2D6A4F', fontWeight: 600 }}>Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;
