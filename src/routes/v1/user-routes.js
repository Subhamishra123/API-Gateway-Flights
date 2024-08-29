const express = require('express')
const userRouter = express.Router()
const { UserController } = require('../../controllers')
const { UserMiddleware } = require('../../middlewares')

const { AuthMiddleware } = require('../../middlewares');

userRouter.post('/signup',UserMiddleware.validateCreateUser,UserController.userSignUp)
userRouter.post('/signin',AuthMiddleware.validateAuthRequest,UserController.userSignIn);
module.exports={
    userRouter
}