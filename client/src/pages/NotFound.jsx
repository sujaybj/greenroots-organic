// NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => (
  <>
    <Helmet><title>404 - Page Not Found</title></Helmet>
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '80px' }}>🍃</div>
      <h1 style={{ fontSize: '3rem', color: '#2D6A4F' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', color: '#374151' }}>Page Not Found</h2>
      <p style={{ color: '#9CA3AF', maxWidth: '400px' }}>Oops! This page seems to have wandered off into the forest. Let's get you back on track.</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/products" className="btn btn-outline">Shop Now</Link>
      </div>
    </div>
  </>
);

export default NotFound;
