import "./Navbar.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../components/AuthContext";
import { IoNotifications } from "react-icons/io5";

const Navbar = ({ showSidebar }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { setToken } = useAuth();

  const balance = userData.balance;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    }
  }, [setToken]);

  const fetchUserData = (token) => {
    setLoading(true); 
    axios
      .get("https://heavenly-onyx-bun.glitch.me/getUserData", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <header>
      <div className="menu_btn" onClick={() => showSidebar()}>
        &#9776;
      </div>
      <ul className="games_filter">
        <li className="active">Soccer</li>
        <li>Slot</li>
        <li>WordSearch</li>
        <li>
          <div className="balance">{loading ? "Loading..." : `R${balance}`}</div>
        </li>
      </ul>

      <ul className="right">
        <div className="notification">
          <IoNotifications className="icon" />
          <div className="count">5</div>
        </div>
        <li className="profile">
          <img src="" alt="" />
        </li>
      </ul>
    </header>
  );
};

export default Navbar;