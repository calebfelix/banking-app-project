const express = require('express')
const {createAccount, getAllAccounts, getAccountByAccNo, depositAmount,withdrawAmount,transferAmount} = require('./controller/Account')
const Jwtauthentication = require('../../middleware/Jwtauthentication')

const accountRouter = express.Router({ mergeParams: true })

accountRouter.use(Jwtauthentication.isUser)


// Admin CRUD
accountRouter.post('/', createAccount)
accountRouter.get('/', getAllAccounts)
accountRouter.get('/:AccountNo', getAccountByAccNo)

accountRouter.put('/deposit/:AccountNo', depositAmount)
accountRouter.put('/withdraw/:AccountNo', withdrawAmount)
accountRouter.put('/transfer/:AccountNo', transferAmount)


module.exports = { accountRouter }
