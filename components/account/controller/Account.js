const { ValidationError, UnauthorizedError } = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const User = require("../../user/service/User");
const Account = require("../service/Account");
require('dotenv').config()

const getAllAccounts = (req, resp, next) => {
  try {
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid parameters");
    }
    // does not have access to other users
    const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if(payload.userId != userId){
        throw new UnauthorizedError("User does not access");
      }

    let myUser = User.findUserById(userId)
    resp.status(200).send(myUser.accounts);
  } catch (error) {
    next(error);
  }
};

const createAccount = (req, resp, next) => {
  try {
    let bankId = Number(req.body.bankId)
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
// does not have access to other users
    const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if(payload.userId != userId){
        throw new UnauthorizedError("User does not access");
      }

    let myUser = User.findUserById(userId)
    let myAcc = myUser.newAccount(bankId)
    resp.status(200).send(myAcc);
  } catch (error) {
    next(error);
  }
};

const getAccountByAccNo = (req, resp, next) => {
  try {
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
    let AccountNo = Number(req.params.AccountNo);
    if (isNaN(AccountNo)) {
      throw new ValidationError("invalid AccountNo");
    }
    // does not have access to other users
    const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if(payload.userId != userId){
        throw new UnauthorizedError("User does not access");
      }

    let myAcc = Account.findByAccountNo(AccountNo)
    resp.status(200).send(myAcc);
  } catch (error) {
    next(error);
  }
};

const depositAmount =  (req, resp, next) => {
  try {
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
    let AccountNo = Number(req.params.AccountNo);
    if (isNaN(AccountNo)) {
      throw new ValidationError("invalid AccountNo");
    }

        // does not have access to other users
        const token = req.cookies.auth;
        if (!token) {
          throw new UnauthorizedError("Token Not Found");
        }
        let payload = Jwtauthentication.verifyToken(token);
        if(payload.userId != userId){
          throw new UnauthorizedError("User does not access");
        }

    let amount = req.body.amount
    let myUser = User.findUserById(userId)
    let myAcc = myUser.deposite(AccountNo, amount)
    
    resp.status(200).send(myAcc);
  } catch (error) {
    next(error);
  }
}

const withdrawAmount =  (req, resp, next) => {
  try {
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
    let AccountNo = Number(req.params.AccountNo);
    if (isNaN(AccountNo)) {
      throw new ValidationError("invalid AccountNo");
    }

    // does not have access to other users
    const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if(payload.userId != userId){
        throw new UnauthorizedError("User does not access");
      }
    
    let amount = req.body.amount
    let myUser = User.findUserById(userId)
    let myAcc = myUser.withdraw(AccountNo, amount)
    
    resp.status(200).send(myAcc);
  } catch (error) {
    next(error);
  }
}


const transferAmount =  (req, resp, next) => {
  try {
    let userId = Number(req.params.userId);
    if (isNaN(userId)) {
      throw new ValidationError("invalid userId");
    }
    let AccountNo = Number(req.params.AccountNo);
    if (isNaN(AccountNo)) {
      throw new ValidationError("invalid AccountNo");
    }

    // does not have access to other users
    const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if(payload.userId != userId){
        throw new UnauthorizedError("User does not access");
      }
    
    let amount = req.body.amount
    let myUser = User.findUserById(userId)
    let myAcc = myUser.withdraw(AccountNo, amount)
    
    resp.status(200).send(myAcc);
  } catch (error) {
    next(error);
  }
}

module.exports = { createAccount, getAllAccounts, getAccountByAccNo, depositAmount, withdrawAmount, transferAmount };
