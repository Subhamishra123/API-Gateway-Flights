const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const { ServerConfig } = require('../../config')

function checkPasswordMatch(plainPassword,encPassword)
{
    try {
        return bcrypt.compareSync(plainPassword,encPassword);
    } catch (error) {
        console.log(error);
    }
}

function createToken(input) {
    try {
        return jwt.sign(input,ServerConfig.JWT_SECRET,{expiresIn:ServerConfig.JWT_EXPIRY})
    } catch (error) {
        
    }
}


function verifyToken(token)
{
    try {
        return jwt.verify(token,ServerConfig.JWT_SECRET)
    } catch (error) {
        
        throw error
    }
}

module.exports={
    checkPasswordMatch,
    createToken,
    verifyToken
}