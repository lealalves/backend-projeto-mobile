import baseRoute from './base/baseRoute.js'
import Joi from 'joi'
import Boom from '@hapi/boom'

const failAction = (request, headers, error) => {
  throw error
}

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
        auth: false,
        description: 'Deve retonar uma lista de posts do instagram.',
        notes: 'retorna um array com as postagens do perfil alvo',
        tags: ['api'],
        validate: {
          failAction,
          query: Joi.object({
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
          })
        }
      },
      handler: async (request, headers) => {
        try {
          const { 
            skip, 
            limit 
          } = request.query
          
          const result = await this.api.getPosts()

          if(result.status !== 200) return Boom.internal()

          const dados = (await result.json()).data

          return dados.slice(skip, limit)
        } catch (error) {
          console.log('DEU RUIM', error);
          Boom.internal()
        }
      }
    }
  }
}