import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'
import api from '../api.js'

let app = {}

const MOCK_CADASTRAR_USUARIO = {
  nome: 'Leal Lindo',
  email: 'leealalves@hotmail.com',
  cpf: '12312312312',
  telefone: '13997654321',
}

describe.only('Suite de testes API', function () {
  this.beforeAll(async () => {
    app = await api
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
    const MOCK_EMAIL = 'leal@outlook.com--1678852977592'
    const result = await app.inject({
      method: 'GET',
      url: `/users?email=${MOCK_EMAIL}`
    })

    const dados = JSON.parse(result.payload)
    const statusCode = result.statusCode

    ok(statusCode === 200)
    deepEqual(dados[0].email, MOCK_EMAIL)
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

})