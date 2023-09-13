const express = require('express')
const {getAllUsers, createUser, getUserById, updateUser, getBankTotal} = require('./controller/User')
const Jwtauthentication = require('../../middleware/Jwtauthentication')

const userRouter = express.Router()

userRouter.use(Jwtauthentication.isAdmin)

// Admin CRU
userRouter.post('/', createUser)
userRouter.get('/', getAllUsers)
userRouter.get('/banktotal/:bankId', getBankTotal)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', updateUser)


module.exports = { userRouter }
