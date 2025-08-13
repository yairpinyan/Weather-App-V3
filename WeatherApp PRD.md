##Touched by Myself manually, agin and again and again

# Weather Web Application - Product Requirements Document (PRD)

## 1. Overview
A responsive web application that allows users to view and compare 7-day weather forecasts for multiple cities worldwide. Users can search for cities, add them to their forecast list, and view detailed daily weather information, including temperature, weather conditions, and population data for each city. The app features an innovative AI-powered chat interface that allows users to customize the GUI dynamically through natural language commands.

---

## 2. Target Users
- General public interested in weather forecasts
- Travelers and commuters
- Users comparing weather across cities
- Users who want personalized, customizable weather interfaces

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

### 3.9. AI-Powered GUI Customization Chat Interface

#### Overview
Add an intelligent chat interface that allows users to interact with an LLM to dynamically modify the weather app's visual appearance and layout through natural language commands.

#### 3.9.1. Chat Interface Components
- **Fixed Chat Panel**: Always-visible chat interface positioned as a sidebar or bottom panel
- **Toggle Visibility**: Collapsible chat panel with minimize/maximize functionality
- **Message History**: Persistent conversation history during the session
- **Typing Indicators**: Visual feedback when AI is processing requests
- **Clear Chat**: Option to reset conversation history

#### 3.9.2. Supported GUI Modification Categories

##### Visual Styling
- **Colors**: Change background colors, text colors, border colors for any UI element
- **Icons**: Add, remove, or change icons next to city names, weather conditions, or UI elements
- **Typography**: Modify font sizes, weights, styles for headers, labels, or content
- **Spacing**: Adjust margins, padding, gaps between elements
- **Borders**: Add, remove, or modify borders, shadows, and visual effects

##### Layout & Organization
- **City Ordering**: Reorder cities by custom criteria (alphabetical, population, temperature, user preference)
- **Panel Layout**: Change from list view to grid view, adjust column counts
- **Element Visibility**: Show/hide specific UI components or information fields
- **Grouping**: Organize cities by regions, temperature ranges, or weather conditions

##### Interactive Elements
- **Hover Effects**: Add custom hover states and transitions
- **Animations**: Apply entrance animations, loading effects, or micro-interactions
- **Button Styles**: Customize appearance of "Add City" and other interactive elements

#### 3.9.3. Natural Language Processing Requirements

##### Command Understanding
The AI must interpret various natural language patterns:
```
Examples:
- "Add a sun icon next to Tokyo"
- "Make London's header blue"
- "Sort cities by temperature, coldest first"
- "Change the background to dark theme"
- "Add a storm warning icon to cities with alerts"
- "Make New York bigger and more prominent"
- "Group cities by continent"
- "Change all temperatures to red color"
```

##### Intent Classification
The system must identify these intent categories:
- **ADD**: Adding visual elements (icons, borders, effects)
- **MODIFY**: Changing existing properties (colors, sizes, styles)
- **REORDER**: Changing sequence or organization
- **REMOVE**: Deleting visual elements or reverting changes
- **THEME**: Applying broader style changes across multiple elements

##### Entity Extraction
Extract key entities from user messages:
- **Target Element**: Which UI component to modify (city name, header, button, etc.)
- **Property**: What aspect to change (color, icon, size, position)
- **Value**: The desired new value (specific color, icon type, ordering criteria)

#### 3.9.4. Technical Implementation

##### State Management
```typescript
interface GUICustomization {
  id: string;
  timestamp: Date;
  description: string;
  changes: {
    targetElement: string; // CSS selector or component identifier
    property: string; // CSS property or component prop
    value: string; // New value to apply
    previousValue?: string; // For undo functionality
  }[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  appliedCustomizations?: string[]; // IDs of customizations applied
}
```

##### LLM Integration
- **API Endpoint**: `/api/chat/customize`
- **Request Body**: `{ message: string, currentCustomizations: GUICustomization[] }`
- **Response**: `{ response: string, customizations: GUICustomization[], success: boolean }`

##### Dynamic Style Application
- Generate and inject CSS classes or inline styles dynamically
- Update React component props and state based on customizations
- Maintain a customization registry for undo/redo functionality

#### 3.9.5. User Experience Flow
1. **Initial State**: Chat panel shows welcome message with example commands
2. **User Input**: User types natural language customization request
3. **Processing**: Loading indicator while LLM processes the request
4. **AI Response**: Conversational confirmation of understood changes
5. **GUI Update**: Visual changes applied immediately to the interface
6. **Feedback**: Option to undo, modify, or continue with more changes

#### 3.9.6. Error Handling & Validation

##### Invalid Requests
- Gracefully handle ambiguous or impossible requests
- Provide suggestions for alternative approaches
- Ask clarifying questions when intent is unclear

##### Technical Limitations
- Validate that requested changes are technically feasible
- Prevent changes that would break functionality or accessibility
- Maintain minimum contrast ratios and usability standards

##### Fallback Responses
```
Examples:
- "I understand you want to change Tokyo's appearance, but could you be more specific about what aspect you'd like to modify?"
- "I can't remove the city name as it's essential for identification. Would you like to style it differently instead?"
- "That color might make the text hard to read. How about this alternative shade?"
```

#### 3.9.7. Accessibility Considerations
- Ensure all AI-applied changes maintain WCAG 2.1 AA compliance
- Preserve keyboard navigation and screen reader compatibility
- Validate color contrast ratios for any color modifications
- Maintain semantic HTML structure regardless of visual changes

#### 3.9.8. Data Persistence
- **Session Storage**: Customizations persist during browser session
- **Local Storage**: Option to save favorite customizations locally
- **Export/Import**: Allow users to save and share customization themes
- **Reset Functionality**: Easy way to revert to original design

#### 3.9.9. Performance Considerations
- Debounce rapid customization requests
- Efficiently batch DOM updates
- Minimize re-renders when applying multiple changes
- Optimize CSS injection and cleanup

#### 3.9.10. Testing Requirements

##### Functional Testing
- Verify AI correctly interprets common customization requests
- Test all supported modification types (colors, icons, ordering, etc.)
- Validate undo/redo functionality works properly
- Ensure customizations persist during session

##### Integration Testing
- Test LLM API integration and error handling
- Verify real-time GUI updates match AI responses
- Test chat interface with various screen sizes

##### Accessibility Testing
- Ensure all AI-applied changes maintain accessibility standards
- Test with screen readers and keyboard navigation
- Validate color contrast compliance

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
- As a user, I want to chat with an AI assistant to customize the app's appearance without technical knowledge.
- As a user, I want to request visual changes like adding icons, changing colors, or reordering cities through natural conversation.
- As a user, I want the AI to understand my intent and apply changes immediately to the GUI.
- As a user, I want to undo or modify previous customizations through follow-up chat messages.

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

### 5.4. GUICustomization
```
GUICustomization {
  id: string,
  timestamp: Date,
  description: string,
  changes: {
    targetElement: string, // CSS selector or component identifier
    property: string, // CSS property or component prop
    value: string, // New value to apply
    previousValue?: string // For undo functionality
  }[]
}
```

### 5.5. ChatMessage
```
ChatMessage {
  id: string,
  role: 'user' | 'assistant',
  content: string,
  timestamp: Date,
  appliedCustomizations?: string[] // IDs of customizations applied
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

### 6.6. AI Chat Customization
- `POST /api/chat/customize`
  - Body: `{ message: string, currentCustomizations: GUICustomization[] }`
  - Returns: `{ response: string, customizations: GUICustomization[], success: boolean }`
  - Errors: 400 for invalid input, 500 for LLM processing errors

---

## 7. External Dependencies
- [Open-Meteo API](https://open-meteo.com/) for weather and geocoding data
- LLM API service (OpenAI GPT, Anthropic Claude, or similar) for natural language processing and GUI customization commands

---

## 8. Technology Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express, TypeScript, node-fetch
- **AI Integration:** LLM API client (OpenAI SDK, Anthropic SDK, or similar)
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
- Chat interface loads and displays properly
- AI correctly interprets and applies GUI customization requests
- Customizations persist during session and can be undone
- Chat interface works on mobile and desktop

### 9.2. Backend
- API returns correct data structure for valid cities
- Bulk endpoint returns data for multiple cities
- Handles invalid city names and input errors
- AI chat endpoint processes natural language requests correctly
- Returns appropriate customization instructions
- Handles LLM API failures gracefully

---

## 10. Accessibility & UX
- All interactive elements are keyboard accessible
- Clear focus states and error messages
- Responsive design for all device sizes
- Chat interface maintains accessibility standards
- AI-applied customizations preserve WCAG 2.1 AA compliance
- Screen reader compatibility maintained throughout customizations

---

## 11. Future Enhancements (Optional)
- User authentication and saved preferences
- Support for temperature units (°C/°F)
- Weather maps and radar
- Historical weather data
- Localization and multi-language support
- Voice commands for AI customization
- Sharing customized themes with other users
- AI-suggested customizations based on usage patterns

---

## 12. Non-Functional Requirements
- Fast load times and smooth UI transitions
- Robust error handling and logging
- Secure API endpoints
- Scalable to support many users
- Real-time GUI updates without page refreshes
- Efficient LLM API usage to manage costs
- Responsive chat interface with minimal latency

---

## 13. Glossary
- **WeatherCode:** Numeric code representing weather condition (see Open-Meteo docs)
- **Population:** City population from geocoding API
- **GUI Customization:** Dynamic visual modifications applied through AI chat commands
- **LLM:** Large Language Model used for natural language processing
- **Entity Extraction:** Process of identifying specific elements (targets, properties, values) from user messages

---

## 14. References
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Testing](https://playwright.dev/)
- [Jest Testing](https://jestjs.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)