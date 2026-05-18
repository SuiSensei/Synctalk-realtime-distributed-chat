import { useRef, useEffect } from "react";
import { MessageSquare, MoreHorizontal, UserCircle2 } from "lucide-react";
import { ChatBubble } from "./chat-bubble";
import { ChatTextBox } from "./chat-text-box";
import { ChatOptionsDropdown } from "../chat-bar/chat-options-dropdown";
import { useChat } from "@/lib/hooks/use-chat";
import { usePresence } from "@/lib/hooks/use-presence";
import { formatRelativeTime } from "@/lib/utils/format-time";

interface ChatContainerProps {
  activeRoomId: string | null;
  onProfileClick: (userId: string) => void;
}

export function ChatContainer({ activeRoomId, onProfileClick }: ChatContainerProps) {
  const { messages, isLoading, sendMessage, sendTyping, stopTyping, typingUsers } = useChat(activeRoomId);
  const { myProfile } = usePresence();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  if (!activeRoomId) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-[#141414] border-l border-[#2A2A2A] w-1/3">
        <MessageSquare className="w-12 h-12 text-[#343434] mb-4" />
        <h3 className="text-xl font-medium text-[#9CA3AF]">Select a conversation to start chatting</h3>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-[#141414] border-l border-[#2A2A2A] w-2/3">
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#00B4D8] to-[#008BA6] flex items-center justify-center text-white font-medium shrink-0">
            R
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#F3F4F6]">Room {activeRoomId.substring(0, 4)}</h2>
            <p className="text-xs text-[#9CA3AF]">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#9CA3AF]">
          <ChatOptionsDropdown roomId={activeRoomId} />
          <button onClick={() => onProfileClick(activeRoomId)} className="hover:text-[#F3F4F6] transition-colors">
            <UserCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div className="w-64 h-16 bg-[#252525] animate-pulse rounded-[6px]" />
            </div>
          ))
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg.content}
              timestamp={formatRelativeTime(msg.timestamp)}
              avatarFallback={msg.sender?.username?.charAt(0).toUpperCase() || "?"}
              isSelf={myProfile?.id === msg.sender?.id}
              senderName={msg.sender?.username}
              reactions={msg.reactions}
              messageId={msg.id}
              myUserId={myProfile?.id}
            />
          ))
        )}

        {typingUsers.size > 0 && (
          <ChatBubble
            typing={true}
            avatarFallback={Array.from(typingUsers)[0]?.charAt(0).toUpperCase()}
            senderName={Array.from(typingUsers)[0]}
          />
        )}
        <div ref={bottomRef} />
      </div>

      <ChatTextBox
        onSend={sendMessage}
        onTyping={sendTyping}
        onStopTyping={stopTyping}
      />
    </main>
  );
}