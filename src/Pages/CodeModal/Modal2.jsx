import React, { useState } from "react";
import axios from "axios";
import "./modal.scss";


const ErrorModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleOTPChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);
    const email = localStorage.getItem("ResetEmail");

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/confirmReset-otp",
        { code, email }
      );

      if (response.status === 403) {
        setError(
          'You entered Incorrect OTP , try again.'
        );

      } else if (response.status === 200) {
        localStorage.setItem("token" , response.data.token);
        window.location.href = "http://localhost:3000";




      }
    } catch (error) {

      setError("You entered Incorrect OTP , try again.");

    }

    setIsLoading(false);

  };

  return (
    isOpen && (
      <div className="error-modal-overlay">
        <div className="error-modal">
          <button className="close-button" onClick={onClose}>
            X
          </button>

          <input
            type="number"
            value={code}
            onChange={handleOTPChange}
            placeholder="Enter the OTP you received on your email"
          />
          <button
            className="ok-button"
            disabled={isLoading}
            onClick={handleSubmit}>
            {isLoading ?
              'Verifying...'
              :
              'Submit'
            }
          </button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}    
        </div>

      </div>
    )
  );
};

export default ErrorModal;
