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
  create() {
    return {
      path: '/users',
      method: 'POST',
      config: {
        description: 'Deve cadastrar um usuário',
        notes: 'cadastrar um usuário usando nome, email, cpf, telefone e a senha.',
        tags: ['api'],
        validate: {
          failAction,
          payload: Joi.object({
            nome: Joi.string().required().min(3).max(100),
            email: Joi.string().required().min(3).max(100),
            cpf: Joi.string().required().min(11).max(14),
            telefone: Joi.string().required().min(8).max(15),
            senha: Joi.string().required().min(4).max(15)
          })
        }
      }, handler: async (request) => {
        try {
          const {
            nome,
            email,
            cpf,
            telefone,
            senha
          } = request.payload

          const result = await this.db.cadastrar({nome, email, cpf, telefone, senha})

          return {
            message: 'Usuário cadastrado com sucesso!',
            _id: result._id
          }
        } catch (error) {
          console.log('DEU RUIM', error)
          return 'Erro interno no servidor'
        }
      }
    }
  }
  read() {
    return {
      path: '/users',
      method: 'GET',
      config: {
        description: 'Deve retornar uma lista de usuários',
        notes: 'pode paginar resultados e filtrar por email.',
        tags: ['api'],
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
  update() {
    return {
      path: '/users/{id}',
      method: 'PATCH',
      config: {
        description: 'Deve atualizar um usuário pelo ID',
        notes: 'pode atualizar qualquer informação de um usuário pelo id.',
        tags: ['api'],
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required().max(50)
          }),
          payload: Joi.object({
            nome: Joi.string().min(3).max(100),
            email: Joi.string().min(3).max(100),
            cpf: Joi.string().min(11).max(14),
            telefone: Joi.string().min(8).max(15),
            senha: Joi.string().min(4).max(15)
          }).options({ stripUnknown: true })
        }
      }, handler: async (request) => {
        try {
          const id = request.params.id
          const dados = request.payload

          const result = await this.db.atualizar(id, dados)
  
          if(result.modifiedCount !== 1) return {message: 'Não foi possível atualizar!'}
          
          return {
            message: 'Usuário atualizado com sucesso!',
          }
          
        } catch (error) {
          console.log('DEU RUIM', error)
          return 'Erro interno no servidor'
        }
      }
    }
  }
  delete() {
    return {
      path: '/users/{id}',
      method: 'DELETE',
      config: {
        description: 'Deve remover um usuário pelo ID',
        notes: 'remove um usuario',
        tags: ['api'],
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required().max(50)
          })
        }
      }, handler: async (request) => {
        try {
          const id = request.params.id

          const result = await this.db.deletar(id)

          if(result.deletedCount !== 1) return {message: 'Não foi possivel deletar!'}

          return {
            message: 'Usuário deletado com sucesso!',
          }
          
        } catch (error) {
          console.log('DEU RUIM', error);
          return 'Erro interno no servidor'
        }
      }
    }
  }
}