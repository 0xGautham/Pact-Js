const express = require('express');
const bankController = require('./bank.controller');

const router = express.Router();

// Retrieve all users
router.get('/users', bankController.getAllUsers);

// Retrieve a user by ID
router.get('/users/:id', bankController.getUserById);

// Transfer money between accounts
router.post('/transfer', bankController.transferMoney);

// Add a new user
router.post('/users', bankController.addUser);

module.exports = router;
