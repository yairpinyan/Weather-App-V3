import React, { useState, useEffect } from 'react';
import WeatherPanel from './components/WeatherPanel';
import ChatToggle from './components/ChatToggle';
import ChatPanel from './components/ChatPanel';
import { WeatherData } from './types/weather';
import { GUICustomization } from './types/chat';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [customizations, setCustomizations] = useState<GUICustomization[]>([]);

  // Apply icon visibility changes
  const applyIconVisibility = (showIcons: boolean) => {
    console.log(`🎯 Setting icon visibility to: ${showIcons}`);

    const weatherPanels = document.querySelectorAll('.weather-panel');
    console.log(`🎯 Found ${weatherPanels.length} weather panels`);

    if (weatherPanels.length === 0) {
      console.log('🎯 No weather panels found yet, will retry later');
      return;
    }

    weatherPanels.forEach((panel, index) => {
      const panelEl = panel as HTMLElement;

      if (showIcons) {
        panelEl.classList.add('show-weather-icons');
        console.log(`🎯 Added show-weather-icons class to panel ${index + 1}`);
      } else {
        panelEl.classList.remove('show-weather-icons');
        console.log(`🎯 Removed show-weather-icons class from panel ${index + 1}`);
      }
    });

    // Also directly target weather icons and set their styles
    const weatherIcons = document.querySelectorAll('.weather-icon');
    console.log(`🎯 Found ${weatherIcons.length} weather icons`);

    weatherIcons.forEach((icon, index) => {
      const iconEl = icon as HTMLElement;
      if (showIcons) {
        // Show icons by removing ALL inline styles that might be blocking visibility
        iconEl.style.removeProperty('opacity');
        iconEl.style.removeProperty('visibility');
        iconEl.style.removeProperty('display');
        iconEl.style.removeProperty('background');
        iconEl.style.removeProperty('background-color');
        // Force remove any remaining inline styles that might interfere
        iconEl.style.cssText = '';
        console.log(`🎯 Completely cleared all inline styles from icon ${index + 1}, letting CSS show it`);

        // Debug: Check what CSS classes and computed styles are applied
        const computedStyle = window.getComputedStyle(iconEl);
        console.log(`🎯 Icon ${index + 1} debug info:`, {
          element: iconEl,
          classes: iconEl.className,
          computedOpacity: computedStyle.opacity,
          computedVisibility: computedStyle.visibility,
          computedDisplay: computedStyle.display,
          parentClasses: iconEl.parentElement?.className
        });
      } else {
        // Hide icons with multiple methods
        iconEl.style.opacity = '0';
        iconEl.style.visibility = 'hidden';
        iconEl.style.display = 'none';
        console.log(`🎯 Set icon ${index + 1} to hidden with multiple methods`);
      }
    });

    // Store the preference in localStorage for persistence (only when showing icons)
    if (showIcons) {
      localStorage.setItem('weatherIconsVisible', 'true');
      console.log(`🎯 Saved icon visibility preference: visible`);
    } else {
      // When hiding icons, remove the preference so they stay hidden on refresh
      localStorage.removeItem('weatherIconsVisible');
      console.log(`🎯 Removed icon visibility preference - icons will stay hidden on refresh`);
    }
  };

  // Apply customization changes
  const applyCustomization = (customization: GUICustomization) => {
    console.log('🎨 Applying customization:', customization);
    
    customization.changes.forEach(change => {
      const { targetElement, property, value } = change;
      
      if (property === 'showIcons') {
        // Handle icon visibility
        applyIconVisibility(value === 'true');
      } else if (property === 'backgroundColor') {
        // Handle background color changes
        if (value === 'reset') {
          document.body.style.backgroundColor = '';
        } else {
          document.body.style.backgroundColor = value;
        }
      } else if (property === 'color') {
        // Handle text color changes
        const panels = document.querySelectorAll(targetElement);
        panels.forEach(panel => {
          const panelEl = panel as HTMLElement;
          if (value === 'reset') {
            panelEl.style.color = '';
          } else {
            panelEl.style.color = value;
          }
        });
      } else if (property === 'sortBy') {
        // Handle city sorting
        applyCitySorting(value);
      }
    });
  };

  // Apply city sorting
  const applyCitySorting = (sortType: string) => {
    console.log('📊 Applying city sorting:', sortType);
    
    const citiesContainer = document.querySelector('.cities-container');
    if (!citiesContainer) {
      console.log('📊 Cities container not found');
      return;
    }

    const cityPanels = Array.from(citiesContainer.querySelectorAll('.weather-panel'));
    
    if (sortType === 'temperature') {
      // Sort by temperature (coldest first)
      cityPanels.sort((a, b) => {
        const tempA = parseFloat(a.querySelector('.temperature')?.textContent || '0');
        const tempB = parseFloat(b.querySelector('.temperature')?.textContent || '0');
        return tempA - tempB;
      });
    } else if (sortType === 'population') {
      // Sort by population (smallest first)
      cityPanels.sort((a, b) => {
        const popA = parseInt(a.querySelector('.population')?.textContent?.replace(/\D/g, '') || '0');
        const popB = parseInt(b.querySelector('.population')?.textContent?.replace(/\D/g, '') || '0');
        return popA - popB;
      });
    } else if (sortType === 'alphabetical') {
      // Sort alphabetically
      cityPanels.sort((a, b) => {
        const nameA = a.querySelector('h2')?.textContent || '';
        const nameB = b.querySelector('h2')?.textContent || '';
        return nameA.localeCompare(nameB);
      });
    }

    // Re-append sorted panels
    cityPanels.forEach(panel => {
      citiesContainer.appendChild(panel);
    });
  };

  // Reset background
  const resetBackground = () => {
    document.body.style.backgroundColor = '';
    applyIconVisibility(false);
    localStorage.removeItem('weatherIconsVisible');
  };

  // Load weather data for demo cities
  useEffect(() => {
    const demoCities = ['London', 'Paris', 'New York', 'Tokyo', 'Sydney'];
    
    demoCities.forEach(city => {
      // Simulate weather data for demo
      const mockData: WeatherData = {
        current: {
          temperature: Math.floor(Math.random() * 30) + 5,
          weathercode: Math.floor(Math.random() * 3) + 1,
          time: new Date().toISOString()
        },
        daily: {
          time: Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date.toISOString().split('T')[0];
          }),
          weathercode: Array.from({length: 7}, () => Math.floor(Math.random() * 3) + 1),
          temperature_2m_max: Array.from({length: 7}, () => Math.floor(Math.random() * 30) + 5),
          temperature_2m_min: Array.from({length: 7}, () => Math.floor(Math.random() * 20) + 2)
        },
        location: {
          name: city,
          country: 'Demo Country',
          population: Math.floor(Math.random() * 10000000) + 100000
        }
      };
      
      setWeatherData(prev => ({ ...prev, [city]: mockData }));
    });
  }, []);

  // Initial setup for icon visibility
  useEffect(() => {
    if (Object.keys(weatherData).length === 0) {
      console.log('🎯 No weather data yet, skipping icon visibility setup');
      return;
    }

    console.log('🎯 Weather data loaded, setting up icon visibility...');

    // Force hide all weather icons immediately on page load as backup
    const forceHideIcons = () => {
      const weatherIcons = document.querySelectorAll('.weather-icon');
      weatherIcons.forEach((icon) => {
        const iconEl = icon as HTMLElement;
        // Use minimal inline styles that won't interfere with CSS show/hide
        iconEl.style.opacity = '0';
        iconEl.style.visibility = 'hidden';
        // Don't set display: none or other aggressive styles
        console.log('🎯 Force hidden icon with minimal inline styles:', iconEl);
      });
      console.log('🎯 Force hidden all weather icons on page load');
    };

    // Try to hide icons immediately
    forceHideIcons();
    // Also try after a short delay
    setTimeout(forceHideIcons, 100);
    setTimeout(forceHideIcons, 500);

    // Set up MutationObserver to catch any new icons added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if the added element is a weather icon
              if (element.classList && element.classList.contains('weather-icon')) {
                console.log('🎯 New weather icon detected, hiding it immediately');
                (element as HTMLElement).style.opacity = '0';
                (element as HTMLElement).style.visibility = 'hidden';
                // Use minimal inline styles that won't interfere with CSS show/hide
              }
              // Also check for weather icons inside added elements
              const icons = element.querySelectorAll('.weather-icon');
              icons.forEach((icon) => {
                console.log('🎯 Weather icon found in new element, hiding it immediately');
                (icon as HTMLElement).style.opacity = '0';
                (icon as HTMLElement).style.visibility = 'hidden';
                // Use minimal inline styles that won't interfere with CSS show/hide
              });
            }
          });
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('🎯 MutationObserver set up to catch new weather icons');

    // Cleanup
    return () => observer.disconnect();
  }, []); // Run only once on mount

  // Separate useEffect for icon visibility to ensure DOM is ready
  useEffect(() => {
    if (Object.keys(weatherData).length === 0) {
      console.log('🎯 No weather data yet, skipping icon visibility setup');
      return;
    }

    console.log('🎯 Weather data loaded, setting up icon visibility...');

    // Wait for weather panels to be rendered before setting icon visibility
    const timer = setTimeout(() => {
      console.log('🎯 Timer 1: Setting default icon state: hidden');
      applyIconVisibility(false);

      // Only restore icon visibility preference if user explicitly set it
      const iconsVisible = localStorage.getItem('weatherIconsVisible');
      if (iconsVisible === 'true') {
        console.log('🎯 Restoring user icon visibility preference: visible');
        applyIconVisibility(true);
      }
    }, 1500); // Wait 1.5 seconds for components to render

    // If panels still aren't found, retry after another delay
    const retryTimer = setTimeout(() => {
      console.log('🎯 Timer 2: Retrying icon visibility setup...');
      applyIconVisibility(false);

      const iconsVisible = localStorage.getItem('weatherIconsVisible');
      if (iconsVisible === 'true') {
        applyIconVisibility(true);
      }
    }, 3000); // Retry after 3 seconds

    // Final retry with longer delay
    const finalTimer = setTimeout(() => {
      console.log('🎯 Timer 3: Final attempt to set icon visibility...');
      applyIconVisibility(false);

      const iconsVisible = localStorage.getItem('weatherIconsVisible');
      if (iconsVisible === 'true') {
        applyIconVisibility(true);
      }
    }, 5000); // Final attempt after 5 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(retryTimer);
      clearTimeout(finalTimer);
    };
  }, [weatherData]); // Run when weather data changes (indicating components are rendered)

  // Handle new customizations from chat
  const handleNewCustomizations = (newCustomizations: GUICustomization[]) => {
    console.log('🎨 Received new customizations:', newCustomizations);
    
    newCustomizations.forEach(customization => {
      applyCustomization(customization);
      setCustomizations(prev => [...prev, customization]);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
        <button onClick={resetBackground} className="reset-btn">
          Reset All
        </button>
      </header>
      
      <main className="weather-app-main">
        <div className="cities-container">
          {Object.entries(weatherData).map(([cityName, data]) => (
            <WeatherPanel
              key={cityName}
              cityName={cityName}
              data={data}
            />
          ))}
        </div>
      </main>

      <ChatToggle 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
      
      {isChatOpen && (
        <ChatPanel 
          onCustomizations={handleNewCustomizations}
          customizations={customizations}
        />
      )}
    </div>
  );
}

export default App; 