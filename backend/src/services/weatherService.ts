interface GeocodingResult {
  latitude: number;
  longitude: number;
  population: number;
}

interface GeocodingResponse {
  results: GeocodingResult[];
}

interface WeatherData {
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export async function getLocationData(cityName: string): Promise<GeocodingResult> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
  );
  
  if (!response.ok) {
    throw new Error(`Geocoding failed: ${response.status}`);
  }

  const data = await response.json() as GeocodingResponse;
  if (!data.results || data.results.length === 0) {
    throw new Error(`City not found: ${cityName}`);
  }

  const { latitude, longitude, population } = data.results[0];
  return { latitude, longitude, population };
}

export async function getWeatherForecast(latitude: number, longitude: number): Promise<WeatherData> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  return response.json() as Promise<WeatherData>;
}

export async function getCityWeather(cityName: string) {
  try {
    const location = await getLocationData(cityName);
    const weather = await getWeatherForecast(location.latitude, location.longitude);
    
    return {
      location,
      weather
    };
  } catch (error) {
    throw error;
  }
} 