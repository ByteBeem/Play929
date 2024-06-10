import React from "react";
import "./Success.scss";

const ErrorModal = ({ errorMessage, isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="success-modal-overlay">
        <div className="success-modal">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          <div className="success-message">{errorMessage}</div>
          <button className="ok-button" onClick={onClose}>OK</button>
        </div>
      </div>
    )
  );
};

export default ErrorModal;
