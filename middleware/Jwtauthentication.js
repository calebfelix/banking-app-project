const jwt = require("jsonwebtoken");
require("dotenv").config();
const { UnauthorizedError, NotFoundError } = require("../error");

class Jwtauthentication {
  static secretKey = process.env.JWT_SECRET_KEY;
  constructor(userId, username, isAdmin) {
    this.userId = userId;
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
