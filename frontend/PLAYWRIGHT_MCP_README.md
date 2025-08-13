# Playwright MCP Server

This project includes a Model Context Protocol (MCP) server for Playwright that allows AI assistants to control browser automation.

## Setup

1. Install dependencies:
```bash
npm install
```

2. The MCP server is located at `mcp-server-playwright.js` and uses the configuration in `mcp-config.json`.

## Available Tools

The Playwright MCP server provides the following tools:

### 1. launch_browser
Launch a new browser instance.

**Parameters:**
- `browserType` (required): 'chromium', 'firefox', or 'webkit'
- `headless` (optional): boolean, defaults to true

**Example:**
```json
{
  "browserType": "chromium",
  "headless": false
}
```

### 2. navigate_to
Navigate to a URL.

**Parameters:**
- `url` (required): URL to navigate to
- `browserId` (required): Browser instance ID returned from launch_browser

**Example:**
```json
{
  "url": "https://example.com",
  "browserId": "browser_1234567890"
}
```

### 3. click_element
Click on an element using a CSS selector.

**Parameters:**
- `selector` (required): CSS selector for the element
- `browserId` (required): Browser instance ID

**Example:**
```json
{
  "selector": "#submit-button",
  "browserId": "browser_1234567890"
}
```

### 4. type_text
Type text into an element.

**Parameters:**
- `selector` (required): CSS selector for the element
- `text` (required): Text to type
- `browserId` (required): Browser instance ID

**Example:**
```json
{
  "selector": "#search-input",
  "text": "weather forecast",
  "browserId": "browser_1234567890"
}
```

### 5. get_page_content
Get the current page content and title.

**Parameters:**
- `browserId` (required): Browser instance ID

**Example:**
```json
{
  "browserId": "browser_1234567890"
}
```

### 6. take_screenshot
Take a screenshot of the current page.

**Parameters:**
- `browserId` (required): Browser instance ID
- `path` (optional): Path to save the screenshot

**Example:**
```json
{
  "browserId": "browser_1234567890",
  "path": "screenshot.png"
}
```

### 7. close_browser
Close a browser instance.

**Parameters:**
- `browserId` (required): Browser instance ID

**Example:**
```json
{
  "browserId": "browser_1234567890"
}
```

## Usage with AI Assistants

To use this MCP server with an AI assistant that supports MCP:

1. Configure your AI assistant to use the MCP configuration in `mcp-config.json`
2. The assistant will be able to control browser automation through the available tools
3. Each browser instance gets a unique ID that must be used for subsequent operations

## Example Workflow

1. Launch a browser: `launch_browser` with `browserType: "chromium"`
2. Navigate to a page: `navigate_to` with the returned browser ID
3. Interact with elements: `click_element`, `type_text`
4. Get page content: `get_page_content`
5. Take screenshots: `take_screenshot`
6. Close browser: `close_browser`

## Notes

- The server manages browser instances internally using Maps
- Each browser instance has a unique ID generated with timestamp
- Screenshots are saved to the current working directory by default
- The server supports Chromium, Firefox, and WebKit browsers
- All operations are asynchronous and return structured responses 