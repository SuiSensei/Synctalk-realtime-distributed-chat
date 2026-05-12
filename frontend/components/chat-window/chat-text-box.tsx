import { useState, useRef } from "react";
import { Paperclip, Smile, Send } from "lucide-react";
import { useWebSocket } from "@/lib/contexts/websocket-context";

interface ChatTextBoxProps {
  onSend: (text: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
}

export function ChatTextBox({ onSend, onTyping, onStopTyping }: ChatTextBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const { isConnected } = useWebSocket();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || !isConnected) return;
    
    onSend(text);
    setInputValue("");
    onStopTyping();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onTyping();
  };
  return (
    <div className="flex flex-col gap-2 w-full px-4 pb-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-[#252525] border border-[#343434] rounded-[16px] pr-2 pl-4 py-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={!isConnected}
          placeholder={isConnected ? "Enter message..." : "Reconnecting..."}
          className="flex-1 bg-transparent text-sm text-[#F3F4F6] placeholder:text-[#6B7280] focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center gap-3 pr-2 text-[#9CA3AF]">
          <button className="hover:text-[#F3F4F6] transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="hover:text-[#F3F4F6] transition-colors">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button 
          type="submit"
          disabled={!inputValue.trim() || !isConnected}
          className="flex items-center gap-2 bg-[#343434] hover:bg-[#404040] text-[#F3F4F6] text-sm font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}