// Simple object repository for banking users
class BankRepository {
    constructor() {
        this.users = [];
    }

    getAllUsers() {
        return this.users;
    }

    getUserById(id) {
        return this.users.find((user) => id == user.id);
    }

    getUserByAccountNumber(accountNumber) {
        return this.users.find((user) => accountNumber === user.accountNumber);
    }

    transferMoney(fromAccountNumber, toAccountNumber, amount) {
        const fromUser = this.getUserByAccountNumber(fromAccountNumber);
        const toUser = this.getUserByAccountNumber(toAccountNumber);

        if (fromUser && toUser && fromUser.balance >= amount) {
            fromUser.balance -= amount;
            toUser.balance += amount;
            return { success: true };
        } else {
            return { success: false, error: 'Transfer failed. Insufficient funds or invalid account.' };
        }
    }

    insert(user) {
        this.users.push(user);
    }

    clear() {
        this.users = [];
    }
}

module.exports = BankRepository;
