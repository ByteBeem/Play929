import React, { useState , useEffect} from 'react';
import './Join.scss';

const Modal = ({ isOpen, onClose }) => {
  const [gameId, setGameId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(
      !gameId
    );
  }, [gameId]);
  const handleInputChange = (e) => {
    setGameId(e.target.value);
  };

  const handleJoinClick = () => {
    console.log(`Joining game with ID: ${gameId}`);
    // Add your logic for joining the game here
    onClose(); // Close the modal after the action
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Enter Game ID</h2>
        <input
          type="text"
          value={gameId}
          onChange={handleInputChange}
          placeholder="Enter Game ID"
        />
        <button onClick={handleJoinClick} className='form_btn' disabled={isButtonDisabled}>Join</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
