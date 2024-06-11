require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = decodedToken; 
    req.user = decodedToken;// Attach the entire payload
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized request' });
  }
};

module.exports = authenticateToken;
