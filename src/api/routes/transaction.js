const { isAuth } = require('../../middlewares/auth');
const { addTransaction, deleteTransaction, editTransaction, getAllTransactions, bulkAddTransactions } = require('../controllers/transaction');
const { excelUpload } = require('../../middlewares/excelUpload');

const transactionsRoutes = require('express').Router();

transactionsRoutes.get('/', [isAuth], getAllTransactions);
transactionsRoutes.post('/', [isAuth], addTransaction);
transactionsRoutes.post('/bulk', [isAuth], (req, res, next) => {
  excelUpload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
}, bulkAddTransactions);
transactionsRoutes.delete('/:id', [isAuth], deleteTransaction);
transactionsRoutes.put('/:id', [isAuth], editTransaction);

module.exports = transactionsRoutes;
