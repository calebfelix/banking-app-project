const Account = require("../../account/service/Account");
const Bank = require("../../bank/service/Bank");
const {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
} = require("../../../error");
const Jwtauthentication = require("../../../middleware/Jwtauthentication");
const bcrypt = require('bcrypt');
const db = require("../../../models");

class User {
  constructor(name, age, gender, isAdmin, username, password) {
    this.name = name;
    this.age = age;
    this.gender = gender;
    this.isAdmin = isAdmin;
    this.username=username;
    this.password=password
  }
  
  static async getUserByUsername(username) {
    const t = await db.sequelize.transaction();
    try {
      let myUsers = await db.user.findAll({ where: { username: username } , transaction:t});
      await t.commit()
      return myUsers;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
  
  static async newAdmin(name, age, gender, username, password) {
    const t = await db.sequelize.transaction();
    try {
      if (typeof name != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof age != "number") {
        throw new ValidationError("invalid age");
      }
      if (typeof gender != "string") {
        throw new ValidationError("invalid gender");
      }
      let hashedPassword = await bcrypt.hash(password, 12)
      let newAdmin = new User(name, age, gender, true, username, hashedPassword);
      let myAdmin = await db.user.create(newAdmin,t)
      await t.commit()
      return myAdmin;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
  
  static async newUser(name, age, gender, username, password) {
    const t = await db.sequelize.transaction();
    try {
      if (typeof name != "string") {
        throw new ValidationError("invalid First Name");
      }
      if (typeof age != "number") {
        throw new ValidationError("invalid age");
      }
      if (typeof gender != "string") {
        throw new ValidationError("invalid gender");
      }
      let hashedPassword = await bcrypt.hash(password, 12)
      let newUserObj = new User(name, age, gender, false, username, hashedPassword);
      let newUser = await db.user.create(newUserObj,t)
      await t.commit()
      return newUser;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
  
  static async getAllUsers(offset, limit) {
    const t = await db.sequelize.transaction();
    try {
      let allUsers = await db.user.findAndCountAll({
        include: { model: db.account, include: db.transaction },
        offset: offset,
        limit: limit,
        transaction:t
      });
      await t.commit()
      return allUsers;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }
  
  static async getUserById(id) {
    const t = await db.sequelize.transaction();
    try {
      let myUser = await db.user.findAll({ where: { id: id }, include: db.account , transaction:t});
      await t.commit()
      return myUser;
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

  static async updateUser(id, parameter, newValue) {
    const t = await db.sequelize.transaction();
    try {
      let userToBeUpdated = await User.getUserById(id);
      console.log(userToBeUpdated)
      if (userToBeUpdated.length == 0) {
        throw new NotFoundError("User Not Found!");
      }
      let up = undefined

      switch (parameter) {
        case "name":
          up = await db.user.update(
            { name: newValue },
            { where: { id: id }, transaction:t }
          );
          await t.commit()
          return up
        case "age":
          up = await db.user.update(
            { age: newValue },
            { where: { id: id }, transaction:t }
          );
          await t.commit()
          return up
          case "gender":
          up = await db.user.update(
            { gender: newValue },
            { where: { id: id }, transaction:t }
          );
          await t.commit()
          return up
        default:
          throw new ValidationError("Invalid Parameter");
      }
    } catch (error) {
      await t.rollback()
      throw error;
    }
  }

static async getNetWorth(userId){
  const t = await db.sequelize.transaction();
  try {
    await User.updateNetWorth(userId)
    let myUser = await db.user.findAll({
      where: { id: userId },
      attributes: ["net_worth"],
    });
    await t.commit();
    return myUser;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

  static async updateNetWorth(userId) {
    const t = await db.sequelize.transaction();
try {
  let total=0;
  let [myUser] = await db.user.findAll({transaction:t,where:{id:userId},attributes:['net_worth'],include:{model:db.account,attributes:['account_balance']},})
  myUser.accounts.forEach(element => {
    total = total + element.dataValues.account_balance
  });
  let up = await db.user.update({ netWorth: total },{ where: { id: userId }, transaction:t })
  if([up]==0){
    throw new ValidationError("could not update networth")
  }
  let returnUser = await db.user.findAll({transaction:t,where:{id:userId}})
  await t.commit();
  return returnUser

} catch (error) {
  await t.rollback();
    throw error;
}
  }

  static async authenticateUser(username, password) {
    try {
    let [myUser] = await User.getUserByUsername(username);
    if(myUser==undefined){
      throw new NotFoundError("user Not Found")
    }
    let check = await bcrypt.compare(password, myUser.dataValues.password)
    if (!check) {
      throw new UnauthorizedError("authentication failed");
    }
      const token = Jwtauthentication.authenticate(myUser.id, myUser.username, myUser.isAdmin)
      return token
    } catch (error) {
      throw error
    }

  }
}

module.exports = User;


