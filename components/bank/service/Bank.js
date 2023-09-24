const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("../../../error");
const db = require("../../../models");

class Bank {
  constructor(bankName, abrivation) {
    this.bankName = bankName;
    this.abrivation = abrivation;
  }

  static async updateBankTotal(bankId) {
    const t = await db.sequelize.transaction();
try {
  let total=0;
  let [myBank] = await db.bank.findAll({transaction:t,where:{id:bankId},attributes:['bank_total'],include:{model:db.account,attributes:['account_balance']},})
  myBank.accounts.forEach(element => {
    total = total + element.dataValues.account_balance
  });
  let up = await db.bank.update({ bankTotal: total },{ where: { id: bankId }, transaction:t })
  if([up]==0){
    throw new ValidationError("could not update bankTotal")
  }
  let returnBank = await db.bank.findAll({transaction:t,where:{id:bankId}})
  await t.commit();
  return returnBank

} catch (error) {
  await t.rollback();
    throw error;
}
  }

  static async getBankTotal(bankId) {
    const t = await db.sequelize.transaction();
    try {
      await Bank.updateBankTotal(bankId)
      let myBank = await db.bank.findAll({
        where: { id: bankId },
        attributes: ["bank_total"],
      });
      await t.commit();
      return myBank;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static abrivation(bankName) {
    let upper = bankName.toUpperCase().split(" ");
    let words = upper.map((word) => {
      return word[0];
    });
    return words.join("");
  }

  static async newBank(bankName) {
    const t = await db.sequelize.transaction();
    try {
      let newBankObj = new Bank(bankName, Bank.abrivation(bankName));
      let newBank = await db.bank.create(newBankObj, t);
      await t.commit();
      return newBank;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getAllBanks(offset, limit) {
    const t = await db.sequelize.transaction();
    try {
      let allBanks = await db.bank.findAndCountAll({
        include: { all: true, nested: true },
        offset: offset,
        limit: limit,
        transaction: t,
      });
      await t.commit();
      return allBanks;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async getBankById(id) {
    const t = await db.sequelize.transaction();
    try {
      let myBank = await db.bank.findAll({
        where: { id: id },
        include: { all: true, nested: true },
        transaction: t,
      });
      await t.commit();
      return myBank;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  static async updateBankName(bankId, newValue) {
    const t = await db.sequelize.transaction();
    try {
      let up = await db.bank.update(
        { bankName: newValue },
        { where: { id: bankId }, transaction: t }
      );
      let newAbrivation = Bank.abrivation(newValue);
      await db.bank.update(
        { abrivation: newAbrivation },
        { where: { id: bankId }, transaction: t }
      );
      await t.commit();
      console.log(up);
      return up;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  
}

module.exports = Bank;
