import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackNav = ({ label = 'Back', fallback = '/' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        color: '#2D6A4F',
        fontWeight: 700,
        cursor: 'pointer',
        padding: 0,
        fontSize: '0.9rem',
      }}
    >
      <ArrowLeft size={15} />
      {label}
    </button>
  );
};

export default BackNav;
