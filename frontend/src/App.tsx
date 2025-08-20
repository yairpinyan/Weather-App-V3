import { useState, useEffect } from 'react';
import { WeatherPanel } from './components/WeatherPanel';
import { weatherService } from './services/weatherService';
import type { WeatherData, GUICustomization } from './types/weather';
import { useGeolocationWeather } from './utils/useGeolocationWeather';
import ChatPanel from './components/ChatPanel';
import ChatToggle from './components/ChatToggle';

const DEFAULT_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

function App() {
  const [cities, setCities] = useState<string[]>(DEFAULT_CITIES);
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [appliedCustomizations, setAppliedCustomizations] = useState<GUICustomization[]>([]);
  const { geoWeather, error: geoError } = useGeolocationWeather();

  useEffect(() => {
    loadDefaultCities();
  }, []);

  // Apply customizations to the DOM
  const applyCustomization = (customization: GUICustomization) => {
    console.log('🎨 Applying customization:', customization);
    console.log('🎨 Customization changes:', customization.changes);
    
    customization.changes.forEach((change, index) => {
      console.log(`🎨 Processing change ${index + 1}:`, change);
      
      try {
        if (change.targetElement === 'body') {
          // Apply to body element
          console.log(`🎨 Targeting body element with ${change.property}: ${change.value}`);
          document.body.style.setProperty(change.property, change.value, 'important');
          console.log(`✅ Applied ${change.property}: ${change.value} to body`);
          console.log(`✅ Body style now:`, document.body.style.getPropertyValue(change.property));
        } else {
          // Apply to specific CSS selectors
          console.log(`🎨 Targeting selector: ${change.targetElement}`);
          const elements = document.querySelectorAll(change.targetElement);
          console.log(`🎨 Found ${elements.length} elements for selector: ${change.targetElement}`);
          
          if (elements.length > 0) {
            elements.forEach((element, i) => {
              console.log(`🎨 Applying to element ${i + 1}:`, element);
              
              // Remove conflicting Tailwind background classes
              if (change.property === 'backgroundColor') {
                const elementEl = element as HTMLElement;
                
                if (change.value === 'reset') {
                  // Reset to original state
                  elementEl.style.removeProperty('background-color');
                  elementEl.classList.add('bg-gray-100');
                  console.log(`🔄 Reset background to original state`);
                } else {
                  // Apply custom color
                  elementEl.classList.remove('bg-gray-100', 'bg-white', 'bg-blue-100', 'bg-red-100', 'bg-green-100');
                  console.log(`🎨 Removed conflicting Tailwind background classes`);
                  
                  // Try multiple approaches to ensure the color is applied
                  elementEl.style.setProperty('background-color', change.value, 'important');
                  elementEl.style.setProperty('background', change.value, 'important');
                  console.log(`✅ Applied background-color: ${change.value} to element ${i + 1}`);
                  console.log(`✅ Applied background: ${change.value} to element ${i + 1}`);
                  
                  // Also try setting body background as fallback
                  document.body.style.setProperty('background-color', change.value, 'important');
                  console.log(`✅ Applied background-color: ${change.value} to body as fallback`);
                  
                  // Debug: Check what CSS was actually applied
                  console.log(`🔍 Element style after application:`, elementEl.style.cssText);
                  console.log(`🔍 Computed backgroundColor:`, window.getComputedStyle(elementEl).backgroundColor);
                  console.log(`🔍 Computed background:`, window.getComputedStyle(elementEl).background);
                  console.log(`🔍 Body computed backgroundColor:`, window.getComputedStyle(document.body).backgroundColor);
                  
                  // Add visual feedback - temporary highlight
                  elementEl.style.transition = 'background-color 0.3s ease';
                  elementEl.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
                  setTimeout(() => {
                    elementEl.style.boxShadow = '';
                  }, 1000);
                  console.log(`🎨 Added visual feedback effect`);
                }
              } else {
                // Handle other properties normally
                (element as HTMLElement).style.setProperty(change.property, change.value, 'important');
                console.log(`✅ Applied ${change.property}: ${change.value} to element ${i + 1}`);
              }
            });
          } else {
            console.warn(`⚠️ No elements found for selector: ${change.targetElement}`);
          }
        }
      } catch (err) {
        console.error(`❌ Failed to apply ${change.property}: ${change.value}`, err);
      }
    });
  };

  // Reset background to original state
  const resetBackground = () => {
    const mainElement = document.getElementById('weather-app-main');
    if (mainElement) {
      mainElement.style.removeProperty('background-color');
      mainElement.classList.add('bg-gray-100');
      console.log('🎨 Reset background to original state');
    }
  };

  // Handle customizations from AI chat
  const handleCustomization = (customizations: GUICustomization[]) => {
    console.log('🎨 Received customizations:', customizations);
    console.log('🎨 Number of customizations:', customizations.length);
    
    if (customizations && customizations.length > 0) {
      console.log('🎨 Processing customizations...');
      
      // Apply each customization
      customizations.forEach((customization, index) => {
        console.log(`🎨 Processing customization ${index + 1}:`, customization);
        applyCustomization(customization);
      });
      
      // Store applied customizations for potential undo functionality
      setAppliedCustomizations(prev => [...prev, ...customizations]);
      
      console.log('✅ All customizations applied successfully');
    } else {
      console.warn('⚠️ No customizations received or empty array');
    }
  };

  const loadDefaultCities = async () => {
    try {
      console.log('Loading default cities...');
      setIsLoading(true);
      const data = await weatherService.getWeatherForCities(DEFAULT_CITIES);
      console.log('Received weather data:', data);
      setWeatherData(data);
      // Sort cities by population after loading weather data
      sortCitiesByPopulation(Object.keys(data), data);
    } catch (err) {
      console.error('Failed to load default cities:', err);
      setError('Failed to load default cities');
    } finally {
      setIsLoading(false);
    }
  };

  const sortCitiesByPopulation = (cityList: string[], data: Record<string, WeatherData>) => {
    const sortedCities = [...cityList].sort((a, b) => {
      const popA = data[a]?.location?.population || 0;
      const popB = data[b]?.location?.population || 0;
      return popB - popA; // Sort in descending order
    });
    setCities(sortedCities);
  };

  const handleAddCity = async () => {
    if (searchInput.trim()) {
      const newCity = searchInput.trim();
      
      // Check for duplicate cities (case-insensitive)
      if (cities.some(city => city.toLowerCase() === newCity.toLowerCase())) {
        setError(`${newCity} is already in your forecast list`);
        return;
      }

      try {
        setIsLoading(true);
        const data = await weatherService.getWeatherForCity(newCity);
        const updatedWeatherData = {
          ...weatherData,
          [newCity]: data
        };
        setWeatherData(updatedWeatherData);
        // Sort all cities including the new one
        sortCitiesByPopulation([...cities, newCity], updatedWeatherData);
        setSearchInput('');
        setError(null);
      } catch (err) {
        setError(`Failed to load weather data for ${newCity}`);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCity();
    }
  };

  // Helper to check if geo city is already in the list (case-insensitive)
  const isGeoCityInList = geoWeather && cities.some(city => city.toLowerCase() === geoWeather.location.name.toLowerCase());

  return (
    <div id="weather-app-main" className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 via-pink-500 to-blue-500 animate-gradient text-transparent bg-clip-text">Global Weather Forecast</h1>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCity}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-200"
          >
            {isLoading ? 'Loading...' : 'Add City'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {geoError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {geoError}
          </div>
        )}

        <div className="space-y-4">
          {/* My Location card, if available and not duplicated */}
          {geoWeather && !isGeoCityInList && (
            <div className="relative">
              <div className="absolute left-2 top-2 text-blue-500 text-xl" title="My Location">📍</div>
              <WeatherPanel
                key="geo-location"
                cityName={`My Location (${geoWeather.location.name})`}
                data={geoWeather}
              />
            </div>
          )}
          {/* Render other cities */}
          {cities.map((city) => {
            console.log(`Rendering city: ${city}, has data:`, !!weatherData[city]);
            return weatherData[city] ? (
              <WeatherPanel
                key={city}
                cityName={city}
                data={weatherData[city]}
              />
            ) : (
              <div key={city} className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* AI Chat Interface */}
      <ChatToggle isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />
      <ChatPanel 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(false)}
        onCustomization={handleCustomization}
        onReset={resetBackground}
      />
    </div>
  );
}

export default App; 