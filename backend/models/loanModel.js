const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./userModel');
const Book = require('./bookModel');
const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idUtilisateur: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  idLivre: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  },
  dateEmprunt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dateRetour: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false
});
User.hasMany(Loan, { foreignKey: 'idUtilisateur' });
Loan.belongsTo(User, { foreignKey: 'idUtilisateur' });

Book.hasMany(Loan, { foreignKey: 'idLivre' });
Loan.belongsTo(Book, { foreignKey: 'idLivre' });

module.exports = Loan;
