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

export interface ChatResult {
  response: string;
  customizations: GUICustomization[];
}
