const { ValidationError, UnauthorizedError, NotFoundError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const User = require("../../user/service/User");
const Account = require("../../account/service/Account");
const Transaction = require("../service/Transaction");
const Bank = require("../../bank/service/Bank");
require('dotenv').config()

const depositAmount = async (req, resp, next) => {
    try {
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid userId");
      }
      let AccountId = Number(req.params.AccountId);
      if (isNaN(AccountId)) {
        throw new ValidationError("invalid AccountId");
      }
      let amount = req.body.amount
      if (amount < 0) {
        throw new ValidationError("invalid Amount");
      }

      let tran = await Transaction.deposite(AccountId, amount)
      await User.updateNetWorth(userId)
    await Bank.updateBankTotal(tran.myBankId)
      
      resp.status(200).send(tran);
    } catch (error) {
      next(error);
    }
  }
  
  const withdrawAmount = async (req, resp, next) => {
    try {
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid userId");
      }
      let AccountId = Number(req.params.AccountId);
      if (isNaN(AccountId)) {
        throw new ValidationError("invalid AccountId");
      }
      let amount = req.body.amount
      if (amount < 0) {
        throw new ValidationError("invalid Amount");
      }
      let myAcc = await Transaction.withdraw(AccountId, amount)
      await User.updateNetWorth(userId)
    await Bank.updateBankTotal(myAcc.myBankId)
      
      resp.status(200).send(myAcc);
    } catch (error) {
      next(error);
    }
  }
  
  const transferAmount =  async(req, resp, next) => {
    try {
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid userId");
      }
      let AccountId = Number(req.params.AccountId);
      if (isNaN(AccountId)) {
        throw new ValidationError("invalid AccountId");
      }
      let {transferAmount, toAccountNo} = req.body
      if (transferAmount < 0) {
        throw new ValidationError("invalid Amount");
      }

      let mytrans = await Transaction.transfer(AccountId, toAccountNo, transferAmount)
      console.log(AccountId)
      console.log(toAccountNo)
      await User.updateNetWorth(mytrans.fromUserId)
      await User.updateNetWorth(mytrans.toUserId)
    await Bank.updateBankTotal(mytrans.fromBankId)
    await Bank.updateBankTotal(mytrans.toBankId)
      
    let from = await Account.getByAccountId(mytrans.fromUserId,AccountId)
    let to = await Account.getByAccountId(mytrans.toUserId,toAccountNo)
    let myTransaction = {from, to}
      resp.status(200).send(myTransaction);
    } catch (error) {
      next(error);
    }
  }
  
  const getPassbook = async(req, resp, next) => {
    try {
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid userId");
      }
      let AccountId = Number(req.params.AccountId);
      if (isNaN(AccountId)) {
        throw new ValidationError("invalid AccountId");
      }
  
      let myPassbook = await Transaction.getAllTransactions(AccountId)
      
      resp.status(200).send(myPassbook);
    } catch (error) {
      next(error);
    }
  }
  
  const getAccountByDate = async(req, resp, next) => {
    try {
      let userId = Number(req.params.userId);
      if (isNaN(userId)) {
        throw new ValidationError("invalid userId");
      }
      let AccountId = Number(req.params.AccountId);
      if (isNaN(AccountId)) {
        throw new ValidationError("invalid AccountNo");
      }
  
        let {startDate, endDate} = req.query
        let myTransactions = await Transaction.getAccountTransactionsByDate(AccountId, startDate, endDate)
      resp.status(200).send(myTransactions);
    } catch (error) {
      next(error);
    }
  }
  


module.exports = {getAccountByDate, depositAmount,withdrawAmount,transferAmount,getPassbook}