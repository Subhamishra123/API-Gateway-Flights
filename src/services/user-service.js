const { UserRepoitory,RoleRepository } = require('../repositories');

const { auth } = require('../utils/commons')
const logger = require('../config/logger-config');
const AppError = require('../utils/errors/AppError');
const { httpStatusCode } = require('httpstatuscode');
const { Role,Users } = require('../models');
const { ENUMS } = require('../utils/commons')

const userRepo=new UserRepoitory();
const roleRepo=new RoleRepository();
const  db  = require('../models')
async function createUser(userData)
{
    const transaction = await db.sequelize.transaction();
    try {
        
        const user = await userRepo.create(userData,transaction);
        const role = await roleRepo.getRoleByName(ENUMS.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
        await transaction.commit();
        return user;
    } catch (error) {
       
        await transaction.rollback();
        
        let explanation = [];
        
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

async function isAuthenticated(token)
{
    try {
        if(!token)
        {
           
            throw new AppError('JWT token Missing',httpStatusCode.BadRequest);
        }
        const response = auth.verifyToken(token);
       
        const user = await userRepo.get(response.id);
        if(!user)
        {
            throw new AppError('No such user found',httpStatusCode.NotFound);
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError)
            throw error;
        if (error.name==='TokenExpiredError')
        {
            throw new AppError('Token expired please sign in again',httpStatusCode.BadRequest);
        }
        if(error.name === 'JsonWebTokenError')
        {
            throw new AppError('Invalid JWT token',httpStatusCode.BadRequest);
        }
        throw error;
    }
}

async function addRoleToUser(data)
{
    try {
        const user = await userRepo.get(data.id);
        if(!user)
        {
            throw new AppError('No such user found',httpStatusCode.NotFound);
        }

        const role = await roleRepo.getRoleByName(data.role);
        if(!role)
        {
            throw new AppError('No role found',httpStatusCode.NotFound);
        }
        user.addRole(role);
    } catch (error) {
        if(error instanceof AppError)
            throw error;
        throw new AppError('Something went wrong',httpStatusCode.InternalServerError);
    }
}

async function checkIsAdmin(id) {
    try {
        const user = await userRepo.get(id);
        if(!user)
        {
            throw new AppError('No such user found',httpStatusCode.NotFound);
        }
       const role = await roleRepo.getRoleByName(ENUMS.USER_ROLES_ENUMS.ADMIN);
        return user.hasRole(role);
    } catch (error) {
        if (error instanceof AppError)
            throw error;
        throw new AppError('Something went wrong',httpStatusCode.InternalServerError);
    }
}

module.exports={
    createUser,
    signIn,
    isAuthenticated,
    addRoleToUser,
    checkIsAdmin
}