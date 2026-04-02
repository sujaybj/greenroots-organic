import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { verifyOTP } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

export const OtpVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, pendingUserId } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(600);

  useEffect(() => {
    if (!pendingUserId) navigate('/register');
    const interval = setInterval(() => setTimer((t) => (t <= 1 ? 0 : t - 1)), 1000);
    return () => clearInterval(interval);
  }, [pendingUserId, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d)) handleVerify(newOtp.join(''));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = async (code) => {
    const result = await dispatch(verifyOTP({ userId: pendingUserId, otp: code }));
    if (!result.error) navigate('/');
  };

  const handleResend = () => {
    toast.success('OTP resent!');
    setTimer(600);
    setOtp(['', '', '', '', '', '']);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fff4 0%, #d1fae5 100%)', padding: '20px' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF3', display: 'grid', placeItems: 'center' }}>
            <Mail size={30} color="#2D6A4F" />
          </div>
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Verify Your Email</h2>
        <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '0.95rem' }}>We've sent a 6-digit code to your email. Enter it below.</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, border: `2px solid ${digit ? '#2D6A4F' : '#E5E7EB'}`, borderRadius: '10px', outline: 'none', transition: 'all 0.2s', background: digit ? '#f0faf4' : 'white' }}
            />
          ))}
        </div>

        <button onClick={() => handleVerify(otp.join(''))} className="btn btn-primary btn-full btn-lg" disabled={loading || otp.join('').length < 6} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : <><CheckCircle2 size={16} /> Verify Email</>}
        </button>

        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#6B7280' }}>
          {timer > 0 ? (
            <p>Resend OTP in <strong style={{ color: '#2D6A4F' }}>{formatTime(timer)}</strong></p>
          ) : (
            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#2D6A4F', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Resend OTP</button>
          )}
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default OtpVerify;
