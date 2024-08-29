const express = require('express');

const { InfoController } = require('../../controllers');
const { userRouter } = require('./user-routes')
const router = express.Router();

const { AuthMiddleware } = require('../../middlewares')

router.get('/info',AuthMiddleware.authCheck, InfoController.info);

router.use('/users',userRouter)

module.exports = router;