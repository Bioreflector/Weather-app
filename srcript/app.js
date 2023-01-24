import { WeatherServices } from './modules/weatherServices.js'
const sectionTop = document.querySelector('.top-container')
const hourlyContainer = document.querySelector('.hourly-container')
const cityinput = document.getElementById('search-city')
const searchBtn = document.getElementById('search-btn')
const fiveDayBtn = document.getElementById('fiveDay')
const todayBtn = document.getElementById('todayBtn')
const curentDay = document.querySelector('.current-day')

let state = ''
let currentWeatherState = ''
const services = new WeatherServices()

async function innit() {
  const currentWeather = await services
    .getByLocationCurrent()
    .then((res) => res)
  const resultFiveDay = await services.getByLocationFiveDay().then((res) => res)
  const { list } = resultFiveDay
  createTodayCard(currentWeather)
  rander(hourlyContainer, hourlyWeather(list), createHourlyCard)
  curentDay.innerText = 'Today'
  currentWeatherState = currentWeather
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
  currentWeatherState = currentWeather
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
  card.classList.add('col-12', 'col-lg-2')
  card.innerHTML = `<div class="d-flex flex-row flex-lg-column justify-content-between align-items-center card-hourly">
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
  } ${directionOfTheWind(item.wind.deg)}<span class="d-block d-lg-none ">Wind(km/h)</span></div>
</div>`
  return card
}

function createDaysCard(item, index) {
  const card = document.createElement('div')
  console.log(card)
  card.classList.add('col-2', 'day-card')
  if (!index) {
    card.classList.add('selected-day')
  }
  card.addEventListener('click', (e) => selectDay(e, item.dt, state))
  card.innerHTML = `
  <div class="time">${setDay(item.dt)}</div>
  <div>${setDetaAndMonth(item.dt)}</div>
  <div>
  <img src="http://openweathermap.org/img/wn/${
    item.weather[0].icon
  }@2x.png" alt="${item.weather[0].description}" />
  </div>
  <div class="time d-none d-lg-block">${item.weather[0].main}</div> `
  return card
}
function selectDay(e, time, arr) {
  const cards = document.querySelectorAll('.day-card')
  cards.forEach((item) => item.classList.remove('selected-day'))
  e.currentTarget.classList.add('selected-day')
  curentDay.innerText = setDay(time)
  const data = new Date(time * 1000).toISOString().slice(0, 10)
  const dayByHourList = arr.filter((item) => item.dt_txt.includes(data))
  rander(hourlyContainer, hourlyWeather(dayByHourList), createHourlyCard)
}

function convertKToC(kelvin) {
  const celsius = Math.round(kelvin - 273, 15)
  return celsius
}

function rander(container, arr, createElement) {
  container.innerHTML = ''
  const list = arr.map((item, index) => createElement(item, index))
  list.forEach((item) => container.appendChild(item))
}

function weatherForFourDay(list) {
  const todayData = getCurrentData()
  const result = list.filter(
    (item) =>
      !item.dt_txt.includes(todayData) && item.dt_txt.includes('12:00:00')
  )
  console.log(result)
  rander(sectionTop, result, createDaysCard)
}
// data end time ----------------------------
function getCurrentData() {
  const data = new Date(Date.now()).toISOString().slice(0, 10)
  return data
}
function setTime(time, utc) {
  let date = ''
  if (utc) {
    date = new Date(time * 1000).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
    })
  } else {
    date = new Date(time * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    })
  }
  return date
}
function setDay(time) {
  const day = new Date(time * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
  })
  return day
}
function setDetaAndMonth(time) {
  const month = new Date(time * 1000).toLocaleDateString('en-US', {
    month: 'long',
  })
  const shortNameMonth = month.slice(0, 3)
  const day = new Date(time * 1000).toLocaleDateString('en-US', {
    day: 'numeric',
  })
  return `${shortNameMonth} ${day}`
}

// -----------------------------------------

function hourlyWeather(dataArr) {
  const result = dataArr.slice(0, 6)
  return result
}
function directionOfTheWind(deg) {
  if (deg == 360 || deg == 0) return ' N'
  if (deg > 0 && deg < 45) return 'NNE'
  if (deg  == 45) return 'NE'
  if (deg > 45 && deg < 90) return 'ENE'
  if (deg  == 90) return 'E'
  if (deg > 90 && deg < 135) return 'ESE'
  if (deg  == 135) return 'SE'
  if (deg > 135 && deg < 180) return 'SSE'
  if (deg  == 180) return 'S'
  if (deg > 180 && deg < 225) return 'SSW'
  if (deg  == 225) return 'SW'
  if (deg > 225 && deg < 270) return 'WSW'
  if (deg  == 270) return 'W'
  if (deg > 270 && deg <= 315) return 'WWW'
  if (deg  == 315) return 'NW'
  if (deg > 315 && deg <= 360) return 'NNW'
}

innit()
fiveDayBtn.addEventListener('click', () => weatherForFourDay(state))
searchBtn.addEventListener('click', async (e) => wheatherFromSearch(e))
todayBtn.addEventListener('click' , ()=>{
  curentDay.innerText =  'Today'
  createTodayCard(currentWeatherState)
  rander(hourlyContainer, hourlyWeather(state), createHourlyCard)
})

