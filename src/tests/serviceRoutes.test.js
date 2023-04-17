import { deepEqual, notDeepStrictEqual, ok } from 'node:assert'
import api from '../api.js'

let app = {}

const TOKEN = 'BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub21lIjoiemlraW5oYSIsImlkIjoiNjQzZDdkY2M3YmNmOWYzY2E1OWIzODY3IiwiaWF0IjoxNjgxNzUxNTE3fQ.xdU53gZabCIy8Jj7aOH-kYqkGJiWmTzrALvMXxe-Yhk'

const headers = {
  Authorization: TOKEN
}

describe('Suite de testes serviços', function () {
  this.beforeAll(async () => {
    app = await api
  })

  it('GET /service/instagram_posts - Deve retornar um array de posts', async () => {
    const result = await app.inject({
      method: 'GET',
      headers,
      url: '/services/instagram_posts'
    })

    const dados = JSON.parse(result.payload)
    ok(result.statusCode === 200)
    ok(Array.isArray(dados.dadosSlice))
  })
})