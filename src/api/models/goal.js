const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const goalSchema = new Schema ({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goalName: {
    type: String,
    required: true,
    trim: true // elimina espacios en blanco al inicio y al final
  },
  targetAmount: {
    type: Number,
    required: true,
    min: [0.01, 'Target amount must be greater than zero'] // el monto objetivo debe ser mayor que cero
  },
  completionDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > new Date(); // la fecha límite no puede ser en el pasado
      },
      message: 'Deadline must be in the future'
    }
  },
  monthlyContribution: {
    type: Number,
    required: true,
    min: [0, 'Monthly contribution must be a positive number'], // la contribución mensual debe ser un número positivo
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  }

}, {
  timestamps: true, // agrega createdAt y updatedAt automáticamente
  collection: 'goals' // nombre de la colección en la base de datos
})

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;