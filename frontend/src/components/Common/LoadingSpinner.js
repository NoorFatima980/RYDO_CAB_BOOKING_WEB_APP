import React from 'react';
import { useSelector } from 'react-redux';

const LoadingSpinner = () => {
  const { isLoading } = useSelector(state => state.loading);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        <div className="loading-spinner" style={{ 
          width: '40px', 
          height: '40px', 
          margin: '0 auto 1rem' 
        }}></div>
        <p style={{ margin: 0, color: 'var(--text-dark)' }}>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;