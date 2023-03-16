import Mongoose from "mongoose"

const STATUS = {
  0: 'Disconnected',
  1: 'Connected',
  2: 'Connecting',
  3: 'Disconnecting',
  4: 'Invalid Credentials'
}

export default class MongoDB {
  constructor(connection, schema) {
    this._connection = connection
    this._schema = schema
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState]
    
    if(state === 'Connected') return state

    if(state !== 'Connecting') return state

    await new Promise(resolve => setTimeout(resolve, 1000))

    return STATUS[this._connection.readyState]
  }

  static connect() {
    Mongoose.connect('mongodb://leallegal:secretcat@localhost:27017/mundo-m',{ useNewUrlParser: true })
    .catch(error => console.log('deu erro!', error))

    const connection = Mongoose.connection
    connection.once('open', () => console.log('database rodando!'))

    return connection
  }

  cadastrar(item) {
    return this._schema.create(item)
  }

  listar(query = {}, skip = 0, limit = 10) {
    return this._schema.find(query).skip(skip).limit(limit)
  }

  atualizar(id, item){
    return this._schema.updateOne({_id: id}, {$set: item})
  }

  deletar(id){
    return this._schema.deleteOne({_id: id})
  }
}