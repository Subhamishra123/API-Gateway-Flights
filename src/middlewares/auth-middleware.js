const { SuccessResponse,ErrorResponse } = require('../utils/commons');
const { httpStatusCode } = require('httpstatuscode')
const AppError = require('../utils/errors/AppError')

const { UserService } = require('../services');
const { error } = require('../utils/commons/success-response');
function validateAuthRequest(request,response,next)
{
    if(!request.body.email)
        {
            ErrorResponse.message="Something went wrong while creating user";
            ErrorResponse.error=new AppError(["Email not found in the incoming request body"],httpStatusCode.BadRequest);
            return response.status(httpStatusCode.BadRequest).json(ErrorResponse);
        }
        if(!request.body.password)
        {
            ErrorResponse.message="Something went wrong while creating user";
            ErrorResponse.error=new AppError(["Password not found in the incoming request body"],httpStatusCode.BadRequest);
            return response.status(httpStatusCode.BadRequest).json(ErrorResponse)
        }

    next();
}
async function authCheck(request,response,next) {
   try {
    const responseData = await UserService.isAuthenticated(request.headers['x-auth-token']);
    
    if(responseData)
    {
        request.userId=responseData;
        next();
    }
   

   } catch (error) {
   
    if(error instanceof AppError)
    {
        
        return response.status(error.statusCode).json(error);
    }
    return response.status(error.statusCode).json(error);
   }
}

async function isAdmin(request,response,next) {
    try {
        const responseData = await UserService.checkIsAdmin(request.userId);
        
        if(!responseData)
        {
            return response.status(httpStatusCode.Unauthorized).json({message:"user not authorized for this action"});
        }
        console.log(responseData);
        next();
    } catch (error) {
        if(error instanceof AppError)
        {
                
            return response.status(error.statusCode).json(error);
        }
        return response.status(error.statusCode).json(error);
    }
}
module.exports={
    validateAuthRequest,
    authCheck,
    isAdmin
}
