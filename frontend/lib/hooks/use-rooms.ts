import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "../contexts/websocket-context";

const ACTIVE_ROOM_KEY = "synctalk_active_room";

export function useRooms() {
  const { isConnected, subscribe, sendMessage } = useWebSocket();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Always start null to avoid SSR/client hydration mismatch
  const [activeRoomId, setActiveRoomIdState] = useState<string | null>(null);

  // Restore active room from localStorage after mount (client-only)
  useEffect(() => {
    const saved = localStorage.getItem(ACTIVE_ROOM_KEY);
    console.log("📦 Restored from localStorage:", saved);
    if (saved) setActiveRoomIdState(saved);
  }, []);

  // Persist to localStorage on every change
  const setActiveRoomId = useCallback((id: string | null) => {
    console.log("📦 setActiveRoomId:", id);

    setActiveRoomIdState(id);
    if (id) {
      localStorage.setItem(ACTIVE_ROOM_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_ROOM_KEY);
    }
  }, []);

  // Effect 1: Set up all event listeners once (stable, no reconnect dependency)
  useEffect(() => {
    const unsubRoomsList = subscribe("rooms_list", (data) => {
      console.log("📬 rooms_list received:", data.rooms?.length, "rooms");
      setRooms(data.rooms || []);
      setIsLoading(false);
    });

    const unsubRoomCreated = subscribe("room_created", (data) => {
      setRooms((prev) => [data.room, ...prev]);
    });

    const unsubUserJoined = subscribe("user_joined", (data) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === data.roomId ? { ...r, memberCount: r.memberCount + 1 } : r
        )
      );
    });

    const unsubUserLeft = subscribe("user_left", (data) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === data.roomId ? { ...r, memberCount: Math.max(0, r.memberCount - 1) } : r
        )
      );
    });

    const handleNewMessage = (data: any) => {
      setRooms((prev) => {
        const exists = prev.find((r) => r.id === data.roomId);
        if (!exists) return prev; // will be picked up by rooms_list refresh

        const updated = prev.map((r) =>
          r.id === data.roomId ? { ...r, lastMessage: data } : r
        );

        return updated.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp || a.created_at;
          const timeB = b.lastMessage?.timestamp || b.created_at;
          return new Date(timeB).getTime() - new Date(timeA).getTime();
        });
      });
    };

    // Listen for a new DM room being created/opened
    const unsubDmReady = subscribe("dm_room_ready", () => {
      // Refresh rooms list to pick up any new DM room
      sendMessage({ type: "get_rooms" });
    });

    const unsubChat = subscribe("chat", handleNewMessage);
    const unsubDm = subscribe("direct_message", handleNewMessage);

    return () => {
      unsubRoomsList();
      unsubRoomCreated();
      unsubUserJoined();
      unsubUserLeft();
      unsubChat();
      unsubDm();
      unsubDmReady();
    };
  }, [subscribe, sendMessage]);

  // Effect 2: Re-fetch rooms every time connection is established
  useEffect(() => {
    if (!isConnected) return;
    console.log("🔌 isConnected changed:", isConnected);
    sendMessage({ type: "get_rooms" });
  }, [isConnected, sendMessage]);

  const createRoom = (name: string, memberIds: string[] = []) => {
    sendMessage({ type: "create_room", name, memberIds });
  };

  const joinRoom = (roomId: string) => {
    sendMessage({ type: "join_room", roomId });
  };

  const leaveRoom = (roomId: string) => {
    sendMessage({ type: "leave_room", roomId });
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }
  };

  return {
    rooms,
    isLoading,
    createRoom,
    joinRoom,
    leaveRoom,
    activeRoomId,
    setActiveRoomId,
  };
}
