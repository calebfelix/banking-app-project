const { ValidationError,NotFoundError } = require("../../../error");
const Bank = require("../../bank/service/Bank");
const User = require("../../user/service/User");
const Account = require("../service/Account");
require('dotenv').config()

const getAllAccounts = async(req, resp, next) => {
  try {
    let { offset, limit } = req.query;
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid parameters");
    }

    let myUser = await User.getUserById(userId);
    if (myUser.length == 0) {
      throw new NotFoundError("User Not Found");
    }

    let allAccounts = await Account.getAllAccounts(userId,offset,limit)

    resp.status(200).send(allAccounts);
  } catch (error) {
    next(error);
  }
};

const createAccount = async (req, resp, next) => {
  try {
    let bankId = Number(req.body.bankId)
    let userId = Number(req.params.userId);
    if (typeof bankId != "number") {
      throw new ValidationError("invalid bank id");
    }
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
    let myUser = await User.getUserById(userId);
    if (myUser.length == 0) {
      throw new NotFoundError("User Not Found");
    }
    let myBank = await Bank.getBankById(bankId)
    if (myBank.length == 0) {
      throw new NotFoundError("Bank Not Found");
    }

    let myAcc = await Account.newAccount(myBank[0].dataValues.bankName,bankId, userId)
    await User.updateNetWorth(userId)
    await Bank.updateBankTotal(bankId)
    resp.status(201).send(myAcc);
  } catch (error) {
    next(error);
  }
};

const getAccountById = async(req, resp, next) => {
  try {
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
    let AccountId = Number(req.params.AccountId);
    if (isNaN(AccountId)) {
      throw new ValidationError("invalid AccountNo");
    }

    let myAcc = await Account.getByAccountId(userId, AccountId)
    resp.status(200).send(myAcc);
  } catch (error) {
    next(error);
  }
};


module.exports = { createAccount, getAllAccounts, getAccountById};
