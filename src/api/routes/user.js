const { isAuth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/file');
const { getUsers, register, login, updateUser, deleteUser } = require('../controllers/user');

const usersRoutes = require('express').Router();

usersRoutes.get('/', getUsers);
usersRoutes.post('/register', register); 
usersRoutes.post('/login', login);
usersRoutes.put('/:id', [isAuth, upload.single('profilePicture')], updateUser); 
usersRoutes.delete('/:id', [isAuth], deleteUser); 

module.exports = usersRoutes;