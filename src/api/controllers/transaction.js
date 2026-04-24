const Transaction = require('../../api/models/transaction')
const User = require('../models/user')

//! GET ALL TRANSACTIONS
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }) // Obtener solo las transacciones del usuario autenticado
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
  const userId = req.user._id

  try {
    const transaction = await Transaction.findById(id)
    if (!transaction) {
      return res.status(404).json('Transaction not found')
    }

    if (transaction.user.toString() !== userId.toString()) {
      return res.status(403).json('Unauthorized: this transaction does not belong to you')
    }

    await transaction.deleteOne()
    await User.findByIdAndUpdate(userId, { $pull: { transactions: id } })

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
  const userId = req.user._id

  try {
    const transaction = await Transaction.findById(id) //buscamos transaction por id
    if (!transaction) {
      return res.status(404).json('Transaction not found')
    }

    if (transaction.user.toString() !== userId.toString()) {
      return res.status(403).json('Unauthorized: this transaction does not belong to you')
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

//! BULK ADD TRANSACTIONS FROM EXCEL
const XLSX = require('xlsx');

const bulkAddTransactions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const userId = req.user._id;

  const VALID_TYPES = ['Income', 'Expense'];
  const VALID_CATEGORIES = [
    'Home', 'Groceries', 'Dining & Drinks', 'Transport', 'Lifestyle',
    'Entertainment', 'Health & Fitness', 'Travel', 'Debt', 'Other'
  ];

  let rows;
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read as array of arrays to locate the header row dynamically
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, cellDates: true });

    // Find the row that contains 'Transaction Type' — wherever it is
    const headerRowIdx = rawRows.findIndex(row =>
      Array.isArray(row) && row.some(cell => typeof cell === 'string' && cell.trim() === 'Transaction Type')
    );

    if (headerRowIdx === -1) {
      return res.status(400).json({ message: 'Could not find a header row with "Transaction Type" column in the file.' });
    }

    const headers = rawRows[headerRowIdx];
    const typeIdx     = headers.findIndex(h => typeof h === 'string' && h.trim() === 'Transaction Type');
    const nameIdx     = headers.findIndex(h => typeof h === 'string' && h.trim().includes('Title'));
    const amountIdx   = headers.findIndex(h => typeof h === 'string' && h.trim().includes('Amount'));
    const dateIdx     = headers.findIndex(h => typeof h === 'string' && h.trim().startsWith('Date'));
    const categoryIdx = headers.findIndex(h => typeof h === 'string' && h.trim().includes('Category'));

    // Data rows = everything after the header row, skip completely empty rows
    rows = rawRows.slice(headerRowIdx + 1)
      .filter(row => Array.isArray(row) && row.some(cell => cell !== '' && cell !== null && cell !== undefined))
      .map(row => ({
        type:     row[typeIdx],
        name:     row[nameIdx],
        amount:   row[amountIdx],
        rawDate:  row[dateIdx],
        category: row[categoryIdx],
      }));

  } catch (err) {
    return res.status(400).json({ message: 'Could not parse the Excel file. Make sure it is a valid .xlsx file.' });
  }

  if (!rows || rows.length === 0) {
    return res.status(400).json({ message: 'The Excel file has no data rows.' });
  }

  const errors = [];
  const toInsert = [];

  rows.forEach((row, idx) => {
    const rowNum  = idx + 1;
    const type     = row.type?.toString().trim();
    const name     = row.name?.toString().trim();
    const rawDate  = row.rawDate;
    const category = row.category?.toString().trim() || undefined;

    // Normalize amount: strip $, spaces, commas (e.g. "$1,200.00" → 1200)
    const rawAmount = row.amount?.toString().replace(/[$,\s]/g, '');
    const amount    = parseFloat(rawAmount);

    // Skip example rows silently (invalid type = not Income/Expense)
    if (!VALID_TYPES.includes(type)) return;

    if (!name) {
      errors.push({ row: rowNum, error: 'Title is required.' });
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      errors.push({ row: rowNum, error: `Invalid amount "${row.amount}". Must be a positive number.` });
      return;
    }

    let date;
    if (rawDate instanceof Date) {
      date = rawDate;
    } else {
      date = new Date(rawDate);
    }
    if (!rawDate || isNaN(date.getTime())) {
      errors.push({ row: rowNum, error: `Invalid date "${rawDate}". Use YYYY-MM-DD format.` });
      return;
    }

    if (type === 'Expense' && !VALID_CATEGORIES.includes(category)) {
      errors.push({ row: rowNum, error: `Invalid or missing category "${category}" for Expense row.` });
      return;
    }

    toInsert.push({
      user: userId,
      type,
      name,
      amount,
      date,
      category: type === 'Expense' ? category : undefined,
    });
  });

  if (toInsert.length === 0) {
    return res.status(400).json({ message: 'No valid rows to import.', errors });
  }

  try {
    const savedTransactions = await Transaction.insertMany(toInsert);
    const ids = savedTransactions.map((t) => t._id);
    await User.findByIdAndUpdate(userId, { $push: { transactions: { $each: ids } } });

    return res.status(201).json({
      message: `${savedTransactions.length} transaction(s) imported successfully.`,
      created: savedTransactions.length,
      errors,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error importing transactions', error: error.message });
  }
};

module.exports = {
  getAllTransactions,
  addTransaction,
  deleteTransaction,
  editTransaction,
  bulkAddTransactions,
}
