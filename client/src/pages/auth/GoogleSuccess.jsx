// client/src/pages/auth/GoogleSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import axios from 'axios';

// Direct backend URL — no proxy, no env vars needed
const BACKEND = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://greenroots-backend.onrender.com';

const GoogleSuccess = () => {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const [status, setStatus] = useState('Signing you in with Google…');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      setIsError(true);
      setStatus('Google sign-in failed. Redirecting to login…');
      setTimeout(() => navigate('/login?error=google_failed'), 2000);
      return;
    }

    const loginWithToken = async () => {
      try {
        // ── KEY FIX: use token from URL as Bearer header ──────
        // Do NOT rely on cookies — they don't work cross-domain
        // between onrender.com and vercel.app
        localStorage.setItem('accessToken', token);

        const { data } = await axios.get(`${BACKEND}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (data.success && data.user) {
          dispatch(setCredentials({ user: data.user, token }));
          setStatus(`Welcome, ${data.user.name.split(' ')[0]}! 🌿`);
          setTimeout(() => navigate('/'), 1000);
        } else {
          throw new Error('User fetch failed');
        }
      } catch (err) {
        console.error('Google login error:', err.message);
        localStorage.removeItem('accessToken');
        setIsError(true);
        setStatus('Sign-in failed. Redirecting…');
        setTimeout(() => navigate('/login?error=google_failed'), 2000);
      }
    };

    loginWithToken();
  }, []); // eslint-disable-line

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fff4, #d1fae5)',
      gap: '24px', padding: '20px',
    }}>
      {/* Logo */}
      <div style={{ fontSize: '3rem' }}>🌿</div>

      {/* Spinner or checkmark */}
      {!isError ? (
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          border: '3px solid #E2E8E5', borderTopColor: '#2D6A4F',
          animation: 'spin 0.8s linear infinite',
        }} />
      ) : (
        <div style={{ fontSize: '2.5rem' }}>❌</div>
      )}

      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '1.05rem',
        color: isError ? '#EF4444' : '#2D6A4F', fontWeight: 600,
        textAlign: 'center',
      }}>
        {status}
      </p>

      <p style={{ fontSize: '0.85rem', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
        GreenRoots Organics
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GoogleSuccess;
