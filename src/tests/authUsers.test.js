import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'
import api from '../api.js'

let app = {}

describe('Suite de testes autenticação', function() {
  this.beforeAll(async () => {
    app = await api
  })

  it('Deve obter um token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'Leal',
        password: '123'
      }
    })

    const statusCode = result.statusCode
    const dados = JSON.parse(result.payload)

    ok(statusCode === 200)
    ok(dados.token.length > 10)

  })
})