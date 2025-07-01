const { addTransaction, deleteTransaction, editTransaction, getAllTransactions, getFilteredTransactions } = require('../controllers/transaction');

const transactionsRoutes = require('express').Router();

transactionsRoutes.get('/', getAllTransactions);
transactionsRoutes.post('/', addTransaction);
transactionsRoutes.delete('/:id', deleteTransaction);
transactionsRoutes.put('/:id', editTransaction);

module.exports = transactionsRoutes;
