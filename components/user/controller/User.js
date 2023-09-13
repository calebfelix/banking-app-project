const User = require("../service/User");
const { ValidationError } = require("../../../error");
const Bank = require("../../bank/service/Bank");



const getAllUsers = (req, resp, next) => {
    try {
      const allUsers = User.getAllUsers();
      resp.status(200).send(allUsers);
    } catch (error) {
      next(error);
    }
  };

  const createUser = async (req, resp, next) => {
    try {
        let { fullName, age, gender, username, password } = req.body;
        let newUser = User.newUser(fullName, age, gender, username, password)
      resp.status(200).send(await newUser);
    } catch (error) {
      next(error);
    }
  };

  const getUserById = (req, resp, next) => {
    try {
      let id = Number(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError("invalid parameters");
      }
      let myUser = User.findUserById(id);
      resp.status(200).send(myUser);
    } catch (error) {
      next(error);
    }
  };
  
  const updateUser = (req, resp, next) => {
    try {
      let {parameter, newValue} = req.body
      let id = Number(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError("invalid parameters");
      }
      let myUser = User.updateUser(id, parameter, newValue)
      
      resp.status(200).send(myUser);
    } catch (error) {
      next(error);
    }
  };

  const getBankTotal= (req, resp, next) => {
    try {
      let bankId = Number(req.params.bankId);
      if (isNaN(bankId)) {
        throw new ValidationError("invalid parameters");
      }

      let mybank = Bank.findBankById(bankId)

      resp.status(200).json({"bankTotal": mybank.bankTotal});
    } catch (error) {
      next(error);
    }
  };

  module.exports = {getAllUsers, createUser, getUserById, updateUser, getBankTotal}