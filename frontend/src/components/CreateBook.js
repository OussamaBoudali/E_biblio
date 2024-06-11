import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/Style/createBook.css'; // Create a CSS file for the form styling

const CreateBook = () => {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [anneePublication, setAnneePublication] = useState('');
  const [genre, setGenre] = useState('');
  const [resume, setResume] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Failed to fetch user role', error);
      }
    };
    fetchUserRole();
  }, []);

  const handleBackClick = () => {
    if (userRole === 'administrateur') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/books', {
        titre, auteur, anneePublication, genre, resume, disponible
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Book created:', response.data);
      setSuccessMessage('Book created successfully!');
      // Reset input fields after successful creation
      setTitre('');
      setAuteur('');
      setAnneePublication('');
      setGenre('');
      setResume('');
      setDisponible(true);
    } catch (error) {
      console.error('Failed to create book', error);
    }
  };

  return (
    <div className="create-book-container">
      <button onClick={handleBackClick} className="back-button">Back</button>
      <h1>Create New Book</h1>
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} className="create-book-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input type="text" value={auteur} onChange={(e) => setAuteur(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Publication Year</label>
          <input type="number" value={anneePublication} onChange={(e) => setAnneePublication(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Genre</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Summary</label>
          <textarea value={resume} onChange={(e) => setResume(e.target.value)}></textarea>
        </div>
        <div className="form-group">
          <label>Available</label>
          <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} />
        </div>
        <button type="submit" className="submit-button">Create</button>
      </form>
    </div>
  );
};

export default CreateBook;
