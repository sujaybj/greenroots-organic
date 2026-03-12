import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
        gap: '24px',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        style={{ fontSize: '80px' }}
      >
        🌿
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontFamily: 'Playfair Display, serif', color: 'white',
          fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '8px',
        }}>
          GreenRoots Organics
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Pure · Natural · Organic
        </p>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ delay: 0.8, duration: 1.2 }}
        style={{ height: '3px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', marginTop: '16px' }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2 }}
        style={{ color: 'white', fontSize: '0.85rem' }}
      >
        Farm fresh, delivered to your door 🌱
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
