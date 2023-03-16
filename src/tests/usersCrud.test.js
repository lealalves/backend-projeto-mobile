import { deepEqual } from 'node:assert'

import MongoDB from '../db/mongodb/mongodb.js'
import userSchema from '../db/mongodb/schemas/userSchema.js'


const MOCK_CADASTRAR_USUARIO = {
  nome: 'Vinicius Leal',
  email: `leal@outlook.com--${Date.now()}`,
  senha: '123',
  cpf: '12312312312',
  telefone: '13996749934'
}

const MOCK_ATUALIZAR_USUARIO = {
  nome: 'Vini Souza',
  email: `souza@outlook.com--${Date.now()}`,
  senha: '123',
  cpf: '12312312312',
  telefone: '13996749934'
}

let db = {}
let MOCK_ID_USUARIO = ''

describe('Suite de testes MongoDB', function() {
  this.timeout(Infinity)
  this.beforeAll(async () => {
    const connection = MongoDB.connect()
    db = new MongoDB(connection, userSchema)
    const result = await db.cadastrar(MOCK_ATUALIZAR_USUARIO)
    MOCK_ID_USUARIO = result._id
  })

  it('Deve conectar ao banco', async () => {
    const result = await db.isConnected()
    deepEqual(result, "Connected")
  })

  it('Deve cadastrar um usuário', async () => {
    const {
      nome, 
      email,
      senha,
      cpf,
      telefone
    } = await db.cadastrar(MOCK_CADASTRAR_USUARIO)

    const result = {
      nome, 
      email,
      senha,
      cpf,
      telefone
    }

    deepEqual(result, MOCK_CADASTRAR_USUARIO)
  })

  it('Deve retornar um usuario pelo id', async () => {
    const [result] = await db.listar({email: MOCK_CADASTRAR_USUARIO.email})
    
    deepEqual(result.cpf, MOCK_CADASTRAR_USUARIO.cpf)
  })

  it('Deve retornar 3 usuarios', async () => {
    const RESULT_LIMIT = 3
    const result = await db.listar({}, 0, RESULT_LIMIT)
    deepEqual(result.length, RESULT_LIMIT)
  })

  it('Deve atualizar o cadastro de um usuario pelo id', async () => {
    const result = await db.atualizar(MOCK_ID_USUARIO, {
      nome: 'Vini Bobo'
    })

    deepEqual(result.modifiedCount, 1)
  })

  it('Deve deletar um usuario pelo id', async () => {
    const result = await db.deletar(MOCK_ID_USUARIO)

    deepEqual(result.deletedCount, 1)
  })
})

