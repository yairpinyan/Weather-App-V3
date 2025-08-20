import type { GUICustomization, ChatResult } from '../types/chat';

// For now, we'll implement a basic rule-based system
// Later, this will be replaced with actual LLM integration
export const processChatMessage = async (
  message: string, 
  currentCustomizations: GUICustomization[]
): Promise<ChatResult> => {
  
  console.log('🔍 Processing message:', message);
  const lowerMessage = message.toLowerCase();
  const customizations: GUICustomization[] = [];
  
  // Basic intent classification and entity extraction
  if (lowerMessage.includes('background')) {
    console.log('🎨 Background change detected');
    
    // Handle specific color requests
    if (lowerMessage.includes('blue')) {
      customizations.push({
        id: `bg-color-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed background to blue based on request: "${message}"`,
        changes: [{
          targetElement: '#weather-app-main',
          property: 'backgroundColor',
          value: '#3b82f6', // Blue-500
          previousValue: '#f3f4f6'
        }]
      });
      
      return {
        response: `🎨 I've changed the background color to blue! The interface should now have a blue background.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('red')) {
      customizations.push({
        id: `bg-color-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed background to red based on request: "${message}"`,
        changes: [{
          targetElement: '#weather-app-main',
          property: 'backgroundColor',
          value: '#ef4444', // Red-500
          previousValue: '#f3f4f6'
        }]
      });
      
      return {
        response: `🎨 I've changed the background color to red! The interface should now have a red background.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('green')) {
      customizations.push({
        id: `bg-color-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed background to green based on request: "${message}"`,
        changes: [{
          targetElement: '#weather-app-main',
          property: 'backgroundColor',
          value: '#10b981', // Green-500
          previousValue: '#f3f4f6'
        }]
      });
      
      return {
        response: `🎨 I've changed the background color to green! The interface should now have a green background.`,
        customizations
      };
    }
    
    // Generic background color change
    customizations.push({
      id: `bg-color-${Date.now()}`,
      timestamp: new Date(),
      description: `Changed background color based on request: "${message}"`,
      changes: [{
        targetElement: '#weather-app-main',
        property: 'backgroundColor',
        value: '#f0f0f0', // Default light gray
        previousValue: '#f3f4f6'
      }]
    });
    
    return {
      response: `🎨 I've changed the background color! You can be more specific by saying "make the background blue", "make it red", or "change to green".`,
      customizations
    };
  }
  
  if (lowerMessage.includes('text') || lowerMessage.includes('font')) {
    console.log('📝 Text change detected');
    
    if (lowerMessage.includes('red')) {
      customizations.push({
        id: `text-color-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed text color to red based on request: "${message}"`,
        changes: [{
          targetElement: '.text-gray-800, .text-gray-700, h1, h2, h3, p',
          property: 'color',
          value: '#ef4444', // Red-500
          previousValue: '#374151'
        }]
      });
      
      return {
        response: `📝 I've changed the text color to red! All text should now appear in red.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('blue')) {
      customizations.push({
        id: `text-color-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed text color to blue based on request: "${message}"`,
        changes: [{
          targetElement: '.text-gray-800, .text-gray-700, h1, h2, h3, p',
          property: 'color',
          value: '#3b82f6', // Blue-500
          previousValue: '#374151'
        }]
      });
      
      return {
        response: `📝 I've changed the text color to blue! All text should now appear in blue.`,
        customizations
      };
    }
    
    // Generic text color change
    customizations.push({
      id: `text-color-${Date.now()}`,
      timestamp: new Date(),
      description: `Changed text color based on request: "${message}"`,
      changes: [{
        targetElement: '.text-gray-800, .text-gray-700, h1, h2, h3, p',
        property: 'color',
        value: '#1f2937', // Dark gray
        previousValue: '#374151'
      }]
    });
    
    return {
      response: `📝 I've adjusted the text color! You can specify exact colors like "make text red" or "change text to blue".`,
      customizations
    };
  }
  
  if (lowerMessage.includes('sort') || lowerMessage.includes('order')) {
    console.log('📊 Sorting change detected');
    
    if (lowerMessage.includes('temperature')) {
      customizations.push({
        id: `sort-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed city sorting to temperature-based based on request: "${message}"`,
        changes: [{
          targetElement: 'cities',
          property: 'sortBy',
          value: 'temperature',
          previousValue: 'population'
        }]
      });
      
      return {
        response: `📊 I've changed the city sorting to be based on temperature! Cities will now be ordered by their current temperature.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('alphabetical') || lowerMessage.includes('name')) {
      customizations.push({
        id: `sort-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed city sorting to alphabetical based on request: "${message}"`,
        changes: [{
          targetElement: 'cities',
          property: 'sortBy',
          value: 'alphabetical',
          previousValue: 'population'
        }]
      });
      
      return {
        response: `📊 I've changed the city sorting to alphabetical order! Cities will now be listed A-Z.`,
        customizations
      };
    }
  }
  
  if (lowerMessage.includes('icon') || lowerMessage.includes('emoji')) {
    console.log('🎯 Icon change detected');
    
    if (lowerMessage.includes('add') || lowerMessage.includes('show')) {
      customizations.push({
        id: `icon-${Date.now()}`,
        timestamp: new Date(),
        description: `Added weather icons based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'showIcons',
          value: 'true',
          previousValue: 'false'
        }]
      });
      
      return {
        response: `🎯 I've added weather icons to the city panels! Each city will now show a weather icon based on current conditions.`,
        customizations
      };
    }
  }
  
  if (lowerMessage.includes('reset') || lowerMessage.includes('undo') || lowerMessage.includes('original')) {
    console.log('🔄 Reset command detected');
    
    customizations.push({
      id: `reset-${Date.now()}`,
      timestamp: new Date(),
      description: `Reset background to original state based on request: "${message}"`,
      changes: [{
        targetElement: '#weather-app-main',
        property: 'backgroundColor',
        value: 'reset',
        previousValue: 'custom'
      }]
    });
    
    return {
      response: `🔄 I've reset the background to its original gray color! You can now customize it again.`,
      customizations
    };
  }
  
  // Default response for unrecognized requests
  console.log('❓ No specific pattern matched, returning default response');
  return {
    response: `I understand you want to customize the interface. I can help you with:

• Changing colors (background, text, borders)
• Sorting cities (by temperature, alphabetical, population)
• Adding icons and visual elements
• Modifying layout and spacing

Try being more specific, like "make the background blue" or "sort cities by temperature".`,
    customizations: []
  };
};
