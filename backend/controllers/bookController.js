const Book = require('../models/bookModel');
const authMiddleware = require('../middleware/auth');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ message: 'Accès interdit: administrateurs uniquement' });
    }

    const { titre, auteur, anneePublication, genre, resume, disponible } = req.body;
    const book = await Book.create({ titre, auteur, anneePublication, genre, resume, disponible });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateBook = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ message: 'Accès interdit: administrateurs uniquement' });
    }

    const bookId = req.params.id;
    const { titre, auteur, anneePublication, genre, resume, disponible } = req.body;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    await book.update({ titre, auteur, anneePublication, genre, resume, disponible });
    res.json(book);
  } catch (error) {
    res.status (500).json({ message: error.message });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    if (req.user.role !== 'administrateur') {
      return res.status(403).json({ message: 'Accès interdit: administrateurs uniquement' });
    }

    const bookId = req.params.id;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    await book.destroy();
    res.json({ message: 'Livre supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

