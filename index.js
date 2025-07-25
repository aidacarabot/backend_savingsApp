require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const usersRoutes = require('./src/api/routes/user');
const transactionsRoutes = require('./src/api/routes/transaction');
const goalsRoutes = require('./src/api/routes/goal');
const { connectCloudinary } = require('./src/utils/cloudinary');

const app = express();

// Configurar CORS para permitir solicitudes de localhost:5173 (tu frontend)
const corsOptions = {
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite encabezados 'Content-Type'
};

app.use(cors(corsOptions)); // Aplicar CORS a todas las rutas
app.use(express.json());

connectDB();

connectCloudinary();

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/goals', goalsRoutes);

// Ruta para manejar rutas no encontradas (404) después de todas las rutas definidas
app.use((req, res) => {
  return res.status(404).json({ message: "Route not found" });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})



