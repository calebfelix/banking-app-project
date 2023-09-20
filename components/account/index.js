const express = require('express')
const {createAccount, getAllAccounts,getNetWorth, getAccountByAccNo} = require('./controller/Account')
const Jwtauthentication = require('../../middleware/Jwtauthentication')
const { transactionRouter } = require('../transaction')

const accountRouter = express.Router({ mergeParams: true })

accountRouter.use(Jwtauthentication.isUser)


// Account CR
accountRouter.get('/networth', getNetWorth)
accountRouter.post('/', createAccount)
accountRouter.get('/', getAllAccounts)
accountRouter.get('/:AccountNo', getAccountByAccNo)

accountRouter.use('/:AccountNo/transaction', transactionRouter)

module.exports = { accountRouter }
