const User = require("../service/User");
const { ValidationError, NotFoundError } = require("../../../error");
const Bank = require("../../bank/service/Bank");

const createUser = async (req, resp, next) => {
  try {
    let { fullName, age, gender, username, password } = req.body;
    let myusers = await User.getUserByUsername(username);
    if (myusers.length != 0) {
      throw new ValidationError("invalid Username user already exists");
    }
    let newUser = await User.newUser(fullName, age, gender, username, password);
    resp.status(200).send(newUser);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, resp, next) => {
  try {
    const { offset, limit } = req.query;
    const allUsers = await User.getAllUsers(offset, limit);
    resp.status(200).send(allUsers);
  } catch (error) {
    next(error);
  }
};


const getUserById = async (req, resp, next) => {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid parameters");
    }
    let myUser = await User.getUserById(id);
    if (myUser.length == 0) {
      throw new NotFoundError("User Not Found");
    }
    resp.status(200).send(myUser);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, resp, next) => {
  try {
    let { parameter, newValue } = req.body;
    let id = Number(req.params.id);
    if (isNaN(id)) {
      throw new ValidationError("invalid id");
    }
    let updated = await User.updateUser(id, parameter, newValue);
    if (updated[0] == 0) {
      throw new ValidationError("could not update");
    }
    resp.status(200).json("updated");
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
};
