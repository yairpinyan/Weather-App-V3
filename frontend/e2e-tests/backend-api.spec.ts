import { test, expect } from '@playwright/test';

test.describe('Backend API Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should have backend server running', async ({ page }) => {
    // Test backend health endpoint
    const response = await page.request.get('http://localhost:5000/');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.message).toBe('Welcome to Weather App API');
  });

  test('should process chat messages correctly', async ({ page }) => {
    // Test chat API endpoint
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Add weather icons',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('weather icons');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('showIcons');
    expect(data.customizations[0].changes[0].value).toBe('true');
  });

  test('should handle icon sizing requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Make the icons bigger',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('bigger');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('iconSize');
    expect(data.customizations[0].changes[0].value).toBe('large');
  });

  test('should handle layout change requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Change to grid layout',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('grid');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('layout');
    expect(data.customizations[0].changes[0].value).toBe('grid');
  });

  test('should handle spacing requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Increase spacing between cities',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('spacing');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('spacing');
    expect(data.customizations[0].changes[0].value).toBe('large');
  });

  test('should handle animation requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Enable smooth animations',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('animations');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('animations');
    expect(data.customizations[0].changes[0].value).toBe('enabled');
  });

  test('should handle fade effect requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Add fade-in effects',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('fade');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('fadeEffect');
    expect(data.customizations[0].changes[0].value).toBe('enabled');
  });

  test('should handle background color requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Change background to blue',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('blue');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('backgroundColor');
    expect(data.customizations[0].changes[0].value).toBe('#3b82f6');
  });

  test('should handle text color requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Change text color to red',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('red');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('color');
    expect(data.customizations[0].changes[0].value).toBe('#ef4444');
  });

  test('should handle city sorting requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Sort cities by temperature',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('temperature');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes[0].property).toBe('sortBy');
    expect(data.customizations[0].changes[0].value).toBe('temperature');
  });

  test('should handle reset requests', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Reset all customizations',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('reset');
    expect(data.customizations).toHaveLength(1);
    expect(data.customizations[0].changes.length).toBeGreaterThan(5); // Should reset multiple properties
  });

  test('should provide helpful default response for unrecognized commands', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Make the app sparkly and magical',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.response).toContain('Colors');
    expect(data.response).toContain('Icons');
    expect(data.response).toContain('Layout');
    expect(data.response).toContain('Animations');
    expect(data.customizations).toHaveLength(0);
  });

  test('should handle multiple customizations in reset', async ({ page }) => {
    const response = await page.request.post('http://localhost:5000/api/chat', {
      data: {
        message: 'Reset all customizations',
        currentCustomizations: []
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    const resetCustomization = data.customizations[0];
    const properties = resetCustomization.changes.map((change: any) => change.property);
    
    // Should reset all the new customization types
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

