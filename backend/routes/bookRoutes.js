const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticateToken = require("../middleware/auth"); // import the authMiddleware function


router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', authenticateToken, bookController.createBook);
router.put('/:id', authenticateToken, bookController.updateBook);
router.delete('/:id', authenticateToken, bookController.deleteBook);


module.exports = router;
