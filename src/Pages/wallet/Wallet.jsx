import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FiLoader } from "react-icons/fi";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Error from "../ErrorModal/ErrorModal";
import Auth from "../Login/Auth";
import "./wallet.scss";
import "../../App.scss";

const Wallet = ({ showSidebar, active, closeSidebar }) => {
  const [userData, setUserData] = useState({ balance: 0 });
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [errorModalOpen , setErrorModalOpen] = useState(false);
  const [errorMessage ,  setErrorMessage] =useState('');
  const country = userData.country;
   const balance = userData.balance;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      
      fetchUserData(storedToken);
    }else{
      setLoginModalOpen(true);
      
    }
  }, []);

   
  const fetchUserData = (token) => {
    setLoading(true);
    axios
      .get("https://play929-1e88617fc658.herokuapp.com/users/balance", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        
        const balance = response.data; 

      if (balance !== undefined) {
        setUserData( balance );
      }
        setLoading(false);
      })
      .catch((error) => {
        
        setLoading(false);
        setErrorMessage(`${error.message} , Check Your connection.`)
        setErrorModalOpen(true);
      });
  };

  const getCurrencySymbol = () => {
    
    return country === 'ZA' ? 'R' : '$';
  };

  return (
    <div className="wallet">
      <Sidebar active={active} closeSidebar={closeSidebar} />

      <div className="wallet_container">
        <Navbar showSidebar={showSidebar} />

        <div className="account_info">
          {loading && (
            <div className="overlay">
              <FiLoader className="loading-spinner" />
            </div>
          )}

          <span>Account Balance:</span>
            <div className="balance">{`${getCurrencySymbol()}${balance.toString()}`}</div>

          <Link className="form_btn" to="/withdraw">
            Withdraw
          </Link>
          <Link className="form_btn" to="/deposit">
            Deposit
          </Link>
        </div>
        {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
        {errorModalOpen && <Error errorMessage = {errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
      </div>
    </div>
  );
};

export default Wallet;
