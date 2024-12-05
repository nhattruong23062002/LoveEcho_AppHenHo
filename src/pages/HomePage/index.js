import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import "./homePage.css";
import Layout from "../../layout/layout";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [friendType, setFriendType] = useState(""); 

  useEffect(() => {
    const user = localStorage.getItem("user");
    axios
      .get("http://localhost:5000/users")
      .then((response) => {
        const loggedInUser = user ? JSON.parse(user) : null;
        const filteredUsers = loggedInUser
          ? response.data.filter((user) => user.email !== loggedInUser.email)
          : response.data;
        setUsers(filteredUsers);
        if (filteredUsers.length > 0) {
          setCurrentUserIndex(Math.floor(Math.random() * filteredUsers.length));
        }
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleNextUser = () => {
    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  const handleAddFriendClick = () => {
    setIsPopupVisible(true);
  };

  const handleFriendTypeSelect = (type) => {
    setFriendType(type);
    setIsPopupVisible(false);
    alert(`Bạn đã chọn: ${type}`); 
  };

  return (
    <Layout>
      <div className="wrapper-content">
        {users.length > 0 && (
          <>
            <img
              src={users[currentUserIndex]?.image}
              alt={users[currentUserIndex]?.username}
            />
            <div className="wrapper-info">
              <h3>{users[currentUserIndex]?.username}</h3>
              <p>{users[currentUserIndex]?.address}</p>
            </div>
            <ul className="wrapper-icon">
              <li className="item-icon">
                <Link to="#" onClick={handleAddFriendClick}>
                  <FaUserPlus size={70} color="#f03e6a" />
                </Link>
              </li>
              <li className="item-icon">
                <Link to="#" onClick={handleNextUser}>
                  <FaArrowRight size={70} color="#f03e6a" />
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h3>Select friend type</h3>
            <ul>
              <li onClick={() => handleFriendTypeSelect("Bạn thân")}>Best friend</li>
              <li onClick={() => handleFriendTypeSelect("Đồng nghiệp")}>Colleague</li>
              <li onClick={() => handleFriendTypeSelect("Bạn xã hội")}>Social friend</li>
            </ul>
            <button onClick={() => setIsPopupVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default HomePage;
