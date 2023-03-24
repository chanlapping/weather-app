
// functions for fetching data
async function getWeather(cityName) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=cc25bd05561b6acac0eb328590016066`;
    message.textContent = 'loading...';
    const response = await fetch(url, {mode: 'cors'});
    message.textContent = '';
    const data = await response.json();
    return data;
}

async function getSummary(cityName) {
    
    const data = await getWeather(cityName);
    const city = data.city.name;
    const forecasts = [];

    const list = data.list;
    for (const item of list) {
        const time = new Date(item.dt*1000);
        const temp = Math.round(item.main.temp) - 273;
        const humidity = item.main.humidity;
        const pop = item.pop;
        const desc = item.weather[0].description;
        const icon = item.weather[0].icon;
        forecasts.push({time, temp, humidity, pop, desc, icon});
    }

    return {city, forecasts};
}


// form for getting and handling input from user
const form = document.querySelector('form');
const input = document.querySelector('#city');
const message = document.querySelector('#message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = input.value;
    if (city == '') {
        message.textContent = 'input field must not be empty';
        return;
    }
    try {
        summary = await getSummary(city);
        currentIndex = 0;
        displayForecasts(summary);
    } catch(e) {
        message.textContent = 'Error: cannot get data';
    }
    
});

// functions and elements for display data
const cityDisplay = document.querySelector('.display h2');
const dateDisplay = document.querySelector('.date');
const cards = document.querySelector('.cards');



function displayForecasts(summary) {
    
    cityDisplay.textContent = summary.city;
    cards.innerHTML = '';
    for (let i = currentIndex; i < currentIndex + 8; i++) {
        const card = createCard(summary.forecasts[i]);
        if (i % 8 == 0 || summary.forecasts[i].time.getHours() < 3) {
            card.querySelector('.date').classList.add('show');
        }
        cards.appendChild(card);
    }
    if (document.querySelector('#celsius').checked) {
        displayTemp('c');
    } else {
        displayTemp('f');
    }

    const bgTemp = summary.forecasts[currentIndex].temp;
    if (bgTemp < 0) {
        document.body.className = 'cold';
    } else if (bgTemp < 15) {
        document.body.className = 'moderate';
    } else if (bgTemp < 30) {
        document.body.className = 'warm';
    } else {
        document.body.className = 'hot';
    }

    const dayNumber = currentIndex / 8;
    days.forEach(day => day.classList.remove('active'));
    days[dayNumber].classList.add('active');
}

function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <p class="date">${item.time.toDateString().substring(4, 10)}</p>
    <p class="time">${item.time.getHours()}:00</p>
    <img src="https://openweathermap.org/img/wn/${item.icon}@2x.png" alt="overcast clouds" >
    <p class="tempC">${item.temp}&#176;C</p>
    <p class="tempF">${Math.round(item.temp*1.8+32)}&#176;F</p>
    <p class="humidity">humidity: ${item.humidity}%</p>
    <p class="rain">rain: ${item.pop}%</p>`;
    
    return card;
}

// prev and next buttons

const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

prevBtn.addEventListener('click', () => {
    if (currentIndex == 0 || !summary) {
        return;
    }
    currentIndex -= 8;
    displayForecasts(summary);
});

nextBtn.addEventListener('click', () => {
    if (currentIndex == 32 || !summary) {
        return;
    }
    currentIndex += 8;
    displayForecasts(summary);
});

// day number buttons
const days = document.querySelectorAll('.day');

days.forEach(day => day.addEventListener('click', (e) => {
    if (!summary) {
        return;
    }
    const dayNumber = e.target.textContent;
    currentIndex = (dayNumber - 1) * 8;
    displayForecasts(summary);
}));

// celsius and fahrenheit buttons

const celsiusBtn = document.querySelector('#celsius');
const fahrenheitBtn = document.querySelector('#fahrenheit');


celsiusBtn.addEventListener('change', () => {
    displayTemp('c');
    
});

fahrenheitBtn.addEventListener('change', () => {
    displayTemp('f');
});

function displayTemp(unit) {
    const celsiusDisplay = document.querySelectorAll('.tempC');
    const fahrenheitDisplay = document.querySelectorAll('.tempF');
    if (unit == 'c') {
        celsiusDisplay.forEach(p => p.classList.add('show'));
        fahrenheitDisplay.forEach(p => p.classList.remove('show'));
    } else {
        celsiusDisplay.forEach(p => p.classList.remove('show'));
        fahrenheitDisplay.forEach(p => p.classList.add('show'));
    }
    
}

// initializing state of app
let summary;
let currentIndex = 0;