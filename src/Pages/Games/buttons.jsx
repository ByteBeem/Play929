import React from 'react';
import "./buttons.scss";

const ModalOfButtons = ({ onClose, onSelect }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select a Game</h2>
        <button onClick={() => onSelect('Chess')}>Chess</button>
        <button onClick={() => onSelect('Ludo')}>Ludo</button>
        <button onClick={() => onSelect('Soccer')}>Soccer</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ModalOfButtons;
