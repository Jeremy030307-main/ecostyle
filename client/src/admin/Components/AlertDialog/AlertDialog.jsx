import React from 'react';
import './AlertDialog.css'

const AlertDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-container">
        <h2 className="alert-title">{title}</h2>
        <p className="alert-message">{message}</p>
        <div className="alert-buttons">
          <button 
            className="alert-button-cancel" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="alert-button-continue" 
            onClick={onConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;