import { ChatResult, GUICustomization } from '../types/chat';

// Enhanced chat service with expanded customization capabilities
export const processChatMessage = async (
  message: string,
  currentCustomizations: GUICustomization[]
): Promise<ChatResult> => {

  console.log('🔍 Processing message:', message);
  console.log('🔍 Current customizations:', currentCustomizations);
  const lowerMessage = message.toLowerCase();
  const customizations: GUICustomization[] = [];

  // Handle icon-related requests (enhanced)
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

    // NEW: Handle icon sizing
    if (lowerMessage.includes('bigger') || lowerMessage.includes('larger') || lowerMessage.includes('size up')) {
      customizations.push({
        id: `icon-size-${Date.now()}`,
        timestamp: new Date(),
        description: `Increased icon size based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-icon',
          property: 'iconSize',
          value: 'large',
          previousValue: 'normal'
        }]
      });

      return {
        response: `🔍 I've made the weather icons bigger! They should now be more prominent and easier to see.`,
        customizations
      };
    }

    if (lowerMessage.includes('smaller') || lowerMessage.includes('tiny') || lowerMessage.includes('size down')) {
      customizations.push({
        id: `icon-size-${Date.now()}`,
        timestamp: new Date(),
        description: `Decreased icon size based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-icon',
          property: 'iconSize',
          value: 'small',
          previousValue: 'normal'
        }]
      });

      return {
        response: `🔍 I've made the weather icons smaller! They should now be more subtle and take up less space.`,
        customizations
      };
    }
  }

  // NEW: Handle layout modifications
  if (lowerMessage.includes('layout') || lowerMessage.includes('arrange') || lowerMessage.includes('grid') || lowerMessage.includes('spacing')) {
    console.log('🏗️ Layout modification detected');

    if (lowerMessage.includes('grid') || lowerMessage.includes('grid view')) {
      customizations.push({
        id: `layout-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed to grid layout based on request: "${message}"`,
        changes: [{
          targetElement: '.cities-container',
          property: 'layout',
          value: 'grid',
          previousValue: 'list'
        }]
      });

      return {
        response: `🏗️ I've changed the layout to a grid view! The cities will now be arranged in a neat grid pattern instead of a vertical list.`,
        customizations
      };
    }

    if (lowerMessage.includes('list') || lowerMessage.includes('vertical') || lowerMessage.includes('stack')) {
      customizations.push({
        id: `layout-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed to list layout based on request: "${message}"`,
        changes: [{
          targetElement: '.cities-container',
          property: 'layout',
          value: 'list',
          previousValue: 'grid'
        }]
      });

      return {
        response: `🏗️ I've changed the layout to a vertical list! The cities will now be stacked vertically for easier reading.`,
        customizations
      };
    }

    if (lowerMessage.includes('spacing') || lowerMessage.includes('gap') || lowerMessage.includes('margin')) {
      if (lowerMessage.includes('more') || lowerMessage.includes('increase') || lowerMessage.includes('wider')) {
        customizations.push({
          id: `spacing-${Date.now()}`,
          timestamp: new Date(),
          description: `Increased spacing between elements based on request: "${message}"`,
          changes: [{
            targetElement: '.weather-panel',
            property: 'spacing',
            value: 'large',
            previousValue: 'normal'
          }]
        });

        return {
          response: `📏 I've increased the spacing between city panels! This should make the interface feel more spacious and easier to read.`,
          customizations
        };
      }

      if (lowerMessage.includes('less') || lowerMessage.includes('decrease') || lowerMessage.includes('tighter')) {
        customizations.push({
          id: `spacing-${Date.now()}`,
          timestamp: new Date(),
          description: `Decreased spacing between elements based on request: "${message}"`,
          changes: [{
            targetElement: '.weather-panel',
            property: 'spacing',
            value: 'small',
            previousValue: 'normal'
          }]
        });

        return {
          response: `📏 I've decreased the spacing between city panels! This should make the interface more compact and show more content at once.`,
          customizations
        };
      }
    }
  }

  // NEW: Handle animations and transitions
  if (lowerMessage.includes('animation') || lowerMessage.includes('transition') || lowerMessage.includes('smooth') || lowerMessage.includes('fade')) {
    console.log('✨ Animation modification detected');

    if (lowerMessage.includes('enable') || lowerMessage.includes('add') || lowerMessage.includes('smooth')) {
      customizations.push({
        id: `animation-${Date.now()}`,
        timestamp: new Date(),
        description: `Enabled smooth animations based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'animations',
          value: 'enabled',
          previousValue: 'disabled'
        }]
      });

      return {
        response: `✨ I've enabled smooth animations! The interface will now have nice transitions when you interact with it, making it feel more polished and responsive.`,
        customizations
      };
    }

    if (lowerMessage.includes('disable') || lowerMessage.includes('remove') || lowerMessage.includes('off')) {
      customizations.push({
        id: `animation-${Date.now()}`,
        timestamp: new Date(),
        description: `Disabled animations based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'animations',
          value: 'disabled',
          previousValue: 'enabled'
        }]
      });

      return {
        response: `✨ I've disabled animations! The interface will now respond instantly without transitions, which can be better for performance.`,
        customizations
      };
    }

    if (lowerMessage.includes('fade') || lowerMessage.includes('fade in')) {
      customizations.push({
        id: `animation-${Date.now()}`,
        timestamp: new Date(),
        description: `Added fade-in effect based on request: "${message}"`,
        changes: [{
          targetElement: '.weather-panel',
          property: 'fadeEffect',
          value: 'enabled',
          previousValue: 'disabled'
        }]
      });

      return {
        response: `✨ I've added a fade-in effect! City panels will now smoothly fade in when they appear, creating a more elegant visual experience.`,
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
     
    if (lowerMessage.includes('red')) {
      customizations.push({
        id: `bg-${Date.now()}`,
        timestamp: new Date(),
        description: `Changed background to red based on request: "${message}"`,
        changes: [{
          targetElement: 'body',
          property: 'backgroundColor',
          value: '#ef4444',
          previousValue: '#ffffff'
        }]
      });
      return {
        response: `🎨 I've changed the background to a vibrant red color!`,
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
          value: 'reset',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'color',
          value: 'reset',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'showIcons',
          value: 'false',
          previousValue: 'current'
        },
        {
          targetElement: '.cities-container',
          property: 'sortBy',
          value: 'reset',
          previousValue: 'current'
        },
        // NEW: Reset new customization types
        {
          targetElement: '.weather-icon',
          property: 'iconSize',
          value: 'reset',
          previousValue: 'current'
        },
        {
          targetElement: '.cities-container',
          property: 'layout',
          value: 'reset',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'spacing',
          value: 'reset',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'animations',
          value: 'reset',
          previousValue: 'current'
        },
        {
          targetElement: '.weather-panel',
          property: 'fadeEffect',
          value: 'reset',
          previousValue: 'current'
        }
      ]
    });
    return {
      response: `🔄 I've reset all customizations! Everything is back to the default appearance, including city order, layout, spacing, and animations.`,
      customizations
    };
  }

  // Default response for unrecognized requests (enhanced)
  console.log('❓ No specific pattern matched, returning default response');
  const defaultResult = {
    response: `I understand you want to customize the interface. I can help you with:

🎨 **Colors**: Change background colors (blue, green, white) or text colors
🎯 **Icons**: Add/hide weather icons, make them bigger or smaller
🏗️ **Layout**: Switch between grid and list views, adjust spacing between elements
✨ **Animations**: Enable/disable smooth transitions and fade effects
📊 **Sorting**: Sort cities by temperature, population, or alphabetically
🔄 **Reset**: Reset all customizations or specific elements

Try asking me to:
• "Make the icons bigger"
• "Change to grid layout"
• "Increase spacing between cities"
• "Enable smooth animations"
• "Add fade-in effects"`,
    customizations: []
  };
  console.log('❓ Returning default result:', defaultResult);
  return defaultResult;
};
