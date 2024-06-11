import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../assets/Style/navbar.css'; 

import logo from '../assets/img/logo.png'; 

const AdminDashboard = () => {
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

  const handleHomeClick = () => {
    navigate("/admin");
  };

  const handleCreateLoanClick = () => {
    navigate('/loans/new');
  };

  const handleCreateBookClick = () => {
    navigate('/books/new');
  };

  const handleLogout = () => {
    navigate('/login');
    localStorage.removeItem('token');
  };

  const isLinkActive = (path) => {
    return window.location.pathname === path;
  };

  return (
    <div>
      <div className="nav-top">
        <div className="nav-inner-top">
          <img src={logo} alt="Logo" className="logo" /> {/* Add logo image */}
          <div
            onClick={handleHomeClick}
            className="title" // Update class for title styling
          >
            E-bibliotheque
          </div>
          <div className="nav-links">
            <div className="nav-inner-element">
              <div
                className={`linked ${
                  isLinkActive("/admin") ? "underline-link" : ""
                }`}
                onClick={handleHomeClick}
              >
                Home
              </div>
            </div>
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
                className={`linked ${
                  isLinkActive("/books/new") ? "underline-link" : ""
                }`}
                onClick={handleCreateBookClick}
              >
                Create Book
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
      <div className="content-wrapper">
        {/* Your content here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
