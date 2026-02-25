const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      required: true,
      enum: ['Income', 'Expense'] // solo permite 'income' o 'expense'
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than zero'] // el monto debe ser mayor que cero
    },
    date: {
      type: Date,
      default: Date.now // si no se proporciona una fecha, se usa la fecha actual
    },
    category: {
      type: String,
      enum: [
        'Home',
        'Groceries',
        'Dining & Drinks',
        'Transport',
        'Lifestyle',
        'Entertainment',
        'Health & Fitness',
        'Travel',
        'Debt',
        'Other'
      ],
      required: function () {
        return this.type === 'Expense' // la categoría es requerida solo si el tipo es 'expense'
      }
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
    collection: 'transactions' // nombre de la colección en la base de datos
  }
)

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;

