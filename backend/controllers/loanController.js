const Loan = require('../models/loanModel');
const User = require('../models/userModel');
const Book = require('../models/bookModel');
const authenticateToken = require('../middleware/auth');

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Prêt non trouvé' });
    }
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLoan = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    // Check if the user already has 2 active loans
    const activeLoans = await Loan.count({ where: { idUtilisateur: userId, dateRetour: null } });
    if (activeLoans >= 2) {
      return res.status(403).json({ message: 'You already have 2 active loans' });
    }

    // Check if the book is available
    const book = await Book.findByPk(bookId);
    if (!book || !book.disponible) {
      return res.status(404).json({ message: 'Book not available' });
    }

    // Create the loan
    const loan = await Loan.create({ idUtilisateur: userId, idLivre: bookId, dateEmprunt: new Date() });

    // Mark the book as not available
    await book.update({ disponible: false });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllAvailableBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const loanId = req.params.id;
    const { idUtilisateur, idLivre, dateEmprunt, dateRetour } = req.body;
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Prêt non trouvé' });
    }
    await loan.update({ idUtilisateur, idLivre, dateEmprunt, dateRetour });
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Prêt non trouvé' });
    }
    await loan.destroy();
    res.json({ message: 'Prêt supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
