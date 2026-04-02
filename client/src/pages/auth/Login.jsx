import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, Leaf, Loader2, ShieldCheck, Truck, Users } from 'lucide-react';
import { getMe, loginUser } from '../../redux/slices/authSlice';
import BackNav from '../../components/common/BackNav';
import API from '../../utils/api';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const resolveGoogleAuthUrl = () => {
  const base = API.defaults.baseURL || '/api';
  if (typeof base === 'string' && /^https?:\/\//.test(base)) return `${base}/auth/google`;
  return '/api/auth/google';
};

const features = [
  { Icon: Leaf,       text: '500+ Certified Organic Products' },
  { Icon: Truck,      text: 'Free delivery on orders above ₹500' },
  { Icon: ShieldCheck,text: 'Secure & trusted by 50,000+ families' },
  { Icon: Users,      text: 'Supporting 200+ local farmers' },
];

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleToken = params.get('google_token');
    if (!googleToken) return;

    localStorage.setItem('accessToken', googleToken);
    dispatch(getMe())
      .unwrap()
      .then((payload) => {
        const role = payload?.user?.role;
        navigate(role === 'admin' ? '/admin' : '/', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
      });
  }, [dispatch, location.search, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required';
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
    if (!result.error) {
      const user = result.payload?.user;
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') navigate(from, { replace: true });
      else if (user?.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  };

  const handleGoogle = () => {
    window.location.href = resolveGoogleAuthUrl();
  };

  return (
    <>
      <Helmet><title>Sign In — GreenRoots Organics</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* Left panel */}
        <div className="hide-mobile" style={{ flex: 1, background: 'linear-gradient(160deg,#1B4332 0%,#2D6A4F 60%,#40916C 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(116,198,157,0.1)', border:'1px solid rgba(116,198,157,0.15)' }}/>
          <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(116,198,157,0.08)', border:'1px solid rgba(116,198,157,0.12)' }}/>
          <motion.div initial={{ y:-20,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:0.3 }} style={{ textAlign:'center', color:'white', position:'relative', zIndex:1 }}>
            <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'50%', width:'80px', height:'80px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', border:'2px solid rgba(116,198,157,0.3)' }}>
              <Leaf size={38} color="#74C69D" strokeWidth={1.5}/>
            </div>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'2.4rem', marginBottom:'8px' }}>GreenRoots</h1>
            <p style={{ opacity:0.7, fontSize:'0.95rem', marginBottom:'36px' }}>Pure · Natural · Organic</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px', textAlign:'left' }}>
              {features.map(({ Icon, text }) => (
                <div key={text} style={{ display:'flex', alignItems:'center', gap:'12px', color:'rgba(255,255,255,0.9)', fontSize:'0.88rem' }}>
                  <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'8px', padding:'7px', flexShrink:0 }}>
                    <Icon size={14} color="#74C69D" strokeWidth={2}/>
                  </div>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right panel */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'#f8fff4' }}>
          <motion.div initial={{ x:40,opacity:0 }} animate={{ x:0,opacity:1 }} transition={{ duration:0.5 }} style={{ width:'100%', maxWidth:'420px' }}>
            <div style={{ marginBottom: '14px' }}>
              <BackNav label="Back" fallback="/" />
            </div>
            <div style={{ marginBottom:'28px', textAlign:'center' }}>
              <h2 style={{ fontSize:'1.8rem', fontFamily:'Playfair Display,serif', color:'#1B1B1B' }}>Welcome back!</h2>
              <p style={{ color:'#6B7280', marginTop:'6px', fontSize:'0.9rem' }}>Sign in to your GreenRoots account</p>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
              <div style={{ flex:1, height:'1px', background:'#E5E7EB' }}/>
              <span style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>or sign in with email</span>
              <div style={{ flex:1, height:'1px', background:'#E5E7EB' }}/>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div style={{ position:'relative' }}>
                  <Mail size={15} color="#9CA3AF" style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type="email" className={`form-input ${errors.email?'error':''}`} placeholder="you@example.com"
                    style={{ paddingLeft:'38px' }} value={form.email}
                    onChange={e => { setForm({...form,email:e.target.value}); setErrors({...errors,email:''}); }}/>
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} color="#9CA3AF" style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type={showPass?'text':'password'} className={`form-input ${errors.password?'error':''}`}
                    placeholder="Enter your password" style={{ paddingLeft:'38px', paddingRight:'48px' }}
                    value={form.password}
                    onChange={e => { setForm({...form,password:e.target.value}); setErrors({...errors,password:''}); }}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex' }}>
                    {showPass ? <EyeOff size={17} strokeWidth={2}/> : <Eye size={17} strokeWidth={2}/>}
                  </button>
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'-8px', marginBottom:'20px' }}>
                <Link to="/forgot-password" style={{ color:'#2D6A4F', fontSize:'0.85rem', fontWeight:600 }}>Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                {loading ? <><Loader2 size={17} style={{ animation:'spin 1s linear infinite' }}/> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginTop:'18px', marginBottom:'12px' }}>
              <div style={{ flex:1, height:'1px', background:'#E5E7EB' }}/>
              <span style={{ color:'#9CA3AF', fontSize:'0.82rem' }}>or continue with</span>
              <div style={{ flex:1, height:'1px', background:'#E5E7EB' }}/>
            </div>

            <button onClick={handleGoogle} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', padding:'12px 20px', borderRadius:'10px', border:'1.5px solid #E5E7EB', background:'white', color:'#374151', fontWeight:600, fontSize:'0.93rem', cursor:'pointer', marginBottom:'12px', transition:'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.1)'}
              onMouseOut={e => e.currentTarget.style.boxShadow='none'}>
              <GoogleIcon/> Continue with Google
            </button>

            <p style={{ textAlign:'center', marginTop:'24px', color:'#6B7280', fontSize:'0.88rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#2D6A4F', fontWeight:700 }}>Create Account</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Login;
