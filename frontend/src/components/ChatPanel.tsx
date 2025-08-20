import { useState, useRef, useEffect } from 'react';
import { ChatMessage, GUICustomization } from '../types/weather';
import ChatMessageComponent from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onCustomization: (customizations: GUICustomization[]) => void;
  onReset?: () => void;
}

export default function ChatPanel({ isOpen, onToggle, onCustomization, onReset }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI assistant for customizing the weather app. I can help you:

• Change colors and styling
• Reorder cities and layout
• Add icons and visual elements
• Modify the overall appearance

Try saying something like "make the background blue" or "sort cities by temperature"!`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          currentCustomizations: [] // We'll implement this later
        }),
      });

      const data = await response.json();
      console.log('🔍 Backend response data:', data);
      console.log('🔍 Customizations received:', data.customizations);

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          appliedCustomizations: data.customizations.map((c: GUICustomization) => c.id)
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Apply customizations if any
        if (data.customizations && data.customizations.length > 0) {
          console.log('🎨 Calling onCustomization with:', data.customizations);
          onCustomization(data.customizations);
        } else {
          console.warn('⚠️ No customizations in response or empty array');
        }
      } else {
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${data.error}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI assistant for customizing the weather app. I can help you:

• Change colors and styling
• Reorder cities and layout
• Add icons and visual elements
• Modify the overall appearance

Try saying something like "make the background blue" or "sort cities by temperature"!`,
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-800">AI Customization Assistant</h3>
        <div className="flex items-center space-x-2">
          {onReset && (
            <button
              onClick={() => {
                try {
                  onReset();
                } catch (error) {
                  console.error('Error in reset function:', error);
                }
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
              title="Reset customizations"
            >
              🔄
            </button>
          )}
          <button
            onClick={clearChat}
            className="text-gray-500 hover:text-gray-700 text-sm"
            title="Clear chat"
          >
            🗑️
          </button>
          <button
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700"
            title="Minimize chat"
          >
            ➖
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
