import * as dotenv from 'dotenv'
dotenv.config({path: '../../.env'})

import InstagramApi from '../services/instagramAPI.js'

const token = process.env.TOKEN_INSTAGRAM
const api = new InstagramApi(token)

console.log(await api.getPosts())
