import baseRoute from './base/baseRoute'
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
            nome: Joi.string().min(3).max(100)
          })
        }
      },handler: (request, headers) => {
        try {
          const {
            limit,
            skip,
            nome
          } = request.query

          let query = {
            nome: {
              $regex: `.*${nome}*.`, $options:'i'
            }
          }
          
          return this.db.listar(nome ? query : {}, skip, limit)    

        } catch (error) {
          console.log('DEU ERRO', error);
          return 'Erro interno no servidor.'
        }
      }
    }
  }
}