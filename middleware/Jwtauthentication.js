const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const { UnauthorizedError, NotFoundError } = require("../error");

class Jwtauthentication {
  static secretKey = process.env.JWT_SECRET_KEY;
  constructor(id, username, isAdmin) {
    this.userId = id;
    this.username = username;
    this.isAdmin = isAdmin;
  }

  static authenticate(userId, username, isAdmin) {
    try {
      let payload = new Jwtauthentication(userId, username, isAdmin);
      let myobj = {
        userId: payload.userId,
        username: payload.username,
        isAdmin: payload.isAdmin,
      };
      let token = jwt.sign(myobj, Jwtauthentication.secretKey, {
        expiresIn: 60 * 60,
      });

      return token;
    } catch (error) {
      throw error;
    }
  }

  static verifyToken(token) {
    try {
      let payload = jwt.verify(token, Jwtauthentication.secretKey);
      return payload;
    } catch (error) {
      throw new UnauthorizedError("Invalid Token");
    }
  }

  static isCurrentUser(req, res, next) {
    try {
      const token = req.cookies.auth;
        if (!token) {
          throw new UnauthorizedError("Token Not Found");
        }
        let payload = Jwtauthentication.verifyToken(token);
        if(payload.userId != req.params.userId){
          throw new UnauthorizedError("User does not access");
        }
        next();
        return
    } catch (error) {
      next(error);
    }
  }

  static async isCurrentUserAccount(req, res, next) {
    try {
      const token = req.cookies.auth;
        if (!token) {
          throw new UnauthorizedError("Token Not Found");
        }
        let {userId, AccountId} = req.params
        console.log(db.accounts)
        let result = await db.account.findAll({where:{id:AccountId, userId:userId}}) 
        if(result.length == 0){
          throw new NotFoundError("Account Not Found with this user");
        }else{
        next();
        return
        }
    } catch (error) {
      next(error);
    }
  }

  static isAdmin(req, res, next) {
    try {
      console.log("isAdmin Started");
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if (payload.isAdmin) {
        next();
        return;
      } else {
        throw new UnauthorizedError("Not an Admin");
      }
    } catch (error) {
      next(error);
    }
  }

  static isUser(req, res, next) {
    try {
      console.log("isUser Started");
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if (!payload.isAdmin) {
        next();
        return;
      } else {
        throw new UnauthorizedError("Not an User");
      }
    } catch (error) {
      next(error);
    }
  }

  static checkValid(req, res, next) {
    try {
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      return payload;
    } catch (error) {
      next(error);
    }
  }

  static isActive(req, res, next) {
    try {
      console.log("isActive Started");
      const token = req.cookies.auth;
      if (!token) {
        throw new UnauthorizedError("Token Not Found");
      }
      let payload = Jwtauthentication.verifyToken(token);
      if (payload.isActive) {
        next();
        return;
      } else {
        throw new NotFoundError("User dosen't exist");
      }
    } catch (error) {
      next(error);
    }
  }
}
module.exports = Jwtauthentication;
