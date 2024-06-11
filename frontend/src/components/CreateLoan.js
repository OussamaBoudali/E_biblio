import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLoan = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loans, setLoans] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableBooks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/loans/available');
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch available books', error);
      }
    };

    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/loans', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLoans(response.data);
      } catch (error) {
        console.error('Failed to fetch loans', error);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserId(response.data.idUtilisateur);
        setIsAdmin(response.data.role === 'administrateur');
      } catch (error) {
        console.error('Failed to fetch user details', error);
      }
    };

    fetchAvailableBooks();
    fetchLoans();
    fetchUserDetails();
  }, []);

  const handleLoanCreation = async (bookId) => {
    try {
      const book = books.find(b => b.id === parseInt(bookId, 10));
      if (!book || !book.disponible) {
        setError('Book not available');
        return;
      }
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/loans', { bookId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setError('');
      const updatedBooks = books.map(book =>
        book.id === parseInt(bookId, 10) ? { ...book, disponible: false } : book
      );
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Failed to create loan', error);
      setError(error.response.data.message);
    }
  };

  const handleBookReturn = async (loanId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/loans/${loanId}/return`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const loan = loans.find(l => l.id === loanId);
      const updatedBooks = books.map(book =>
        book.id === loan.idLivre ? { ...book, disponible: true } : book
      );
      setBooks(updatedBooks);
      const updatedLoans = loans.filter(l => l.id !== loanId);
      setLoans(updatedLoans);
    } catch (error) {
      console.error('Failed to return book', error);
      setError(error.response.data.message);
    }
  };

  const handleEditClick = (book) => {
    console.log('Edit button clicked for book:', book);
    setEditBook(book);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBook(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/books/${editBook.id}`, editBook, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEditBook(null);
      const updatedBooks = books.map(book =>
        book.id === editBook.id ? response.data : book
      );
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Failed to update book', error);
      setError(error.response.data.message);
    }
  };

  const handleGoBack = () => {
    if (isAdmin) {
      navigate('/admin'); // Navigate to /admin if user is an admin
    } else {
      navigate('/user'); // Navigate to /user if user is not an admin
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Create Loan</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleGoBack} style={{ position: 'absolute', top: '5px',  padding: '3px 6px', fontSize: '12px' }}>Go Back</button>
      <div>
        <h2 style={{ textAlign: 'center', color: 'white' }}>Available Books</h2>
        <table style={{ backgroundColor: '#ffffff6b' , width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => {
              const userLoans = loans.filter(loan => loan.idUtilisateur === userId);
              const userLoan = userLoans.find(loan => loan.idLivre === book.id && !loan.dateRetour);
              return (
                <tr key={book.id}>
                  <td>{book.titre}</td>
                  <td>{book.auteur}</td>
                  <td>{book.anneePublication}</td>
                  <td>{book.genre}</td>
                  <td>{book.resume}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {book.disponible ? (
                        <button onClick={() => handleLoanCreation(book.id)}>Loan</button>
                      ) : (
                        userLoan && (
                          <button onClick={() => handleBookReturn(userLoan.id)}>Return</button>
                        )
                      )}
                      {isAdmin && (
                        <button onClick={() => handleEditClick(book)}>Modify</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {editBook && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px' }}>
          <h2 style={{ textAlign: 'center', color: 'white' }}>Edit Book</h2>
          <form onSubmit={handleEditSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Title:</label>
              <input type="text" name="titre" value={editBook.titre} onChange={handleEditChange} style={{ marginLeft: '10px', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Author:</label>
              <input type="text" name="auteur" value={editBook.auteur} onChange={handleEditChange} style={{ marginLeft: '5px', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Year:</label>
              <input type="text" name="anneePublication" value={editBook.anneePublication} onChange={handleEditChange} style={{ marginLeft: '14px', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Genre:</label>
              <input type="text" name="genre" value={editBook.genre} onChange={handleEditChange} style={{ marginLeft: '10px', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Description:</label>
              <input type="text" name="resume" value={editBook.resume} onChange={handleEditChange} style={{ marginLeft: '5px', padding: '5px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Available:</label>
              <input type="checkbox" name="disponible" checked={editBook.disponible} onChange={e => setEditBook(prevState => ({ ...prevState, disponible: e.target.checked }))} style={{ marginLeft: '5px' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateLoan;
