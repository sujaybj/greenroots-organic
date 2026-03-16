import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// ── GreenRoots SVG Logo Mark ──────────────────────────────────
// A clean leaf + root design — professional, scalable, unique
const GreenRootsLogo = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Outer circle background */}
    <circle cx="50" cy="50" r="48" fill="rgba(116,198,157,0.15)" stroke="rgba(116,198,157,0.3)" strokeWidth="1"/>

    {/* Leaf shape — main */}
    <path
      d="M50 18 C50 18 72 28 72 48 C72 64 62 74 50 78 C38 74 28 64 28 48 C28 28 50 18 50 18Z"
      fill="rgba(116,198,157,0.25)"
      stroke="#74C69D"
      strokeWidth="1.5"
    />

    {/* Inner leaf — darker */}
    <path
      d="M50 24 C50 24 66 33 66 48 C66 61 58 70 50 73 C42 70 34 61 34 48 C34 33 50 24 50 24Z"
      fill="rgba(116,198,157,0.15)"
    />

    {/* Center vein */}
    <line x1="50" y1="24" x2="50" y2="78" stroke="#74C69D" strokeWidth="1.8" strokeLinecap="round"/>

    {/* Side veins left */}
    <path d="M50 38 C50 38 38 42 34 48" stroke="#74C69D" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M50 50 C50 50 38 54 35 60" stroke="#74C69D" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>

    {/* Side veins right */}
    <path d="M50 38 C50 38 62 42 66 48" stroke="#74C69D" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>
    <path d="M50 50 C50 50 62 54 65 60" stroke="#74C69D" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7"/>

    {/* Root lines at bottom */}
    <path d="M50 78 C50 78 44 84 42 90" stroke="#74C69D" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M50 78 C50 78 50 85 50 90" stroke="#74C69D" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M50 78 C50 78 56 84 58 90" stroke="#74C69D" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>

    {/* Small soil dots */}
    <circle cx="42" cy="90" r="1.5" fill="#74C69D" opacity="0.5"/>
    <circle cx="50" cy="91" r="1.5" fill="#74C69D" opacity="0.5"/>
    <circle cx="58" cy="90" r="1.5" fill="#74C69D" opacity="0.5"/>
  </svg>
);

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #0F2419 0%, #1B4332 40%, #2D6A4F 100%)',
        gap: '0', position: 'relative', overflow: 'hidden',
      }}>

      {/* Background decorative circles */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(116,198,157,0.04)', border: '1px solid rgba(116,198,157,0.08)' }}/>
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(116,198,157,0.04)', border: '1px solid rgba(116,198,157,0.06)' }}/>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(116,198,157,0.02)', border: '1px solid rgba(116,198,157,0.05)' }}/>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
        style={{ marginBottom: '28px' }}>
        <GreenRootsLogo size={110}/>
      </motion.div>

      {/* Brand name */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          color: 'white',
          fontSize: 'clamp(2rem,6vw,3rem)',
          fontWeight: 700,
          letterSpacing: '-0.5px',
          marginBottom: '6px',
          lineHeight: 1,
        }}>
          Green<span style={{ color: '#74C69D' }}>Roots</span>
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.72rem',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
        }}>
          Organics
        </p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '0.85rem',
          fontFamily: 'Inter, sans-serif',
          marginTop: '20px',
          letterSpacing: '0.5px',
        }}>
        Pure · Natural · Organic
      </motion.p>

      {/* Loading bar */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.0, duration: 1.8, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '48px',
          width: '120px', height: '2px',
          background: 'linear-gradient(90deg, transparent, #74C69D, transparent)',
          borderRadius: '2px',
          transformOrigin: 'left center',
        }}/>

      {/* Location badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        style={{
          position: 'absolute', bottom: '70px',
          display: 'flex', alignItems: 'center', gap: '5px',
          color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem',
          fontFamily: 'Inter, sans-serif',
        }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        Bangalore, Karnataka
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
