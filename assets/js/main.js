const rootCss = document.querySelector(':root');

const locNameEl = document.querySelector('.location__name');
const locRealTemperatureEl = document.querySelector('.location__realtemperature');
const locMaxTemperatureEl = document.querySelector('.location__maxtemperature');
const locMinTemperatureEl = document.querySelector('.location__mintemperature');
const locHumidityEl = document.querySelector('.location__humidity');
const locPressureEl = document.querySelector('.location__pressure');
const locCloudsEl = document.querySelector('.location__clouds');

const weatherDescriptionEl = document.querySelector('.weather__description');
const weatherImage = document.querySelector('.weather__image');

const dateEl = document.querySelector('.date');

const btnSearch = document.querySelector('.search__btn');
const loaderContainer = document.querySelector('.loader__container');

const mainEl = document.querySelector('.main');
const headerEl = document.querySelector('.header');

const displayLoading = () => {
  document.body.appendChild(loaderContainer);
  loaderContainer.style.display = 'flex';
};

const hideLoading = () => {
  loaderContainer.style.display = 'none';
  document.body.removeChild(loaderContainer);
};

const kelvinToCelsius = (temperature) => {
  return Math.floor(temperature - 273.15);
};

const kelvinToFarenheit = (temperature) => {
  return Math.floor((temperature - 273.15) * 9 / 5 + 32);
};

const setTemperature = (data) => {

  const temperaturesOptions = document.querySelectorAll('.opt');
  
  let realTemperature = kelvinToCelsius(data.main.temp);
  let maxTemperature = kelvinToCelsius(data.main.temp_max);
  let minTemperature = kelvinToCelsius(data.main.temp_min);
  let letter = 'C';

  // DEFAULT
  locMaxTemperatureEl.textContent = maxTemperature + '°' + letter;
  locMinTemperatureEl.textContent = minTemperature + '°' + letter;
  locRealTemperatureEl.textContent = realTemperature + '°' + letter;
  
  temperaturesOptions.forEach(opt => {
    opt.addEventListener('click', e => {
      if (e.target.innerText === 'C') {
        letter = 'C';
        realTemperature = kelvinToCelsius(data.main.temp);
        maxTemperature = kelvinToCelsius(data.main.temp_max);
        minTemperature = kelvinToCelsius(data.main.temp_min);
      } else {
        letter = 'F';
        realTemperature = kelvinToFarenheit(data.main.temp);
        maxTemperature = kelvinToFarenheit(data.main.temp_max);
        minTemperature = kelvinToFarenheit(data.main.temp_min);
      }

      locMaxTemperatureEl.textContent = maxTemperature + '°' + letter;
      locMinTemperatureEl.textContent = minTemperature + '°' + letter;
      locRealTemperatureEl.textContent = realTemperature + '°' + letter;
    });
  });
};

const setBgColor = (dateAndTime) => {
  const isDay = dateAndTime.split(',')[2].split(':')[1].split(' ')[1] === 'AM';
  const hour = Number(dateAndTime.split(',')[2].split(':')[0]);

  if (isDay) {
    if (hour >= 0 && hour < 5) {
      rootCss.style.setProperty('--CLR-LIGHT', '#13142bf2');
      rootCss.style.setProperty('--CLR-WHITE', '#1a0e0e');
      rootCss.style.setProperty('--CLR-BLACK', '#f5f5f5');
      rootCss.style.setProperty('--CLR-LIGHT-BLACK', '#5f5b5b5e');
      rootCss.style.setProperty('--CLR-BUTTON', '#f5f5f5');
      rootCss.style.setProperty('--BG-WEATHER-BOX', 'linear-gradient(to right bottom, var(--CLR-LIGHT-BLACK), hsl(0deg 2% 20% / 68%))');
      rootCss.style.setProperty('--BG-BUTTON', '#3a3b3cf2');
    } else if (hour >= 5 && hour < 12) {
      rootCss.style.setProperty('--CLR-LIGHT', '#af8255');
      rootCss.style.setProperty('--CLR-WHITE', '#613030bd');
      rootCss.style.setProperty('--CLR-BLACK', '#ffffff');
      rootCss.style.setProperty('--CLR-LIGHT-BLACK', '#070404cf');
      rootCss.style.setProperty('--BG-WEATHER-BOX', 'linear-gradient(to right bottom, var(--CLR-LIGHT-BLACK), hsl(0deg 0% 0% / 88%))');
      rootCss.style.setProperty('--CLR-BUTTON', 'hsl(0, 0%, 96%)');
      rootCss.style.setProperty('--BG-BUTTON', 'hsl(0, 0%, 7%)');
    }
  } else {
    if (hour >= 12 || hour < 6) {
      rootCss.style.setProperty('--CLR-LIGHT', '#d7d7e6e3');
      rootCss.style.setProperty('--CLR-WHITE', '#c5c5c5');
      rootCss.style.setProperty('--CLR-BLACK', '#1a1818');
      rootCss.style.setProperty('--CLR-LIGHT-BLACK', '#ffffff5e');
      rootCss.style.setProperty('--BG-WEATHER-BOX', 'linear-gradient(to right bottom, var(--CLR-LIGHT-BLACK), hsl(0deg 0% 76% / 88%))');
      rootCss.style.setProperty('--CLR-BUTTON', 'hsl(0, 0%, 96%)');
      rootCss.style.setProperty('--BG-BUTTON', 'hsl(0, 0%, 7%)');
    } else {
      rootCss.style.setProperty('--CLR-LIGHT', '#212244f2');
      rootCss.style.setProperty('--CLR-WHITE', '#352713');
      rootCss.style.setProperty('--CLR-BLACK', '#f5f5f5');
      rootCss.style.setProperty('--CLR-LIGHT-BLACK', '#5f5b5b5e');
      rootCss.style.setProperty('--CLR-BUTTON', '#f5f5f5');
      rootCss.style.setProperty('--BG-WEATHER-BOX', 'linear-gradient(to right bottom, var(--CLR-LIGHT-BLACK), hsl(0deg 2% 20% / 68%))');
      rootCss.style.setProperty('--BG-BUTTON', '#3a3b3cf2');
    }
  }
};

const setInfo = async (data) => {
  displayLoading();

  const dateAndTime = await getDateAndTime(data.coord.lat, data.coord.lon);

  setBgColor(dateAndTime);

  const locationName = data.name;
  const locationCountry = data.sys.country;

  const locHumidity = data.main.humidity;
  const locPressure = data.main.pressure;
  const locClouds = data.clouds.all;

  const weatherDescription = data.weather[0].description;
  const weatherIconId = data.weather[0].icon;

  const weatherImageUrl = `http://openweathermap.org/img/wn/${weatherIconId}@2x.png`;

  weatherImage.setAttribute('src', weatherImageUrl);
  weatherDescriptionEl.textContent = weatherDescription;

  locNameEl.textContent = `${locationName}, ${locationCountry}`;

  locHumidityEl.textContent = locHumidity + '%';
  locCloudsEl.textContent = locClouds + '%'
  locPressureEl.textContent = locPressure + ' hPa';

  setTemperature(data);

  dateEl.textContent = dateAndTime;

  hideLoading();
};

const getDateAndTime = async (lat, lon) => {
  
  const apiKey = 'e86f3fb45d3541628e622cef44bd90e3';
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data) throw new Error('Failed to load API data.');

  const date = Intl.DateTimeFormat(navigator.language, { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric', timeZone: `${data.results[0].timezone.name}`, hour: "numeric", minute: "numeric", hour12: true }).format(new Date());

  return date;
};

const getDataFromCurrentDay = async (lat, lon) => {
  const apiKey = '0f8c88146a435b8db9d6af1cacbbc02a';
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();

  if (!data) throw new Error('Failed to load API data.');

  setInfo(data);
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      getDataFromCurrentDay(lat, lon);
    }, (err) => console.log(err.message));
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

const getLocationBySubmit = () => {
  btnSearch.addEventListener('click', async e => {
    e.preventDefault();

    const city = document.querySelector('.city').value;

    if (!city || /(?![Ç-ç]|\s)[\W\d]/gm.test(city)) {
      alert('Please, type a valid city.');
      return;
    }

    const apiKey = '0f8c88146a435b8db9d6af1cacbbc02a';
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.length) {
      alert('Please, type a valid city.');
      return;
    }

    const lat = data[0].lat;
    const lon = data[0].lon;

    if (!lat || !lon || lat === 'undefined' || lon === 'undefined') {
      alert('Please, type a valid city.');
      return;
    };

    getDataFromCurrentDay(lat, lon);
  });
};

const main = () => {
  getLocation();
  getLocationBySubmit();
};

main();
