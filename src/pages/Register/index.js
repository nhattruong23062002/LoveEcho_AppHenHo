import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name)
    console.log(value)
    if (name === "email") {
      setEmail(value);
    } else if (name === "username") {
      setUsername(value);
    } else if (name === "address") {
      setAddress(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !address || !confirmPassword) {
      setError("Vui lòng điền tất cả thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }
    setError("");
    const response = await fetch("http://localhost:5000/users");
    const users = await response.json();
    const newId = users.length + 1;
    const newUser = {
      id: `${newId}`,
      email,
      username,
      password,
      address,
      friends: [],
      events: [],
      image: "https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg",
      friendGroups: {
        closeFriends: [],
        colleagues: [],
        social: [],
      },
      friendRequests: []
    };

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setUsername("");
        setPassword("");
        setAddress("");
        setConfirmPassword("");
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Không thể kết nối đến máy chủ.");
    }
  };

  return (
    <div className="register-form">
      <h2>Register Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>UserName:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Registration successful!</p>}

        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
