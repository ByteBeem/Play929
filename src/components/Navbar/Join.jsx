import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Join.scss';

const Modal = ({ isOpen, onClose }) => {
  const [gameId, setGameId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const[Loading , setIsLoading]=useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsButtonDisabled(
      !gameId
    );
  }, [gameId]);
  const handleInputChange = (e) => {
    setGameId(e.target.value);
  };

  const handleJoinClick = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.post( 
        "https://play929-1e88617fc658.herokuapp.com/games/JoinGame",
        {
          gameId: gameId 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      window.location.href=response.data.Link;
  
    } catch (err) {
      
    }
  
   setIsLoading(false);
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
        <button onClick={handleJoinClick} className='form_btn' disabled={Loading ||isButtonDisabled}>{Loading ? 'Joining...' : 'Join'}</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
