import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, children, header, isLoading }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            {header.icon && (
              <span className="material-symbols-outlined modal-header-icon">
                {header.icon}
              </span>
            )}
            <h2 className="modal-title">{header.title}</h2>
          </div>
          {!isLoading && (
            <button
              className="modal-close"
              onClick={handleClose}
              aria-label="Cerrar modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
