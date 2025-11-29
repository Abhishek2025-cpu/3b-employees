import React, { useEffect } from 'react';

const toastStyles = {
  container: {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1100,
    padding: '15px 25px',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '250px',
  },
  success: {
    backgroundColor: '#28a745', // Green
  },
  error: {
    backgroundColor: '#dc3545', // Red
  },
  info: {
    backgroundColor: '#17a2b8', // Blue
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.2rem',
    marginLeft: '15px',
    cursor: 'pointer',
  },
};

function Toast({ show, message, type, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Toast disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  const getToastBackgroundColor = () => {
    switch (type) {
      case 'success':
        return toastStyles.success.backgroundColor;
      case 'error':
        return toastStyles.error.backgroundColor;
      case 'info':
        return toastStyles.info.backgroundColor;
      default:
        return toastStyles.info.backgroundColor;
    }
  };

  return (
    <div style={{
      ...toastStyles.container,
      backgroundColor: getToastBackgroundColor(),
    }}>
      <span>{message}</span>
      <button style={toastStyles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
  );
}

export default Toast;