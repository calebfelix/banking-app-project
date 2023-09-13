const Bank = require("../service/Bank");
const { ValidationError } = require("../../../error");


const getAllBanks = (req, resp, next) => {
    try {
      resp.status(200).send(Bank.allBanks);
    } catch (error) {
      next(error);
    }
  };

  const createBank =(req, resp, next) => {
    try {
        let {bankName} = req.body
        mybank = Bank.newBank(bankName)
      resp.status(200).send(mybank);
    } catch (error) {
      next(error);
    }
  };

  const getBankById = (req, resp, next) => {
    try {
      let bankId = Number(req.params.bankId);
      if (isNaN(bankId)) {
        throw new ValidationError("invalid parameters");
      }
      let myBank = Bank.findBankById(bankId)
      resp.status(200).send(myBank);
    } catch (error) {
      next(error);
    }
  };
  
  const updateBank= (req, resp, next) => {
    try {
      let {newValue} = req.body
      let bankId = Number(req.params.bankId);
      if (isNaN(bankId)) {
        throw new ValidationError("invalid parameters");
      }
      let myBank = Bank.updateBankName(bankId, newValue)
      
      resp.status(200).send(myBank);
    } catch (error) {
      next(error);
    }
  };


  module.exports = {getAllBanks, createBank, getBankById, updateBank}