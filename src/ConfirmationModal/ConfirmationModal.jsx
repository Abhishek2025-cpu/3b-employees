import React from 'react';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1050,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    position: 'relative',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '25px',
    color: '#333',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '15px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.3s ease',
    flexGrow: 1,
  },
  confirmButton: {
    backgroundColor: '#28a745', // Green for confirmation
    color: 'white',
    '&:hover': {
      backgroundColor: '#218838',
    },
  },
  cancelButton: {
    backgroundColor: '#dc3545', // Red for cancellation
    color: 'white',
    '&:hover': {
      backgroundColor: '#c82333',
    },
  },
};

function ConfirmationModal({ show, message, onConfirm, onCancel }) {
  if (!show) {
    return null;
  }

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <p style={modalStyles.message}>{message}</p>
        <div style={modalStyles.buttonContainer}>
          <button
            style={{ ...modalStyles.button, ...modalStyles.cancelButton }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            style={{ ...modalStyles.button, ...modalStyles.confirmButton }}
            onClick={onConfirm}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;