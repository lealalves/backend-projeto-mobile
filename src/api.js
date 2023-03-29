import * as dotenv from 'dotenv'
dotenv.config()

import Hapi from '@hapi/hapi'
import HapiSwagger from 'hapi-swagger'
import Vision from '@hapi/vision'
import Inert from '@hapi/inert'
import MongoDB from './db/mongodb/mongodb.js'
import HapiJwt from 'hapi-auth-jwt2'

import userSchema from './db/mongodb/schemas/userSchema.js'
import userRoutes from './routes/userRoutes.js'

import authRoutes from './routes/authRoutes.js'

import instagramAPI from './services/instagramAPI.js'
import serviceRoutes from './routes/serviceRoutes.js'

const INSTA_TOKEN = process.env.TOKEN_INSTAGRAM
const JWT_SECRET = process.env.TOKEN_JWT

const app = new Hapi.server({
  port: 5000,
  routes: {
    cors: {
      origin: ['*'],
      credentials: true
    }
  }
})

function mapRoutes(instance, methods){
  return methods.map(method => instance[method]())
}

async function main() {
  const connection = MongoDB.connect()
  const context = new MongoDB(connection, userSchema)
  const api = new instagramAPI(INSTA_TOKEN)

  const swaggerOptions = {
    info: {
      title: 'API Projeto Mobile',
      version: 'v1.0'
    }
  }
  await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }    
  ])

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20
    // },
    validate: (dados, request, h) => {
      console.log('dados', dados);
      return {
        isValid: true
      }
    }
  })

  app.auth.default('jwt')

  app.route([
    ...mapRoutes(new userRoutes(context), userRoutes.methods()),
    ...mapRoutes(new serviceRoutes(api), serviceRoutes.methods()),
    ...mapRoutes(new authRoutes(JWT_SECRET, context), authRoutes.methods())
    ]
  )

  app.start()
  console.log('Servidor rodando na porta', app.info.port);

  return app
}

export default main()