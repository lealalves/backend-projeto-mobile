import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'
import api from '../api.js'

let app = {}

describe('Suite de testes serviços', function () {
  this.beforeAll(async () => {
    app = await api
  })

  it('GET /service/instagram_posts - Deve retornar um array de posts', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/services/instagram_posts'
    })

    const dados = JSON.parse(result.payload)

    ok(result.statusCode === 200)
    ok(Array.isArray(dados))
  })
})