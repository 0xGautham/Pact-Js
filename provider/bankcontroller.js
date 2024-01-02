const BankRepository = require("./bank.repository");

const repository = new BankRepository();

exports.getAllUsers = (req, res) => {
    res.send(repository.getAllUsers());
};

exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = repository.getUserById(userId);

    if (user) {
        res.send(user);
    } else {
        res.status(404).send({ message: "User not found" });
    }
};

exports.transferMoney = (req, res) => {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;
    const result = repository.transferMoney(fromAccountNumber, toAccountNumber, amount);

    if (result.success) {
        res.send({ message: "Money transfer successful" });
    } else {
        res.status(400).send({ message: result.error });
    }
};

exports.addUser = (req, res) => {
    const { accountNumber, balance, id, name } = req.body;
    const user = {
        accountNumber,
        balance,
        id,
        name,
    };

    repository.insert(user);
    res.send({ message: "User added successfully", user });
};

exports.repository = repository;
