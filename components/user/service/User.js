const Account = require("../../account/service/Account");
const Bank = require("../../bank/service/Bank");
const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const bcrypt = require('bcrypt');
const db = require("../../../models");

class User {
  // static userId = 0;
  static allUsers = [];
  constructor(name, age, gender, isAdmin, username, password) {
    // this.userId = User.userId++;
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.isAdmin = isAdmin;
    this.accounts = [];
    this.username=username;
    this.password=password
  }
  // Utility Functions
  updateNetWorth() {
    let total = 0;
    for (let index = 0; index < this.accounts.length; index++) {
      total = total + this.accounts[index].AccountBalance;
    }
    this.netWorth = total;
    return this.netWorth;
  }

  getAccounts(){
return this.accounts
  }

  static findUserByUsername(username) {
    try {
      for (let index = 0; index < User.allUsers.length; index++) {
        if (User.allUsers[index].username === username) {
          let foundObject = User.allUsers[index];
          return foundObject;
        }
      }
      throw new NotFoundError("User Not Found");
    } catch (error) {
      throw error;
    }
  }

  getNetWorth() {
    return this.netWorth;
  }

  static findUser(userId) {
    for (let index = 0; index < User.allUsers.length; index++) {
      if (userId === User.allUsers[index].userId) {
        return User.allUsers[index];
      }
    }
    return null;
  }

  static findUserById(userId) {
try {
  for (let index = 0; index < User.allUsers.length; index++) {
    if (userId === User.allUsers[index].userId) {
      return User.allUsers[index];
    }
  }  
  throw new NotFoundError("User Not Found");
} catch (error) {
  throw error;
}
  }

  findUserAccount(accountNumber) {
    for (let index = 0; index < this.accounts.length; index++) {
      if (accountNumber == this.accounts[index].AccountNumber) {
        return [this.accounts[index], index];
      }
    }
    return [null, -1];
  }

  updateName(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid name");
      }
      this.name = newValue;
    } catch (error) {
      throw error;
    }
  }

  updateAge(newValue) {
    try {
      if (typeof newValue != "number") {
        throw new ValidationError("Invalid Age");
      }
      this.age = newValue;
    } catch (error) {
      throw error;
    }
  }

  updateGender(newValue) {
    try {
      if (typeof newValue != "string") {
        throw new ValidationError("Invalid Gender");
      }
      this.gender = newValue;
    } catch (error) {
      throw error;
    }
  }

  /// CREATE user///
  static async newAdmin(name, age, gender, username, password) {
    try {
      if (typeof name != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof age != "number") {
        throw new ValidationError("invalid age");
      }
      if (typeof gender != "string") {
        throw new ValidationError("invalid gender");
      }
      let hashedPassword = await bcrypt.hash(password, 12)
      let newAdmin = new User(name, age, gender, true, username, hashedPassword);
      let myAdmin = await db.user.create(newAdmin)
      // User.allUsers.push(myAdmin)
      return myAdmin;
    } catch (error) {
      return error;
    }
  }

  static async newUser(name, age, gender, username, password) {
    try {
      if (typeof name != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof age != "number") {
        throw new ValidationError("invalid age");
      }
      if (typeof gender != "string") {
        throw new ValidationError("invalid gender");
      }
      let hashedPassword = bcrypt.hash(password, 12)
      let newUser = new User(name, age, gender, false, username, await hashedPassword);
      User.allUsers.push(newUser);
      return newUser;
    } catch (error) {
      return error;
    }
  }

  /// READ user///
  static getAllUsers() {
    try {
      if (User.allUsers.length === 0) {
        throw new NotFoundError("Contact list is empty");
      }
      return User.allUsers;
    } catch (error) {
      return error;
    }
  }

  /// UPDATE user///
  static updateUser(userId, parameter, newValue) {
    try {
      let userToBeUpdated = User.findUser(userId);
      if (userToBeUpdated == null) {
        throw new NotFoundError("User Not Found!");
      }

      switch (parameter) {
        case "name":
          userToBeUpdated.updateName(newValue);
          return userToBeUpdated;
        case "age":
          userToBeUpdated.updateAge(newValue);
          return userToBeUpdated;
        case "gender":
          userToBeUpdated.updateGender(newValue);
          return userToBeUpdated;
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      return error;
    }
  }

  /// CREATE Bank///
  newBank(bankName) {
    try {
      if (!this.isAdmin) {
        throw new UnauthorizedError("Not a Admin");
      }
      return Bank.newBank(bankName);
    } catch (error) {
      return error;
    }
  }

  /// READ Bank///
  getAllBanks() {
    try {
      if (!this.isAdmin) {
        throw new UnauthorizedError("Not a Admin");
      }
      if (Bank.allBanks.length === 0) {
        throw new NotFoundError("Bank list is empty");
      }
      return Bank.allBanks;
    } catch (error) {
      return error;
    }
  }

  /// UPDATE Bank///
  updateBank(bankId, parameter, newValue) {
    try {
      if (!this.isAdmin) {
        throw new UnauthorizedError("Only admin can update");
      }
      switch (parameter) {
        case "bankName":
          return Bank.updateBankName(bankId, newValue);
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      return error;
    }
  }

  /// CREATE Account ///
  newAccount(bankId) {
    try {
      // if (this.isAdmin) {
      //   throw new UnauthorizedError("Not a User");
      // }
      let [BankWhereAccountNeedsCreation, index] = Bank.findBank(bankId);
      if (BankWhereAccountNeedsCreation == null) {
        throw new NotFoundError("Bank Not Found");
      }

      let newAccount = Account.newAccount(
        BankWhereAccountNeedsCreation.bankId,
        this.userId
      );

      this.accounts.push(newAccount);
      BankWhereAccountNeedsCreation.accounts.push(newAccount);
      BankWhereAccountNeedsCreation.updateBankTotal();
      this.updateNetWorth();
      return this;
    } catch (error) {
      return error;
    }
  }

  /// READ Account ///
  getAccounts() {
    try {
      if (this.isAdmin) {
        throw new UnauthorizedError("Not a User");
      }
      return this.accounts;
    } catch (error) {
      return error;
    }
  }

  /// User Deposit ///
  deposite(accountNumber, amount) {
    try {
      if (this.isAdmin) {
        throw new UnauthorizedError("Not a User");
      }
      if (typeof accountNumber != "number") {
        throw new ValidationError("invalid Account Number");
      }
      if (typeof amount != "number") {
        throw new ValidationError("invalid Amount");
      }
      if (amount < 0) {
        throw new ValidationError("invalid Amount");
      }

      let [userAccount, accountIndex] = this.findUserAccount(accountNumber);
      if (userAccount == null) {
        throw new NotFoundError("Account number not found in User");
      }
      let [bankAccount, bankAccountIndex] = Bank.findBank(userAccount.bankId);
      this.accounts[accountIndex].addAmount(amount, accountNumber, -1);
      if (bankAccount == null) {
        throw new NotFoundError("Account not found in Bank");
      }
      bankAccount.updateBankTotal();
      this.updateNetWorth();
      return bankAccount;
    } catch (error) {
      return error;
    }
  }

  /// User Withdraw ///
  withdraw(accountNumber, amount) {
    try {
      if (this.isAdmin) {
        throw new UnauthorizedError("Not a User");
      }
      if (typeof accountNumber != "number") {
        throw new ValidationError("invalid Account Number");
      }
      if (typeof amount != "number") {
        throw new ValidationError("invalid Amount");
      }
      if (amount < 0) {
        throw new ValidationError("invalid Amount");
      }

      let [userAccount, accountIndex] = this.findUserAccount(accountNumber);
      if (userAccount == null) {
        throw new NotFoundError("Account number not found in User");
      }
      let [bankAccount, bankAccountIndex] = Bank.findBank(userAccount.bankId);
      this.accounts[accountIndex].deductAmount(amount, -1, accountNumber);
      if (bankAccount == null) {
        throw new NotFoundError("Account not found in Bank");
      }
      bankAccount.updateBankTotal();
      this.updateNetWorth();
      return bankAccount;
    } catch (error) {
      return error;
    }
  }

  /// User Transfer ///
  transfer(fromAccountNo, toAccountNo, transferAmount) {
    try {
      if (this.isAdmin) {
        throw new UnauthorizedError("Not a User");
      }
      if (typeof toAccountNo != "number") {
        throw new ValidationError("Not a Valid toAccountNo");
      }
      if (typeof fromAccountNo != "number") {
        throw new ValidationError("Not a Valid fromAccountNo");
      }
      if (typeof transferAmount != "number") {
        throw new ValidationError("Not a Valid Amount");
      }

      let [from, fromIndex] = this.findUserAccount(fromAccountNo);
      if (from == null) {
        throw new UnauthorizedError("Not Authorized to transfer from this Acc");
      }

      let to = Account.findAccount(toAccountNo);
      if (to == null) {
        throw new ValidationError("to account number not valid");
      }

      if (from.userId == to.userId && from.bankId == to.bankId) {
        throw new UnauthorizedError("Not Allowed to transfer to self");
      }

      if (from.AccountBalance - transferAmount < 1000) {
        throw new ValidationError("Insufficent Balance");
      }

      from.deductAmount(transferAmount, fromAccountNo, toAccountNo);
      to.addAmount(transferAmount, fromAccountNo, toAccountNo);

      let [bankTotalFrom, fromTotalIndex] = Bank.findBank(from.bankId);
      let [bankTotalTo, toTotalIndex] = Bank.findBank(to.bankId);

      bankTotalFrom.updateBankTotal();
      bankTotalTo.updateBankTotal();

      let userNetWorthToBeUpdated = User.findUser(to.userId);

      this.updateNetWorth();
      userNetWorthToBeUpdated.updateNetWorth();
      return Account.allAccounts;
    } catch (error) {
      return error;
    }
  }

  /// get Transactions by date ///
  getAccountTransactionsByDate(accountNumber, startDate, endDate) {
    try {
      if (this.isAdmin) {
        throw new UnauthorizedError("Not a User");
      }
      if (typeof accountNumber != "number") {
        throw new ValidationError("Not a Valid to AccountNo");
      }
      if (typeof startDate != "string") {
        throw new ValidationError("Not a Valid from start Date");
      }
      if (typeof endDate != "string") {
        throw new ValidationError("Not a Valid from end Date");
      }

      let [userAccount, fromIndex] = this.findUserAccount(accountNumber);
      if (userAccount == "") {
        throw new UnauthorizedError(
          "Not Authorized to get transactions of this Acc"
        );
      }
      let userPassbook = userAccount.getPassbook();
      // let userPassbook = userAccount.passbook;

      if (startDate === "") {
        startDate = "1/1/1800";
      }
      if (endDate === "") {
        let temp = new Date();
        endDate = temp.toLocaleDateString();
      }

      let filteredDate = userPassbook.filter((transaction) => {
        return transaction.getDate() >= startDate && transaction.getDate() <= endDate;
      });

      return filteredDate;
    } catch (error) {
      return error;
    }
  }

  static async authenticateUser(username, password) {
    try {
    let myUser = User.findUserByUsername(username);
    let check = bcrypt.compare(password, myUser.password)
    if (!await check) {
      throw new UnauthorizedError("authentication failed");
    }
      const token = Jwtauthentication.authenticate(myUser.userId, myUser.username, myUser.isAdmin)
      return token
    } catch (error) {
      throw error
    }

  }
}

module.exports = User;

// let driver = async()=>{
//   let admin = await User.newAdmin("caleb", 3, "m", "admin", "password");
//   let user1 = await User.newUser("u1", 22, "m", "u1", "password");
//   let user2 = await User.newUser("u2", 25, "f","u2", "password");
//   Bank.newBank("Indian Bank")
//   Bank.newBank("Axis Bank")
//   Bank.newBank("Maharashtra Bank")
//   Bank.newBank("Bank of Baroda")
//   Bank.newBank("Bank of Andhra")

// }

// driver()

