const Bank = require("../service/Bank");
const { ValidationError,NotFoundError } = require("../../../error");


const getAllBanks = async (req, resp, next) => {
  try {
    const { offset, limit } = req.query;
    const allUsers = await Bank.getAllBanks(offset, limit);
    resp.status(200).send(allUsers);
  } catch (error) {
    next(error);
  }
};

const createBank = async(req, resp, next) => {
  try {
    let { bankName } = req.body;
    if (typeof bankName != "string") {
      throw new ValidationError("invalid Bank Name");
    }
    let newBank = await Bank.newBank(bankName);
    resp.status(201).send(newBank);
  } catch (error) {
    next(error);
  }
};

const getBankById =async (req, resp, next) => {
  try {
    let bankId = Number(req.params.bankId);
    if (isNaN(bankId)) {
      throw new ValidationError("invalid parameters");
    }
    let myBank = await Bank.getBankById(bankId)
    if (myBank.length == 0) {
      throw new NotFoundError("Bank Not Found");
    }
    resp.status(200).send(myBank);
  } catch (error) {
    next(error);
  }
};

const updateBank = async (req, resp, next) => {
  try {
    let { newValue } = req.body;
    let bankId = Number(req.params.bankId);
    if (isNaN(bankId)) {
      throw new ValidationError("invalid parameters");
    }
    let myBank = await Bank.getBankById(bankId)
    if (myBank.length == 0) {
      throw new NotFoundError("Bank Not Found");
    }

    let updated = await Bank.updateBankName(bankId,newValue)
    if (updated[0] == 0) {
      throw new ValidationError("could not update");
    }
    resp.status(200).json("updated");
  } catch (error) {
    next(error);
  }
};

const getBankTotal = async(req, resp, next) => {
  try {
    let bankId = Number(req.params.bankId);
    if (isNaN(bankId)) {
      throw new ValidationError("invalid parameters");
    }
    let myBank = await Bank.getBankById(bankId)
    if (myBank.length == 0) {
      throw new NotFoundError("Bank Not Found");
    }
    let mytotal = await Bank.getBankTotal(bankId)
    resp.status(200).json(mytotal);
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllBanks,
  createBank,
  getBankById,
  updateBank,
  getBankTotal,

};
