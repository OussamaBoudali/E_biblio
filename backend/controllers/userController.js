const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;
    const hash = await bcrypt.hash(motDePasse, 10);
    const user = await User.create({ nom, email, motDePasse: hash, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse))) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, 'votre_secret_jwt', { expiresIn: '72h' });
      res.send({ token });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('User ID:', userId); // log the user ID to the console
    const user = await User.findByPk(userId);

    // vérifiez que l'utilisateur a été trouvé
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User:', user.get()); // log the user object to the console

    // Vérifiez que le payload est défini
    if (!req.payload) {
      return res.status(500).json({ message: 'Payload not found in request' });
    }

    // vérifiez que l'utilisateur connecté a le droit de voir les informations de cet utilisateur
    console.log('Authenticated user ID:', req.payload.userId); // log the authenticated user ID to the console
    console.log('Authenticated user role:', req.payload.role); // log the authenticated user role to the console

    if (req.payload.role !== 'administrateur' && req.payload.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// controllers/userController.js
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('Current user ID:', req.user.userId); // Log the user ID from the token
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'email', 'role'] // Include other fields as necessary
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Current user:', user); // Log the found user
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    let { nom, email, motDePasse, role } = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifiez que l'utilisateur connecté a le droit de modifier les informations de cet utilisateur
    if (req.user.userId !== parseInt(userId) && req.user.role !== 'administrateur') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    if (motDePasse) {
      const hash = await bcrypt.hash(motDePasse, 10);
      motDePasse = hash;
    }

    await user.update({ nom, email, motDePasse, role });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    // vérifiez que l'utilisateur connecté a le droit de supprimer cet utilisateur
    if (req.user.id !== userId && req.user.role !== 'administrateur') {
      return res.status(403).json({ message: 'Accès interdit' });
    }
    await user.destroy();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  console.log('Getting all users...'); // log a message to indicate that the function is being called
  try {
    const users = await User.findAll();
    console.log('Users:', users); // log the array of users to the console
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error); // log an error message and the error object to the console
    res.status(500).json({ message: error.message });
  }
};


