const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const bookRoutes = require('./bookRoutes');
const loanRoutes = require('./loanRoutes');
const authenticateToken = require('../middleware/auth');

router.use('/api/users', userRoutes);
router.use('/api/books', bookRoutes);
router.use('/api/loans', loanRoutes);

module.exports = router;
