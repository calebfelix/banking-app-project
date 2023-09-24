const express = require('express')
const {getAllUsers, createUser, getUserById, updateUser,getNetWorth} = require('./controller/User')
const Jwtauthentication = require('../../middleware/Jwtauthentication')

const userRouter = express.Router()

userRouter.use(Jwtauthentication.isAdmin)

// Admin CRU
userRouter.post('/', createUser)
userRouter.get('/', getAllUsers)
userRouter.get('/:userId', getUserById)
userRouter.put('/:userId', updateUser)
userRouter.get('/:userId/networth', getNetWorth)

module.exports = { userRouter }
