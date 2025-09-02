// utils/weather.js
// Holt Wetterdaten DIREKT vom Open-Meteo-Service (kein API-Key nötig).
// Quelle/Anforderung im Repo: Wetterdaten-API, z. B. open-meteo. 5-Minuten-Cache ist hier clientseitig simpel gehalten. :contentReference[oaicite:2]{index=2}

const cache = new Map();
const TTL_MS = 5 * 60 * 1000; // 5 Minuten

// Mapping WMO -> kurzer Text (UX-freundlich)
const WMO = {
  0: 'Klar', 1: 'Überw. klar', 2: 'Teilw. bewölkt', 3: 'Bewölkt',
  45: 'Nebel', 48: 'Reifnebel',
  51:'Leicht. Niesel', 53:'Mäßig. Niesel', 55:'Stark. Niesel',
  56:'Gefr. Niesel', 57:'Stark gefr. Niesel',
  61:'Leicht. Regen', 63:'Mäßig. Regen', 65:'Stark. Regen',
  66:'Gefr. Regen', 67:'Stark gefr. Regen',
  71:'Leicht. Schnee', 73:'Mäßig. Schnee', 75:'Stark. Schnee',
  77:'Schneegriesel',
  80:'Leicht. Schauer', 81:'Mäßig. Schauer', 82:'Heftige Schauer',
  85:'Leicht. Schneeschauer', 86:'Heft. Schneeschauer',
  95:'Gewitter', 96:'Gew. mit leichtem Hagel', 99:'Gew. mit starkem Hagel',
};

export async function geocode(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=de&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding fehlgeschlagen');
  const data = await res.json();
  const r = data.results && data.results[0];
  if (!r) throw new Error('Ort nicht gefunden');
  return { lat: r.latitude, lon: r.longitude, label: `${r.name}${r.country ? ', ' + r.country : ''}` };
}

export async function getCurrentWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Wetterabruf fehlgeschlagen');
  const data = await res.json();
  const c = data.current;
  return {
    time: c.time,
    temperature: c.temperature_2m,
    windspeed: c.wind_speed_10m,
    weather_code: c.weather_code,
    summary: WMO[c.weather_code] ?? `Code ${c.weather_code}`,
  };
}

export async function getWeatherByLocation(locationRaw) {
  const key = locationRaw.trim().toLowerCase();
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && (now - hit.ts) < TTL_MS) return hit.data;

  const { lat, lon, label } = await geocode(locationRaw);
  const current = await getCurrentWeather(lat, lon);
  const data = { locationLabel: label, lat, lon, current };
  cache.set(key, { data, ts: now });
  return data;
}
