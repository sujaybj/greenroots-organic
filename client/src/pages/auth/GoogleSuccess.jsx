import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Leaf, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { getMe } from '../../redux/slices/authSlice';

// ── This page handles the Google OAuth redirect ───────────────
// Backend redirects here: /auth/google/success?token=xxx
// We read the token, store it, call /me to get user data, then
// redirect to the home page (or wherever user came from).

const GoogleSuccess = () => {
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const [params]       = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      setStatus('error');
      setMessage('Google login failed. Please try again.');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    // Store token in localStorage (same as email login)
    localStorage.setItem('accessToken', token);

    let cancelled = false;

    const finishGoogleLogin = async (attempt = 1) => {
      try {
        await dispatch(getMe()).unwrap();
        if (cancelled) return;
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1200);
      } catch (err) {
        if (cancelled) return;

        const status = err?.status || null;
        const isRetryable = !status || status >= 500;

        if (isRetryable && attempt < 3) {
          setMessage(`Finalizing your login... (${attempt}/3)`);
          setTimeout(() => {
            finishGoogleLogin(attempt + 1);
          }, 1500 * attempt);
          return;
        }

        setStatus('error');
        setMessage(err?.message || 'Could not fetch user data. Please login again.');
        localStorage.removeItem('accessToken');
        setTimeout(() => navigate('/login'), 2500);
      }
    };

    finishGoogleLogin();

    return () => {
      cancelled = true;
    };
  }, [params, navigate, dispatch]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(116,198,157,0.2)', borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(116,198,157,0.3)' }}>
          <Leaf size={24} color="#74C69D" strokeWidth={1.8}/>
        </div>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'white', fontWeight: 700 }}>
          Green<span style={{ color: '#74C69D' }}>Roots</span>
        </span>
      </div>

      {/* Status card */}
      <div style={{ background: 'white', borderRadius: '18px', padding: '36px 40px', textAlign: 'center', maxWidth: '340px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {status === 'loading' && (
          <>
            <Loader2 size={44} color="#2D6A4F" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}/>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#1B1B1B', marginBottom: '8px' }}>
              Signing you in...
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>Completing Google authentication</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ background: '#D1FAE5', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={32} color="#059669" strokeWidth={1.8}/>
            </div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>
              Login Successful!
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ background: '#FEE2E2', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <XCircle size={32} color="#DC2626" strokeWidth={1.8}/>
            </div>
            <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#DC2626', marginBottom: '8px' }}>
              Login Failed
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>{message}</p>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GoogleSuccess;
