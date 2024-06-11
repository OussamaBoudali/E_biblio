import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getBooks = () => api.get('/books');
export const createLoan = (loanData, token) => api.post('/loans', loanData, { headers: { Authorization: `Bearer ${token}` } });
export const loginUser = (credentials) => api.post('/login', credentials);

export default api;
