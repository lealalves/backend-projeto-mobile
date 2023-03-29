import { deepEqual, notDeepStrictEqual,ok } from 'node:assert'
import passwordHelper from '../helpers/passwordHelper.js'

const SENHA = 'Leal12345@!'
const HASH = '$2b$04$DTMXdYwKI7IcXybhjc4x8OfAseCnLRSiBYjeqJTWal8XBcS80Ok8C'

describe('Suite de testes passwordhelper', function () {
  it('Deve gerar um hash a partir de uma senha', async () => {
    const result = await passwordHelper.hashPassword(SENHA)
    
    ok(result.length > 10)
  })

  it('Deve comparar uma senha e seu hash', async () => {
    const result = await passwordHelper.comparePassword(SENHA, HASH)

    ok(result)
  })
})