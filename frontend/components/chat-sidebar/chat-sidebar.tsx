import { Search } from "lucide-react";
import { NewChatDropdown } from "./new-chat-dropdown";
import { ChatItem } from "./chat-item";

const MOCK_CHATS = [
  { id: 1, name: "Jhey Guide", message: "facts.", time: "10 minutes", unreadCount: 8, avatarColor: "bg-gradient-to-b from-[#E04F38] to-[#B33522]", isOnline: true, readStatus: "sent" as const },
  { id: 2, name: "Nickola Peever", message: "Sounds perfect! I've been ...", time: "40 minutes", unreadCount: 4, avatarColor: "bg-gradient-to-b from-[#00B4D8] to-[#008BA6]", isOnline: true, readStatus: "sent" as const },
  { id: 3, name: "Ossie Peasey", message: "How about 7 PM at the new it ...", time: "13 days", unreadCount: 0, avatarColor: "bg-gradient-to-b from-[#80C868] to-[#5C9B47]", isOnline: false, readStatus: "read" as const },
  { id: 4, name: "Farand Hume", message: "Great! Looking forward to see ...", time: "2 days", unreadCount: 0, avatarColor: "bg-gradient-to-b from-[#AA00FF] to-[#7B00B8]", isOnline: false, readStatus: "read" as const },
  { id: 5, name: "Hali Negri", message: "Hey Bonnie, yes, definitely...", time: "3 hours", unreadCount: 2, avatarColor: "bg-gradient-to-b from-[#D4A33B] to-[#9E7828]", isOnline: true, readStatus: "sent" as const },
  { id: 6, name: "Bab Cleaton", message: "No worries at all! I'll grab a ...", time: "6 minutes", unreadCount: 8, avatarColor: "bg-gradient-to-b from-[#5B48E4] to-[#3B2BA6]", isOnline: true, readStatus: "sent" as const },
  { id: 7, name: "Elyssa Segot", message: "She just told me today.", time: "7 minutes", unreadCount: 8, avatarColor: "bg-gradient-to-b from-[#C84B9C] to-[#943171]", isOnline: false, readStatus: "sent" as const },
  { id: 8, name: "Gil Wilfing", message: "See you in 5 minutes!", time: "3 days", unreadCount: 8, avatarColor: "bg-gradient-to-b from-[#38D4B0] to-[#259C80]", isOnline: true, readStatus: "read" as const },
  { id: 9, name: "Janith Satch", message: "If it takes long you can ma ...", time: "24 minutes", unreadCount: 8, avatarColor: "bg-gradient-to-b from-[#E2E8F0] to-[#9CA3AF]", isOnline: true, readStatus: "sent" as const },
];

export function ChatSidebar() {
  return (
    <aside className="flex flex-col w-[340px] h-full bg-[#1C1C1C] border-r border-[#2A2A2A]">
      {}
      <div className="flex items-center justify-between p-4 pb-3">
        <h2 className="text-xl font-semibold text-[#F3F4F6] tracking-tight">
          Chats
        </h2>
        <NewChatDropdown />
      </div>

      {}
      <div className="px-4 pb-3 border-b border-[#2A2A2A]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Chats search..."
            className="w-full h-9 pl-9 pr-4 text-sm bg-[#252525] text-[#F3F4F6] border border-[#343434] rounded-[6px] focus:outline-none focus:border-[#4B5563] transition-colors placeholder:text-[#6B7280]"
          />
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#1C1C1C]">
        <div className="flex flex-col">
          {MOCK_CHATS.map((chat) => (
            <ChatItem
              key={chat.id}
              name={chat.name}
              message={chat.message}
              time={chat.time}
              unreadCount={chat.unreadCount}
              avatarColor={chat.avatarColor}
              isOnline={chat.isOnline}
              readStatus={chat.readStatus}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}