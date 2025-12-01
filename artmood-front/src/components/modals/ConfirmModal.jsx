// components/modals/ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar acción",
  message = "¿Estás seguro de realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger" // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay confirm-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirm-modal-content">
        {/* Icono según tipo */}
        <div className={`confirm-modal-icon ${type}`}>
          {type === 'danger' && (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V12M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {type === 'warning' && (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
          {type === 'info' && (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {/* Contenido */}
        <div className="confirm-modal-header">
          <h3 className="confirm-modal-title">{title}</h3>
          <button onClick={onClose} className="confirm-modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="confirm-modal-body">
          <p className="confirm-modal-message">{message}</p>
        </div>

        {/* Acciones */}
        <div className="confirm-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="confirm-modal-btn cancel-btn"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`confirm-modal-btn confirm-btn ${type}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;