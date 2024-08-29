const express = require('express')
const userRouter = express.Router()
const { UserController } = require('../../controllers')
const { UserMiddleware } = require('../../middlewares')

userRouter.post('/signup',UserMiddleware.validateCreateUser,UserController.userSignUp)
userRouter.post('/signin',UserController.userSignIn);
module.exports={
    userRouter
}