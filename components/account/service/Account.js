const db = require("../../../models");

class Account {
  constructor(bankName, bankId, userId) {
    this.bankName = bankName;
    this.bankId = bankId;
    this.userId = userId;
  }

  static async getByAccountId(userId, AccountId) {
    const t = await db.sequelize.transaction();
    try {
      let myAcc = await db.account.findAll({
        where: { id: AccountId, userId: userId },
        transaction: t,
      });
      await t.commit();
      return myAcc;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getAllAccounts(userId, offset, limit) {
    const t = await db.sequelize.transaction();
    try {
      let allUsers = await db.account.findAndCountAll({
        where: { userId, userId },
        offset: offset,
        limit: limit,
        transaction: t,
      });
      await t.commit();
      return allUsers;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async newAccount(bankName, bankId, userId) {
    const t = await db.sequelize.transaction();
    try {
      let newAccountObj = new Account(bankName, bankId, userId);
      let newAccount = await db.account.create(newAccountObj, t);
      await t.commit();
      return newAccount;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = Account;
