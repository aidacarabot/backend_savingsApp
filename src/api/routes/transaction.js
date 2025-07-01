const { isAuth } = require('../../middlewares/auth');
const { addTransaction, deleteTransaction, editTransaction, getAllTransactions, getFilteredTransactions } = require('../controllers/transaction');

const transactionsRoutes = require('express').Router();

transactionsRoutes.get('/', [isAuth], getAllTransactions);
transactionsRoutes.post('/',[isAuth], addTransaction);
transactionsRoutes.delete('/:id', [isAuth], deleteTransaction);
transactionsRoutes.put('/:id', [isAuth], editTransaction);

module.exports = transactionsRoutes;
