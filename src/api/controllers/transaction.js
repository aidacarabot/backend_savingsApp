const Transaction = require('../../api/models/transaction')
const User = require('../models/user')

//! GET ALL TRANSACTIONS
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find() // Obtener todas las transacciones
    return res.status(200).json(transactions) // Enviar las transacciones como respuesta
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching transactions:', error: error.message })
  }
}

//! ADD NEW TRANSACTION
const addTransaction = async (req, res) => {
  const { type, name, amount, date, category } = req.body;
  const userId = req.user._id; // Get user from token

  // Validar que si el tipo es "Expense", se debe especificar la categoría
  if (type === 'Expense' && !category) {
    return res.status(400).json('Category is required for expenses');
  }

  try {
    // Crear una nueva transacción
    const newTransaction = new Transaction({
      type,
      name,
      amount,
      date,
      category: type === 'Expense' ? category : undefined,
      user: userId // Use authenticated user
    });

    // Guardar la transacción en la base de datos
    const savedTransaction = await newTransaction.save();

    // Añadir la transacción al array de transacciones del usuario
    await User.findByIdAndUpdate(
      userId,
      { $push: { transactions: savedTransaction._id } }
    );

    res.status(201).json(savedTransaction); // Enviar la transacción recién creada
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error adding transaction', error: error.message });
  }
}

//! DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  const { id } = req.params //obtener el id de transaction

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id) //eliminamos la transaccion y si no se encuentra...
    if (!deletedTransaction) {
      return res.status(404).json('Transaction not found')
    }

    res.status(200).json('Transaction deleted successfully')
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting transaction:', error: error.message })
  }
}

//! EDIT TRANSACTION
const editTransaction = async (req, res) => {
  const { id } = req.params
  const { type, name, amount, date, category } = req.body

  try {
    const transaction = await Transaction.findById(id) //buscamos transaction por id
    if (!transaction) {
      return res.status(404).json('Transaction not found')
    }

    //? Si el tipo es "Expense", asignamos la categoría
    if (type === 'Expense') {
      transaction.category = category || transaction.category
    } else {
      //? Si el tipo es "Income", eliminamos la categoría
      transaction.category = undefined
    }

    //? Actualizamos el resto de campos
    //property = newValue || existingValue;
    transaction.type = type || transaction.type
    transaction.name = name || transaction.name
    transaction.amount = amount || transaction.amount
    transaction.date = date || transaction.date

    //? Guardamos la transacción actualizada
    const updatedTransaction = await transaction.save() // guardamos los cambios en la DB
    res.status(200).json(updatedTransaction) // Devolvemos la transacción actualizada
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating transaction:', error: error.message })
  }
}

module.exports = {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  editTransaction
}
