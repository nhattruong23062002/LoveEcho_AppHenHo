import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import "./homePage.css";
import Layout from "../../layout/layout";
import SelectTypeFriend from "../../components/SelectTypeFriend";
import { notification } from "antd";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [friendType, setFriendType] = useState(""); 
  const user = localStorage.getItem("user");

  useEffect(() => {
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
    const selectedUser = users[currentUserIndex];
    const selectedUserId = selectedUser.id;

    const friendRequest = {
      fromUserId: user.id, 
      toUserId: selectedUserId, 
      status: "pending",        
      friendType: type,          
    };
    axios.patch(`http://localhost:5000/users/${selectedUserId}`, {
        friendRequests: [...selectedUser.friendRequests, friendRequest],
      })
      .then((response) => {
        console.log("Friend request sent:", response.data);
        notification.success({
          message: "Friend request sent!",
          description: `You have sent a friend request of this type "${type}" to ${selectedUser.username}.`,
          placement: "top",  
        });
      })
      .catch((error) => {
        console.error("Error sending friend request:", error);
        notification.error({
          message: "Error sending friend request",
          description: "An error occurred while sending the friend request. Please try again.",
          placement: "top",  
        });
      });
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

      <SelectTypeFriend 
        isVisible={isPopupVisible} 
        onClose={() => setIsPopupVisible(false)} 
        onSelectFriendType={handleFriendTypeSelect} 
      />
    </Layout>
  );
}

export default HomePage;
