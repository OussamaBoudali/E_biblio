// components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/Style/login.css'; // Import the CSS file

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email, motDePasse: password });
      const { token } = response.data; // Destructure token from response
      setToken(token);
      localStorage.setItem('token', token);

      const userResponse = await axios.get('http://localhost:3000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userRole = userResponse.data.role;
      if (userRole === 'administrateur') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <div className="bgImg"></div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h1 className="text-center">Login</h1>
          <div className="ui divider"></div>
          <div className="ui form">
            <div className="field">
              <label className="Login-label">Email</label>
              <input className="Login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label className="Login-label">Password</label>
              <input className="Login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="fluid ui button blue">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
