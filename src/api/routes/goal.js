const { isAuth } = require('../../middlewares/auth');
const { getAllGoals, createGoal, editGoal, deleteGoal } = require('../controllers/goal');

const goalsRoutes = require('express').Router();

goalsRoutes.get('/',[isAuth], getAllGoals);
goalsRoutes.post('/',[isAuth], createGoal);
goalsRoutes.put('/:id', [isAuth], editGoal);
goalsRoutes.delete('/:id', [isAuth], deleteGoal);

module.exports = goalsRoutes;