const express = require('express')
const {createAccount, getAllAccounts, getAccountById} = require('./controller/Account')
const Jwtauthentication = require('../../middleware/Jwtauthentication')
const { transactionRouter } = require('../transaction')

const accountRouter = express.Router({ mergeParams: true })

accountRouter.use(Jwtauthentication.isUser)
accountRouter.use(Jwtauthentication.isCurrentUser)


// Account CR
accountRouter.post('/', createAccount)
accountRouter.get('/', getAllAccounts)
accountRouter.get('/:AccountId', getAccountById)

accountRouter.use('/:AccountId/transaction', transactionRouter)

module.exports = { accountRouter }
