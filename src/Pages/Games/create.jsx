import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Error from "../ErrorModal/ErrorModal";
import Auth from "../Login/Auth";
import axios from "axios";
import "./create.scss";

const Create = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setcsrfToken] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [ErrorModalOpen, setErrorModalOpen] = useState(false);
  const gameTypes = ['', 'Tournament', 'One v/s One']
  const token = localStorage.getItem("token");


  const fetchCsrfToken = async () => {
    if (token) {
      try{
      setIsLoading(true);
      const response = await axios.get("https://localhost:3001/auth/csrfToken",{
        headers:{
        Authorization: `Bearer ${token}`
        }
      })

      if(response.status == 200){
        setcsrfToken(response.data.csrfToken);
        HandleSearch();
      }
    }
    catch(error){
      setIsLoading(false);
      setErrorMessage(error.message);
      setErrorModalOpen(true);
    
    }
  }else{
    setIsLoading(false);
    setLoginModalOpen(true);
  }

  }


  const HandleSearch = async () => {
    
    setIsLoading(true);
    if (!csrfToken) {
      setErrorMessage("Something went wrong , Refresh this page.")
      setErrorModalOpen(true);
      setIsLoading(false);
      return;
    }
    try {


      const response = axios.get("http://localhost:3001/games/players", {
        headers: {
          Authorization: `Bearer ${token}`,
          csrfToken: `UserCsrfToken ${csrfToken}`
        }
      })

    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
      setErrorModalOpen(true);

    }

  }


  return (
    isOpen && (
      <div className="create-modal-overlay">
        <div className="login">
          <div className="login_container">
            <button className="create-close-button" onClick={onClose}>
              X
            </button>
            <span>Select Game Type:</span>
            <select
              id="country"
              className="dropdown"
              name="country"

              required
            >

              {gameTypes.map((gameType) => (
                <option >
                  {gameType}
                </option>
              ))}

            </select>

            <div className="bottom">

              <span className="or_text" >OR:</span>

              <button
                onClick={fetchCsrfToken}
                className={`form_btn ${isLoading ? "disabled" : ""}`}
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? "Searching ..." : "Search For Online Players"}
              </button>
            </div>
          </div>
        </div>
        {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
        {ErrorModalOpen && <Error errorMessage={errorMessage} isOpen={ErrorModalOpen} onClose={() => setErrorModalOpen(false)} />}
      </div>
    )
  );
};




export default Create;
