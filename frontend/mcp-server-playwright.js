#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { chromium, firefox, webkit } = require('playwright');

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browsers = new Map();
    this.pages = new Map();
    this.contexts = new Map();
  }

  async initialize() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'launch_browser',
            description: 'Launch a new browser instance',
            inputSchema: {
              type: 'object',
              properties: {
                browserType: {
                  type: 'string',
                  enum: ['chromium', 'firefox', 'webkit'],
                  description: 'Type of browser to launch',
                },
                headless: {
                  type: 'boolean',
                  description: 'Whether to run in headless mode',
                  default: true,
                },
              },
              required: ['browserType'],
            },
          },
          {
            name: 'navigate_to',
            description: 'Navigate to a URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to navigate to',
                },
                browserId: {
                  type: 'string',
                  description: 'Browser instance ID',
                },
              },
              required: ['url', 'browserId'],
            },
          },
          {
            name: 'click_element',
            description: 'Click on an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element',
                },
                browserId: {
                  type: 'string',
                  description: 'Browser instance ID',
                },
              },
              required: ['selector', 'browserId'],
            },
          },
          {
            name: 'type_text',
            description: 'Type text into an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element',
                },
                text: {
                  type: 'string',
                  description: 'Text to type',
                },
                browserId: {
                  type: 'string',
                  description: 'Browser instance ID',
                },
              },
              required: ['selector', 'text', 'browserId'],
            },
          },
          {
            name: 'get_page_content',
            description: 'Get the current page content',
            inputSchema: {
              type: 'object',
              properties: {
                browserId: {
                  type: 'string',
                  description: 'Browser instance ID',
                },
              },
              required: ['browserId'],
            },
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                browserId: {
                  type: 'string',
                  description: 'Browser instance ID',
                },
                path: {
                  type: 'string',
                  description: 'Path to save the screenshot',
                },
              },
              required: ['browserId'],
            },
          },
          {
            name: 'close_browser',
            description: 'Close a browser instance',
            inputSchema: {
              type: 'object',
              properties: {
                browserId: {
                  type: 'string',
                  description: 'Browser instance ID',
                },
              },
              required: ['browserId'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args);
          case 'navigate_to':
            return await this.navigateTo(args);
          case 'click_element':
            return await this.clickElement(args);
          case 'type_text':
            return await this.typeText(args);
          case 'get_page_content':
            return await this.getPageContent(args);
          case 'take_screenshot':
            return await this.takeScreenshot(args);
          case 'close_browser':
            return await this.closeBrowser(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async launchBrowser(args) {
    const { browserType, headless = true } = args;
    const browserId = `browser_${Date.now()}`;

    let browser;
    switch (browserType) {
      case 'chromium':
        browser = await chromium.launch({ headless });
        break;
      case 'firefox':
        browser = await firefox.launch({ headless });
        break;
      case 'webkit':
        browser = await webkit.launch({ headless });
        break;
      default:
        throw new Error(`Unsupported browser type: ${browserType}`);
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    this.browsers.set(browserId, browser);
    this.contexts.set(browserId, context);
    this.pages.set(browserId, page);

    return {
      content: [
        {
          type: 'text',
          text: `Browser launched successfully with ID: ${browserId}`,
        },
      ],
    };
  }

  async navigateTo(args) {
    const { url, browserId } = args;
    const page = this.pages.get(browserId);

    if (!page) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }

    await page.goto(url);

    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${url}`,
        },
      ],
    };
  }

  async clickElement(args) {
    const { selector, browserId } = args;
    const page = this.pages.get(browserId);

    if (!page) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }

    await page.click(selector);

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element with selector: ${selector}`,
        },
      ],
    };
  }

  async typeText(args) {
    const { selector, text, browserId } = args;
    const page = this.pages.get(browserId);

    if (!page) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }

    await page.fill(selector, text);

    return {
      content: [
        {
          type: 'text',
          text: `Typed text into element with selector: ${selector}`,
        },
      ],
    };
  }

  async getPageContent(args) {
    const { browserId } = args;
    const page = this.pages.get(browserId);

    if (!page) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }

    const content = await page.content();
    const title = await page.title();

    return {
      content: [
        {
          type: 'text',
          text: `Page Title: ${title}\n\nPage Content:\n${content}`,
        },
      ],
    };
  }

  async takeScreenshot(args) {
    const { browserId, path } = args;
    const page = this.pages.get(browserId);

    if (!page) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }

    const screenshotPath = path || `screenshot_${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to: ${screenshotPath}`,
        },
      ],
    };
  }

  async closeBrowser(args) {
    const { browserId } = args;
    const browser = this.browsers.get(browserId);

    if (!browser) {
      throw new Error(`Browser with ID ${browserId} not found`);
    }

    await browser.close();
    this.browsers.delete(browserId);
    this.contexts.delete(browserId);
    this.pages.delete(browserId);

    return {
      content: [
        {
          type: 'text',
          text: `Browser ${browserId} closed successfully`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP Server started');
  }
}

async function main() {
  const server = new PlaywrightMCPServer();
  await server.initialize();
  await server.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = PlaywrightMCPServer; 