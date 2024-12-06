import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css"
import { API_URL } from '../../config/configUrl';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Vui lòng điền tất cả thông tin.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();
      const user = users.find(user => user.email === email && user.password === password);
      const { id, username, image, address, friends, friendRequests, friendGroups } = user;

      if (user) {
        navigate('/');
        setSuccess(true);
        setError('');
        setEmail('');
        setPassword('');
        localStorage.setItem('user', JSON.stringify({ id, username, email, image, address, friends, friendRequests, friendGroups }));
      } else {
        setError('Email hoặc mật khẩu không chính xác.');
      }
    } catch (error) {
      setError('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Login success!</p>}

        <button type="submit">Login</button>
        <p>
        Don't have an account? <Link to="/register">Sign up now</Link>
      </p>
      </form>
    </div>
  );
}

export default LoginForm;
