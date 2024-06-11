const Sequelize = require('sequelize');

const sequelize = new Sequelize('biblio_projet', 'root', 'Oussama007', {  
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = sequelize;