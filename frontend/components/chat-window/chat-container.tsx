import { ChatTextBox } from "./chat-text-box";
import { MoreHorizontal, UserCircle2 } from "lucide-react";

export function ChatContainer() {
  return (
    <div className="flex flex-col flex-1 h-full bg-[#1C1C1C] border-l border-[#2A2A2A]">
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#E04F38] to-[#B33522]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] border-2 border-[#1C1C1C] rounded-full" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#F3F4F6]">Jhey Gulde</span>
            <span className="text-xs text-[#10B981]">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#2A2A2A] hover:bg-[#343434] text-[#F3F4F6] text-sm px-3 py-1.5 rounded-[6px] transition-colors">
            <UserCircle2 className="w-4 h-4" />
            <span>View Profile</span>
          </button>
          <button className="flex items-center justify-center w-8 h-8 bg-[#2A2A2A] hover:bg-[#343434] text-[#F3F4F6] rounded-[6px] transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-end">
        <div className="flex flex-col items-center justify-center h-full text-[#6B7280] border-2 border-dashed border-[#343434] rounded-xl m-4">
          <p className="text-sm font-medium text-[#9CA3AF]">Chat Bubbles Area</p>
        </div>
      </div>

      <ChatTextBox typingUser={null} />
    </div>
  );
}