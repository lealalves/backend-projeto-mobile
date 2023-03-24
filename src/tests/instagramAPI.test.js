import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'

import * as dotenv from 'dotenv'
dotenv.config()

import InstagramApi from '../services/instagramAPI.js'

const token = process.env.TOKEN_INSTAGRAM
const api = new InstagramApi(token)

const MOCK_USERNAME_PROFILE = {
  username: 'leallealleal1'
}

describe('Suite de testes serviço InstagramAPI', function() {
  it('testApi() deve retornar TRUE', async () => {
    const result = await api.testApi()
    ok(result)
  })

  it('getPosts() deve retornar um array', async () => {
    const result = await api.getPosts()
    ok(Array.isArray(result))
  })

  it('getPosts() deve retornar o nome de usuário', async () => {
    const [{ username }] = await api.getPosts()
    deepEqual(username, MOCK_USERNAME_PROFILE.username)
  })

  it('getPosts() deve retornar URL e Legenda da publicação', async () => {
    const [{ caption, media_url }] = await api.getPosts()

    notDeepStrictEqual(caption, undefined)
    notDeepStrictEqual(media_url, undefined)
  })
})
