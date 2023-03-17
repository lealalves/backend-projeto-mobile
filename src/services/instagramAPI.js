export default class InstagramApi {
  constructor(token) {
    this._token = token
  }

  async testApi() {
    try {
      const url = `https://graph.instagram.com/me/media?access_token=${this._token}`
      const statusCode = (await fetch(url)).status

      if(statusCode !== 200) return false

      return true

    } catch (error) {
      console.log('DEU RUIM', error);
      return 'Erro interno na API'
    }
  }

  async getPosts(skip = 0, limit = 10){
    try {
      const fields = 'caption,id,media_type,media_url,username,timestamp'
      const url = `https://graph.instagram.com/me/media?access_token=${this._token}&fields=${fields}`
  
      const data = (await (await fetch(url)).json()).data  

      return data.slice(skip, limit)
      
    } catch (error) {
      console.log('DEU RUIM', error);
      return 'Erro interno na API'
    }
  }
}