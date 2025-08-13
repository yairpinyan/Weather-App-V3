import { useState, useCallback } from 'react';
import type { WeatherData } from '../types/weather';

interface WeatherPanelProps {
  cityName: string;
  data: WeatherData;
}

export function WeatherPanel({ cityName, data }: WeatherPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(`Rendering WeatherPanel for ${cityName}:`, { isExpanded, data });

  // Validate data structure
  if (!data || !data.daily || !Array.isArray(data.daily.time)) {
    console.error('Invalid weather data structure:', data);
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-red-500">Error: Invalid weather data</div>
      </div>
    );
  }

  const weatherCodeToIcon = (code: number): string => {
    switch (code) {
      case 0: return '☀️';   // Clear sky
      case 1: return '🌤️';   // Mainly clear
      case 2: return '⛅';    // Partly cloudy
      case 3: return '☁️';    // Overcast
      case 45: case 48: return '🌫️';  // Fog
      case 51: case 53: case 55: return '🌧️';  // Drizzle
      case 56: case 57: return '🌨️';  // Freezing drizzle
      case 61: case 63: case 65: return '🌧️';  // Rain
      case 66: case 67: return '🌨️';  // Freezing Rain
      case 71: case 73: case 75: return '🌨️';  // Snow
      case 77: return '🌨️';  // Snow grains
      case 80: case 81: case 82: return '🌧️';  // Rain showers
      case 85: case 86: return '🌨️';  // Snow showers
      case 95: return '⛈️';   // Thunderstorm
      case 96: case 99: return '⛈️';  // Thunderstorm with hail
      default: return '❓';   // Unknown
    }
  };

  const handleClick = useCallback((e: React.MouseEvent) => {
    console.log('Panel clicked, current isExpanded:', isExpanded);
    e.preventDefault();
    e.stopPropagation();
    
    setIsExpanded(prev => !prev);
  }, [isExpanded]);

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${isExpanded ? 'shadow-md' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {cityName}
            {typeof data.location?.population === 'number' && data.location.population >= 10000 ? (
              <span className="text-gray-600 text-base ml-2">
                (Population: {data.location.population.toLocaleString()})
              </span>
            ) : (
              <span className="text-gray-600 text-base ml-2">
                (Population: N/A)
              </span>
            )}
          </h2>
          <span 
            className={`text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </div>
      </div>

      {isExpanded && data.daily && (
        <div 
          className="border-t border-gray-100 bg-gray-50 p-4"
          onClick={e => e.stopPropagation()}
        >
          {data.daily.time.map((date, index) => (
            <div 
              key={date} 
              className="flex items-center space-x-4 p-2 hover:bg-white rounded transition-colors"
            >
              <span className="text-2xl w-8">
                {weatherCodeToIcon(data.daily.weathercode[index])}
              </span>
              <span className="flex-1 font-medium text-gray-700">
                {new Date(date).toLocaleDateString(undefined, { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              <span className="text-right whitespace-nowrap">
                <span className="text-red-500">{Math.round(data.daily.temperature_2m_max[index])}°C</span>
                {' / '}
                <span className="text-blue-500">{Math.round(data.daily.temperature_2m_min[index])}°C</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 