import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Withdraw.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Success from "../ErrorModal/Success";

function Withdraw({ showSidebar, active, closeSidebar }) {
  const [formData, setFormData] = useState({
    amount: "",
    account: "",
    bank: "",
    email: "",
    password: "",
  });
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [bankError, setBankError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isButtonPaypalDisabled, setIsButtonPaypalDisabled] = useState(true);
  const [isSuccessModalOpen , setIsSuccessModalOpen]=useState(false);
  const token = localStorage.getItem("token");
  const countryCode = localStorage.getItem("country");

  useEffect(() => {
    axios
      .get("https://play929-1e88617fc658.herokuapp.com/auth/csrfToken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCsrfToken(response.data.csrfToken);
      })
      .catch(() => {
        setError("Something went wrong , Try refreshing.");
      });
  }, [token]);

  useEffect(() => {
    const { amount, account, bank, password } = formData;
    setIsButtonDisabled(
      error ||
      !amount ||
      !account ||
      !bank ||
      !password ||
      amountError ||
      passwordError ||
      bankError
    );
  }, [formData, error, amountError, passwordError, bankError]);

  useEffect(() => {
    const { amount, email, password } = formData;
    setIsButtonPaypalDisabled(error || !amount || !email || !password);
  }, [formData, error]);

  const handleChange = (e) => {
    setPasswordError("");
    setBankError("");
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (name === "amount" && (isNaN(value) || value <= 0)) {
      setAmountError("Invalid withdrawal amount");
    } else {
      setAmountError("");
    }
    setError("");
    setMessage("");
  };

  const handleWithdraw = () => {
    const { amount, account, bank, password } = formData;

    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Invalid withdrawal amount");
      return;
    }
    if (!password) {
      setError("Enter password");
      return;
    }
    if (amount < 200) {
      setAmountError("Minimum withdrawal is R200");
      return;
    }

    const requestBody = {
      amount: parseFloat(amount),
      account,
      bank,
      password,
    };

    setLoading(true);
    axios
      .post("https://play929-1e88617fc658.herokuapp.com/wallet/withdraw", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
      })
      .then((response) => {
        setIsSuccessModalOpen(true);
        setMessage(`Withdrawal successful. New balance: R ${response.data.newBalance}`);
        setFormData({ amount: "", account: "", bank: "", password: "", email: formData.email });
      })
      .catch((error) => {
        const responseError = error.response?.data;
        if (responseError) {
          if (responseError.errors) {
            setError(responseError.errors.map(err => err.msg).join(", "));
          }
          if (responseError.PasswordError) {
            setPasswordError(responseError.PasswordError);
          }
          if (responseError.NotAuthorisedError) {
            setError(responseError.NotAuthorisedError);
          }
          if (responseError.UserError) {
            setError(responseError.UserError);
          }
          if (responseError.MinimumError) {
            setAmountError(responseError.MinimumError);
          }
          if (responseError.BalanceError) {
            setError(responseError.BalanceError);
          }
        } else {
          setError("Error processing withdrawal");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleWithdrawPaypal = () => {
    const { amount, email, password } = formData;

    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Invalid withdrawal amount");
      return;
    }
    if (!email) {
      setError("Enter PayPal email");
      return;
    }
    if (amount < 50) {
      setError("Minimum withdrawal is $50");
      return;
    }
    if (!password) {
      setError("Enter password");
      return;
    }

    const requestBody = {
      amount: parseFloat(amount),
      email,
      password,
    };

    setLoading(true);
    axios
      .post("https://play929-1e88617fc658.herokuapp.com/wallet/withdrawPaypal", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
      })
      .then((response) => {
        setMessage(`Withdrawal successful , Check Your Email. New balance: R ${response.data.newBalance}`);
        setFormData({ amount: "", account: "", bank: "", password: "", email: "" });
      })
      .catch((error) => {
        const responseError = error.response?.data;
        if (responseError) {
          setError(responseError.error || "Error processing withdrawal");
        } else {
          setError("Error processing withdrawal");
        }
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
              {countryCode === "ZA" ? (
                <>
                  <h3>Withdraw Funds</h3>
                  <div>
                    <label>Withdraw Amount</label>
                    <br />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      inputMode="numeric"
                    />
                    {amountError && <p className="error-message">{amountError}</p>}
                  </div>
                  <div>
                    <label>Account Number</label>
                    <br />
                    <input
                      type="text"
                      name="account"
                      value={formData.account}
                      onChange={handleChange}
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label>Password</label>
                    <br />
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      inputMode="text"
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                  </div>
                  <div className="right">
                    <div className="dropdown_container">
                      <span>Select Bank:</span>
                      <br />
                      <select
                        className="dropdown"
                        name="bank"
                        value={formData.bank}
                        onChange={handleChange}
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
                      disabled={loading || isButtonDisabled}
                    >
                      {loading ? "Processing..." : "Withdraw"}
                    </button>
                  </div>
                  {message && <p className="success-message">{message}</p>}
                  {error && <p className="error-message">{error}</p>}
                </>
              ) : (
                <>
                  <h4>Withdraw Funds - Paypal</h4>
                  <div>
                    <label>Withdraw Amount</label>
                    <br />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      inputMode="numeric"
                    />
                  </div>
                  <div>
                    <label>Paypal Email</label>
                    <br />
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      inputMode="text"
                    />
                  </div>
                  <div>
                    <label>Password</label>
                    <br />
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      inputMode="text"
                    />
                  </div>
                  <button
                    className="form_btn"
                    onClick={handleWithdrawPaypal}
                    disabled={loading || isButtonPaypalDisabled}
                  >
                    {loading ? "Processing..." : "Withdraw"}
                  </button>
                  
                  {error && <p className="error-message">{error}</p>}
                </>
              )}
            </div>
          </div>
        </div>
        {isSuccessModalOpen && <Success errorMessage={message} isOpen={isSuccessModalOpen} onClose={() =>setIsSuccessModalOpen(false)}  />}
      </div>
     
    </div>
  );
}

export default Withdraw;
