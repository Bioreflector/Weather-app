import { WeatherServices } from './modules/weatherServices.js'
import { setTime } from './modules/timeService.js'

const sectionTop = document.querySelector('.section-top')
const hourlyContainer = document.querySelector('.hourly-container')
const services = new WeatherServices()

let state = ''

async function innit() {
  const result = await services.getResourceByLocation().then((res) => res)
  const { city, list } = result
  createTodayCard(city , list)
  rander( hourlyContainer , hourlyWeather(list) , createDayHourlyCard)
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
  const { city, list } = result
  createTodayCard(city , list)
  rander( hourlyContainer , hourlyWeather(list) , createDayHourlyCard)
  console.log(state)


})
function createTodayCard(city , dataArr) {
  const res = ` <div class="today-header">
<h2>${city.name} curent weather</h2>
<span>${getCurrentData()}</span>
</div>
<div class="curent-wheather">
<div class="curent-wheather-item center">
  <img src="http://openweathermap.org/img/wn/${
    dataArr[0].weather[0].icon
  }@2x.png" alt="${dataArr[0].weather[0].description}" />
  <span>${dataArr[0].weather[0].main}</span>
</div>
<div class="curent-wheather-item center">
  <div>
    <div class="temp">${convertKToC(dataArr[0].main.temp)} &#8451</div>
    <div class="temp-fil">Real Feel ${convertKToC(
      dataArr[0].main.feels_like
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
sectionTop.innerHTML = res
}

function createDayHourlyCard(item){
    return `<div class="col-12 col-lg-2 card-hourly">
    <div class="d-flex flex-row flex-lg-column justify-content-between align-items-center box-shadow">
      <div class="time">${setTime(item.dt, true)}</div>
      <div>
      <img src="http://openweathermap.org/img/wn/${
        item.weather[0].icon
      }@2x.png" alt="${item.weather[0].description}" />
      </div>
      <div class="time d-none d-lg-block">${item.weather[0].main}</div>
      <div class="time">${convertKToC(item.main.temp)}&deg<span class="d-block d-lg-none ">Temp(&#8451)</span></div>
      <div class="time">${convertKToC(item.main.feels_like)}&deg<span class="d-block d-lg-none ">RealFeel</span></div>
      <div class="time">${item.wind.speed}ESE<span class="d-block d-lg-none ">Wind(km/h)</span></div>
    </div>   
  </div>`
}

function convertKToC(kelvin) {
  const celsius = Math.round(kelvin - 273, 15)
  return celsius
}

function rander( container , arr , createElement){
  container.innerHTML = ''
  const list = arr.map(item => createElement(item))
  list.forEach(item => container.innerHTML +=item)
}

function weatherToday (dataArr){
  console.log(dataArr)
  const todayData = getCurrentData()
  const weatherToday = dataArr.filter(item => item.dt_txt.includes(todayData))
  return weatherToday
}

function getCurrentData() {
  const data = new Date(Date.now()).toLocaleString().split(',')[0].split('.').reverse().join('-')
  console.log(data)
  return data
}

function hourlyWeather(dataArr){
const result = dataArr.slice(0 , 6)
return result
} 

