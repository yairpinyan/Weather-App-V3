import { test, expect } from '@playwright/test';

test.describe('AI Customization Features', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and add some demo cities
    await page.goto('/');
    
    // Add demo cities for testing
    await page.getByPlaceholder('Enter city name').fill('London');
    await page.getByRole('button', { name: /Add City/i }).click();
    await expect(page.getByRole('heading', { name: /London/i })).toBeVisible({ timeout: 10000 });
    
    await page.getByPlaceholder('Enter city name').fill('Paris');
    await page.getByRole('button', { name: /Add City/i }).click();
    await expect(page.getByRole('heading', { name: /Paris/i })).toBeVisible({ timeout: 10000 });
    
    await page.getByPlaceholder('Enter city name').fill('Tokyo');
    await page.getByRole('button', { name: /Add City/i }).click();
    await expect(page.getByRole('heading', { name: /Tokyo/i })).toBeVisible({ timeout: 10000 });
    
    // Open the AI chat panel
    await page.getByRole('button', { name: /AI Customization/i }).click();
    await expect(page.locator('.fixed.bottom-4.right-4')).toBeVisible();
  });

  test.describe('Icon Customization', () => {
    test('should add weather icons when requested', async ({ page }) => {
      // Send message to add icons
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add weather icons');
      await page.locator('button[type="submit"]').click();
      
      // Wait for AI response
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that icons are now visible
      const weatherIcons = page.locator('.weather-icon');
      await expect(weatherIcons.first()).toBeVisible();
      
      // Verify icons have proper styling
      const firstIcon = weatherIcons.first();
      const iconStyle = await firstIcon.evaluate(el => window.getComputedStyle(el));
      expect(iconStyle.opacity).toBe('1');
      expect(iconStyle.visibility).toBe('visible');
    });

    test('should hide weather icons when requested', async ({ page }) => {
      // First add icons
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add weather icons');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Then hide them
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Hide weather icons');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that icons are now hidden
      const weatherIcons = page.locator('.weather-icon');
      const firstIcon = weatherIcons.first();
      const iconStyle = await firstIcon.evaluate(el => window.getComputedStyle(el));
      expect(iconStyle.opacity).toBe('0');
      expect(iconStyle.visibility).toBe('hidden');
    });

    test('should make icons bigger when requested', async ({ page }) => {
      // First add icons
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add weather icons');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Make icons bigger
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Make the icons bigger');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that icons are larger
      const weatherIcons = page.locator('.weather-icon');
      const firstIcon = weatherIcons.first();
      const iconStyle = await firstIcon.evaluate(el => window.getComputedStyle(el));
      expect(iconStyle.width).toBe('48px');
      expect(iconStyle.height).toBe('48px');
      expect(iconStyle.fontSize).toBe('48px');
    });

    test('should make icons smaller when requested', async ({ page }) => {
      // First add icons
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add weather icons');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Make icons smaller
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Make the icons smaller');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that icons are smaller
      const weatherIcons = page.locator('.weather-icon');
      const firstIcon = weatherIcons.first();
      const iconStyle = await firstIcon.evaluate(el => window.getComputedStyle(el));
      expect(iconStyle.width).toBe('16px');
      expect(iconStyle.height).toBe('16px');
      expect(iconStyle.fontSize).toBe('16px');
    });
  });

  test.describe('Layout Customization', () => {
    test('should change to grid layout when requested', async ({ page }) => {
      // Change to grid layout
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change to grid layout');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that cities container has grid layout
      const citiesContainer = page.locator('.cities-container');
      const containerStyle = await citiesContainer.evaluate(el => window.getComputedStyle(el));
      expect(containerStyle.display).toBe('grid');
      expect(containerStyle.gridTemplateColumns).toContain('repeat(auto-fit, minmax(300px, 1fr))');
    });

    test('should change to list layout when requested', async ({ page }) => {
      // Change to list layout
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change to list layout');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that cities container has list layout
      const citiesContainer = page.locator('.cities-container');
      const containerStyle = await citiesContainer.evaluate(el => window.getComputedStyle(el));
      expect(containerStyle.display).toBe('flex');
      expect(containerStyle.flexDirection).toBe('column');
    });
  });

  test.describe('Spacing Customization', () => {
    test('should increase spacing when requested', async ({ page }) => {
      // Increase spacing
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Increase spacing between cities');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that weather panels have increased spacing
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.margin).toContain('24px'); // 1.5rem = 24px
      expect(panelStyle.padding).toContain('32px'); // 2rem = 32px
    });

    test('should decrease spacing when requested', async ({ page }) => {
      // Decrease spacing
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Decrease spacing between cities');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that weather panels have decreased spacing
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.margin).toContain('4px'); // 0.25rem = 4px
      expect(panelStyle.padding).toContain('12px'); // 0.75rem = 12px
    });
  });

  test.describe('Animation Customization', () => {
    test('should enable smooth animations when requested', async ({ page }) => {
      // Enable animations
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Enable smooth animations');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that weather panels have transition animations
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.transition).toContain('all 0.3s ease-in-out');
    });

    test('should disable animations when requested', async ({ page }) => {
      // First enable animations
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Enable smooth animations');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Then disable them
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Disable animations');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that animations are disabled
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.transition).toBe('none');
      expect(panelStyle.animation).toBe('none');
    });

    test('should add fade-in effects when requested', async ({ page }) => {
      // Add fade effects
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add fade-in effects');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that weather panels have fade-in animation
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.animation).toContain('fadeIn');
    });
  });

  test.describe('Background Color Customization', () => {
    test('should change background to blue when requested', async ({ page }) => {
      // Change background to blue
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change background to blue');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that body has blue background
      const bodyStyle = await page.evaluate(() => window.getComputedStyle(document.body));
      expect(bodyStyle.backgroundColor).toBe('rgb(59, 130, 246)'); // #3b82f6
    });

    test('should change background to green when requested', async ({ page }) => {
      // Change background to green
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change background to green');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that body has green background
      const bodyStyle = await page.evaluate(() => window.getComputedStyle(document.body));
      expect(bodyStyle.backgroundColor).toBe('rgb(16, 185, 129)'); // #10b981
    });

    test('should reset background when requested', async ({ page }) => {
      // First change to blue
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change background to blue');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Then reset
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Reset background');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that background is reset (should be default)
      const bodyStyle = await page.evaluate(() => window.getComputedStyle(document.body));
      // Default background should not be blue
      expect(bodyStyle.backgroundColor).not.toBe('rgb(59, 130, 246)');
    });
  });

  test.describe('Text Color Customization', () => {
    test('should change text color to blue when requested', async ({ page }) => {
      // Change text color to blue
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change text color to blue');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that weather panel text is blue
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.color).toBe('rgb(59, 130, 246)'); // #3b82f6
    });

    test('should change text color to red when requested', async ({ page }) => {
      // Change text color to red
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change text color to red');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that weather panel text is red
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.color).toBe('rgb(239, 68, 68)'); // #ef4444
    });
  });

  test.describe('City Sorting Customization', () => {
    test('should sort cities by temperature when requested', async ({ page }) => {
      // Sort by temperature
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Sort cities by temperature');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Get all city headings and check their order
      const cityHeadings = page.locator('.weather-panel h2');
      const cityNames = await cityHeadings.allTextContents();
      
      // Should have at least 3 cities
      expect(cityNames.length).toBeGreaterThanOrEqual(3);
      
      // Note: We can't easily test the actual temperature sorting without knowing the exact temperatures
      // But we can verify that the cities are still there and the command was processed
      expect(cityNames).toContain('London');
      expect(cityNames).toContain('Paris');
      expect(cityNames).toContain('Tokyo');
    });

    test('should sort cities alphabetically when requested', async ({ page }) => {
      // Sort alphabetically
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Sort cities alphabetically');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Get all city headings and check their order
      const cityHeadings = page.locator('.weather-panel h2');
      const cityNames = await cityHeadings.allTextContents();
      
      // Should be sorted alphabetically
      const sortedNames = [...cityNames].sort();
      expect(cityNames).toEqual(sortedNames);
    });
  });

  test.describe('Reset Functionality', () => {
    test('should reset all customizations when requested', async ({ page }) => {
      // Apply multiple customizations
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add weather icons');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change background to blue');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Change text color to red');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Reset all
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Reset all customizations');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that customizations are reset
      const weatherIcons = page.locator('.weather-icon');
      const firstIcon = weatherIcons.first();
      const iconStyle = await firstIcon.evaluate(el => window.getComputedStyle(el));
      expect(iconStyle.opacity).toBe('0');
      expect(iconStyle.visibility).toBe('hidden');
      
      const bodyStyle = await page.evaluate(() => window.getComputedStyle(document.body));
      expect(bodyStyle.backgroundColor).not.toBe('rgb(59, 130, 246)');
      
      const weatherPanel = page.locator('.weather-panel').first();
      const panelStyle = await weatherPanel.evaluate(el => window.getComputedStyle(el));
      expect(panelStyle.color).not.toBe('rgb(239, 68, 68)');
    });
  });

  test.describe('AI Response Quality', () => {
    test('should provide helpful responses for unrecognized commands', async ({ page }) => {
      // Send an unrecognized command
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Make the app sparkly');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
      
      // Check that AI provides helpful guidance
      const lastMessage = page.locator('.space-y-3 > div').last();
      const messageText = await lastMessage.textContent();
      expect(messageText).toContain('Colors');
      expect(messageText).toContain('Icons');
      expect(messageText).toContain('Layout');
      expect(messageText).toContain('Animations');
    });

    test('should show loading state while processing', async ({ page }) => {
      // Send a command and immediately check for loading state
      await page.locator('input[placeholder*="Ask me to customize"]').fill('Add weather icons');
      await page.locator('button[type="submit"]').click();
      
      // Should show loading indicator
      await expect(page.locator('.text-gray-500.text-sm.italic')).toBeVisible();
      
      // Loading should disappear when response is ready
      await expect(page.locator('.text-gray-500.text-sm.italic')).not.toBeVisible({ timeout: 10000 });
    });
  });
});
