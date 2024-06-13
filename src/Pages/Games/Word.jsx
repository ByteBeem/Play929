import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './Word.scss';

const Modal = ({ isOpen, onClose }) => {
  const [bet, setBet] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const[Loading , setIsLoading]=useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsButtonDisabled(
      !bet
    );
  }, [bet]);
  const handleInputChange = (e) => {
    setBet(e.target.value);
  };

  const handleJoinClick = async () => {
    setIsLoading(true);
  
    try {
      const response = await axios.post( 
        "https://play929-1e88617fc658.herokuapp.com/games/JoinGame",
        {
            bet: bet 
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
        <h2>Enter bet Amount</h2>
        <input
          type="number"
          value={bet}
          onChange={handleInputChange}
          placeholder="Bet Amount"
        />
        <button onClick={handleJoinClick} className='form_btn' disabled={Loading ||isButtonDisabled}>{Loading ? 'Starting...' : 'Start'}</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
