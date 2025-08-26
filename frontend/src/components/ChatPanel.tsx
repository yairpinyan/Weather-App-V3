import React, { useState } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import { ChatMessage as ChatMessageType, GUICustomization } from '../types/chat';

interface ChatPanelProps {
  onCustomizations: (customizations: GUICustomization[]) => void;
  customizations: GUICustomization[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onCustomizations, customizations }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          currentCustomizations: customizations
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 Customizations received:', data.customizations);

      if (data.response && data.customizations !== undefined) {
        const assistantMessage: ChatMessageType = {
          id: `assistant-${Date.now()}`,
          content: data.response,
          sender: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Apply customizations if any
        if (data.customizations && data.customizations.length > 0) {
          onCustomizations(data.customizations);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        content: `Sorry, I encountered an error processing your request. Please try again.`,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col">
      <div className="bg-blue-500 text-white p-3 rounded-t-lg">
        <h3 className="font-semibold">AI Weather Customization</h3>
        <p className="text-sm opacity-90">Ask me to customize the interface!</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm italic">
            AI is thinking...
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;
