export default class InstagramApi {
  constructor(token) {
    this._token = token
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