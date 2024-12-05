import React, { useState } from 'react';
import "./register.css";
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      setError('Vui lòng điền tất cả thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }
    setError(''); 
    const response = await fetch('http://localhost:5000/users');
    const users = await response.json();
    const newId = users.length + 1; 
    const newUser = {
      id: `${newId}`,
      email,
      username,
      password,
      friends: [],
      events: [],
      friendGroups: {
        closeFriends: [],
        colleagues: [],
        social: []
      }
    };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="register-form">
      <h2>Đăng Ký Tài Khoản</h2>
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
          <label>Tên Người Dùng:</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Mật Khẩu:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Xác Nhận Mật Khẩu:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Đăng ký thành công!</p>}

        <button type="submit">Đăng Ký</button>
        <p>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
      </form>
    </div>
  );
}

export default RegisterForm;
