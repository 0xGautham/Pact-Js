// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const BankRepository = require('./bankRepository');

// const server = express();
// server.use(cors());
// server.use(bodyParser.json());
// server.use(
//     bodyParser.urlencoded({
//         extended: true,
//     })
// );
// server.use((req, res, next) => {
//     res.header('Content-Type', 'application/json; charset=utf-8');
//     next();
// });

// server.use((req, res, next) => {
//     const token = req.headers['authorization'] || '';

//     if (token !== 'Bearer token') {
//         res.status(401).send();
//     } else {
//         next();
//     }
// });

// const bankRepository = new BankRepository();

// const importData = (bankRepository) => {

//     const defaultUsers = [
//         {
//             id: 1,
//             name: 'John Doe',
//             accountNumber: '1234567890',
//             balance: 5000.00,
//         },
//         {
//             id: 2,
//             name: 'Jane Smith',
//             accountNumber: '0987654321',
//             balance: 2500.00,
//         },

//     ];
// };

// server.get('/users', (req, res) => {
//     res.json(bankRepository.getAllUsers());
// });


// server.get('/users/:userId', (req, res) => {
//     const user = bankRepository.getUserById(req.params.userId);
//     if (user) {
//         res.json(user);
//     } else {
//         res.status(404).json({ error: 'User not found' });
//     }
// });


// server.post('/transfer', (req, res) => {
//     const { fromAccountNumber, toAccountNumber, amount } = req.body;
//     const result = bankRepository.transferMoney(fromAccountNumber, toAccountNumber, amount);

//     if (result.success) {
//         res.json({ success: true, message: 'Money transferred successfully' });
//     } else {
//         res.status(400).json({ success: false, message: 'Money transfer failed' });
//     }
// });

// module.exports = {
//     server,
//     importData,
//     bankRepository,
// };


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const BankRepository = require('./bankRepository');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
server.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
});

server.use((req, res, next) => {
    const token = req.headers['authorization'] || '';

    if (token !== 'Bearer token') {
        res.status(401).send();
    } else {
        next();
    }
});

const bankRepository = new BankRepository();

// Import data into the repository
const importData = () => {
    const defaultUsers = [
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
    ];

    // Insert default users into the repository
    defaultUsers.forEach(user => bankRepository.insert(user));
};

// Call importData to initialize the repository with default users
importData();

server.get('/users', (req, res) => {
    res.json(bankRepository.getAllUsers());
});

server.get('/users/:userId', (req, res) => {
    const user = bankRepository.getUserById(req.params.userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

server.post('/transfer', (req, res) => {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;
    const result = bankRepository.transferMoney(fromAccountNumber, toAccountNumber, amount);

    if (result.success) {
        res.json({ success: true, message: 'Money transferred successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Money transfer failed' });
    }
});

module.exports = {
    server,
    importData,
    bankRepository,
};
