const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require("../middleware/auth"); // import the authMiddleware function


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authenticateToken, userController.getCurrentUser); 
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);
router.get('/', authenticateToken, userController.getAllUsers);


module.exports = router;
