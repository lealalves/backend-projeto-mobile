import Hapi from '@hapi/hapi'
import MongoDB from './db/mongodb/mongodb.js'
import userSchema from './db/mongodb/schemas/userSchema.js'
import userRoutes from './routes/userRoutes.js'

import HapiSwagger from 'hapi-swagger'
import Vision from '@hapi/vision'
import Inert from '@hapi/inert'


const app = new Hapi.server({
  port: 5000
})

function mapRoutes(instance, methods){
  return methods.map(method => instance[method]())
}

async function main() {
  const connection = MongoDB.connect()
  const context = new MongoDB(connection, userSchema)

  const swaggerOptions = {
    info: {
      title: 'API Projeto Mobile',
      version: 'v1.0'
    }
  }
  await app.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }    
  ])

  app.route(
    mapRoutes(new userRoutes(context), userRoutes.methods())
  )

  app.start()
  console.log('Servidor rodando na porta', app.info.port);

  return app
}

export default main()