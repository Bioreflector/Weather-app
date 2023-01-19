import { WeatherServices } from './modules/weatherServices.js'
import { setTime } from './modules/timeService.js'

const sectionTop = document.querySelector('.section-top')
const services = new WeatherServices()

let state = ''

async function innit() {
  const result = await services.getResourceByLocation().then((res) => res)
  rander(sectionTop, result, createTodayCard)
  state = result
}
innit()

setTime(1674107352, true)
setTime(1674107352, false)

const cityinput = document.getElementById('search-city')
const searchBtn = document.getElementById('search-btn')

searchBtn.addEventListener('click', async (e) => {
  e.preventDefault()
  const value = cityinput.value
  const result = await services.getResourceByCity(value).then((res) => res)
  rander(sectionTop, result, createTodayCard)
  console.log(result)


})
function createTodayCard(data) {
  const { city, list } = data
  return ` <div class="today-header">
<h2>${city.name} curent weather</h2>
<span>${getCurrentData()}</span>
</div>
<div class="curent-wheather">
<div class="curent-wheather-item center">
  <img src="http://openweathermap.org/img/wn/${
    list[0].weather[0].icon
  }@2x.png" alt="${list[0].weather[0].description}" />
  <span>${list[0].weather[0].main}</span>
</div>
<div class="curent-wheather-item center">
  <div>
    <div class="temp">${convertKToC(list[0].main.temp)} &#8451</div>
    <div class="temp-fil">Real Feel ${convertKToC(
      list[0].main.feels_like
    )}&#8451</div>
  </div>
</div>
<div class="curent-wheather-item center">
  <div>
    <div>Sunrise: <span class='sunInf'>${setTime(city.sunrise)}</span></div>
  <div>Sunset: <span class='sunInf'>${setTime(city.sunset)}</span></div>
  </div>
</div>
</div>`
}

function convertKToC(kelvin) {
  const celsius = Math.round(kelvin - 273, 15)
  return celsius
}
function rander(container, date, createCard) {
  container.innerHTML = createCard(date)
}
// http://openweathermap.org/img/wn/04n@2x.png

// const weatherToday = (result) =>{
//   const todayData = getCurrentData()
//   const { list} = result
//   const weatherToday = list.filter(item => item.dt_txt.includes(todayData))
//   console.log(weatherToday)
// }

function getCurrentData() {
  const data = new Date(Date.now()).toLocaleString().split(',')[0]
  return data
}

getCurrentData()
