const { SuccessResponse,ErrorResponse } = require('../utils/commons');
const { httpStatusCode } = require('httpstatuscode')
const AppError = require('../utils/errors/AppError')
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

module.exports={
    validateAuthRequest
}
