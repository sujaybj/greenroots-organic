import React from 'react';

const Loader = ({ fullPage = false, size = 40 }) => {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        width: size, height: size, border: `3px solid #E5E7EB`,
        borderTopColor: '#2D6A4F', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'rgba(248,255,244,0.9)', zIndex: 9999,
      }}>
        <div style={{ textAlign: 'center' }}>
          {spinner}
          <p style={{ color: '#2D6A4F', marginTop: '12px', fontWeight: 500 }}>Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
