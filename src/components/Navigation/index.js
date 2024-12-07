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
      </ul>
    </div>
  );
}

export default Navigation;
