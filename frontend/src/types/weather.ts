export interface WeatherLocation {
  latitude: number;
  longitude: number;
  population: number;
}

export interface WeatherDaily {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
}

export interface WeatherData {
  location: {
    name: string;
    population?: number;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export interface CityWeatherData {
  [city: string]: WeatherData;
}

// AI Chat Customization Types
export interface GUICustomization {
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  appliedCustomizations?: string[]; // IDs of customizations applied
}

export interface ChatState {
  messages: ChatMessage[];
  customizations: GUICustomization[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
} 