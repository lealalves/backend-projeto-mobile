import { deepEqual, notDeepStrictEqual, ok } from 'node:assert'
import api from '../api.js'

let app = {}

const MOCK_USER = {
  email: 'viniciuslealalves@outlook.com',
  senha: '123456'
}

describe('Suite de testes autenticação', function() {
  this.beforeAll(async () => {
    app = await api
  })

  it('POST /login - Deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: MOCK_USER
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)
    ok(statusCode === 200)
    ok(dados.token.length > 10)

  })

  it('POST /login - Deve retornar não autorizado ao tentar logar com credenciais inválidas', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'email@',
        senha: '1234'
      }
    })
    
    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 401)
    deepEqual(dados.error, "Unauthorized")
  })
})