import baseRoute from './base/baseRoute.js'
import Joi from 'joi'
import Boom from '@hapi/boom'
import Jwt  from 'jsonwebtoken'
import passwordHelper from '../helpers/passwordHelper.js'


const failAction = (request, headers, error) => {
  let errors = error.output.payload.validation.keys[0]
  throw Boom.badRequest(`o campo ${errors} não é permitido estar vazio.`)
}

export default class authRoutes extends baseRoute {
  constructor(secret, db) {
    super()
    this.secret = secret
    this.db = db
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
            email: Joi.string().required(),
            senha: Joi.string().required()
          })
        }
      }, handler: async (request, headers) => {
        try {
          const { 
            email, 
            senha 
          } = request.payload
  
          const [usuario] = await this.db.listar({
            email: email.toLowerCase()
          })
  
          if(!usuario) return Boom.unauthorized('Usuário não encontrado!')

          const match = await passwordHelper.comparePassword(senha, usuario.senha)
  
          if(!match) return Boom.unauthorized('Usuário ou senha inválida')
  
          const token = Jwt.sign({
            nome: usuario.nome,
            id: usuario._id
          }, this.secret)
  
          return {
            token
          }          
        } catch (error) {
          console.log('DEU RUIM', error);
          return Boom.internal()
        }
      }
    }
  }
}