// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import CreateBook from './components/CreateBook'; // Assuming you have a component for creating books
import CreateLoan from './components/CreateLoan';

import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setUserRole(response.data.role);
      }).catch(error => {
        console.error('Failed to fetch user data', error);
      });
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={userRole === 'administrateur' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/user" element={userRole === 'utilisateur' ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/books/new" element={userRole === 'administrateur' ? <CreateBook /> : <Navigate to="/login" />} />
        <Route path="/loans/new" element={userRole ? <CreateLoan /> : <Navigate to="/login" />} /> {/* New route */}
      </Routes>
    </Router>
  );
};

export default App;
