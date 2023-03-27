import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'
import api from '../api.js'

let app = {}

const MOCK_CADASTRAR_USUARIO = {
  nome: 'Leal Lindo',
  email: `leealalves@hotmail.com-${Date.now()}`,
  cpf: '12312312312',
  telefone: '13997654321',
  senha: '123123123'
}

const MOCK_DEFAULT_USUARIO = {
  nome: 'Leal Lindo',
  email: `vinileal@hotmail.com-${Date.now()}`,
  cpf: '12312312312',
  telefone: '13997654321',
  senha: '123123123'
}

const MOCK_DELETED_ID = '641140b1527a6ede09dce934'

let MOCK_USER_ID = ''

describe('Suite de testes rotas usuário', function () {
  this.beforeAll(async () => {
    app = await api
    const result = await app.inject({
      method: 'POST',
      url: '/users',
      payload: MOCK_DEFAULT_USUARIO
    })

    const { _id } = JSON.parse(result.payload)

    MOCK_USER_ID = _id
  })

  it('GET /users - deve retornar um array de usuarios', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/users'
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    ok(statusCode === 200)
    ok(Array.isArray(dados))
  })

  it('GET /users - deve retornar apenas 3 usuarios', async () => {
    const TAMANHO_LIMITE = 3
    const result = await app.inject({
      method: 'GET',
      url: `/users?limit=${TAMANHO_LIMITE}`
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    ok(statusCode === 200)
    deepEqual(dados.length, TAMANHO_LIMITE)
  })

  it('GET /users - deve retornar um erro ao usar STRING na query LIMIT', async () => {
    const TAMANHO_LIMITE = 'OIE'
    const result = await app.inject({
      method: 'GET',
      url: `/users?limit=${TAMANHO_LIMITE}`
    })

    const statusCode = result.statusCode
    const erroResult = {
      "statusCode":400,
      "error":"Bad Request",
      "message":"\"limit\" must be a number",
      "validation":{
        "source":"query",
        "keys":["limit"]
      }
    }
    
    ok(statusCode === 400)
    deepEqual(result.payload, JSON.stringify(erroResult))
  })

  it('GET /users - deve retornar um erro ao usar STRING na query SKIP', async () => {
    const TAMANHO_SKIP = 'OIE'
    const result = await app.inject({
      method: 'GET',
      url: `/users?skip=${TAMANHO_SKIP}`
    })

    const statusCode = result.statusCode
    const erroResult = {
      "statusCode":400,
      "error":"Bad Request",
      "message":"\"skip\" must be a number",
      "validation":{
        "source":"query",
        "keys":["skip"]
      }
    }
    
    ok(statusCode === 400)
    deepEqual(result.payload, JSON.stringify(erroResult))
  })

  it('GET /users - deve filtrar um usuario pelo email', async () => {
    const EMAIL = MOCK_DEFAULT_USUARIO.email
    const result = await app.inject({
      method: 'GET',
      url: `/users?email=${EMAIL}`
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    ok(statusCode === 200)
    deepEqual(dados[0].email, EMAIL)
  })

  it('POST /users - deve cadastrar um usuario', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/users',
      payload: MOCK_CADASTRAR_USUARIO
    })

    const statusCode = result.statusCode
    const {
      message,
      _id
    } = JSON.parse(result.payload)

    ok(statusCode === 200)
    notDeepStrictEqual(_id, undefined)
    deepEqual(message, 'Usuário cadastrado com sucesso!')
  })

  it('PATCH /users/:id - Deve atualizar um usuario pelo id', async () => {
    const MOCK_NOVO_NOME = {
      nome: 'Alves Leal'
    }

    const result = await app.inject({
      method: 'PATCH',
      url: `/users/${MOCK_USER_ID}`,
      payload: MOCK_NOVO_NOME
    })

    const statusCode = result.statusCode
    const {
      message,
    } = JSON.parse(result.payload)

    ok(statusCode === 200)
    deepEqual(message, 'Usuário atualizado com sucesso!')
  })

  it('PATCH /users/:id - Não deve atualizar um usuario pelo id incorreto', async () => {
    const MOCK_NOVO_NOME = {
      nome: 'Alves Leal'
    }
    
    const result = await app.inject({
      method: 'PATCH',
      url: `/users/${MOCK_DELETED_ID}`,
      payload: MOCK_NOVO_NOME
    })

    const statusCode = result.statusCode
    const {
      message,
    } = JSON.parse(result.payload)

    ok(statusCode === 200)
    deepEqual(message, 'Não foi possível atualizar!')
  })

  it('DELETE /users/:id - Deve deletar um usuario pelo id', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/users/${MOCK_USER_ID}`
    })

    const statusCode = result.statusCode
    const {
      message,
      deletedCount
    } = JSON.parse(result.payload)

    ok(statusCode === 200)
    deepEqual(message, 'Usuário deletado com sucesso!')
  })

  it('DELETE /users/:id - Não deve deletar um usuario pelo id incorreto', async () => {
    const result = await app.inject({
      method: 'DELETE',
      url: `/users/${MOCK_DELETED_ID}`
    })

    const statusCode = result.statusCode
    const {
      message,
      deletedCount
    } = JSON.parse(result.payload)

    ok(statusCode === 200)
    deepEqual(message, 'Não foi possivel deletar!')
  })
})