export interface WeatherLocation {
  latitude: number;
  longitude: number;
  population: number;
}

export interface WeatherDaily {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface WeatherData {
  location: {
    name: string;
    population?: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export interface CityWeatherData {
  [city: string]: WeatherData;
} 