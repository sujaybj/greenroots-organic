import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import API from '../../utils/api';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password reset successful!');
      navigate('/login');
    } catch {
      toast.error('Invalid or expired reset link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password - GreenRoots</title></Helmet>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fff4 0%, #d1fae5 100%)', padding: '20px' }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '60px', marginBottom: '12px' }}>🔒</div>
            <h2 style={{ fontSize: '1.6rem' }}>Reset Your Password</h2>
            <p style={{ color: '#6B7280', marginTop: '6px', fontSize: '0.95rem' }}>Choose a strong new password</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="Min. 8 characters"
                  value={form.password} style={{ paddingRight: '48px' }}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" placeholder="Confirm password"
                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="form-error">Passwords do not match</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Resetting...' : 'Reset Password ✓'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
            <Link to="/login" style={{ color: '#2D6A4F', fontWeight: 600 }}>← Back to Login</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
