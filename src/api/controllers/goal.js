const Goal = require('../models/goal');
const User = require('../models/user'); //para sacar edad del user

//! CREATE NEW GOAL
const createGoal = async (req, res) => {
  const { goalName, targetAmount, completionDate, monthlyContribution } = req.body;
  const userId = req.user._id;  // El id del usuario lo tomamos de req.user (que se pasa en isAuth)

  try {
    //? Obtener el usuario por el ID para obterner el birthDate
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    let calculatedCompletionDate = completionDate;
    let calculatedMonthlyContribution = monthlyContribution;

    //? Calcular la fecha de finalización si se proporciona monthlyContribution
    if (monthlyContribution && !completionDate) {
      const monthsRemaining = targetAmount / monthlyContribution;
      calculatedCompletionDate = new Date();
      calculatedCompletionDate.setMonth(calculatedCompletionDate.getMonth() + monthsRemaining);
    }

    //? Calcular monthlyContribution si se proporciona completionDate
    if (completionDate && !monthlyContribution) {
      const monthsRemaining = (new Date(completionDate) - new Date()) / (1000 * 60 * 60 * 24 * 30); // Convertimos a meses
      calculatedMonthlyContribution = targetAmount / monthsRemaining;
    }

    //? Calcular la edad del usuario en el momento de alcanzar el objetivo
    const ageAtGoalCompletion = new Date(calculatedCompletionDate).getFullYear() - new Date(user.birthDate).getFullYear();

    //? Crear el nuevo goal
    const newGoal = new Goal({
      goalName,
      targetAmount,
      completionDate: calculatedCompletionDate,
      monthlyContribution: calculatedMonthlyContribution,
      ageAtGoalCompletion,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal); // Enviar el goal creado con todos los detalles

  } catch (error) {
    res.status(400).json("Error creating goal:", error);
  }
};

//! GET ALL GOALS
const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    return res.status(200).json(goals); 
  } catch (error) {
    return res.status(500).json("Error fetching goals:", error);
  }
};

//! EDIT GOAL
const editGoal = async (req, res) => {
  const { id } = req.params; // Obtenemos el id del goal
  const { goalName, targetAmount, completionDate, monthlyContribution } = req.body;

  try {
    const goal = await Goal.findById(id); // Buscamos el goal por su id
    if (!goal) {
      return res.status(404).json("Goal not found"); // Si no se encuentra el goal, respondemos con un 404
    }

    let calculatedCompletionDate = completionDate;
    let calculatedMonthlyContribution = monthlyContribution;

    //? Si se proporciona monthlyContribution, calculamos completionDate
    if (monthlyContribution && !completionDate) {
      const monthsRemaining = targetAmount / monthlyContribution;
      calculatedCompletionDate = new Date();
      calculatedCompletionDate.setMonth(calculatedCompletionDate.getMonth() + monthsRemaining);
    }

    //? Si se proporciona completionDate, calculamos monthlyContribution
    if (completionDate && !monthlyContribution) {
      const monthsRemaining = (new Date(completionDate) - new Date()) / (1000 * 60 * 60 * 24 * 30); // Convertimos a meses
      calculatedMonthlyContribution = targetAmount / monthsRemaining;
    }

    //? Actualizamos los datos del goal
    goal.goalName = goalName || goal.goalName;
    goal.targetAmount = targetAmount || goal.targetAmount;
    goal.completionDate = calculatedCompletionDate || goal.completionDate;
    goal.monthlyContribution = calculatedMonthlyContribution || goal.monthlyContribution;

    //? Guardamos el goal actualizado
    const updatedGoal = await goal.save();
    res.status(200).json('Goal updated successfully', updatedGoal) // Enviamos el goal actualizado como respuesta
  } catch (error) {
    res.status(500).json("Error updating goal:", error); // Si hay algún error, respondemos con un 500
  }
};

//! DELETE GOAL
const deleteGoal = async (req, res) => {
  const { id } = req.params; // Obtenemos el id del goal 

  try {
    const goal = await Goal.findById(id); // Buscamos el goal por su id
    if (!goal) {
      return res.status(404).json("Goal not found"); // Si no se encuentra el goal, respondemos con un 404
    }

    //? Eliminamos el goal
    await Goal.findByIdAndDelete(id);
    res.status(200).json("Goal deleted successfully"); // Enviamos respuesta de éxito
  } catch (error) {
    res.status(500).json("Error deleting goal:", error); // Si hay un error, respondemos con un 500
  }
};

module.exports = {
  createGoal,
  getAllGoals,
  editGoal,
  deleteGoal
};

