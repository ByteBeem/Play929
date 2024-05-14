import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "../../Pages/Login/Auth";
import Create from "../../Pages/Games/create";
import Error from "../../Pages/ErrorModal/ErrorModal";
import "./Navbar.scss";

const Navbar = ({ showSidebar }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userEmail = localStorage.getItem("userEmail");

 const ws = new WebSocket('wss://play929-1e88617fc658.herokuapp.com');
ws.onopen = () => {
  ws.send(JSON.stringify({ userId: userEmail }));
};

 
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'onlineStatus') {
      const onlineUserIds = data.onlineUserIds;
      console.log(onlineUserIds)
      
    }
  };
  
  setInterval(() => {
    
    ws.send(JSON.stringify({ type: 'heartbeat', userId: userEmail }));
  }, 30000);

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
        <ul className="games_filter">
          <li>
            <div className="balance">
              <h6>Play929</h6>
              {loading ? "Loading..." : (
                userData.balance ? `${getCurrencySymbol()}${userData.balance}` :
                  <button className="form_btn" onClick={() => setLoginModalOpen(true)}>Login</button>
              )}
            </div>
          </li>
        </ul>

        <div className="tournament">

          <div className="torn_name" >Create Game</div>
          <button className="torn_btn" onClick={() => setCreateModalOpen(true)}>+</button>
        </div>
      </header>
      {createModalOpen && <Create isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />}

      {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
      {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
    </>
  );
};

export default Navbar;
