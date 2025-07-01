const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateSign } = require("../../config/jwt");

//! GET USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users); //send the users as a response
  } catch (error) {
    return res.status(400).json("Error fetching users:", error);
  }
}

//! REGISTER NEW USER
const register = async (req, res) => {
  const {name, birthDate, email, password, repeatPassword} = req.body; //destructuring the request body
  try {
    const newUser = new User({
      name,
      birthDate,
      email,
      password
    });

    //? Validar que las contraseñas coinciden
    if (password !== repeatPassword) {
      return res.status(400).json("Passwords do not match"); // Si las contraseñas no coinciden, enviar un mensaje de error
    }

    //? Verificar si el usuario ya existe
    const userDuplicated = await User.findOne({ email });
    if (userDuplicated) {
      return res.status(400).json("User already exists with this email"); // Enviar error si el usuario ya existe
    }

    const savedUser = await newUser.save(); //save the user to the database
    res.status(201).json(savedUser); //send the saved user as a response
  } catch (error) {
    res.status(400).json("Error registering user:",error); //send error response
  }
}

//! LOGIN USER
const login = async (req, res) => {
  try {
    const {email, password} = req.body; 
    const user = await User.findOne({email});
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = generateSign(user._id); //generate a token for the user
        return res.status(200).json({ message: "Login successful", user, token });
      }
    } else {
      return res.status(400).json("Email or password incorrect");
    }
} catch (error) {
  return res.status(400).json("Error logging in:", error);
  }
}

//! UPDATE USER
const updateUser = async(req, res) => {
  const {id} = req.params;
  const {name, birthDate, profilePicture, monthlySalary, monthlyExpenses} = req.body;

  try {
    //? Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    //? Actualizar los datos del usuario
    user.name = name || user.name;
    user.birthDate = birthDate || user.birthDate;
    user.monthlySalary = monthlySalary || user.monthlySalary;
    user.profilePicture = profilePicture || user.profilePicture;
    
    //? Si se pasan nuevos monthlyExpenses, actualizamos las categorías correspondientes
    if (monthlyExpenses) {
      user.monthlyExpenses = { 
        ...user.monthlyExpenses,   // Mantén las categorías existentes
        ...monthlyExpenses        // Actualiza las categorías pasadas en la solicitud
      };
    }

    //? Calcular el total de los gastos después de la actualización
    const totalExpenses = Object.values(user.monthlyExpenses).reduce((acc, curr) => acc + curr, 0);
    user.totalExpenses = Number(totalExpenses);

    //?Guardar los cambios en la base de datos
    const updatedUser = await user.save();
    return res.status(200).json({message: "User updated successfully", user: updatedUser});
    
  } catch (error) {
    const errorMessage = error.message || "Error updating user";
    res.status(400).json({ message: errorMessage, error: error });
  }
}

//! DELETE USER
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userIdFromToken = req.user._id;

  try {
    //? Verificar si el ID del usuario en la URL coincide con el ID del usuario autenticado
    if (userIdFromToken.toString() !== id) {
      return res.status(403).json("You are not authorized to delete this account");
    }

    //? Verificar si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    //? Eliminar el usuario
    await User.findByIdAndDelete(id);

    res.status(200).json("User deleted successfully");
  } catch (error) {
    res.status(500).json("Error deleting user:", error);
  }
};

module.exports = { register, login, getUsers, updateUser, deleteUser };