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
        description: 'Deve retonar uma lista de posts do instagram.',
        notes: 'retorna um array com as postagens do perfil alvo',
        tags: ['api'],
      },
      handler: async (request, headers) => {
        try {
          const result = await this.api.getPosts()

          return result
        } catch (error) {
          console.log('DEU RUIM', error);
          Boom.internal()
        }
      }
    }
  }
}