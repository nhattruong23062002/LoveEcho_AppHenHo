import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import HomePage from './pages/HomePage';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<HomePage />} />
          <Route path="/events" element={<HomePage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/login" element={<div className="login-page"><LoginForm /></div>} />
          <Route path="/register" element={<div className="login-page"><RegisterForm /></div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
