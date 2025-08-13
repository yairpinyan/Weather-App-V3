import axios from 'axios';
import type { WeatherData } from '../types/weather';

const API_BASE_URL = '/api';

const validateWeatherData = (data: any): data is WeatherData => {
  return (
    data &&
    typeof data === 'object' &&
    data.daily &&
    Array.isArray(data.daily.time) &&
    Array.isArray(data.daily.weathercode) &&
    Array.isArray(data.daily.temperature_2m_max) &&
    Array.isArray(data.daily.temperature_2m_min)
  );
};

export const weatherService = {
  async getWeatherForCity(cityName: string): Promise<WeatherData> {
    try {
      console.log(`Fetching weather data for ${cityName}...`);
      // Ensure proper URL encoding of the city name
      const encodedCityName = encodeURIComponent(cityName);
      console.log(`Encoded city name: ${encodedCityName}`);
      const response = await axios.get(`${API_BASE_URL}/weather/${encodedCityName}`);
      const rawData = response.data;
      
      console.log('Raw data received:', rawData);

      // Transform the data into the expected format
      const transformedData: WeatherData = {
        location: {
          name: cityName,
          population: rawData.location?.population
        },
        daily: rawData.weather?.daily || {}
      };

      console.log('Transformed data:', transformedData);

      if (!validateWeatherData(transformedData)) {
        console.error('Invalid weather data format after transformation:', transformedData);
        throw new Error('Invalid weather data format received from server');
      }

      console.log(`Successfully fetched weather data for ${cityName}:`, transformedData);
      return transformedData;
    } catch (error) {
      console.error(`Error fetching weather for ${cityName}:`, error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url
        });
        
        // If it's a "City not found" error, try to find a nearby major city
        if (error.response?.status === 400 && error.response?.data?.message?.includes('City not found')) {
          console.log('City not found, attempting to find nearby major city...');
          throw new Error('CITY_NOT_FOUND');
        }
        
        throw new Error(`Weather API error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  },

  async getWeatherForCities(cities: string[]): Promise<Record<string, WeatherData>> {
    const weatherData: Record<string, WeatherData> = {};
    const errors: string[] = [];

    for (const city of cities) {
      try {
        weatherData[city] = await this.getWeatherForCity(city);
      } catch (error) {
        console.error(`Failed to fetch weather for ${city}:`, error);
        errors.push(city);
      }
    }

    if (errors.length > 0) {
      console.error(`Failed to fetch weather data for cities: ${errors.join(', ')}`);
    }

    return weatherData;
  },

  async reverseGeocode(lat: number, lon: number): Promise<{ city: string; country: string }> {
    try {
      console.log(`Reverse geocoding for coordinates: ${lat}, ${lon}`);
      const response = await axios.get(`${API_BASE_URL}/reverse`, {
        params: { lat, lon }
      });
      console.log('Reverse geocoding response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        throw new Error(`Reverse geocoding error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  },

  // Get weather for coordinates by trying nearby major cities
  async getWeatherForCoordinates(lat: number, lon: number): Promise<WeatherData> {
    try {
      // First try the reverse geocoding approach
      const { city } = await this.reverseGeocode(lat, lon);
      return await this.getWeatherForCity(city);
    } catch (error: any) {
      if (error.message === 'CITY_NOT_FOUND') {
        console.log('Attempting to find weather for coordinates using dynamically calculated nearby cities...');
        
        // Global approach: Detect region and provide appropriate major cities
        const globalCities = this.getCitiesByRegion(lat, lon);
        
        // Calculate distances and sort by proximity
        const citiesWithDistance = globalCities.map(city => ({
          ...city,
          distance: this.calculateDistance(lat, lon, city.lat, city.lon)
        })).sort((a, b) => a.distance - b.distance);
        
        console.log('Cities sorted by distance:', citiesWithDistance.map(c => `${c.name} (${c.distance.toFixed(1)}km)`));
        
        // Try cities in order of proximity
        for (const city of citiesWithDistance) {
          try {
            console.log(`Trying closest city: ${city.name} (${city.distance.toFixed(1)}km away)`);
            const weather = await this.getWeatherForCity(city.name);
            console.log(`Successfully found weather for ${city.name}`);
            return weather;
          } catch (cityError: any) {
            console.log(`Failed to get weather for ${city.name}:`, cityError.message);
            continue;
          }
        }
        
        throw new Error('Unable to find weather data for any nearby city');
      }
      throw error;
    }
  },

  // Get cities based on geographic region
  getCitiesByRegion(lat: number, lon: number): Array<{ name: string; lat: number; lon: number }> {
    // Define major cities by region
    const regions = {
      // Middle East & Israel
      middleEast: {
        bounds: { minLat: 25, maxLat: 37, minLon: 34, maxLon: 60 },
        cities: [
          { name: 'Rehovot', lat: 31.8961, lon: 34.8167 },
          { name: 'Tel Aviv', lat: 32.0853, lon: 34.7818 },
          { name: 'Jerusalem', lat: 31.7683, lon: 35.2137 },
          { name: 'Haifa', lat: 32.7940, lon: 34.9896 },
          { name: 'Amman', lat: 31.9454, lon: 35.9284 },
          { name: 'Beirut', lat: 33.8935, lon: 35.5016 }
        ]
      },
      // North America
      northAmerica: {
        bounds: { minLat: 25, maxLat: 70, minLon: -170, maxLon: -50 },
        cities: [
          { name: 'New York', lat: 40.7128, lon: -74.0060 },
          { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
          { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
          { name: 'Houston', lat: 29.7604, lon: -95.3698 },
          { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
          { name: 'Vancouver', lat: 49.2827, lon: -123.1207 }
        ]
      },
      // Europe
      europe: {
        bounds: { minLat: 35, maxLat: 70, minLon: -10, maxLon: 40 },
        cities: [
          { name: 'London', lat: 51.5074, lon: -0.1278 },
          { name: 'Paris', lat: 48.8566, lon: 2.3522 },
          { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
          { name: 'Rome', lat: 41.9028, lon: 12.4964 },
          { name: 'Madrid', lat: 40.4168, lon: -3.7038 },
          { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 }
        ]
      },
      // Asia
      asia: {
        bounds: { minLat: 10, maxLat: 55, minLon: 60, maxLon: 180 },
        cities: [
          { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
          { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
          { name: 'Seoul', lat: 37.5665, lon: 126.9780 },
          { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
          { name: 'Bangkok', lat: 1.3521, lon: 100.5018 },
          { name: 'Mumbai', lat: 19.0760, lon: 72.8777 }
        ]
      }
    };

    // Determine which region the coordinates fall into
    for (const [regionName, region] of Object.entries(regions)) {
      const { bounds, cities } = region;
      if (lat >= bounds.minLat && lat <= bounds.maxLat && 
          lon >= bounds.minLon && lon <= bounds.maxLon) {
        console.log(`Detected region: ${regionName}`);
        return cities;
      }
    }

    // Default fallback: return a mix of major world cities
    console.log('No specific region detected, using global fallback cities');
    return [
      { name: 'New York', lat: 40.7128, lon: -74.0060 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      { name: 'Cape Town', lat: -33.9249, lon: 18.4241 }
    ];
  },

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
};