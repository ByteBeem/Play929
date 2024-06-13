import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "../../Pages/Login/Auth";
import Create from "../../Pages/Games/create";
import ModalOfButtons from "../../Pages/Games/buttons";
import Error from "../../Pages/ErrorModal/ErrorModal";
import "./Navbar.scss";
import Join from "./Join";

const Navbar = ({ showSidebar }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);

  const JoinopenModal = () => {
    setJoinModalOpen(true);
  };

  const JoincloseModal = () => {
    setJoinModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGameSelection = (game) => {

    setSelectedGame(game);
    closeModal();
    setCreateModalOpen(true);
  };




  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserData(token);
    } else {
      setLoginModalOpen(true);
    }
  }, []);

  const fetchUserData = (token) => {
    setLoading(true);
    axios
      .get('https://play929-1e88617fc658.herokuapp.com/users/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const balance = response.data;
        if (balance !== undefined) {
          setUserData(balance);
        }
      })
      .catch((error) => {
        setErrorMessage(`${error.message} ,  Check Your internet connection`);
        setErrorModalOpen(true);

      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCurrencySymbol = () => {
    const country = userData.country;
    const symbol = country === 'ZA' ? 'R' : '$';
    localStorage.setItem("country", country);
    return symbol;
  };

  return (
    <>
      <header>
       
        
          <li>
            <div className="balance">
              
              {loading ? "Loading..." : (
                userData.balance ? `${getCurrencySymbol()}${userData.balance}` :
                  <button className="form_btn" onClick={() => setLoginModalOpen(true)}>Login</button>
              )}
            </div>
          </li>

          {token &&

<div className="join">
  <div className="join_name" >Join Game</div>
  <button className="torn_btn" onClick={JoinopenModal}>+</button>
</div>

}

      
      </header>
      {createModalOpen && <Create isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} selectedGame={selectedGame} />}
      {isModalOpen && (
        <ModalOfButtons
          onClose={closeModal}
          onSelect={handleGameSelection}
        />
      )}
      {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
      {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
      <Join isOpen={isJoinModalOpen} onClose={JoincloseModal} />
    </>
  );
};

export default Navbar;
