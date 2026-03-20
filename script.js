// API_KEY
const API_KEY = "0fc836a2e922cbc7e6458e62593bbdd1";

// Weather app will ask you for where you are and show u the right temp there you are.
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

        fetchWeather(lat,lon);
    }, (error) => {
        console.error("You said no so we show you Stockholm instead.")
        fetchWeather(59.3293, 18.0686)});
    } else {
    console.error("Geolocation is not supported by your browser.")
  }
};


// API link
const fetchWeather = async (lat, lon) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${API_KEY}`;

  try {
    const response = await fetch(weatherUrl);
    const data = await response.json();
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json(); 

    //body element
    const icon = document.getElementById("weather-icon");
    const cityElement = document.getElementById("city");
    const bodyElement = document.body;
    const tempElement = document.getElementById("temp");
    const descElement = document.getElementById("description");
    const sunriseElement = document.getElementById("sunrise");
    const sunsetElement = document.getElementById("sunset");
    const forecastElement = document.getElementById("forecast");

    //Logic for the view
    const weatherMain = data.weather[0].main;

    if (weatherMain === "Clear") {
        icon.src = "./assets/catsunglasses.png";
        icon.alt = "A cool cat with sunglasses in the sun."
        cityElement.innerHTML = `Get your sunnies on. ${data.name} is looking rather great today.`;
        bodyElement.className = "clear-day";
    } else if (weatherMain === "Clouds") {
        icon.src = "./assets/cloudy.png";
        icon.alt = "Cloudy";
        cityElement.innerHTML = `Light a fire and get cosy. ${data.name} is looking grey today.`;
        bodyElement.className = "cloudy-day";
    } else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
        icon.src = "./assets/umbrella.png";
        icon.alt = "A yellow umbrella in rain";
        cityElement.innerHTML = `Don´t forget your umbrella. It's wet in ${data.name} today.`;
        bodyElement.className = "rainy-day";
    } else if (weatherMain === "Thunderstorm") {
        icon.src = "./assets/storm.png";
        icon.alt = "Thunderstorm";
        cityElement.innerHTML = `Stay inside and order food instead, there's a storm coming to ${data.name} now.`;
        bodyElement.className = "storm-day";
    } else if (weatherMain === "Snow") {
        icon.src = "./assets/snowman.png"
        icon.alt = "Snowman in a snowing day";
        cityElement.innerHTML = `Dress warmly and go out and make the nicest snowman in the whole ${data.name}.`;
        bodyElement.className = "snow-day";
    } else {
        icon.src = "./assets/suncloudy.png"
        icon.alt = "sun and clouds";
        cityElement.innerHTML = `Weather in ${data.name} is a bit unusual today!`;
        bodyElement.className = "cloudy-day"
    }

    tempElement.innerHTML = `${data.main.temp.toFixed(1)}°C`;
    descElement.innerHTML = data.weather[0].description;

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});

    sunriseElement.innerHTML = `sunrise ${sunriseTime}`;
    sunsetElement.innerHTML = `sunset ${sunsetTime}`;

    const filteredForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    forecastElement.innerHTML = "";
    filteredForecast.forEach((day) => {
        const date = new Date(day.dt * 1000);

        let dayName = date.toLocaleDateString("en-US", { weekday: "short"})
        .toLowerCase();

        forecastElement.innerHTML += `
            <div class="forecast-row">
                <span class="day-name">${dayName}</span>
                <span class="day-temp">${day.main.temp.toFixed(0)}°C</span>
            </div>`;
        });

    } catch (error) {
    console.error("Oh something was wrong:", error);
  }
};

getLocation();