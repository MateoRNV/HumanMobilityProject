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
          <div>{header.title}</div>
          {!isLoading && (
            <button className="modal-close" onClick={handleClose}>
              &times;
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
