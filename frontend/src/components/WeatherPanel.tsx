import React, { useState } from 'react';
import { WeatherData } from '../types/weather';
import { weatherCodeToIcon } from '../utils/weatherCodes';

interface WeatherPanelProps {
  cityName: string;
  data: WeatherData;
}

const WeatherPanel: React.FC<WeatherPanelProps> = ({ cityName, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="weather-panel bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl weather-icon">
            {weatherCodeToIcon(data.daily.weathercode[0])}
          </span>
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
        </div>
        <span
          className={`text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          onClick={toggleExpanded}
          style={{ cursor: 'pointer' }}
        >
          ▼
        </span>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">
          {data.daily.temperature_2m_max[0]}°C
        </div>
        <div className="text-gray-600 mt-1">
          {new Date(data.daily.time[0]).toLocaleDateString()}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">7-Day Forecast</h3>
          <div className="space-y-2">
            {data.daily.time.map((date, index) => (
              <div
                key={date}
                className="flex items-center space-x-4 p-2 hover:bg-white rounded transition-colors"
              >
                <span className="text-2xl w-8 weather-icon">
                  {weatherCodeToIcon(data.daily.weathercode[index])}
                </span>
                <span className="text-gray-700 min-w-[80px]">
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-gray-600">
                  {data.daily.temperature_2m_max[index]}°C / {data.daily.temperature_2m_min[index]}°C
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPanel; 