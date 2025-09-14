import { describe, test, expect, beforeEach, afterEach } from 'vitest';

// Mock DOM environment
const mockDocument = {
  querySelectorAll: vi.fn(),
  body: {
    style: {
      setProperty: vi.fn(),
      removeProperty: vi.fn(),
      cssText: '',
      display: ''
    },
    classList: {
      remove: vi.fn()
    }
  },
  documentElement: {
    style: {
      setProperty: vi.fn(),
      removeProperty: vi.fn(),
      cssText: '',
      display: ''
    },
    classList: {
      remove: vi.fn()
    }
  },
  getElementById: vi.fn(),
  createElement: vi.fn(),
  head: {
    appendChild: vi.fn()
  }
};

// Mock window
const mockWindow = {
  getComputedStyle: vi.fn(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0)',
    background: 'transparent',
    opacity: '1',
    visibility: 'visible',
    display: 'block'
  })),
  localStorage: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn()
  }
};

// Mock global objects
Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
});

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true
});

// Import the chat service after mocking
import { processChatMessage } from '../../backend/src/services/chatService';

describe('AI Customization System Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    mockDocument.querySelectorAll.mockReturnValue([]);
    mockDocument.getElementById.mockReturnValue(null);
    mockDocument.createElement.mockReturnValue({
      id: '',
      textContent: '',
      style: { cssText: '' }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Icon Customization Tests', () => {
    test('should add weather icons when requested', async () => {
      const message = 'Add weather icons';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('added weather icons');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('showIcons');
      expect(result.customizations[0].changes[0].value).toBe('true');
    });

    test('should hide weather icons when requested', async () => {
      const message = 'Hide weather icons';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('hidden the weather icons');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('showIcons');
      expect(result.customizations[0].changes[0].value).toBe('false');
    });

    test('should make icons bigger when requested', async () => {
      const message = 'Make the icons bigger';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('made the weather icons bigger');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('iconSize');
      expect(result.customizations[0].changes[0].value).toBe('large');
    });

    test('should make icons smaller when requested', async () => {
      const message = 'Make the icons smaller';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('made the weather icons smaller');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('iconSize');
      expect(result.customizations[0].changes[0].value).toBe('small');
    });
  });

  describe('Background Color Tests', () => {
    test('should change background to blue', async () => {
      const message = 'Change background to blue';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('changed the background to a nice blue color');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('backgroundColor');
      expect(result.customizations[0].changes[0].value).toBe('#3b82f6');
    });

    test('should change background to green', async () => {
      const message = 'Make background green';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('changed the background to a refreshing green color');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('backgroundColor');
      expect(result.customizations[0].changes[0].value).toBe('#10b981');
    });

    test('should reset background when requested', async () => {
      const message = 'Reset background to default';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('reset the background to the default white color');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('backgroundColor');
      expect(result.customizations[0].changes[0].value).toBe('reset');
    });
  });

  describe('Text Color Tests', () => {
    test('should change text color to blue', async () => {
      const message = 'Make all text blue';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('changed the text color to blue');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('color');
      expect(result.customizations[0].changes[0].value).toBe('#3b82f6');
    });

    test('should change text color to red', async () => {
      const message = 'Change text color to red';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('changed the text color to red');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('color');
      expect(result.customizations[0].changes[0].value).toBe('#ef4444');
    });

    test('should reset text color when requested', async () => {
      const message = 'Reset text color to default';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('reset the text color to the default');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('color');
      expect(result.customizations[0].changes[0].value).toBe('reset');
    });
  });

  describe('City Sorting Tests', () => {
    test('should sort cities by temperature', async () => {
      const message = 'Sort cities by temperature';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('sorted the cities by temperature');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('sortBy');
      expect(result.customizations[0].changes[0].value).toBe('temperature');
    });

    test('should sort cities by population', async () => {
      const message = 'Sort cities by population';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('sorted the cities by population');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('sortBy');
      expect(result.customizations[0].changes[0].value).toBe('population');
    });

    test('should sort cities alphabetically', async () => {
      const message = 'Sort cities alphabetically';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('sorted the cities alphabetically');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('sortBy');
      expect(result.customizations[0].changes[0].value).toBe('alphabetical');
    });

    test('should handle re-sort requests', async () => {
      const message = 'Re-sort the cities by population';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('sorted the cities by population');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('sortBy');
      expect(result.customizations[0].changes[0].value).toBe('population');
    });
  });

  describe('Layout Customization Tests', () => {
    test('should change to grid layout', async () => {
      const message = 'Change to grid layout';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('changed the layout to a grid view');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('layout');
      expect(result.customizations[0].changes[0].value).toBe('grid');
    });

    test('should change to list layout', async () => {
      const message = 'Change to list layout';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('changed the layout to a vertical list');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('layout');
      expect(result.customizations[0].changes[0].value).toBe('list');
    });

    test('should increase spacing between elements', async () => {
      const message = 'Increase spacing between cities';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('increased the spacing between city panels');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('spacing');
      expect(result.customizations[0].changes[0].value).toBe('large');
    });

    test('should decrease spacing between elements', async () => {
      const message = 'Make spacing tighter';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('decreased the spacing between city panels');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('spacing');
      expect(result.customizations[0].changes[0].value).toBe('small');
    });
  });

  describe('Animation Customization Tests', () => {
    test('should enable smooth animations', async () => {
      const message = 'Enable smooth animations';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('enabled smooth animations');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('animations');
      expect(result.customizations[0].changes[0].value).toBe('enabled');
    });

    test('should disable animations', async () => {
      const message = 'Disable animations';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('disabled animations');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('animations');
      expect(result.customizations[0].changes[0].value).toBe('disabled');
    });

    test('should add fade-in effects', async () => {
      const message = 'Add fade in effects';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('fade-in effect');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes[0].property).toBe('fadeEffect');
      expect(result.customizations[0].changes[0].value).toBe('enabled');
    });
  });

  describe('Reset Functionality Tests', () => {
    test('should reset all customizations', async () => {
      const message = 'Reset all customizations';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('reset all customizations');
      expect(result.customizations).toHaveLength(1);
      expect(result.customizations[0].changes).toHaveLength(9); // All reset properties
      
      // Check that all major properties are reset
      const properties = result.customizations[0].changes.map(change => change.property);
      expect(properties).toContain('backgroundColor');
      expect(properties).toContain('color');
      expect(properties).toContain('showIcons');
      expect(properties).toContain('sortBy');
      expect(properties).toContain('iconSize');
      expect(properties).toContain('layout');
      expect(properties).toContain('spacing');
      expect(properties).toContain('animations');
      expect(properties).toContain('fadeEffect');
    });
  });

  describe('Error Handling Tests', () => {
    test('should provide helpful response for unrecognized requests', async () => {
      const message = 'Make the weather dance';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('I understand you want to customize the interface');
      expect(result.response).toContain('Colors');
      expect(result.response).toContain('Icons');
      expect(result.response).toContain('Layout');
      expect(result.response).toContain('Animations');
      expect(result.response).toContain('Sorting');
      expect(result.response).toContain('Reset');
      expect(result.customizations).toHaveLength(0);
    });

    test('should handle empty messages gracefully', async () => {
      const message = '';
      const result = await processChatMessage(message, []);
      
      expect(result.response).toContain('I understand you want to customize the interface');
      expect(result.customizations).toHaveLength(0);
    });
  });

  describe('Customization Data Structure Tests', () => {
    test('should generate valid GUICustomization objects', async () => {
      const message = 'Add weather icons';
      const result = await processChatMessage(message, []);
      
      expect(result.customizations).toHaveLength(1);
      const customization = result.customizations[0];
      
      expect(customization).toHaveProperty('id');
      expect(customization).toHaveProperty('timestamp');
      expect(customization).toHaveProperty('description');
      expect(customization).toHaveProperty('changes');
      expect(Array.isArray(customization.changes)).toBe(true);
      expect(customization.changes).toHaveLength(1);
      
      const change = customization.changes[0];
      expect(change).toHaveProperty('targetElement');
      expect(change).toHaveProperty('property');
      expect(change).toHaveProperty('value');
      expect(change).toHaveProperty('previousValue');
    });

    test('should generate unique IDs for customizations', async () => {
      const message1 = 'Add weather icons';
      const message2 = 'Change background to blue';
      
      const result1 = await processChatMessage(message1, []);
      const result2 = await processChatMessage(message2, []);
      
      expect(result1.customizations[0].id).not.toBe(result2.customizations[0].id);
    });
  });

  describe('Integration with Current Customizations Tests', () => {
    test('should work with existing customizations', async () => {
      const existingCustomizations = [{
        id: 'existing-1',
        timestamp: new Date(),
        description: 'Previous customization',
        changes: [{
          targetElement: 'body',
          property: 'backgroundColor',
          value: '#3b82f6',
          previousValue: '#ffffff'
        }]
      }];
      
      const message = 'Add weather icons';
      const result = await processChatMessage(message, existingCustomizations);
      
      expect(result.response).toContain('added weather icons');
      expect(result.customizations).toHaveLength(1);
      // Should not be affected by existing customizations
      expect(result.customizations[0].changes[0].property).toBe('showIcons');
    });
  });
});
