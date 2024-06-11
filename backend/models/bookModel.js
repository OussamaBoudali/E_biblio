const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  auteur: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anneePublication: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resume: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: false
});

module.exports = Book;
