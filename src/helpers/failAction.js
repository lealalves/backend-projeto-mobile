export default function failAction (request, headers, error) {
  let errorType = error.details[0].type
  let errorPath = error.details[0].path

  if(errorType === 'string.empty'){
    throw Boom.badRequest(`o campo ${errorPath} não é permitido estar vazio.`)
  }
  if(errorType === 'string.min'){
    throw Boom.badRequest(`o campo ${errorPath} deve conter mais de 4 caracteres.`)
  }

  throw error
}