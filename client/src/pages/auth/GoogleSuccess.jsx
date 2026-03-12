// ─── client/src/pages/auth/GoogleSuccess.jsx ────────────────
// This page receives the redirect from Google OAuth callback.
// It reads the token from the URL, fetches the user, and logs in.
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import api from '../../utils/api';

const GoogleSuccess = () => {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const [status, setStatus] = useState('Signing you in…');

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      setStatus('Google sign-in failed. Redirecting…');
      setTimeout(() => navigate('/login?error=google_failed'), 1500);
      return;
    }

    // Fetch user info using the token
    const loginWithToken = async () => {
      try {
        // The access token is already set in cookies by the server redirect.
        // Just call /me to get the full user object.
        const { data } = await api.get('/auth/me');

        if (data.success) {
          dispatch(setCredentials({ user: data.user, token }));
          setStatus('Success! Taking you home…');
          setTimeout(() => navigate('/'), 800);
        } else {
          throw new Error('Could not fetch user');
        }
      } catch (err) {
        setStatus('Something went wrong. Redirecting…');
        setTimeout(() => navigate('/login?error=google_failed'), 1500);
      }
    };

    loginWithToken();
  }, []);  // eslint-disable-line

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FAFAFA',
      gap: '20px',
    }}>
      {/* Spinner */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        border: '3px solid #E2E8E5',
        borderTopColor: '#3B7A57',
        animation: 'spin 0.8s linear infinite',
      }} />

      <p style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '1rem',
        color: '#4a6358',
        fontWeight: 500,
      }}>
        {status}
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default GoogleSuccess;
