const { ValidationError, NotFoundError, UnauthorizedError } = require("../../../error");
const db = require("../../../models");
const { Op } = require("sequelize");

class Transaction {
  constructor(
    senderAccountId,
    receverAccountId,
    amount,
    currentBalance,
    type,
    accountId
  ) {
    this.senderAccountId = senderAccountId;
    this.receverAccountId = receverAccountId;
    this.amount = amount;
    this.currentBalance = currentBalance;
    this.type = type;
    this.accountId = accountId;
  }

  static async deposite(accountId, amount) {
    try {
      let bankAccount = await Transaction.addAmount(amount, -1, accountId);
      return bankAccount;
    } catch (error) {
      throw error;
    }
  }

  static async withdraw(accountId, amount) {
    try {
      let bankAccount = await Transaction.deductAmount(amount, accountId, -1 );
      return bankAccount;
    } catch (error) {
      throw error;
    }
  }

  static async getAllTransactions(AccountId){
    const t = await db.sequelize.transaction();
    try {
      let allTransactions = await db.transaction.findAll({transaction:t, where:{accountId:AccountId}})
      await t.commit()
      return allTransactions
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  static async addAmount(amount, senderAccountId, receverAccountId) {
    const t = await db.sequelize.transaction();
    try {
      let myAcc = await db.account.findAll({ where: { id: receverAccountId }, transaction:t});
      if (myAcc.length == 0) {
        throw new NotFoundError("Account Not Found");
      }
      let up = await db.account.update({ accountBalance: myAcc[0].dataValues.accountBalance + amount },{ where: { id: receverAccountId }, transaction:t });
      if (up[0] == 0) {
        throw new ValidationError("could not update");
      }
      let forBalance = await db.account.findAll({ where: { id: receverAccountId }, transaction:t});
    
      let newTransactionObj = new Transaction(
        senderAccountId,
        receverAccountId,
        amount,
        forBalance[0].dataValues.accountBalance,
        "Credit",
        receverAccountId
      );
      let newTransaction = await db.transaction.create(newTransactionObj,t)
      await t.commit()
      return {newTransaction:newTransaction, myBankId:myAcc[0].dataValues.bankId}
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async deductAmount(amount, senderAccountId, receverAccountId) {
    const t = await db.sequelize.transaction();
    try {
      let myAcc = await db.account.findAll({ where: { id: senderAccountId }, transaction:t});
      if (myAcc.length == 0) {
        throw new NotFoundError("Account Not Found");
      }
      if (myAcc[0].dataValues.accountBalance - amount < 1000) {
        throw new ValidationError("insufficent balance amount exceding minimum balance");
      }

      let up = await db.account.update({ accountBalance: myAcc[0].dataValues.accountBalance - amount },{ where: { id: senderAccountId }, transaction:t });
      if (up[0] == 0) {
        throw new ValidationError("could not update");
      }
      let forBalance = await db.account.findAll({ where: { id: senderAccountId }, transaction:t});
    
      let newTransactionObj = new Transaction(
        senderAccountId,
        receverAccountId,
        amount,
        forBalance[0].dataValues.accountBalance,
        "Debit",
        senderAccountId
      );
      let newTransaction = await db.transaction.create(newTransactionObj,t)
      await t.commit()
      return {newTransaction:newTransaction, myBankId:myAcc[0].dataValues.bankId}
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async transfer(fromAccountId, toAccountId, transferAmount) {
    const t = await db.sequelize.transaction();
    try {
      let fromAcc = await db.account.findAll({ where: { id: fromAccountId }, transaction:t});
      if (fromAcc.length == 0) {
        throw new NotFoundError("from Account Not Found");
      }

      let toAcc = await db.account.findAll({ where: { id: toAccountId }, transaction:t});
      if (toAcc.length == 0) {
        throw new NotFoundError("to Account Not Found");
      }

      if (fromAcc[0].dataValues.userId == toAcc[0].dataValues.userId && fromAcc[0].dataValues.bankId == toAcc[0].dataValues.bankId) {
        throw new UnauthorizedError("Not Allowed to transfer to self");
      }

      if (fromAcc[0].dataValues.accountBalance - transferAmount < 1000) {
        throw new ValidationError("Insufficent Balance");
      }

      await Transaction.deductAmount(transferAmount, fromAccountId, toAccountId);
      await Transaction.addAmount(transferAmount, fromAccountId, toAccountId);

      await t.commit()
      return {
        fromUserId:fromAcc[0].dataValues.userId ,
        toUserId:toAcc[0].dataValues.userId,
        fromBankId:fromAcc[0].dataValues.bankId ,
        toBankId:toAcc[0].dataValues.bankId
      }
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
  
  static async getAccountTransactionsByDate(AccountId, startDate, endDate){
    const t = await db.sequelize.transaction();
    try {
      let transactionByDate = await db.transaction.findAll({transaction:t, where:{accountId:AccountId, createdAt: {
        [Op.and]: [
          {
            [Op.lt]: new Date(`${endDate} 23:59:59`),
            [Op.gt]: new Date(startDate)
          }
        ]
      }}})
      await t.commit()
      return transactionByDate
    } catch (error) {
      await t.rollback()
      throw error;
    }
    }
}

module.exports = Transaction;
