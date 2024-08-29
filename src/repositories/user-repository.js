const { CrudRepository } = require("./crud-repository");

const { Users } = require('../models');


class UserRepoitory extends CrudRepository
{
    constructor()
    {
        super(Users)
    }

    async create(data,transaction)
    {
       
        const response=await Users.create(data,{transaction:transaction})
        return response
    }

    async findUserByEmail(email)
    {
        const response = await Users.findOne({where:{email:email}})
        return response
    }
}

module.exports=UserRepoitory