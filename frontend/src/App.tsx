import { useState, useEffect } from 'react';
import WeatherPanel from './components/WeatherPanel';
import ChatToggle from './components/ChatToggle';
import ChatPanel from './components/ChatPanel';
import { WeatherData, GUICustomization } from './types/weather';
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
    
    customization.changes.forEach((change: any) => {
      const { targetElement, property, value } = change;
      console.log(`🎨 Processing change: ${property} = ${value} for ${targetElement}`);
      
      if (property === 'showIcons') {
        // Handle icon visibility
        console.log('🎯 Applying icon visibility change');
        applyIconVisibility(value === 'true');
      } else if (property === 'backgroundColor') {
        // Handle background color changes
        console.log(`🎨 Applying background color: ${value}`);
        
        if (value === 'reset') {
          console.log('🔄 Resetting background color');
          
          // Reset multiple elements
          document.body.style.removeProperty('background-color');
          document.body.style.removeProperty('background');
          document.documentElement.style.removeProperty('background-color');
          document.documentElement.style.removeProperty('background');
          
          // Also reset the app element
          const appElement = document.getElementById('app');
          if (appElement) {
            appElement.style.removeProperty('background-color');
            appElement.style.removeProperty('background');
            appElement.style.removeProperty('min-height');
            console.log('🔄 Reset app element styles');
          }
          
          // Remove injected CSS
          const styleElement = document.getElementById('custom-bg-style');
          if (styleElement) {
            styleElement.remove();
            console.log('🔄 Removed injected CSS');
          }
          
          // Also remove any Tailwind classes that might interfere
          document.body.classList.remove('bg-blue-500', 'bg-green-500', 'bg-white', 'bg-gray-100');
          document.documentElement.classList.remove('bg-blue-500', 'bg-green-500', 'bg-white', 'bg-gray-100');
          
          // Force a repaint to ensure the reset is visible
          document.body.style.display = 'none';
          document.body.offsetHeight; // Trigger reflow
          document.body.style.display = '';
          
          console.log('🔄 Background reset complete');
        } else {
          console.log(`🎨 Setting background color to: ${value}`);
          
          // Apply to multiple elements to ensure visibility
          const elements = [document.body, document.documentElement];
          
          elements.forEach((element, index) => {
            console.log(`🎨 Applying to element ${index + 1}:`, element);
            
            // Use multiple methods to ensure the color is applied
            element.style.setProperty('background-color', value, 'important');
            element.style.setProperty('background', value, 'important');
            
            // Also set as a CSS custom property
            element.style.setProperty('--custom-bg-color', value, 'important');
            
            // Force a repaint
            element.style.display = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.display = '';
            
            console.log(`🎨 Element ${index + 1} style after:`, element.style.cssText);
          });
          
          // Also apply to the root app div
          const appElement = document.getElementById('app');
          if (appElement) {
            console.log('🎨 Applying to app element:', appElement);
            appElement.style.setProperty('background-color', value, 'important');
            appElement.style.setProperty('background', value, 'important');
            appElement.style.setProperty('min-height', '100vh', 'important');
            console.log('🎨 App element style after:', appElement.style.cssText);
          }
          
          // Try a different approach - inject CSS directly
          let styleElement = document.getElementById('custom-bg-style');
          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-bg-style';
            document.head.appendChild(styleElement);
          }
          
          styleElement.textContent = `
            html, body, #app, .App {
              background-color: ${value} !important;
              background: ${value} !important;
            }
            
            /* Make sure no other elements are covering the background */
            .App {
              background-color: ${value} !important;
              background: ${value} !important;
              min-height: 100vh !important;
            }
            
            /* Override any potential covering elements */
            .weather-app-main {
              background-color: transparent !important;
              background: transparent !important;
            }
            
            .cities-container {
              background-color: transparent !important;
              background: transparent !important;
            }
          `;
          
          console.log('🎨 Injected CSS:', styleElement.textContent);
          
          // Debug: Check what was actually applied
          const computedStyle = window.getComputedStyle(document.body);
          console.log(`🎨 Computed background-color: ${computedStyle.backgroundColor}`);
          console.log(`🎨 Computed background: ${computedStyle.background}`);
          console.log(`🎨 Body element:`, document.body);
          console.log(`🎨 Body style:`, document.body.style.cssText);
          
          // Also check html element
          const htmlComputedStyle = window.getComputedStyle(document.documentElement);
          console.log(`🎨 HTML computed background-color: ${htmlComputedStyle.backgroundColor}`);
          console.log(`🎨 HTML computed background: ${htmlComputedStyle.background}`);
          
          // Check the App element
          const appElementCheck = document.querySelector('.App');
          if (appElementCheck) {
            const appComputedStyle = window.getComputedStyle(appElementCheck);
            console.log(`🎨 App computed background-color: ${appComputedStyle.backgroundColor}`);
            console.log(`🎨 App computed background: ${appComputedStyle.background}`);
            console.log(`🎨 App element:`, appElementCheck);
          }
          
          // Check if there are any covering elements
          const coveringElements = document.querySelectorAll('*');
          console.log(`🎨 Total elements on page: ${coveringElements.length}`);
          
          // Check for elements with background colors that might be covering
          const elementsWithBg = Array.from(coveringElements).filter(el => {
            const style = window.getComputedStyle(el);
            return style.backgroundColor !== 'rgba(0, 0, 0, 0)' && 
                   style.backgroundColor !== 'transparent' &&
                   style.backgroundColor !== 'rgb(59, 130, 246)';
          });
          
          console.log(`🎨 Elements with different background colors:`, elementsWithBg.map(el => ({
            element: el,
            tagName: el.tagName,
            className: el.className,
            backgroundColor: window.getComputedStyle(el).backgroundColor
          })));
        }
      } else if (property === 'color') {
        // Handle text color changes
        console.log(`🎨 Applying text color: ${value}`);
        
        if (value === 'reset') {
          // Reset text colors by removing inline styles from all text elements
          const allTextElements = document.querySelectorAll('.weather-panel, .weather-panel h2, .weather-panel .text-3xl, .weather-panel .text-gray-600, .weather-panel .text-gray-700, .weather-panel .text-gray-800, .weather-panel .text-gray-900');
          allTextElements.forEach(element => {
            const el = element as HTMLElement;
            el.style.removeProperty('color');
            console.log(`🎨 Reset color for element:`, el);
          });
          console.log('🎨 Text color reset complete');
        } else {
          // Apply text color to all text elements within weather panels
          const allTextElements = document.querySelectorAll('.weather-panel, .weather-panel h2, .weather-panel .text-3xl, .weather-panel .text-gray-600, .weather-panel .text-gray-700, .weather-panel .text-gray-800, .weather-panel .text-gray-900');
          allTextElements.forEach(element => {
            const el = element as HTMLElement;
            el.style.setProperty('color', value, 'important');
            console.log(`🎨 Applied color ${value} to element:`, el);
          });
          console.log(`🎨 Applied text color ${value} to ${allTextElements.length} text elements`);
        }
      } else if (property === 'sortBy') {
        // Handle city sorting
        console.log(`📊 Applying city sorting: ${value}`);
        if (value === 'reset') {
          // Reset city order to default (original order)
          console.log('📊 Resetting city order to default');
          resetCityOrder();
        } else {
          applyCitySorting(value);
        }
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
    console.log(`📊 Found ${cityPanels.length} city panels to sort`);
    
    if (sortType === 'temperature') {
      // Sort by temperature (coldest first)
      cityPanels.sort((a, b) => {
        // Look for the temperature in the div with text-3xl class
        const tempElementA = a.querySelector('.text-3xl.font-bold.text-gray-900');
        const tempElementB = b.querySelector('.text-3xl.font-bold.text-gray-900');
        
        const tempA = parseFloat(tempElementA?.textContent?.replace('°C', '') || '0');
        const tempB = parseFloat(tempElementB?.textContent?.replace('°C', '') || '0');
        
        console.log(`📊 Temperature A: ${tempA}, Temperature B: ${tempB}`);
        return tempA - tempB;
      });
    } else if (sortType === 'population') {
      // Sort by population (smallest first)
      cityPanels.sort((a, b) => {
        // Look for population in the span with text-gray-600 class
        const popElementA = a.querySelector('.text-gray-600.text-base.ml-2');
        const popElementB = b.querySelector('.text-gray-600.text-base.ml-2');
        
        const popA = parseInt(popElementA?.textContent?.replace(/[^\d]/g, '') || '0');
        const popB = parseInt(popElementB?.textContent?.replace(/[^\d]/g, '') || '0');
        
        console.log(`📊 Population A: ${popA}, Population B: ${popB}`);
        return popA - popB;
      });
    } else if (sortType === 'alphabetical') {
      // Sort alphabetically
      cityPanels.sort((a, b) => {
        const nameA = a.querySelector('h2')?.textContent?.split('(')[0].trim() || '';
        const nameB = b.querySelector('h2')?.textContent?.split('(')[0].trim() || '';
        
        console.log(`📊 Name A: ${nameA}, Name B: ${nameB}`);
        return nameA.localeCompare(nameB);
      });
    }

    console.log('📊 Re-appending sorted panels...');
    // Re-append sorted panels
    cityPanels.forEach((panel, index) => {
      console.log(`📊 Appending panel ${index + 1}:`, panel.querySelector('h2')?.textContent);
      citiesContainer.appendChild(panel);
    });
    
    console.log('📊 City sorting complete');
  };

  // Reset city order to default
  const resetCityOrder = () => {
    console.log('📊 Resetting city order to default');
    
    // Get the original city data in the order it was loaded
    const originalCityOrder = Object.keys(weatherData);
    console.log('📊 Original city order:', originalCityOrder);
    
    const citiesContainer = document.querySelector('.cities-container');
    if (!citiesContainer) {
      console.log('📊 Cities container not found for reset');
      return;
    }

    // Get all current panels and create a map for easy lookup
    const currentPanels = Array.from(citiesContainer.querySelectorAll('.weather-panel'));
    const panelMap = new Map();
    
    currentPanels.forEach(panel => {
      const cityName = panel.querySelector('h2')?.textContent?.split('(')[0].trim();
      if (cityName) {
        panelMap.set(cityName, panel);
      }
    });
    
    // Remove all current panels
    currentPanels.forEach(panel => panel.remove());
    
    // Re-add panels in original order
    originalCityOrder.forEach(cityName => {
      const cityPanel = panelMap.get(cityName);
      if (cityPanel) {
        citiesContainer.appendChild(cityPanel);
        console.log(`📊 Restored ${cityName} to original position`);
      }
    });
    
    console.log('📊 City order reset complete');
  };

  // Reset all customizations (comprehensive reset)
  const resetAllCustomizations = () => {
    console.log('🔄 Reset All button clicked - applying comprehensive reset');
    
    // Reset background color
    document.body.style.removeProperty('background-color');
    document.body.style.removeProperty('background');
    document.documentElement.style.removeProperty('background-color');
    document.documentElement.style.removeProperty('background');
    
    // Remove injected CSS
    const styleElement = document.getElementById('custom-bg-style');
    if (styleElement) {
      styleElement.remove();
      console.log('🔄 Removed injected CSS');
    }
    
    // Reset app element
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.style.removeProperty('background-color');
      appElement.style.removeProperty('background');
      appElement.style.removeProperty('min-height');
    }
    
    // Reset text colors
    const allTextElements = document.querySelectorAll('.weather-panel, .weather-panel h2, .weather-panel .text-3xl, .weather-panel .text-gray-600, .weather-panel .text-gray-700, .weather-panel .text-gray-800, .weather-panel .text-gray-900');
    allTextElements.forEach(element => {
      const el = element as HTMLElement;
      el.style.removeProperty('color');
    });
    
    // Reset icons
    applyIconVisibility(false);
    localStorage.removeItem('weatherIconsVisible');
    
    // Reset city order
    resetCityOrder();
    
    console.log('🔄 Comprehensive reset complete');
  };

  // Load weather data for demo cities
  useEffect(() => {
    const demoCities = ['London', 'Paris', 'New York', 'Tokyo', 'Sydney'];
    
    demoCities.forEach(city => {
      // Simulate weather data for demo
      const mockData: WeatherData = {
        daily: {
          time: Array.from({length: 7}, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date.toISOString().split('T')[0];
          }),
          weathercode: Array.from({length: 7}, () => Math.floor(Math.random() * 3) + 1),
          temperature_2m_max: Array.from({length: 7}, () => Math.floor(Math.random() * 30) + 5),
          temperature_2m_min: Array.from({length: 7}, () => Math.floor(Math.random() * 20) + 2),
          precipitation_sum: Array.from({length: 7}, () => Math.random() * 10)
        },
        location: {
          name: city,
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
        <button onClick={resetAllCustomizations} className="reset-btn">
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