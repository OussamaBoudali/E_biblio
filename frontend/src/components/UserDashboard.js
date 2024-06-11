import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../assets/Style/navbar.css'; 
import logo from '../assets/img/logo.png'; 

const UserDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set the token for all requests
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  const handleCreateLoanClick = () => {
    navigate('/loans/new');
  };
  const handleHomeClick = () => {
    navigate("/user");
  };
  const handleLogout = () => {
    navigate('/login');
    localStorage.removeItem('token');
  };

  const isLinkActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div className="user-dashboard">
      <div className="nav-top">
        <div className="nav-inner-top">
          <img src={logo} alt="Logo" className="logo" />
          <div
            onClick={handleHomeClick}
            className="title"
          >
            E-bibliotheque
          </div>
          <div className="nav-links">
            <div className="nav-inner-element">
              <div
                className={`linked ${
                  isLinkActive("/loans/new") ? "underline-link" : ""
                }`}
                onClick={handleCreateLoanClick}
              >
                Create Loan
              </div>
            </div>
            <div className="nav-inner-element">
              <div
                className={`linked ${isLinkActive("/login") ? "underline-link" : ""}`}
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserDashboard;
