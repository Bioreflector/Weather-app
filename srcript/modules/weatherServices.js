export class WeatherServices {
    _apiBase = 'https://api.openweathermap.org/data/2.5/'
    _apiKey = 'appid=42edb80756ba984d71a5c690dc9b699f'


    getResource = async (url) => {
      let result = await fetch(url)
      if (!result.ok) {
        throw new Error(`Col not fath ${url} status : ${result.status}`)
      }
      return await result.json()
    }
  
    getLocation = async () => {
      const response = await fetch('http://ip-api.com/json/?fields=61439')
      if (!response.ok) {
        throw new Error(`Col not fath  status : ${result.status}`)
      }
      const result = response.json()
      return result
    }
    getByLocationCurrent = async () => {
      const location = await this.getLocation()
      const result = await this.getResource(
        `${this._apiBase}weather?q=${location.city}&${this._apiKey}`
      )
      return result
    }
    
    getByLocationFiveDay = async () => {
      const location = await this.getLocation()
      const result = await this.getResource(
        `${this._apiBase}forecast?q=${location.city}&${this._apiKey}`
      )
      return result
    }
    getByCityNameCurrent = async (cityName) => {
      const result = await this.getResource(
        `${this._apiBase}weather?q=${cityName}&${this._apiKey}`
      )
      return result
    }
    getByCityNameFiveDay = async (cityName) => {
      const result = await this.getResource(
        `${this._apiBase}forecast?q=${cityName}&${this._apiKey}`
      )
      return result
    }

  }