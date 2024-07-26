const searchInput = document.querySelector(".input");
const searchBtn = document.querySelector(".btn");
const title = document.querySelector(".title");
const temp = document.querySelector(".temperature");
const hero = document.querySelector('.hero')
const main = document.querySelector('.main')

const country = document.querySelector('.country')
const timezone = document.querySelector('.timezone')
const population = document.querySelector('.population')
const tempLow = document.querySelector('.temp-low')
const tempHigh = document.querySelector('.temp-high')

const getCityName = () => searchInput.value;

const getJSON = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}(${data.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

const loadData = async (city) => {
  try {
    // city
    const cityData = await getJSON(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const { results } = cityData;
    if (!results || results.length === 0) throw new Error(`Not found`);

    const {name, latitude, longitude, timezone, population, country } = results[0];

    // weather
    const weatherData = await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`)

    const weather = {
      timezone: weatherData.timezone,
      temperature: weatherData.current.temperature_2m,
      unit: weatherData.daily_units.temperature_2m_max,
      tomorrowLow: weatherData.daily.temperature_2m_min,
      tomorrowHigh: weatherData.daily.temperature_2m_max,
      day: weatherData.current.is_day, // 1 or 0
    }
    return {city: name, latitude, longitude, population, weather, country};

  } catch (err) {
    throw err;
  }
};

const renderData = (data) => {
  title.textContent = data.city
  temp.textContent = `${data.weather.temperature}${data.weather.unit}`
  country.textContent = data.country
  timezone.textContent = data.weather.timezone
  population.textContent = data.population
  tempLow.textContent = `${data.weather.tomorrowLow}${data.weather.unit}`
  tempHigh.textContent = `${data.weather.tomorrowHigh}${data.weather.unit}`

  if(data.weather.day === 1) {
    hero.style.backgroundImage = `url('./images/day.jpg')`;
    hero.style.color = 'black';
  } else {
    hero.style.backgroundImage = `url('./images/night.jpg')`;
    hero.style.color = 'white';
  }
}

searchBtn.addEventListener("click", async () => {
  try {
    const city = getCityName()
    const data = await loadData(city);
    renderData(data)
    main.style.display = 'block';
    searchInput.value = '';
  } catch(err) {
    alert(err);
  }
});