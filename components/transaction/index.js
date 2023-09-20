const express = require('express')
const {getAccountByDate, depositAmount,withdrawAmount,transferAmount,getPassbook} = require('./controller/Transaction')

const transactionRouter = express.Router({ mergeParams: true })

// transactionRouter.use(Jwtauthentication.isUser)

// transaction functions
transactionRouter.put('/deposit', depositAmount)
transactionRouter.put('/withdraw', withdrawAmount)
transactionRouter.put('/transfer', transferAmount)
transactionRouter.get('/passbook', getPassbook)
transactionRouter.get('/Accountbydate', getAccountByDate)

module.exports = { transactionRouter }
