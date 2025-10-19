const LAT = 40.7128;
const LON = -74.0060;

const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const statusNowEl = document.getElementById("status-now");

const forecastSection = document.getElementById("weather-forecast");
const forecastList = document.getElementById("forecast-list");
const forecastStatusEl = document.getElementById("status-forecast");

const tabs = document.querySelectorAll(".tab");
const sectionNow = document.getElementById("weather-now");

// Weather code → text

const WEATHER_TEXT = {
  0: "Clear", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Depositing rime fog",
  51: "Drizzle: light", 53: "Drizzle: moderate", 55: "Drizzle: dense",
  61: "Rain: slight", 63: "Rain: moderate", 65: "Rain: heavy",
  71: "Snow: slight", 73: "Snow: moderate", 75: "Snow: heavy",
  80: "Rain showers: slight", 81: "Rain showers: moderate", 82: "Rain showers: violent",
  95: "Thunderstorm", 96: "Thunderstorm w/ slight hail", 99: "Thunderstorm w/ heavy hail"
};


// Fetch current conditions
async function loadNow() {
  try {
    statusNowEl.textContent = "Loading current conditions…";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const tempC = data?.current?.temperature_2m;
    const wind  = data?.current?.wind_speed_10m;

    tempEl.textContent = (typeof tempC === "number") ? `${tempC} °C` : "—";
    windEl.textContent = (typeof wind === "number") ? `${wind} m/s` : "—";
    statusNowEl.textContent = "Updated.";
  } catch (err) {
    console.error(err);
    statusNowEl.textContent = "Could not load current conditions.";
  }
}


// 7-day forecast
async function loadForecast() {
  try {
    forecastStatusEl.textContent = "Loading forecast…";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();

    const days  = data?.daily?.time || [];
    const highs = data?.daily?.temperature_2m_max || [];
    const lows  = data?.daily?.temperature_2m_min || [];
    const codes = data?.daily?.weathercode || [];

    forecastList.innerHTML = "";
    for (let i = 0; i < days.length; i++) {
      const li = document.createElement("li");
      const label = WEATHER_TEXT[codes[i]] ?? "—";
      li.innerHTML = `
        <div><strong>${new Date(days[i]).toLocaleDateString()}</strong></div>
        <div>${label}</div>
        <div>High: ${highs[i]} °C • Low: ${lows[i]} °C</div>
      `;
      forecastList.appendChild(li);
    }
    forecastStatusEl.textContent = "Updated.";
  } catch (err) {
    console.error(err);
    forecastStatusEl.textContent = "Could not load forecast.";
  }
}

// Tabs
function showView(view) {
  tabs.forEach(btn => btn.classList.toggle("is-active", btn.dataset.view === view));

  if (view === "now") {
    sectionNow.hidden = false;
    forecastSection.hidden = true;
    loadNow();
  } else {
    sectionNow.hidden = true;
    forecastSection.hidden = false;
    loadForecast();
  }
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

// Initial load
showView("now");