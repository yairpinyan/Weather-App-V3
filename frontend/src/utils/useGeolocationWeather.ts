import { useEffect, useState, useRef } from 'react';
import { weatherService } from '../services/weatherService';
import type { WeatherData } from '../types/weather';

interface GeolocationWeatherResult {
  geoWeather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const GEO_PROMPTED_KEY = 'geo_prompted';
const GEO_COORDS_KEY = 'geo_coords';

export function useGeolocationWeather(): GeolocationWeatherResult {
  const [geoWeather, setGeoWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasPromptedGeo = useRef(false);

  useEffect(() => {
    if (localStorage.getItem(GEO_PROMPTED_KEY)) {
      hasPromptedGeo.current = true;
      // Try to load from cached coords
      const coords = localStorage.getItem(GEO_COORDS_KEY);
      if (coords) {
        const { lat, lon } = JSON.parse(coords);
        fetchWeatherByCoords(lat, lon);
      }
      return;
    }
    // Only prompt if not already prompted
    if (!hasPromptedGeo.current) {
      hasPromptedGeo.current = true;
      localStorage.setItem(GEO_PROMPTED_KEY, '1');
      if ('geolocation' in navigator) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            localStorage.setItem(GEO_COORDS_KEY, JSON.stringify({ lat, lon }));
            await fetchWeatherByCoords(lat, lon);
          },
          (err) => {
            setLoading(false);
            console.error('Geolocation error:', err);
            if (err.code === 1) {
              setError('Geolocation permission denied. Please allow location access.');
            } else if (err.code === 2) {
              setError('Location unavailable. Please try again.');
            } else if (err.code === 3) {
              setError('Location request timed out. Please try again.');
            } else {
              setError('Failed to get your location. Please try again.');
            }
          }
        );
      } else {
        setError('Geolocation is not supported in this browser.');
      }
    }
  }, []);

  async function fetchWeatherByCoords(lat: number, lon: number) {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching weather for coordinates:', lat, lon);
      
      // Use the new method that handles city not found errors
      const weather = await weatherService.getWeatherForCoordinates(lat, lon);
      console.log('Weather data received:', weather);
      
      setGeoWeather(weather);
    } catch (e) {
      console.error('Error in fetchWeatherByCoords:', e);
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      if (errorMessage === 'Unable to find weather data for any nearby city') {
        setError('Unable to find weather data for your location. Please try searching for a specific city instead.');
      } else {
        setError(`Failed to fetch weather for your location: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return { geoWeather, loading, error };
} 