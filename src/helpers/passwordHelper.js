import bcrypt from 'bcrypt'

const SALT = 3

export default class passwordHelper {
  static async hashPassword(pass) {
    return await bcrypt.hash(pass, SALT)
  }
  static async comparePassword(pass, hash) {
    return await bcrypt.compare(pass, hash)
  }
}