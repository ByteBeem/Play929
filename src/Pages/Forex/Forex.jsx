import React, { useState, useEffect } from "react";
import './Forex.scss';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from "../../components/AuthContext";
import Modal from "./model";
import ForexChart from './ForexChart';
import axios from 'axios';

const Forex = ({ showSidebar, active, closeSidebar }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tradeDetails, setTradeDetails] = useState(null);
  const [activities, setActivities] = useState([]);
  const [dates, setDates] = useState([]);
  const { setToken } = useAuth();

useEffect(() => {
  setShowModal(true);

  const storedToken = localStorage.getItem("token");

  if (storedToken) {
    setToken(storedToken);
    fetchActivities(storedToken);
  }
}, []);


  const closeModal = () => {
    setShowModal(false);
  };

  const handleDeposit = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token not found, please log in again.");
      setLoading(false);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setError("Invalid amount");
      setLoading(false);
      return;
    }

    if (amount < 100) {
      setError("Minimum amount is R100");
      setLoading(false);
      return;
    }

    try {
      const requestBody = {
        amount: parseFloat(amount),
      };

      const response = await axios.post(
        "https://spinz-servers-17da09bbdb53.herokuapp.com/trade",
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Store trade details in state
      setTradeDetails(response.data);

      // Set success message
      setMessage(`Successfully placed a trade.`);

      // Clear the amount input
      setAmount("");
    } catch (error) {
      setError("Trading failed. " + error.response?.data?.error || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (token) => {
    try {
      setLoading(true);

      const response = await axios.get(
        "https://spinz-servers-17da09bbdb53.herokuapp.com/tradesHistory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 206) {
        alert("Token Expired. Please log in again!");
      } else {
        setActivities(response.data);

        const formattedDates = response.data.map((activity) => {
          const date = activity.date_time;
          const originalDate = new Date(date);
          return originalDate.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });
        });

        setDates(formattedDates);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forex">
      <Sidebar active={active} closeSidebar={closeSidebar} />
      <div className="forex_container">
        <Navbar showSidebar={showSidebar} />
        <div className="content">
          <ForexChart />
          <h3>Let's Handle The Trading for You!</h3>
          <div className="deposit_form">
            <div>
              <label>Amount</label>
              <br />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="numeric"
              />
              <button
                className="form_btn"
                onClick={handleDeposit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Begin"}
              </button>
              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
        <div className="activity">
          <span>Activity</span>
          {activities.length > 0 ? (
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Estimated Profit</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {activities.reverse().map(({ id, date_time, estimated_outcome, amount, result }) => (
                  <tr key={id} className={result === 'fail' ? 'fail' : ''}>
                    <td id="time">{date_time}</td>
                    <td id="title">{estimated_outcome}</td>
                    <td id="body">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No trades yet</p>
          )}
        </div>
      </div>
      {showModal && <Modal visible={showModal} closeModal={closeModal} />}
    </div>
  );
};

export default Forex;
