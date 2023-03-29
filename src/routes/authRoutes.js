import baseRoute from './base/baseRoute.js'
import Joi from 'joi'
import Boom from '@hapi/boom'
import Jwt  from 'jsonwebtoken'

const failAction = (request, headers, error) => {
  throw error
}

const USER = {
  username: 'leal',
  password: '123'
}

export default class authRoutes extends baseRoute {
  constructor(secret) {
    super()
    this.secret = secret
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      config: {
        auth: false,
        description: 'Obter token',
        notes: 'faz login com user e senha do banco',
        tags: ['api'],
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
          })
        }
      }, handler: async (request, headers) => {
        const { username, password } = request.payload

        if(username.toLowerCase() !== USER.username || password !== USER.password) return Boom.unauthorized()

        const token = Jwt.sign({
          username: username,
          id: 1
        }, this.secret)

        return {
          token
        }
      }
    }
  }
}