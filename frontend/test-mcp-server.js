#!/usr/bin/env node

const PlaywrightMCPServer = require('./mcp-server-playwright.js');

async function testMCPServer() {
  console.log('Testing Playwright MCP Server...');
  
  const server = new PlaywrightMCPServer();
  await server.initialize();
  
  try {
    // Test launching a browser
    console.log('Testing browser launch...');
    const launchResult = await server.launchBrowser({
      browserType: 'chromium',
      headless: true
    });
    console.log('Launch result:', launchResult);
    
    // Extract browser ID from the result
    const browserId = launchResult.content[0].text.match(/ID: (browser_\d+)/)[1];
    console.log('Browser ID:', browserId);
    
    // Test navigation
    console.log('Testing navigation...');
    const navigateResult = await server.navigateTo({
      url: 'https://example.com',
      browserId: browserId
    });
    console.log('Navigate result:', navigateResult);
    
    // Test getting page content
    console.log('Testing page content retrieval...');
    const contentResult = await server.getPageContent({
      browserId: browserId
    });
    console.log('Content result title:', contentResult.content[0].text.split('\n')[0]);
    
    // Test taking a screenshot
    console.log('Testing screenshot...');
    const screenshotResult = await server.takeScreenshot({
      browserId: browserId,
      path: 'test-screenshot.png'
    });
    console.log('Screenshot result:', screenshotResult);
    
    // Test closing browser
    console.log('Testing browser close...');
    const closeResult = await server.closeBrowser({
      browserId: browserId
    });
    console.log('Close result:', closeResult);
    
    console.log('All tests passed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

if (require.main === module) {
  testMCPServer().catch(console.error);
} 