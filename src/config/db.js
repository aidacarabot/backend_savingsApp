const mongoose = require('mongoose');

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
  }
}

module.exports = connectDB;