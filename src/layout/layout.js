import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import "./../pages/HomePage/homePage.css";

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className={`homePage ${isLoggedIn ? "loggedIn" : ""}`}>
      <div className="container">
        {!isLoggedIn && (
          <button className="loginButton" onClick={handleLoginClick}>
            Đăng Nhập
          </button>
        )}
        <Navigation />
        {children}
      </div>
    </div>
  );
};

export default Layout;
