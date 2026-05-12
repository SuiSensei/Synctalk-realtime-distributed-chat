import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { NewChatDropdown } from "./new-chat-dropdown";
import { ChatItem } from "./chat-item";
import { formatRelativeTime } from "@/lib/utils/format-time";
import { getAvatarGradient } from "@/lib/utils/avatar";

interface ChatSidebarProps {
  rooms: any[];
  activeRoomId: string | null;
  setActiveRoomId: (id: string) => void;
  onlineUsers: any[];
  isLoading: boolean;
}

export function ChatSidebar({ rooms, activeRoomId, setActiveRoomId, onlineUsers, isLoading }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(() => {
    if (!searchQuery) return rooms;
    return rooms.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rooms, searchQuery]);

  return (
    <aside className="flex flex-col w-85 h-[calc(100dvh-4rem)] scroll-auto bg-[#1C1C1C] border-r border-[#2A2A2A] w-1/3">
      <div className="flex items-center justify-between p-4 pb-3">
        <h2 className="text-xl font-semibold text-[#F3F4F6] tracking-tight">
          Chats
        </h2>
        <NewChatDropdown onRoomReady={setActiveRoomId} />
      </div>
      { }
      <div className="px-4 pb-3 border-b border-[#2A2A2A]">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Chats search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm bg-[#252525] text-[#F3F4F6] border border-[#343434] rounded-[6px] focus:outline-none focus:border-[#4B5563] transition-colors placeholder:text-[#6B7280]"
          />
        </div>
      </div>

      { }
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#1C1C1C]">
        <div className="flex flex-col">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 mx-2 my-1">
                <div className="w-12 h-12 rounded-full bg-[#2A2A2A] animate-pulse shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-[#2A2A2A] rounded w-24 animate-pulse mb-2" />
                  <div className="h-3 bg-[#2A2A2A] rounded w-32 animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            filteredRooms.map((room) => {
              // Extract name for DMs (hacky but works for now)
              const displayName = room.name.startsWith("DM:") ? room.name.replace("DM: ", "") : room.name;

              return (
                <div key={room.id} onClick={() => setActiveRoomId(room.id)}>
                  <ChatItem
                    name={displayName}
                    message={room.lastMessage?.content || "No messages yet"}
                    time={formatRelativeTime(room.lastMessage?.created_at)}
                    unreadCount={0}
                    avatarColor={getAvatarGradient(room.id)}
                    isOnline={false} // Would need to check onlineUsers against room members
                    readStatus="sent"
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}