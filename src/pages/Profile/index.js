import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"; // Import icon edit
import axios from "axios"; // Import axios
import "./profile.css"; // Import file CSS
import Layout from "../../layout/layout";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    username: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const savedUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (savedUser) {
      setUser(savedUser);
      setUpdatedUser({
        username: savedUser.username,
        email: savedUser.email,
        address: savedUser.address,
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/users/${savedUser.id}`,
        updatedUser
      );

      if (response.status === 200) {
        const updatedUserData = {
          ...updatedUser,
          id: response.data.id,
          image: response.data.image,
        };
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        setUser(updatedUserData);
        setIsEditing(false);
        setError(null);
        alert("Update success");
      } else {
        setError("Update Error.");
      }
    } catch (error) {
      setError("Error.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Layout>
      <div className="profile-container">
        <div className="avatar-container">
          <img
            src={
              user.image ||
              "https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
            }
            alt="Avatar"
            className="avatar"
          />
        </div>
        {!isEditing ? (
          <div className="user-info">
            <h2>{user.username}</h2>
            <FaEdit className="edit-icon" onClick={() => setIsEditing(true)} />
          </div>
        ) : (
          <div className="edit-form">
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <label>User Name</label>
              <input
                type="text"
                name="username"
                value={updatedUser.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={updatedUser.address}
                onChange={handleInputChange}
              />
            </div>
            <button className="save-button" onClick={handleSaveChanges}>
              Save
            </button>
          </div>
        )}
        <p className="logout-link" onClick={handleLogout}>
          Log Out
        </p>
      </div>
    </Layout>
  );
}

export default Profile;
