import Mongoose from 'mongoose'

const userSchema = Mongoose.Schema({
  nome: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  telefone: {
    required: true,
    type: String
  },
  cpf: {
    required: true,
    type: String,
  },
  senha: {
    required: true,
    type: String
  }
})

export default Mongoose.model('user',userSchema)
