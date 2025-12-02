const Goal = require('../models/goal');
const User = require('../models/user'); //para sacar edad del user

//! CREATE NEW GOAL
const createGoal = async (req, res) => {
  const { goalName, targetAmount, completionDate, monthlyContribution } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    let calculatedCompletionDate = completionDate;
    let calculatedMonthlyContribution = monthlyContribution;

    if (monthlyContribution && !completionDate) {
      const monthsRemaining = targetAmount / monthlyContribution;
      calculatedCompletionDate = new Date();
      calculatedCompletionDate.setMonth(calculatedCompletionDate.getMonth() + monthsRemaining);
    }

    if (completionDate && !monthlyContribution) {
      const monthsRemaining = (new Date(completionDate) - new Date()) / (1000 * 60 * 60 * 24 * 30);
      calculatedMonthlyContribution = targetAmount / monthsRemaining;
    }

    const ageAtGoalCompletion = new Date(calculatedCompletionDate).getFullYear() - new Date(user.birthDate).getFullYear();

    // 1. Add user reference to the goal
    const newGoal = new Goal({
      goalName,
      targetAmount,
      completionDate: calculatedCompletionDate,
      monthlyContribution: calculatedMonthlyContribution,
      currentAmount: 0,
      ageAtGoalCompletion,
      user: userId
    });

    const savedGoal = await newGoal.save();

    // 2. Push the goal's _id to the user's goals array
    await User.findByIdAndUpdate(userId, { $push: { goals: savedGoal._id } });

    res.status(201).json(savedGoal);

  } catch (error) {
    res.status(400).json({ message: "Error creating goal:", error: error.message });
  }
};

//! GET ALL GOALS
const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    return res.status(200).json(goals); 
  } catch (error) {
    return res.status(500).json({ message: "Error fetching goals:", error: error.message });
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
     if (currentAmount !== undefined) {
      goal.currentAmount = currentAmount;
    }

    //? Guardamos el goal actualizado
    const updatedGoal = await goal.save();
    res.status(200).json('Goal updated successfully', updatedGoal) // Enviamos el goal actualizado como respuesta
  } catch (error) {
    res.status(500).json({ message: 'Error updating goal:', error: error.message }) // Si hay algún error, respondemos con un 500
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
    res.status(500).json({ message: 'Error deleting goal:', error: error.message }) // Si hay un error, respondemos con un 500
  }
};

module.exports = {
  createGoal,
  getAllGoals,
  editGoal,
  deleteGoal
};

