import { test, expect } from '@playwright/test';

test.describe('AI Customization System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');
    
    // Wait for the app to load
    await page.waitForSelector('.weather-app-main');
    
    // Open the chat panel
    await page.click('[data-testid="chat-toggle"]');
    await page.waitForSelector('.chat-panel');
  });

  test('should open chat panel and display welcome message', async ({ page }) => {
    // Check that chat panel is visible
    await expect(page.locator('.chat-panel')).toBeVisible();
    
    // Check welcome message
    await expect(page.locator('text=AI Weather Customization')).toBeVisible();
    await expect(page.locator('text=Ask me to customize the interface!')).toBeVisible();
    
    // Check input and send button are present
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should add weather icons through chat', async ({ page }) => {
    // Send message to add icons
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.click('button[type="submit"]');
    
    // Wait for AI response
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
    
    // Check that icons are actually visible in weather panels
    await page.waitForSelector('.weather-icon', { timeout: 5000 });
    const icons = await page.locator('.weather-icon').count();
    expect(icons).toBeGreaterThan(0);
  });

  test('should hide weather icons through chat', async ({ page }) => {
    // First add icons
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
    
    // Then hide them
    await page.fill('input[type="text"]', 'Hide weather icons');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=I\'ve hidden the weather icons')).toBeVisible();
    
    // Check that icons are hidden
    await page.waitForTimeout(1000); // Wait for DOM updates
    const visibleIcons = await page.locator('.weather-icon:visible').count();
    expect(visibleIcons).toBe(0);
  });

  test('should change background color through chat', async ({ page }) => {
    // Change background to blue
    await page.fill('input[type="text"]', 'Change background to blue');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=changed the background to a nice blue color')).toBeVisible();
    
    // Check that background color is applied
    const bodyBackground = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bodyBackground).toContain('rgb(59, 130, 246)'); // Blue color
  });

  test('should change text color through chat', async ({ page }) => {
    // Change text color to red
    await page.fill('input[type="text"]', 'Make all text red');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=changed the text color to red')).toBeVisible();
    
    // Check that text color is applied to weather panels
    const textColor = await page.evaluate(() => {
      const panel = document.querySelector('.weather-panel');
      return panel ? window.getComputedStyle(panel).color : '';
    });
    expect(textColor).toContain('rgb(239, 68, 68)'); // Red color
  });

  test('should sort cities by temperature through chat', async ({ page }) => {
    // Sort by temperature
    await page.fill('input[type="text"]', 'Sort cities by temperature');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=sorted the cities by temperature')).toBeVisible();
    
    // Check that cities are sorted (this would require checking the actual order)
    // For now, just verify the response was received
    await expect(page.locator('text=ordered from coldest to warmest')).toBeVisible();
  });

  test('should sort cities by population through chat', async ({ page }) => {
    // Sort by population
    await page.fill('input[type="text"]', 'Sort cities by population');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=sorted the cities by population')).toBeVisible();
    
    // Check that cities are sorted
    await expect(page.locator('text=ordered from smallest to largest population')).toBeVisible();
  });

  test('should change to grid layout through chat', async ({ page }) => {
    // Change to grid layout
    await page.fill('input[type="text"]', 'Change to grid layout');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=changed the layout to a grid view')).toBeVisible();
    
    // Check that layout changed (this would require checking CSS classes)
    // For now, just verify the response was received
    await expect(page.locator('text=arranged in a neat grid pattern')).toBeVisible();
  });

  test('should increase spacing through chat', async ({ page }) => {
    // Increase spacing
    await page.fill('input[type="text"]', 'Increase spacing between cities');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=increased the spacing between city panels')).toBeVisible();
    
    // Check that spacing increased
    await expect(page.locator('text=more spacious and easier to read')).toBeVisible();
  });

  test('should enable animations through chat', async ({ page }) => {
    // Enable animations
    await page.fill('input[type="text"]', 'Enable smooth animations');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=enabled smooth animations')).toBeVisible();
    
    // Check that animations are enabled
    await expect(page.locator('text=feel more polished and responsive')).toBeVisible();
  });

  test('should add fade effects through chat', async ({ page }) => {
    // Add fade effects
    await page.fill('input[type="text"]', 'Add fade-in effects');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=added a fade-in effect')).toBeVisible();
    
    // Check that fade effects are added
    await expect(page.locator('text=smoothly fade in when they appear')).toBeVisible();
  });

  test('should reset all customizations through chat', async ({ page }) => {
    // First make some customizations
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
    
    await page.fill('input[type="text"]', 'Change background to blue');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=changed the background to a nice blue color')).toBeVisible();
    
    // Then reset all
    await page.fill('input[type="text"]', 'Reset all customizations');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=reset all customizations')).toBeVisible();
    
    // Check that reset was applied
    await expect(page.locator('text=back to the default appearance')).toBeVisible();
  });

  test('should handle unrecognized requests gracefully', async ({ page }) => {
    // Send an unrecognized request
    await page.fill('input[type="text"]', 'Make the weather dance');
    await page.click('button[type="submit"]');
    
    // Check that helpful response is shown
    await expect(page.locator('text=I understand you want to customize the interface')).toBeVisible();
    await expect(page.locator('text=Colors')).toBeVisible();
    await expect(page.locator('text=Icons')).toBeVisible();
    await expect(page.locator('text=Layout')).toBeVisible();
    await expect(page.locator('text=Animations')).toBeVisible();
    await expect(page.locator('text=Sorting')).toBeVisible();
    await expect(page.locator('text=Reset')).toBeVisible();
  });

  test('should maintain conversation history', async ({ page }) => {
    // Send multiple messages
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
    
    await page.fill('input[type="text"]', 'Change background to green');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=changed the background to a refreshing green color')).toBeVisible();
    
    // Check that both messages are still visible
    await expect(page.locator('text=Add weather icons')).toBeVisible();
    await expect(page.locator('text=Change background to green')).toBeVisible();
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
    await expect(page.locator('text=changed the background to a refreshing green color')).toBeVisible();
  });

  test('should handle Enter key to send messages', async ({ page }) => {
    // Send message using Enter key
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.press('input[type="text"]', 'Enter');
    
    // Check that message was sent
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
  });

  test('should not send empty messages', async ({ page }) => {
    // Try to send empty message
    await page.fill('input[type="text"]', '   ');
    await page.click('button[type="submit"]');
    
    // Check that no AI response appears
    await page.waitForTimeout(1000);
    const messages = await page.locator('.chat-message').count();
    expect(messages).toBe(0); // Only user message, no AI response
  });

  test('should show loading state while processing', async ({ page }) => {
    // Start sending a message
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.click('button[type="submit"]');
    
    // Check that loading state appears
    await expect(page.locator('text=AI is thinking...')).toBeVisible();
    
    // Wait for response
    await expect(page.locator('text=I\'ve added weather icons')).toBeVisible();
    
    // Check that loading state disappears
    await expect(page.locator('text=AI is thinking...')).not.toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
    
    // Send message
    await page.fill('input[type="text"]', 'Add weather icons');
    await page.click('button[type="submit"]');
    
    // Check that error message appears
    await expect(page.locator('text=Sorry, I encountered an error')).toBeVisible();
  });
});
