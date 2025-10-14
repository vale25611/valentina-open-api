const LAT = 40.7128;
const LON = -74.0060;

// Open-Meteo docs: https://open-meteo.com/
const URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,wind_speed_10m`;

const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");
const statusEl = document.getElementById("status");

async function loadWeather() {
  try {
    statusEl.textContent = "Loading weather…";

    const res = await fetch(URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    console.log("Open-Meteo response:", data);

    const temp = data?.current?.temperature_2m;
    const wind = data?.current?.wind_speed_10m;

    if (typeof temp === "number") tempEl.textContent = `${temp} °C`;
    if (typeof wind === "number") windEl.textContent = `${wind} m/s`;

    statusEl.textContent = "Updated just now.";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Could not load weather right now.";
  }
}

loadWeather();
