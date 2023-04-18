import * as dotenv from 'dotenv'
dotenv.config()

import Jwt  from 'jsonwebtoken'
import baseRoute from './base/baseRoute.js'
import Joi from 'joi'
import Boom from '@hapi/boom'
import failAction from '../helpers/failAction.js'

const headers = Joi.object({
  authorization: Joi.string().required()
}).unknown()

const JWT_SECRET = process.env.TOKEN_JWT

export default class serviceRoutes extends baseRoute {
  constructor(api) {
    super()
    this.api = api
  }
  posts() {
    return {
      path: '/services/instagram_posts',
      method: 'GET',
      config: {
        description: 'Deve retonar uma lista de posts do instagram.',
        notes: 'retorna um array com as postagens do perfil alvo',
        tags: ['api'],
        validate: {
          failAction,
          headers,
          query: Joi.object({
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
          })
        }
      },
      handler: async (request, headers) => {
        try {
          const token = request.headers.authorization.split('Bearer')[1]
          const tokenInfo = await Jwt.verify(token, JWT_SECRET, function(err, decoded) {
            if(err) throw Error('DEU RUIM NO TOKEN')
            return {
              ...decoded
            }
          });

          const { 
            skip, 
            limit 
          } = request.query
          
          const result = await this.api.getPosts()

          if(result.status !== 200) return Boom.internal()

          const dados = (await result.json()).data
          const dadosSlice = dados.slice(skip, limit)
          return {
            dadosSlice,
            tokenInfo
          }
        } catch (error) {
          console.log('DEU RUIM', error);
          return Boom.internal()
        }
      }
    }
  }
}