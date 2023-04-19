import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'
import api from '../api.js'

let app = {}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxlYWwiLCJpZCI6MSwiaWF0IjoxNjgwMDYwMjM4fQ.-vXkAiuAKRPyoNVBWWZcAj8yLWpYoJIvKqinVjUoxj8'

const headers = {
  Authorization: TOKEN
}

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
const MOCK_USER_EXIST_EMAIL = MOCK_DEFAULT_USUARIO.email

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
      headers,
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
      headers,
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
      headers,
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
      headers,
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
      headers,
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

  it('POST /users - não deve cadastrar um usuario com um email já cadastrado', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        ...MOCK_CADASTRAR_USUARIO,
        email: MOCK_USER_EXIST_EMAIL
      }
    })

    const expectedError = {
      statusCode: 409,
      error: "Conflict",
      message: "Esse e-mail já está sendo utilizado."
    }
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 409)
    deepEqual(dados, expectedError)
  })

  it('PATCH /users/:id - deve atualizar um usuario pelo id', async () => {
    const MOCK_NOVO_NOME = {
      nome: 'Alves Leal'
    }

    const result = await app.inject({
      method: 'PATCH',
      headers,
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

  it('PATCH /users/:id - não deve atualizar um usuario pelo id inexistente', async () => {
    const MOCK_NOVO_NOME = {
      nome: 'Alves Leal'
    }
    
    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/users/${MOCK_DELETED_ID}`,
      payload: MOCK_NOVO_NOME
    })
    
    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID não encontrado no banco!'
    }
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 412)
    deepEqual(dados, expectedError)
  })

  it('PATCH /users/:id - não deve atualizar um usuario pelo id inválido', async () => {
    const MOCK_INVALID_ID = '_id'
    const MOCK_NOVO_NOME = {
      nome: 'Alves Leal'
    }
    
    const result = await app.inject({
      method: 'PATCH',
      headers,
      url: `/users/${MOCK_INVALID_ID}`,
      payload: MOCK_NOVO_NOME
    })
    
    const expectedError = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    } 
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 500)
    deepEqual(dados, expectedError)
  })

  it('DELETE /users/:id - deve deletar um usuario pelo id', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
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

  it('DELETE /users/:id - não deve deletar um usuario por um id inexistente', async () => {
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/users/${MOCK_DELETED_ID}`
    })

    const expectedError = {
      statusCode: 412,
      error: 'Precondition Failed',
      message: 'ID não encontrado no banco!'
    } 
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 412)
    deepEqual(dados, expectedError)
  })

  it('DELETE /users/:id - não deve deletar um usuario por um id inválido', async () => {
    const MOCK_INVALID_ID = '_id'
    const result = await app.inject({
      method: 'DELETE',
      headers,
      url: `/users/${MOCK_INVALID_ID}`
    })

    const expectedError = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred'
    } 
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 500)
    deepEqual(dados, expectedError)
  })

})