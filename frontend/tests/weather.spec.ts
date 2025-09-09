import { test, expect } from '@playwright/test';

test.describe('Weather App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('should load the main page', async ({ page }) => {
    // Check if the title is present
    await expect(page.getByRole('heading', { name: /Weather App/i })).toBeVisible();
    
    // Check if the reset button is present
    await expect(page.getByRole('button', { name: /Reset All/i })).toBeVisible();
    
    // Check if weather panels are present (demo cities should be loaded)
    await expect(page.locator('.weather-panel')).toHaveCount(5); // Should have 5 demo cities
  });

  test('should add a new city', async ({ page }) => {
    // Type a city name
    await page.getByPlaceholder('Enter city name').fill('London');
    
    // Click the add button
    await page.getByRole('button', { name: /Add City/i }).click();
    
    // Wait for the city panel to appear
    const cityPanel = page.getByRole('heading', { name: /London/i });
    await expect(cityPanel).toBeVisible({ timeout: 10000 });
  });

  test('should display weather details when expanding a city panel', async ({ page }) => {
    // Add a city first
    await page.getByPlaceholder('Enter city name').fill('Tokyo');
    await page.getByRole('button', { name: /Add City/i }).click();
    
    // Wait for the city panel to appear and click it
    const cityPanel = page.getByRole('heading', { name: /Tokyo/i }).locator('..');
    await expect(cityPanel).toBeVisible({ timeout: 10000 });
    await cityPanel.click();
    
    // Wait for the expanded content to be visible
    const expandedContent = page.locator('.border-t.border-gray-100');
    await expect(expandedContent).toBeVisible({ timeout: 10000 });
    
    // Check for the first day's temperature display
    const firstDayTemp = expandedContent.locator('.text-right.whitespace-nowrap').first();
    await expect(firstDayTemp).toBeVisible();
    
    // Verify the temperature format
    const tempText = await firstDayTemp.textContent();
    expect(tempText).toMatch(/\d+°C \/ \d+°C/);
  });

  test('should handle invalid city names', async ({ page }) => {
    // Try to add an invalid city
    const invalidCity = 'NonExistentCity123';
    await page.getByPlaceholder('Enter city name').fill(invalidCity);
    await page.getByRole('button', { name: /Add City/i }).click();
    
    // Check if error message appears in the error div
    await expect(
      page.locator('.bg-red-100.border.border-red-400.text-red-700')
        .filter({ hasText: `Failed to load weather data for ${invalidCity}` })
    ).toBeVisible({ timeout: 10000 });
  });

  test('should prevent duplicate cities', async ({ page }) => {
    // Add a city
    await page.getByPlaceholder('Enter city name').fill('Paris');
    await page.getByRole('button', { name: /Add City/i }).click();
    
    // Wait for the first city to be added
    await expect(page.getByRole('heading', { name: /Paris/i })).toBeVisible({ timeout: 10000 });
    
    // Try to add the same city again
    await page.getByPlaceholder('Enter city name').fill('Paris');
    await page.getByRole('button', { name: /Add City/i }).click();
    
    // Check if error message appears in the error div
    await expect(
      page.locator('.bg-red-100.border.border-red-400.text-red-700')
        .filter({ hasText: /Paris is already in your forecast list/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('should show My Location card if geolocation is allowed', async ({ page, context }) => {
    // Mock geolocation to a known city (e.g., Paris)
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
    await page.goto('/');
    // Wait for My Location card
    await expect(page.getByRole('heading', { name: /My Location/i })).toBeVisible({ timeout: 10000 });
    // Should show the pin icon (📍)
    await expect(page.locator('div[title="My Location"]')).toBeVisible();
  });

  test('should not show My Location card if geolocation is denied', async ({ page, context }) => {
    // Deny geolocation
    await context.grantPermissions([], { origin: page.url() });
    await page.goto('/');
    // Should not show My Location card
    await expect(page.getByRole('heading', { name: /My Location/i })).toHaveCount(0);
  });

  test('should allow both My Location and a manual city', async ({ page, context }) => {
    // Mock geolocation to a known city (e.g., Paris)
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 48.8566, longitude: 2.3522 });
    await page.goto('/');
    // Wait for My Location card
    await expect(page.getByRole('heading', { name: /My Location/i })).toBeVisible({ timeout: 10000 });
    // Add a manual city
    await page.getByPlaceholder('Enter city name').fill('London');
    await page.getByRole('button', { name: /Add City/i }).click();
    await expect(page.getByRole('heading', { name: /London/i })).toBeVisible({ timeout: 10000 });
    // Both cards should be present
    await expect(page.getByRole('heading', { name: /My Location/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /London/i })).toBeVisible();
  });
}); 