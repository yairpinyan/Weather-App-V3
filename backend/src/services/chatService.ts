import { ChatResult, GUICustomization } from '../types/chat';

// Simple, working chat service with icon support
export const processChatMessage = async (
  message: string,
  currentCustomizations: GUICustomization[]
): Promise<ChatResult> => {

  console.log('🔍 Processing message:', message);
  console.log('🔍 Current customizations:', currentCustomizations);
  const lowerMessage = message.toLowerCase();
  const customizations: GUICustomization[] = [];

  // Handle icon-related requests
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

      const result = {
        response: `🎯 I've added weather icons to the city panels! Each city will now show a weather icon based on current conditions.`,
        customizations
      };
      console.log('🎯 Returning icon add result:', result);
      return result;
    }

    if (lowerMessage.includes('hide') || lowerMessage.includes('remove') || lowerMessage.includes('delete')) {
      customizations.push({
        id: `icon-${Date.now()}`,
        timestamp: new Date(),
        description: `Hidden weather icons based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'showIcons',
          value: 'false',
          previousValue: 'true'
        }]
      });

      return {
        response: `🎯 I've hidden the weather icons from the city panels! The icons are now hidden and won't be visible.`,
        customizations
      };
    }
  }

  // Handle background color changes
  if (lowerMessage.includes('background') || lowerMessage.includes('bg')) {
    if (lowerMessage.includes('blue')) {
      customizations.push({
        id: `bg-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed background to blue based on request: "${message}"`,
        changes: [{
          targetElement: 'body',
          property: 'backgroundColor',
          value: '#3b82f6',
          previousValue: '#ffffff'
        }]
      });
      return {
        response: `🎨 I've changed the background to a nice blue color!`,
        customizations
      };
    }
    
    if (lowerMessage.includes('green')) {
      customizations.push({
        id: `bg-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed background to green based on request: "${message}"`,
        changes: [{
          targetElement: 'body',
          property: 'backgroundColor',
          value: '#10b981',
          previousValue: '#ffffff'
        }]
      });
      return {
        response: `🎨 I've changed the background to a refreshing green color!`,
        customizations
      };
    }

    if (lowerMessage.includes('reset') || lowerMessage.includes('default') || lowerMessage.includes('white')) {
      customizations.push({
        id: `bg-reset-${Date.now()}`,
        timestamp: new Date(),
        description: `Reset background to default based on request: "${message}"`,
        changes: [{
          targetElement: 'body',
          property: 'backgroundColor',
          value: 'reset',
          previousValue: 'current'
        }]
      });
      return {
        response: `🔄 I've reset the background to the default white color!`,
        customizations
      };
    }
  }

  // Handle text color changes
  if (lowerMessage.includes('text') || lowerMessage.includes('color') || lowerMessage.includes('make all text') || lowerMessage.includes('change text')) {
    if (lowerMessage.includes('blue')) {
      customizations.push({
        id: `text-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed text color to blue based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'color',
          value: '#3b82f6',
          previousValue: '#000000'
        }]
      });
      return {
        response: `🎨 I've changed the text color to blue! All text in the weather panels should now be blue.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('red')) {
      customizations.push({
        id: `text-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed text color to red based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'color',
          value: '#ef4444',
          previousValue: '#000000'
        }]
      });
      return {
        response: `🎨 I've changed the text color to red! All text in the weather panels should now be red.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('green')) {
      customizations.push({
        id: `text-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed text color to green based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'color',
          value: '#10b981',
          previousValue: '#000000'
        }]
      });
      return {
        response: `🎨 I've changed the text color to green! All text in the weather panels should now be green.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('white')) {
      customizations.push({
        id: `text-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed text color to white based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'color',
          value: '#ffffff',
          previousValue: '#000000'
        }]
      });
      return {
        response: `🎨 I've changed the text color to white for better visibility!`,
        customizations
      };
    }
    
    if (lowerMessage.includes('reset') || lowerMessage.includes('default') || lowerMessage.includes('black')) {
      customizations.push({
        id: `text-reset-${Date.now()}`,
        timestamp: new Date(),
        description: `Reset text color to default based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'color',
          value: 'reset',
          previousValue: 'current'
        }]
      });
      return {
        response: `🎨 I've reset the text color to the default! All text should now be back to the original colors.`,
        customizations
      };
    }
  }

  // Handle city sorting
  if (lowerMessage.includes('sort') || lowerMessage.includes('re-sort') || lowerMessage.includes('resort')) {
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
      customizations.push({
        id: `sort-${Date.now()}`,
        timestamp: new Date(),
        description: `Sort cities by temperature based on request: "${message}"`,
        changes: [{
          targetElement: '.cities-container',
          property: 'sortBy',
          value: 'temperature',
          previousValue: 'default'
        }]
      });
      return {
        response: `📊 I've sorted the cities by temperature! The cities are now ordered from coldest to warmest.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('population') || lowerMessage.includes('pop')) {
      customizations.push({
        id: `sort-${Date.now()}`,
        timestamp: new Date(),
        description: `Sort cities by population based on request: "${message}"`,
        changes: [{
          targetElement: '.cities-container',
          property: 'sortBy',
          value: 'population',
          previousValue: 'default'
        }]
      });
      return {
        response: `📊 I've sorted the cities by population! The cities are now ordered from smallest to largest population.`,
        customizations
      };
    }
    
    if (lowerMessage.includes('alphabetical') || lowerMessage.includes('name')) {
      customizations.push({
        id: `sort-${Date.now()}`,
        timestamp: new Date(),
        description: `Sort cities alphabetically based on request: "${message}"`,
        changes: [{
          targetElement: '.cities-container',
          property: 'sortBy',
          value: 'alphabetical',
          previousValue: 'default'
        }]
      });
      return {
        response: `📊 I've sorted the cities alphabetically! The cities are now ordered A-Z by name.`,
        customizations
      };
    }
  }

  // Handle reset all customizations
  if (lowerMessage.includes('reset') && (lowerMessage.includes('all') || lowerMessage.includes('everything'))) {
    customizations.push({
      id: `reset-all-${Date.now()}`,
      timestamp: new Date(),
      description: `Reset all customizations based on request: "${message}"`,
      changes: [
        {
          targetElement: 'body',
          property: 'backgroundColor',
          value: '#ffffff',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'color',
          value: '#000000',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'showIcons',
          value: 'false',
          previousValue: 'current'
        }
      ]
    });
    return {
      response: `🔄 I've reset all customizations! Everything is back to the default appearance.`,
      customizations
    };
  }

  // Default response for unrecognized requests
  console.log('❓ No specific pattern matched, returning default response');
  const defaultResult = {
    response: `I understand you want to customize the interface. I can help you:
    
🎨 **Colors**: Change background colors (blue, green, white) or text colors
🎯 **Icons**: Add or hide weather icons on the city panels
📊 **Sorting**: Sort cities by temperature, population, or alphabetically
🔄 **Reset**: Reset all customizations or specific elements

Try asking me to "add weather icons", "change background to blue", or "sort cities by temperature"!`,
    customizations: []
  };
  console.log('❓ Returning default result:', defaultResult);
  return defaultResult;
};
