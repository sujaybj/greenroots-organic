import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { registerUser } from '../../redux/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [agree, setAgree] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid Indian phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) e.password = 'Must include uppercase letter and number';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agree) e.agree = 'You must agree to terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name:form.name, email:form.email, phone:form.phone, password:form.password }));
    if (!result.error) navigate('/verify-otp');
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return { level:0, label:'', color:'' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [,{label:'Weak',color:'#EF4444'},{label:'Fair',color:'#F59E0B'},{label:'Good',color:'#3B82F6'},{label:'Strong',color:'#22C55E'}];
    return { level:score, ...levels[score] };
  };
  const strength = passwordStrength();

  return (
    <>
      <Helmet><title>Create Account - GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg,#f8fff4 0%,#d1fae5 100%)' }}>

        {/* Left decorative panel — hidden on mobile */}
        <div className="hide-mobile" style={{ flex: 1, background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🌱</div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: '16px' }}>Join GreenRoots</h1>
            <div style={{ opacity: 0.85, fontSize: '1rem', lineHeight: 2.2 }}>
              {['✅ 100% Organic Products','🚚 Free Delivery on ₹500+','🎁 10% off your first order','🔒 Secure & private shopping'].map(t => (
                <div key={t}>{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(20px,5vw,40px) clamp(16px,4vw,40px)', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '420px', paddingTop: '20px', paddingBottom: '40px' }}>

            {/* Mobile logo */}
            <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '2rem' }}>🌱</span>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: '#2D6A4F', marginTop: '4px' }}>Join GreenRoots</p>
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.4rem,4vw,1.8rem)', color: '#1B1B1B' }}>Create Account</h2>
              <p style={{ color: '#6B7280', marginTop: '6px', fontSize: 'clamp(0.82rem,2vw,0.9rem)' }}>Join our organic community</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className={`form-input ${errors.name?'error':''}`} placeholder="Your full name"
                  value={form.name} onChange={e => { setForm({...form,name:e.target.value}); setErrors({...errors,name:''}); }} />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input type="email" className={`form-input ${errors.email?'error':''}`} placeholder="you@example.com"
                  value={form.email} onChange={e => { setForm({...form,email:e.target.value}); setErrors({...errors,email:''}); }} />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label">Phone Number <span style={{ color:'#9CA3AF',fontWeight:400 }}>(optional)</span></label>
                <input type="tel" className={`form-input ${errors.phone?'error':''}`} placeholder="+91 9876543210"
                  value={form.phone} onChange={e => { setForm({...form,phone:e.target.value}); setErrors({...errors,phone:''}); }} />
                {errors.phone && <p className="form-error">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass?'text':'password'} className={`form-input ${errors.password?'error':''}`}
                    placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} style={{ paddingRight: '48px' }}
                    onChange={e => { setForm({...form,password:e.target.value}); setErrors({...errors,password:''}); }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1.1rem', padding:'4px' }}>
                    {showPass?'🙈':'👁️'}
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display:'flex', gap:'4px', marginBottom:'4px' }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background: i<=strength.level ? strength.color : '#E5E7EB', transition:'background 0.3s' }} />
                      ))}
                    </div>
                    <span style={{ fontSize:'0.75rem', color:strength.color, fontWeight:600 }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input type={showPass?'text':'password'} className={`form-input ${errors.confirmPassword?'error':''}`}
                  placeholder="Re-enter password" value={form.confirmPassword}
                  onChange={e => { setForm({...form,confirmPassword:e.target.value}); setErrors({...errors,confirmPassword:''}); }} />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'20px' }}>
                <input type="checkbox" id="agree" checked={agree} onChange={e => { setAgree(e.target.checked); setErrors({...errors,agree:''}); }}
                  style={{ width:'18px', height:'18px', marginTop:'2px', accentColor:'#2D6A4F', flexShrink:0, cursor:'pointer' }} />
                <label htmlFor="agree" style={{ fontSize:'0.85rem', color:'#6B7280', cursor:'pointer', lineHeight:1.5 }}>
                  I agree to the <Link to="/terms" style={{ color:'#2D6A4F', fontWeight:600 }}>Terms of Service</Link> and <Link to="/privacy" style={{ color:'#2D6A4F', fontWeight:600 }}>Privacy Policy</Link>
                </label>
              </div>
              {errors.agree && <p className="form-error" style={{ marginTop:'-12px', marginBottom:'12px' }}>{errors.agree}</p>}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? '⏳ Creating account...' : 'Create Account 🌱'}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:'20px', color:'#6B7280', fontSize:'0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#2D6A4F', fontWeight:600 }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
