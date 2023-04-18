import Boom from '@hapi/boom'

export default function failAction (request, headers, error) {
  let errorType = error.details[0].type
  let errorPath = error.details[0].path
  let message = error.details[0].message
  let characters = message.match(/\d/g)?.join('')

  if(errorType === 'string.empty'){
    throw Boom.badRequest(`o campo ${errorPath} não é permitido estar vazio.`)
  }
  if(errorType === 'string.min'){
    throw Boom.badRequest(`o campo ${errorPath} deve conter mais de ${characters} caracteres.`)
  }
  if(errorType === 'string.max'){
    throw Boom.badRequest(`o campo ${errorPath} não deve conter mais de ${characters} caracteres.`)
  }

  throw error
}