const express = require('express')
const {getAllBanks, createBank, getBankById, updateBank} = require('./controller/Bank')
const Jwtauthentication = require('../../middleware/Jwtauthentication')

const bankRouter = express.Router()

bankRouter.use(Jwtauthentication.isAdmin)

// Admin CRUD
bankRouter.post('/', createBank)
bankRouter.get('/', getAllBanks)
bankRouter.get('/:bankId', getBankById)
bankRouter.put('/:bankId', updateBank)

module.exports = { bankRouter }
