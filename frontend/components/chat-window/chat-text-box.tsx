import { Paperclip, Smile, Send } from "lucide-react";

interface ChatTextBoxProps {
  typingUser?: string | null;
}

export function ChatTextBox({ typingUser }: ChatTextBoxProps) {
  return (
    <div className="flex flex-col gap-2 w-full px-4 pb-4">
      <div className="h-4 ml-1">
        {typingUser && (
          <span className="text-xs text-[#9CA3AF]">
            {typingUser} is typing ...
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 bg-[#252525] border border-[#343434] rounded-[16px] pr-2 pl-4 py-2">
        <input
          type="text"
          placeholder="Enter message..."
          className="flex-1 bg-transparent text-sm text-[#F3F4F6] placeholder:text-[#6B7280] focus:outline-none"
        />

        <div className="flex items-center gap-3 pr-2 text-[#9CA3AF]">
          <button className="hover:text-[#F3F4F6] transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="hover:text-[#F3F4F6] transition-colors">
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button className="flex items-center gap-2 bg-[#343434] hover:bg-[#404040] text-[#F3F4F6] text-sm font-medium px-4 py-1.5 rounded-full transition-colors">
          <Send className="w-4 h-4" />
          <span>Sent</span>
        </button>
      </div>
    </div>
  );
}