const express = require('express')
const { userRouter } = require("./user");
const { bankRouter } = require("./bank");
const { accountRouter } = require("./account");

const User = require('./user/service/User');
require('dotenv').config()


const mainRouter = express.Router()

// login
mainRouter.post('/login', async(req, res, next)=>{
    try {
        const { username, password } = req.body;
        const token = await User.authenticateUser(username, password);
        res.cookie(process.env.AUTH_COOKIE_NAME, token);
        res.status(200).send("Login Done");
      } catch (error) {
        next(error);
      }
})

mainRouter.use('/admin', userRouter)
mainRouter.use('/bank', bankRouter)
mainRouter.use('/user/:userId/account', accountRouter)

// logout
mainRouter.post('/logout', async(req, res, next)=>{
  try {
      res.cookie(process.env.AUTH_COOKIE_NAME, "", {expires: new Date(Date.now())});
      res.status(200).send("Logged out");
    } catch (error) {
      next(error);
    }
})

module.exports = { mainRouter }