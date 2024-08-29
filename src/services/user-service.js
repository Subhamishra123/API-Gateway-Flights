const { UserRepoitory } = require('../repositories');

const { auth } = require('../utils/commons')
const logger = require('../config/logger-config');
const AppError = require('../utils/errors/AppError');
const { httpStatusCode } = require('httpstatuscode');
const userRepo=new UserRepoitory();
const  db  = require('../models')
async function createUser(userData)
{
    const transaction = await db.sequelize.transaction();
    try {
        
        const response = await userRepo.create(userData,transaction);
        await transaction.commit();
        return response;
    } catch (error) {
       
        await transaction.rollback();
        
        let explanation = [];
        console.log(error.name)
        if(error.name === 'SequelizeUniqueConstraintError' || error.name==='SequelizeValidationError');
        {
            error.errors.forEach(e=>{
                
                explanation.push(e.message);
            })
            throw new AppError(explanation,httpStatusCode.InternalServerError);
        }
        
        throw new AppError(error,httpStatusCode.InternalServerError);
    }
}

async function signIn(data)
{
    try {
       const user = await userRepo.findUserByEmail(data.email)
       if(!user)
        {
            throw new AppError('No user found for given email',httpStatusCode.NotFound);
        } 
       const pwdCheck =  auth.checkPasswordMatch(data.password,user.password);
       if(!pwdCheck)
       {
        throw new AppError('invalid credentials email or password is incorrect',httpStatusCode.NotFound);
       }
       const jwtToken =  auth.createToken({id:user.id,email:user.email});
       return jwtToken;
    } catch (error) {
        if (error instanceof AppError)
            throw error;
        throw new AppError('Something went wrong',httpStatusCode.InternalServerError);
    }
}



module.exports={
    createUser,
    signIn
}