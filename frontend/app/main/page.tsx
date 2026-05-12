"use client";

import { useState } from "react";
import { useWebSocket } from "@/lib/contexts/websocket-context";
import { useRooms } from "@/lib/hooks/use-rooms";
import { usePresence } from "@/lib/hooks/use-presence";
import { NavigationBar } from "@/components/navigation-bar/navigation-bar";
import { ChatSidebar } from "@/components/chat-sidebar/chat-sidebar";
import { ChatContainer } from "@/components/chat-window/chat-container";
import { ProfileSidebar } from "@/components/chat-bar/profile-sidebar";

export default function MainPage() {
  const { isConnected } = useWebSocket();
  const { rooms, isLoading: isRoomsLoading, activeRoomId, setActiveRoomId } = useRooms();
  const { onlineUsers } = usePresence();

  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);

  const handleProfileClick = (userId: string) => {
    setSelectedProfileUserId(userId);
    setShowProfileSidebar(true);
  };

  return (
    <div className="flex flex-col h-screen bg-[#05060F] font-sans overflow-hidden w-screen">
      {!isConnected && (
        <div className="bg-yellow-600/20 border-b border-yellow-600/50 text-yellow-500 text-sm py-1 text-center animate-pulse">
          Reconnecting...
        </div>
      )}

      <NavigationBar />

      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar
          rooms={rooms}
          activeRoomId={activeRoomId}
          setActiveRoomId={setActiveRoomId}
          onlineUsers={onlineUsers}
          isLoading={isRoomsLoading}
        />

        <div className="flex-1 flex overflow-hidden">
          <ChatContainer
            activeRoomId={activeRoomId}
            onProfileClick={handleProfileClick}
          />

          {showProfileSidebar && selectedProfileUserId && (
            <ProfileSidebar
              userId={selectedProfileUserId}
              onClose={() => setShowProfileSidebar(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
