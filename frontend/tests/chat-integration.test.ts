import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatPanel from '../src/components/ChatPanel';
import { GUICustomization } from '../src/types/weather';

// Mock fetch
global.fetch = vi.fn();

// Mock console methods to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  vi.clearAllMocks();
  console.log = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('Chat Integration Tests', () => {
  const mockOnCustomizations = vi.fn();
  const mockCustomizations: GUICustomization[] = [];

  beforeEach(() => {
    mockOnCustomizations.mockClear();
  });

  test('should render chat panel with correct initial state', () => {
    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    expect(screen.getByText('AI Weather Customization')).toBeInTheDocument();
    expect(screen.getByText('Ask me to customize the interface!')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should send message and receive response', async () => {
    const mockResponse = {
      response: 'I\'ve added weather icons!',
      customizations: [{
        id: 'test-1',
        timestamp: new Date(),
        description: 'Added weather icons',
        changes: [{
          targetElement: '.weather-panel',
          property: 'showIcons',
          value: 'true',
          previousValue: 'false'
        }]
      }]
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    // Check that user message appears
    expect(screen.getByText('Add weather icons')).toBeInTheDocument();

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('I\'ve added weather icons!')).toBeInTheDocument();
    });

    // Check that customizations were passed to parent
    expect(mockOnCustomizations).toHaveBeenCalledWith(mockResponse.customizations);
  });

  test('should handle API errors gracefully', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument();
    });

    expect(mockOnCustomizations).not.toHaveBeenCalled();
  });

  test('should handle invalid response format', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: 'response' }),
    });

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument();
    });
  });

  test('should show loading state while processing', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    (global.fetch as any).mockReturnValueOnce(promise);

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    // Check loading state
    expect(screen.getByText('AI is thinking...')).toBeInTheDocument();
    expect(sendButton).toBeDisabled();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => ({
        response: 'Done!',
        customizations: []
      }),
    });

    await waitFor(() => {
      expect(screen.queryByText('AI is thinking...')).not.toBeInTheDocument();
    });
  });

  test('should not send empty messages', () => {
    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(sendButton);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('should send current customizations in request', async () => {
    const currentCustomizations: GUICustomization[] = [{
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

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Done!',
        customizations: []
      }),
    });

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={currentCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Add weather icons',
          currentCustomizations: currentCustomizations
        }),
      });
    });
  });

  test('should handle Enter key to send message', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Done!',
        customizations: []
      }),
    });

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test('should clear input after sending message', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        response: 'Done!',
        customizations: []
      }),
    });

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('should display multiple messages in conversation', async () => {
    const mockResponse1 = {
      response: 'I\'ve added weather icons!',
      customizations: []
    };

    const mockResponse2 = {
      response: 'I\'ve changed the background to blue!',
      customizations: []
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse2,
      });

    render(
      <ChatPanel 
        onCustomizations={mockOnCustomizations} 
        customizations={mockCustomizations} 
      />
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    // Send first message
    fireEvent.change(input, { target: { value: 'Add weather icons' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Add weather icons')).toBeInTheDocument();
      expect(screen.getByText('I\'ve added weather icons!')).toBeInTheDocument();
    });

    // Send second message
    fireEvent.change(input, { target: { value: 'Change background to blue' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Change background to blue')).toBeInTheDocument();
      expect(screen.getByText('I\'ve changed the background to blue!')).toBeInTheDocument();
    });

    // Check that both messages are visible
    expect(screen.getAllByText(/Add weather icons|Change background to blue/)).toHaveLength(2);
    expect(screen.getAllByText(/I've added weather icons|I've changed the background to blue/)).toHaveLength(2);
  });
});
