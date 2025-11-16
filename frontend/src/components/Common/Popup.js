import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePopup } from '../../redux/slices/popupSlice';

const Popup = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector(state => state.popup);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(hidePopup());
    }, 4000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const getPopupStyles = () => {
    const baseStyles = {
      success: { background: '#10B981', icon: 'fa-check-circle' },
      error: { background: '#EF4444', icon: 'fa-exclamation-circle' },
      warning: { background: '#F59E0B', icon: 'fa-exclamation-triangle' },
      info: { background: '#3B82F6', icon: 'fa-info-circle' }
    };
    
    return baseStyles[type] || baseStyles.success;
  };

  const styles = getPopupStyles();

  return (
    <div className="popup-overlay">
      <div 
        className="popup-content"
        style={{ 
          borderLeft: `4px solid ${styles.background}`,
          background: 'white'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <i 
            className={`fas ${styles.icon}`} 
            style={{ color: styles.background, fontSize: '1.5rem' }}
          ></i>
          <div style={{ flex: 1 }}>
            <h4 style={{ 
              margin: '0 0 0.25rem 0', 
              color: '#1F2937',
              textTransform: 'capitalize'
            }}>
              {type}
            </h4>
            <p style={{ margin: 0, color: '#6B7280' }}>{message}</p>
          </div>
          <button 
            onClick={() => dispatch(hidePopup())}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;