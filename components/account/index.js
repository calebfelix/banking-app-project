const express = require('express')
const {createAccount,getAccountByDate, getAllAccounts,getNetWorth, getAccountByAccNo, depositAmount,withdrawAmount,transferAmount,getPassbook} = require('./controller/Account')
const Jwtauthentication = require('../../middleware/Jwtauthentication')

const accountRouter = express.Router({ mergeParams: true })

accountRouter.use(Jwtauthentication.isUser)


// Admin CRUD
accountRouter.post('/', createAccount)
accountRouter.get('/', getAllAccounts)
accountRouter.get('/networth', getNetWorth)
accountRouter.get('/:AccountNo', getAccountByAccNo)

accountRouter.put('/deposit/:AccountNo', depositAmount)
accountRouter.put('/withdraw/:AccountNo', withdrawAmount)
accountRouter.put('/transfer/:AccountNo', transferAmount)
accountRouter.get('/passbook/:AccountNo', getPassbook)
accountRouter.get('/Accountbydate/:AccountNo', getAccountByDate)


module.exports = { accountRouter }
