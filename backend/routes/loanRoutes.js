const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authenticateToken = require("../middleware/auth"); // Import the authMiddleware function

// Define the route for fetching available books before any routes with dynamic segments
router.get('/available', loanController.getAllAvailableBooks);
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', authenticateToken, loanController.createLoan);
router.put('/:id', authenticateToken, loanController.updateLoan);
router.delete('/:id', authenticateToken, loanController.deleteLoan);

module.exports = router;