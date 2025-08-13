import { Request, Response } from 'express';
import { getCityWeather } from '../services/weatherService';
import fetch from 'node-fetch';

export const getWeather = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
    const weatherData = await getCityWeather(city);
    res.json(weatherData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getBulkWeather = async (req: Request, res: Response) => {
  try {
    const { cities } = req.body;
    if (!Array.isArray(cities)) {
      return res.status(400).json({ message: 'Cities must be provided as an array' });
    }

    const weatherPromises = cities.map(city => getCityWeather(city));
    const results = await Promise.all(weatherPromises);
    
    const weatherData = cities.reduce((acc, city, index) => {
      acc[city] = results[index];
      return acc;
    }, {} as Record<string, any>);

    res.json(weatherData);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const reverseGeocode = async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'lat and lon are required' });
  }
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'weather-app/1.0' }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch from Nominatim');
    }
    const data = await response.json();
    const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.county;
    const country = data.address.country;
    if (!city) {
      return res.status(404).json({ message: 'City not found for coordinates' });
    }
    // Try to get population from Nominatim search endpoint
    let population = null;
    const searchUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&addressdetails=1&extratags=1&limit=3`;
    const searchResp = await fetch(searchUrl, { headers: { 'User-Agent': 'weather-app/1.0' } });
    if (searchResp.ok) {
      const searchResults = await searchResp.json();
      // Prefer result with highest population
      let best = null;
      for (const result of searchResults) {
        const pop = result.extratags && result.extratags.population ? parseInt(result.extratags.population, 10) : null;
        if (pop && (!best || pop > best.population)) {
          best = { ...result, population: pop };
        }
      }
      if (best && best.population && best.population >= 10000) {
        population = best.population;
      }
    }
    res.json({ city, country, population });
  } catch (error) {
    res.status(500).json({ message: 'Reverse geocoding failed', error: error instanceof Error ? error.message : error });
  }
}; 