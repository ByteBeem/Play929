import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Withdraw.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

function Withdraw({ showSidebar, active, closeSidebar }) {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/csrfToken", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const csrfToken = response.data.csrfToken;
        
        setCsrfToken(csrfToken);
      });
  }, [token]);

  const handleWithdraw = () => {
    setError("");
    setMessage("");
    setLoading(true);

    if (isNaN(amount) || amount <= 0) {
      setError("Invalid withdrawal amount");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Enter password");
      setLoading(false);
      return;
    }

    const requestBody = {
      amount: parseFloat(amount),
      account: account,
      bank: bank,
      password: password 
    };

    axios
      .post("http://localhost:3001/wallet/withdraw", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken
        }
      })
      .then((response) => {
        setMessage(
          `Withdrawal successful. New balance: R ${response.data.newBalance}`
        );
        setAmount("");
        setAccount("");
        setBank("");
        setPassword("");
      })
      .catch((error) => {
        setError( error.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="withdraw">
      <Sidebar active={active} closeSidebar={closeSidebar} />
      <div className="withdraw_container">
        <Navbar showSidebar={showSidebar} />
        <div className="content">
          <div className="middle">
            <div className="left">
              <h3>Withdraw Funds</h3>
              <div>
                <label>Withdraw Amount</label>
                <br />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <label>Account Number</label>
                <br />
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <label>Password</label>
                <br />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputMode="text"
                />
              </div>
            </div>
            <div className="right">
              <div className="dropdown_container">
                <span>Select Bank:</span>
                <br />
                <select
                  className="dropdown"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                >
                  <option value="">Select a Bank</option>
                  <option value="Capitec">Capitec Bank</option>
                  <option value="Standardbank">Standard Bank</option>
                  <option value="Tymebank">TymeBank</option>
                  <option value="Absa">Absa</option>
                </select>
              </div>
              <button
                className="form_btn"
                onClick={handleWithdraw}
                disabled={loading}
              >
                {loading ? "Processing..." : "Withdraw"}
              </button>
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
