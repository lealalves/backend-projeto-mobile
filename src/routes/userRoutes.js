import baseRoute from './base/baseRoute.js'
import Joi from 'joi'

const failAction = (request, headers, error) => {
  throw error
}

export default class userRoutes extends baseRoute{
  constructor(db){
    super()
    this.db = db
  }
  list() {
    return {
      path: '/users',
      method: 'GET',
      config: {
        validate: {
          failAction,
          query: Joi.object({
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
            email: Joi.string().min(3).max(100)
          })
        }
      },handler: (request, headers) => {
        try {
          const {
            limit,
            skip,
            email
          } = request.query

          let query = {
            email: {
              $regex: `.*${email}*.`, $options:'i'
            }
          }
          
          return this.db.listar(email ? query : {}, skip, limit)    

        } catch (error) {
          console.log('DEU ERRO', error);
          return 'Erro interno no servidor.'
        }
      }
    }
  }
  create() {
    return {
      path: '/users',
      method: 'GET',
      config: {
        validate: {
          failAction,
          payload: Joi.object({
            nome: Joi.string().required().min(3).max(100),
            email: Joi.string().required().min(3).max(100),
            cpf: Joi.string().required().min(11).max(14),
            telefone: Joi.string().required().min(8).max(15)
          })
        }
      }, handler: (request, headers) => {
        try {
          
        } catch (error) {
          console.log('DEU RUIM', error)
          return 'Erro interno no servidor'
        }
      }
    }
  }
}