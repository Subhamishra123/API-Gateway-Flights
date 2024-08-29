const { where } = require('sequelize')
const logger =require('../config/logger-config')
const AppError = require('../utils/errors/AppError')
const { httpStatusCode } = require('httpstatuscode')

class CrudRepository
{
    constructor(model)
    {
        this.model=model
       
    }

    async create(data)
    {


       // logger.info(`inside create function ${JSON.stringify(data)}`)
        // Create a new user
        // try {
            const response=await this.model.create(data)
            return response
        // } catch (error) {
        //     logger.error(`something went wrong in create function ${error}`)
        //     throw error
        // }
    }

   async getAll()
    {
        try {
            const response=await this.model.findAll()
            return response
        } catch (error) {
            logger.error(`something went wrong in getAll function ${error}`)
            throw error
        }
    }

    async get(primaryKey)
    {
        try {
            const response=await this.model.findByPk(primaryKey)
            if(!response)
            {
                throw new AppError(`Not able to find `,httpStatusCode.NotFound)
            }
            return response
        } catch (error) {
            logger.error(`something went wrong in get function ${error}`)
            throw error
        }
    }

    async update(key,data)
    {
        try {
            const response = await this.model.findByPk(key)
           // console.log(response)
            if(response==null)
            {
                
                 throw new AppError(`Not able to find `,httpStatusCode.NotFound)
            }
            else
            {
                await this.model.update(
                    data,
                    {
                        where:{
                            id:key
                        }
                    }
                )
                return this.model.findByPk(key);
                // await User.update(
                //     { lastName: 'Doe' },
                //     {
                //       where: {
                //         lastName: null,
                //       },
                //     },
                //   );
            }
            logger.info(`model with ${key} not found`)
            throw {message:"not found"}
        } catch (error) {
            logger.error(`something went wrong in update function ${error}`)
            throw error
        }
    }

    async delete(key)
    {
        try {
            const response = await this.model.findByPk(key)
            if(!response)
            {
                throw new AppError(`Not able to find `,httpStatusCode.NotFound)
            }
           else
            {
                this.model.destroy({
                    where:{
                        id:key
                    }
                })
                return response
                // ost.destroy({
                //     where: {
                //       authorId: {
                //         [Op.or]: [12, 13],
                //       },
                //     },
                //   });
            }


            logger.info(`model with ${key} not found`)
            throw {message:"not found"}
        } catch (error) {
            logger.error(`something went wrong in delete function ${error}`)
            throw error
        }
    }


}

module.exports={
    CrudRepository
}