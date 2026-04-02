import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, KeyRound, Loader2, MailCheck } from 'lucide-react';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password - GreenRoots</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fff4 0%, #d1fae5 100%)', padding: '20px' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', textAlign: 'center' }}>
          {!sent ? (
            <>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF3', display: 'grid', placeItems: 'center' }}>
                  <KeyRound size={30} color="#2D6A4F" />
                </div>
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Forgot Password?</h2>
              <p style={{ color: '#6B7280', marginBottom: '28px', fontSize: '0.95rem' }}>Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</> : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF3', display: 'grid', placeItems: 'center' }}>
                  <MailCheck size={30} color="#16A34A" />
                </div>
              </div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Check Your Email</h2>
              <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Password reset instructions have been sent to <strong>{email}</strong>. Check your inbox (and spam folder).</p>
            </>
          )}
          <p style={{ marginTop: '24px', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: '#2D6A4F', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={14} /> Back to Login</Link>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default ForgotPassword;
