import React,{useState} from 'react';
import "./buttons.scss";

const ModalOfButtons = ({ onClose, onSelect }) => {
  const [isUnavailable] = useState(true);
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select a Game</h2>
        <button onClick={() => onSelect('Chess')}
         className="form_btn"
        >Chess
        </button>
        <button onClick={() => onSelect('Ludo')}
        className={`form_btn ${isUnavailable ? "disabled" : ""}`}
         disabled={isUnavailable}
        aria-busy={isUnavailable}>
          Ludo
        </button>
        <button onClick={() => onSelect('Soccer')}
        disabled={isUnavailable}
        aria-busy={isUnavailable}
        className={`form_btn ${isUnavailable ? "disabled" : ""}`}
        >Soccer</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalOfButtons;
