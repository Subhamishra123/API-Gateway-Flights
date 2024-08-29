const { UserService } = require('../services')

const { ErrorResponse,SuccessResponse } = require('../utils/commons')

const { httpStatusCode } = require('httpstatuscode')

async function userSignUp(request,response) {
    try {
        const responsedata = await UserService.createUser({
            email:request.body.email,
            password:request.body.password
        })
        SuccessResponse.message="Succesfully created User"
        SuccessResponse.data=responsedata
        return response.status(httpStatusCode.Created).json(SuccessResponse)
    } catch (error) {
        
        ErrorResponse.message="Unable to create User"
        ErrorResponse.error=error
        return response.status(error.statusCode).json(ErrorResponse)
    }
}

async function userSignIn(request,response) {
    try {
        const responseData = await UserService.signIn({
            email:request.body.email,
            password:request.body.password
        })
        SuccessResponse.message="Succesful User Sign In";
        SuccessResponse.data=responseData;
        return response.status(httpStatusCode.Accepted).json(SuccessResponse)
    } catch (error) {
       
        ErrorResponse.message = error.explanation;
        ErrorResponse.error=error;
        return response.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports={
    userSignUp,
    userSignIn
}