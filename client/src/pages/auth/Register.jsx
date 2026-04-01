import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, Mail, Lock, User, Phone, Leaf, Loader2, ShieldCheck, Truck, Gift, Users } from 'lucide-react';
import { registerUser } from '../../redux/slices/authSlice';

const features = [
  { Icon: Leaf,       text: '100% Organic Certified Products' },
  { Icon: Truck,      text: 'Free delivery on orders above ₹500' },
  { Icon: Gift,       text: '10% off your first order — ORGANIC10' },
  { Icon: ShieldCheck,text: 'Secure & private shopping' },
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]         = useState({});
  const [agree, setAgree]           = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name = 'Name is required';
    if (!form.email)        errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Invalid Indian phone number';
    if (!form.password)     errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) errs.password = 'Must include uppercase and number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agree) errs.agree = 'You must agree to terms';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(registerUser({ name:form.name, email:form.email, phone:form.phone, password:form.password }));
    if (!result.error) navigate('/verify-otp');
  };

  const strength = () => {
    const p = form.password;
    if (!p) return { level:0, label:'', color:'' };
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const map = [,{ label:'Weak',color:'#EF4444' },{ label:'Fair',color:'#F59E0B' },{ label:'Good',color:'#3B82F6' },{ label:'Strong',color:'#22C55E' }];
    return { level:s, ...map[s] };
  };
  const pw = strength();

  const field = (icon, type, name, placeholder, extra = {}) => (
    <div className="form-group">
      <label className="form-label">{extra.label || name} {extra.optional && <span style={{ color:'#9CA3AF', fontWeight:400 }}>(optional)</span>}</label>
      <div style={{ position:'relative' }}>
        <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', display:'flex' }}>{icon}</span>
        <input type={type} className={`form-input ${errors[name]?'error':''}`} placeholder={placeholder}
          style={{ paddingLeft:'38px', ...(extra.pr ? { paddingRight:'48px' } : {}) }}
          value={form[name]}
          onChange={e => { setForm({...form,[name]: name==='phone' ? e.target.value.replace(/\D/,'') : e.target.value}); setErrors({...errors,[name]:''}); }}/>
        {extra.toggle && (
          <button type="button" onClick={extra.toggle} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex' }}>
            {extra.showing ? <EyeOff size={17}/> : <Eye size={17}/>}
          </button>
        )}
      </div>
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      <Helmet><title>Create Account — GreenRoots Organics</title></Helmet>
      <div style={{ minHeight:'100vh', display:'flex' }}>

        {/* Left panel */}
        <div className="hide-mobile" style={{ flex:1, background:'linear-gradient(160deg,#1B4332 0%,#2D6A4F 60%,#40916C 100%)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(116,198,157,0.1)', border:'1px solid rgba(116,198,157,0.15)' }}/>
          <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(116,198,157,0.08)', border:'1px solid rgba(116,198,157,0.12)' }}/>
          <motion.div initial={{ y:-20,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:0.3 }} style={{ textAlign:'center', color:'white', position:'relative', zIndex:1 }}>
            <div style={{ background:'rgba(116,198,157,0.2)', borderRadius:'50%', width:'80px', height:'80px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', border:'2px solid rgba(116,198,157,0.3)' }}>
              <Leaf size={38} color="#74C69D" strokeWidth={1.5}/>
            </div>
            <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'2.4rem', marginBottom:'8px' }}>Join GreenRoots</h1>
            <p style={{ opacity:0.7, fontSize:'0.95rem', marginBottom:'36px' }}>Start your organic journey today</p>
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
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'#f8fff4', overflowY:'auto' }}>
          <motion.div initial={{ x:40,opacity:0 }} animate={{ x:0,opacity:1 }} transition={{ duration:0.5 }} style={{ width:'100%', maxWidth:'420px' }}>
            <div style={{ marginBottom:'28px', textAlign:'center' }}>
              <h2 style={{ fontSize:'1.8rem', fontFamily:'Playfair Display,serif', color:'#1B1B1B' }}>Create Account</h2>
              <p style={{ color:'#6B7280', marginTop:'6px', fontSize:'0.9rem' }}>Join our organic community</p>
            </div>

            <form onSubmit={handleSubmit}>
              {field(<User size={15} color="#9CA3AF"/>, 'text', 'name', 'John Doe', { label:'Full Name *' })}
              {field(<Mail size={15} color="#9CA3AF"/>, 'email', 'email', 'you@example.com', { label:'Email Address *' })}
              {field(<Phone size={15} color="#9CA3AF"/>, 'tel', 'phone', '9876543210', { label:'Phone', optional:true })}

              {/* Password with strength */}
              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} color="#9CA3AF" style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type={showPass?'text':'password'} className={`form-input ${errors.password?'error':''}`}
                    placeholder="Min. 8 characters" style={{ paddingLeft:'38px', paddingRight:'48px' }}
                    value={form.password}
                    onChange={e => { setForm({...form,password:e.target.value}); setErrors({...errors,password:''}); }}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex' }}>
                    {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop:'8px' }}>
                    <div style={{ height:'4px', background:'#E5E7EB', borderRadius:'2px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(pw.level/4)*100}%`, background:pw.color, transition:'all 0.3s', borderRadius:'2px' }}/>
                    </div>
                    <p style={{ color:pw.color, fontSize:'0.75rem', marginTop:'4px' }}>Strength: {pw.label}</p>
                  </div>
                )}
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} color="#9CA3AF" style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
                  <input type={showConfirm?'text':'password'} className={`form-input ${errors.confirmPassword?'error':''}`}
                    placeholder="Confirm your password" style={{ paddingLeft:'38px', paddingRight:'48px' }}
                    value={form.confirmPassword}
                    onChange={e => { setForm({...form,confirmPassword:e.target.value}); setErrors({...errors,confirmPassword:''}); }}/>
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', display:'flex' }}>
                    {showConfirm ? <EyeOff size={17}/> : <Eye size={17}/>}
                  </button>
                </div>
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'8px' }}>
                <input type="checkbox" id="agree" checked={agree} onChange={e => { setAgree(e.target.checked); setErrors({...errors,agree:''}); }}
                  style={{ width:'16px', height:'16px', marginTop:'2px', accentColor:'#2D6A4F', flexShrink:0 }}/>
                <label htmlFor="agree" style={{ fontSize:'0.875rem', color:'#374151', lineHeight:1.5, cursor:'pointer' }}>
                  I agree to the <Link to="#" style={{ color:'#2D6A4F' }}>Terms of Service</Link> and <Link to="#" style={{ color:'#2D6A4F' }}>Privacy Policy</Link>
                </label>
              </div>
              {errors.agree && <p className="form-error" style={{ marginBottom:'12px' }}>{errors.agree}</p>}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'8px' }}>
                {loading ? <><Loader2 size={17} style={{ animation:'spin 1s linear infinite' }}/> Creating account...</> : <><Leaf size={16}/> Create Account</>}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:'20px', color:'#6B7280', fontSize:'0.88rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#2D6A4F', fontWeight:700 }}>Sign In</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Register;