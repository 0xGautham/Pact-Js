const express = require('express');
const request = require('superagent');
const server = express();

const getApiEndpoint = () => process.env.API_HOST || 'http://localhost:7070';
const authHeader = {
    Authorization: 'Bearer token',
};

// Mock data for bank users
const bankUsers = [
    {
        id: 1,
        name: 'John Doe',
        accountNumber: '1234567890',
        balance: 5000.00,
    },
    {
        id: 2,
        name: 'Jane Smith',
        accountNumber: '0987654321',
        balance: 2500.00,
    },
    // Add more users as needed
];

// Get all bank users
const getAllUsers = () => {
    return bankUsers;
};

// Get user by ID
const getUserById = (id) => {
    return bankUsers.find(user => user.id === parseInt(id, 10));
};

// Get user account by account number
const getUserByAccountNumber = (accountNumber) => {
    return bankUsers.find(user => user.accountNumber === accountNumber);
};

// Transfer money between two bank accounts
const transferMoney = (fromAccountNumber, toAccountNumber, amount) => {
    const fromUser = getUserByAccountNumber(fromAccountNumber);
    const toUser = getUserByAccountNumber(toAccountNumber);

    if (fromUser && toUser && fromUser.balance >= amount) {
        fromUser.balance -= amount;
        toUser.balance += amount;
        return true; // Transfer successful
    } else {
        return false; // Transfer failed
    }
};

// API endpoint to get all bank users
server.get('/users', (req, res) => {
    res.json(getAllUsers());
});

// API endpoint to get user by ID
server.get('/users/:userId', (req, res) => {
    const user = getUserById(req.params.userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// API endpoint to transfer money between accounts
server.post('/transfer', (req, res) => {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;
    if (transferMoney(fromAccountNumber, toAccountNumber, amount)) {
        res.json({ success: true, message: 'Money transferred successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Money transfer failed' });
    }
});

module.exports = {
    server,
    getAllUsers,
    getUserById,
    getUserByAccountNumber,
    transferMoney,
};
