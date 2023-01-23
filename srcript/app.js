import { WeatherServices } from './modules/weatherServices.js'
import { setTime } from './modules/timeService.js'

const sectionTop = document.querySelector('.top-container')
const hourlyContainer = document.querySelector('.hourly-container')
const cityinput = document.getElementById('search-city')
const searchBtn = document.getElementById('search-btn')
const fiveDayBtn = document.getElementById('fiveDay')
let state = ''
const services = new WeatherServices()

async function innit() {
  const currentWeather = await services
    .getByLocationCurrent()
    .then((res) => res)
  console.log(currentWeather)
  const resultFiveDay = await services.getByLocationFiveDay().then((res) => res)
  const { list } = resultFiveDay
  createTodayCard(currentWeather)
  rander(hourlyContainer, hourlyWeather(list), createHourlyCard)
  state = list 
}

async function wheatherFromSearch(e) {
  e.preventDefault()
  const value = cityinput.value
  const currentWeather = await services
    .getByCityNameCurrent(value)
    .then((res) => res)
  const result = await services.getByCityNameFiveDay(value).then((res) => res)
  const { list } = result
  createTodayCard(currentWeather)
  rander(hourlyContainer, hourlyWeather(list), createHourlyCard)
  state = list
}

function createTodayCard(currentWeather) {
  const { name, main, weather, sys } = currentWeather
  const res = ` <div class="today-header">
<h2>${name} curent weather</h2>
<span>${getCurrentData()}</span>
</div>
<div class="curent-wheather">
<div class="curent-wheather-item center">
  <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${
    weather[0].description
  }" />
  <span>${weather[0].main}</span>
</div>
<div class="curent-wheather-item center">
  <div>
    <div class="temp">${convertKToC(main.temp)} &#8451</div>
    <div class="temp-fil">Real Feel ${convertKToC(main.feels_like)}&#8451</div>
  </div>
</div>
<div class="curent-wheather-item center">
  <div>
    <div>Sunrise: <span class='sunInf'>${setTime(sys.sunrise)}</span></div>
  <div>Sunset: <span class='sunInf'>${setTime(sys.sunset)}</span></div>
  </div>
</div>
</div>`
  sectionTop.innerHTML = res
}

function createHourlyCard(item) {
  const card = document.createElement('div')
  card.classList.add('col-12', 'col-lg-2', 'card-hourly')
  card.innerHTML = `<div class="d-flex flex-row flex-lg-column justify-content-between align-items-center box-shadow">
  <div class="time">${setTime(item.dt, true)}</div>
  <div>
  <img src="http://openweathermap.org/img/wn/${
    item.weather[0].icon
  }@2x.png" alt="${item.weather[0].description}" />
  </div>
  <div class="time d-none d-lg-block">${item.weather[0].main}</div>
  <div class="time">${convertKToC(
    item.main.temp
  )}&deg<span class="d-block d-lg-none ">Temp(&#8451)</span></div>
  <div class="time">${convertKToC(
    item.main.feels_like
  )}&deg<span class="d-block d-lg-none ">RealFeel</span></div>
  <div class="time">${
    item.wind.speed
  }ESE<span class="d-block d-lg-none ">Wind(km/h)</span></div>
</div>`
  return card
}

function createDaysCard(item) {
  const card = document.createElement('div')
  console.log(card)
  card.classList.add('col-2', 'day-card')
  card.addEventListener('click', (e) => selectDay(e , item.dt , state))
  card.innerHTML = `
  <div class="time">${setTime(item.dt, true)}</div>
  <div>
  <img src="http://openweathermap.org/img/wn/${
    item.weather[0].icon
  }@2x.png" alt="${item.weather[0].description}" />
  </div>
  <div class="time d-none d-lg-block">${item.weather[0].main}</div> `
  return card
}
function selectDay(e , time , arr) {
  const cards = document.querySelectorAll('.day-card')
  cards.forEach((item) => item.classList.remove('selected-day'))
  e.currentTarget.classList.add('selected-day')
  const data = new Date(time*1000).toLocaleString().split(',')[0].split('.').reverse().join('-')
  const result = arr.filter(item => item.dt_txt.includes(data))
  console.log(result)
  rander(hourlyContainer, result, createHourlyCard)
}

function convertKToC(kelvin) {
  const celsius = Math.round(kelvin - 273, 15)
  return celsius
}

function rander(container, arr, createElement) {
  container.innerHTML = ''
  const list = arr.map((item) => createElement(item))
  list.forEach((item) => container.insertAdjacentElement('beforeend', item))
}

function weatherForFourDay( list ) {
  console.log(list)
  const todayData = getCurrentData()
  const result = list.filter(
    (item) =>
      !item.dt_txt.includes(todayData) && item.dt_txt.includes('12:00:00')
  )
  console.log(result)
  rander(sectionTop, result, createDaysCard)
}

function getCurrentData() {
  const data = new Date(Date.now())
    .toLocaleString()
    .split(',')[0]
    .split('.')
    .reverse()
    .join('-')
  console.log(data)
  return data
}

function hourlyWeather(dataArr) {
  const result = dataArr.slice(0, 6)
  return result
}

innit()
fiveDayBtn.addEventListener('click', () => weatherForFourDay(state))
searchBtn.addEventListener('click', async (e) => wheatherFromSearch(e))


