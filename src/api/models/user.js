const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Importa bcryptjs para el hash de contraseñas

const Schema = mongoose.Schema;

//? Categorías predeterminadas de gastos
const defaultExpenses = {
  'Home 🏠': 0,
  'Transportation 🚗': 0,
  'Groceries 🛒': 0,
  'Health 🏥': 0,
  'Entertainment 🎭': 0,
  'Travel ✈️': 0,
  'Subscriptions 💳': 0,
  'Shopping 🛍️': 0,
  'Education 📚': 0,
  'Gifts 🎁': 0,
  'Debt 🏦': 0,
  'Leisure 🍸': 0,
  'Other ❓': 0
};


const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // elimina espacios en blanco al inicio y al final
  },
  birthDate: {
    type: Date,
    required: true, // la fecha de nacimiento es obligatoria
    validate: {
      validator: function(value) {
        return value <= new Date(); // la fecha de nacimiento no puede ser en el futuro
      },
      message: 'Birth date cannot be in the future'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true, // el correo electrónico debe ser único
    trim: true, // elimina espacios en blanco al inicio y al final
    lowercase: true, // convierte el correo electrónico a minúsculas
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] // valida el formato del correo electrónico
  },
  password: {
    type: String,
    trim: true, // elimina espacios en blanco al inicio y al final
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'], // la contraseña debe tener al menos 6 caracteres
  },
  profilePicture: {
    type: String,
    default: '/img/default-profile.png',
  },
  monthlySalary: {
    type: Number,
    min: [0, 'Monthly salary must be a positive number'],
    default: 0, // salario mensual por defecto es 0
  },
  monthlyExpenses: {
    type: Object,
    default: defaultExpenses
  },
  totalExpenses: {
    type: Number,
    default: 0
  }
}, 
{
  timestamps: true, // agrega createdAt y updatedAt automáticamente
  collection: 'users' // nombre de la colección en la base de datos
})

//? Encriptación de la contraseña
userSchema.pre("save", function () {
    this.password = bcrypt.hashSync(this.password, 10);
})

const User = mongoose.model('User', userSchema);
module.exports = User;