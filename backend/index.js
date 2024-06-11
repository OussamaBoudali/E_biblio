(async () => {
    const database = require('./config/db');

    const Loan = require('./models/loanModel');
    const User = require('./models/userModel');
    const Book = require('./models/bookModel');

User.hasMany(Loan, { foreignKey: 'idUtilisateur' });
Loan.belongsTo(User, { foreignKey: 'idUtilisateur' });

Book.hasMany(Loan, { foreignKey: 'idLivre' });
Loan.belongsTo(Book, { foreignKey: 'idLivre' });

    await database.sync();


})();

