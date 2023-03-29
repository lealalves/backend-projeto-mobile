import Boom from '@hapi/boom'

export default class InstagramApi {
  constructor(token) {
    this._token = token
  }

  async testApi() {
      const url = `https://graph.instagram.com/me/media?access_token=${this._token}`
      const statusCode = (await fetch(url)).status
      
      return statusCode === 200? true : false
  }

  async getPosts(){
    const fields = 'caption,id,media_type,media_url,username,timestamp'
    const url = `https://graph.instagram.com/me/media?access_token=${this._token}&fields=${fields}`

    return await fetch(url)
  }
}