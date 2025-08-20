

interface ChatToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function ChatToggle({ isOpen, onToggle }: ChatToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg border-2 border-white transition-all duration-200 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-blue-500 hover:bg-blue-600'
      }`}
      title={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      <span className="text-white text-2xl">
        {isOpen ? '✕' : '🤖'}
      </span>
    </button>
  );
}
