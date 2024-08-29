const { ErrorResponse } = require('../utils/commons');

const { StatusCodes } = require('http-status-codes');

const AppError = require('../utils/errors/AppError');

function validateCreateUser(request,response,next)
{
    
    if(!request.body.email)
    {
        ErrorResponse.message="Something went wrong while creating user";
        ErrorResponse.error=new AppError(["Email not found in the incoming request body"],StatusCodes.BAD_REQUEST);
        return response.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!request.body.password)
    {
        ErrorResponse.message="Something went wrong while creating user";
        ErrorResponse.error=new AppError(["Password not found in the incoming request body"],StatusCodes.BAD_REQUEST);
        return response.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    next()
}

module.exports={
    validateCreateUser
}