import React, { useState } from "react";
import {
  FaHome,
  FaUserFriends,
  FaCalendarAlt,
  FaUser,
  FaSearch,
} from "react-icons/fa"; 
import { Link } from "react-router-dom"; 
import "./navigation.css"; 

function Navigation() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleSearchClick = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/">
            <FaHome size={50} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/friends">
            <FaUserFriends size={50} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/events">
            <FaCalendarAlt size={50} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile">
            <FaUser size={50} />
          </Link>
        </li>
        <li className="nav-item">
          <div className="search-container">
            <FaSearch size={50} onClick={handleSearchClick} />
          </div>
        </li>
        {isSearchVisible && (
          <input type="text" placeholder="Search..." className="search-input" />
        )}
      </ul>
    </div>
  );
}

export default Navigation;
