const express = require('express');
const router = express.Router();

// Import controller
const userController = require('../Controller/UserController');

// Login
router.post('/Login', userController.LoginUser);

// GET user by ID
router.get('/:id', userController.getUserById);

// CREATE new user
router.post('/SignUp', userController.SignUp);



module.exports = router;
