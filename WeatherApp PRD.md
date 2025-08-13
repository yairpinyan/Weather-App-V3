# Weather Web Application - Product Requirements Document (PRD)

## 1. Overview
A responsive web application that allows users to view and compare 7-day weather forecasts for multiple cities worldwide. Users can search for cities, add them to their forecast list, and view detailed daily weather information, including temperature, weather conditions, and population data for each city.

---

## 2. Target Users
- General public interested in weather forecasts
- Travelers and commuters
- Users comparing weather across cities

---

## 3. Core Features
### 3.1. City Weather Dashboard
- Display a list of cities with their 7-day weather forecast.
- Default cities shown on first load: London, New York, Tokyo, Paris, Sydney.
- Cities are sorted by population (descending).

### 3.2. Add City
- Users can search for and add any city worldwide.
- Prevents duplicate city entries (case-insensitive).
- Handles invalid or non-existent city names with user-friendly error messages.

### 3.3. Weather Details
- Each city panel can be expanded to show daily weather details:
  - Date (weekday, month, day)
  - Weather condition (icon and description)
  - Max/Min temperature (°C)
  - Precipitation
- City population is displayed next to the city name.

### 3.4. Responsive UI
- Mobile-friendly and desktop-optimized layout.
- Modern, clean design using Tailwind CSS.

### 3.5. Error Handling
- User-friendly error messages for network/API errors, invalid cities, and duplicates.
- Loading indicators during data fetches.

### 3.6. Geolocation-based Weather Fetching
- On first load, before any city is added, the app requests browser geolocation permission.
- If granted, reverse-geocode coordinates to a city name and fetch weather as for manual cities.
- Prepend a special card titled **"My Location"** (with pin icon) to the city list.
- Store coordinates in state/localStorage to avoid repeated prompts.
- If denied or error, fail silently (no modal, no error message).

### 3.7. Hourly Forecast Tab
- Add a new tab or creative UI element to display the next 24 hours of forecast for the selected city.
- Hourly data includes: time, temperature, weather condition (icon/description), precipitation probability, wind speed.
- Tab is accessible from each city's panel/card.

### 3.8. Weather Alerts & Notifications
- Detect and display weather alerts for extreme conditions (e.g., storms, heatwaves, heavy precipitation) for any city.
- Alerts are shown as banners or notifications in the UI, with clear severity indication (color/icon).
- Optionally, allow users to dismiss or mute alerts for a session.

---

## 4. User Stories
- As a user, I want to see the weather forecast for several major cities by default.
- As a user, I want to search for and add a new city to my forecast list.
- As a user, I want to see detailed daily weather for each city.
- As a user, I want to be notified if I enter an invalid city or try to add a duplicate.
- As a user, I want the app to work well on both desktop and mobile devices.
- As a user, I want to see the weather for my current location automatically if I grant permission.
- As a user, I want to view hourly forecasts for any city in a dedicated tab or section.
- As a user, I want to be notified of extreme weather conditions for any city I'm tracking.

---

## 5. Data Model
### 5.1. WeatherData
```
WeatherData {
  location: {
    name: string,
    population?: number
  },
  daily: {
    time: string[], // ISO date strings
    weathercode: number[], // Weather condition codes
    temperature_2m_max: number[], // Max temp per day (°C)
    temperature_2m_min: number[], // Min temp per day (°C)
    precipitation_sum: number[] // Precipitation per day
  }
}
```

### 5.2. HourlyWeatherData
```
HourlyWeatherData {
  time: string[], // ISO date strings, hourly
  temperature_2m: number[], // Hourly temperature (°C)
  weathercode: number[], // Hourly weather condition codes
  precipitation_probability: number[], // Hourly precipitation probability (%)
  windspeed_10m: number[] // Hourly wind speed (km/h)
}
```

### 5.3. WeatherAlert
```
WeatherAlert {
  event: string, // e.g., "Storm Warning"
  description: string,
  severity: 'advisory' | 'watch' | 'warning',
  start: string, // ISO datetime
  end: string // ISO datetime
}
```

---

## 6. API Endpoints
### 6.1. Get Weather for a City
- `GET /api/weather/:city`
  - Returns: `{ location, weather }` for the specified city
  - Errors: 400 for invalid city

### 6.2. Get Weather for Multiple Cities
- `POST /api/weather/bulk`
  - Body: `{ cities: string[] }`
  - Returns: `{ [city: string]: { location, weather } }`
  - Errors: 400 for invalid input or if any city is invalid

### 6.3. Reverse Geocoding
- `GET /api/reverse?lat={lat}&lon={lon}`
  - Returns: `{ city: string, country: string }`
  - Errors: 400 for invalid coordinates

### 6.4. Get Hourly Weather
- `GET /api/weather/:city/hourly`
  - Returns: `HourlyWeatherData` for the specified city
  - Errors: 400 for invalid city

### 6.5. Get Weather Alerts
- `GET /api/weather/:city/alerts`
  - Returns: `WeatherAlert[]` for the specified city
  - Errors: 400 for invalid city

---

## 7. External Dependencies
- [Open-Meteo API](https://open-meteo.com/) for weather and geocoding data

---

## 8. Technology Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express, TypeScript, node-fetch
- **Testing:** Playwright (frontend), Jest (backend)

---

## 9. Testing Requirements
### 9.1. Frontend
- UI loads with default cities
- Can add a new city and display its weather
- Expanding a city panel shows daily details
- Handles invalid city names and duplicate entries
- Geolocation prompt appears only on first load, and only if no cities are added.
- If permission granted, "My Location" card appears with correct city and weather.
- If denied, no errors or extra cards appear.
- Hourly forecast tab displays correct data for selected city.
- Weather alerts are shown for cities with extreme conditions, with correct severity and dismiss/mute options.

### 9.2. Backend
- API returns correct data structure for valid cities
- Bulk endpoint returns data for multiple cities
- Handles invalid city names and input errors

---

## 10. Accessibility & UX
- All interactive elements are keyboard accessible
- Clear focus states and error messages
- Responsive design for all device sizes

---

## 11. Future Enhancements (Optional)
- User authentication and saved preferences
- Support for temperature units (°C/°F)
- Weather maps and radar
- Historical weather data
- Localization and multi-language support

---

## 12. Non-Functional Requirements
- Fast load times and smooth UI transitions
- Robust error handling and logging
- Secure API endpoints
- Scalable to support many users

---

## 13. Glossary
- **WeatherCode:** Numeric code representing weather condition (see Open-Meteo docs)
- **Population:** City population from geocoding API

---

## 14. References
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev/)
- [Jest Testing](https://jestjs.io/) 