import type { Response } from 'node-fetch';
const nodeFetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

interface WeatherResponse {
  location: {
    latitude: number;
    longitude: number;
    population: number;
  };
  weather: {
    daily: {
      time: string[];
      weathercode: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_sum: number[];
    };
  };
}

describe('Weather API Tests', () => {
  // Test if server is running
  test('Server is running', async () => {
    try {
      const response = await nodeFetch(`${BASE_URL}/weather/London`);
      expect(response.status).toBe(200);
    } catch (error) {
      throw new Error('Server is not running. Please start the server with `npm run dev`');
    }
  });

  // Test single city endpoint
  test('GET /weather/:city returns correct data structure', async () => {
    const response = await nodeFetch(`${BASE_URL}/weather/London`);
    const data = await response.json() as WeatherResponse;

    // Check response structure
    expect(data).toHaveProperty('location');
    expect(data).toHaveProperty('weather');
    expect(data.location).toHaveProperty('latitude');
    expect(data.location).toHaveProperty('longitude');
    expect(data.location).toHaveProperty('population');
    expect(data.weather.daily).toHaveProperty('time');
    expect(data.weather.daily).toHaveProperty('weathercode');
    expect(data.weather.daily).toHaveProperty('temperature_2m_max');
    expect(data.weather.daily).toHaveProperty('temperature_2m_min');
    expect(data.weather.daily).toHaveProperty('precipitation_sum');

    // Check data types
    expect(typeof data.location.latitude).toBe('number');
    expect(typeof data.location.longitude).toBe('number');
    expect(typeof data.location.population).toBe('number');
    expect(Array.isArray(data.weather.daily.time)).toBe(true);
    expect(data.weather.daily.time.length).toBe(7); // 7-day forecast
  });

  // Test bulk cities endpoint
  test('POST /weather/bulk returns data for multiple cities', async () => {
    const cities = ['London', 'Paris', 'New York'];
    const response = await nodeFetch(`${BASE_URL}/weather/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cities }),
    });

    const data = await response.json() as Record<string, WeatherResponse>;

    // Check if all requested cities are in response
    cities.forEach(city => {
      expect(data).toHaveProperty(city);
      expect(data[city]).toHaveProperty('location');
      expect(data[city]).toHaveProperty('weather');
    });
  });

  // Test error handling
  test('Invalid city name returns 400 error', async () => {
    const response = await nodeFetch(`${BASE_URL}/weather/InvalidCityName123456`);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });

  // Test bulk endpoint error handling
  test('Bulk endpoint handles invalid cities', async () => {
    const cities = ['London', 'InvalidCity123', 'Paris'];
    const response = await nodeFetch(`${BASE_URL}/weather/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cities }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty('message');
  });
}); 