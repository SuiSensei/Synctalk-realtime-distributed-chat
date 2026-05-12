import { useState, useEffect, useRef, useCallback } from "react";
import { useWebSocket } from "../contexts/websocket-context";
import { toast } from "sonner";

const TYPING_EXPIRE_MS = 5000; // Auto-clear typing indicator after 5s
const TYPING_SEND_DEBOUNCE_MS = 3000; // Send stopped_typing after 3s of no input

export function useChat(roomId: string | null) {
  const { isConnected, subscribe, sendMessage } = useWebSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(!!roomId); // true immediately if room is pre-selected
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); // for auto stop-typing send
  const typingExpireTimers = useRef<Map<string, NodeJS.Timeout>>(new Map()); // per-user expire
  const prevRoomIdRef = useRef<string | null>(null);
  const hasSentTypingRef = useRef(false);

  // Helper: remove a specific user from typing set
  const removeTypingUser = useCallback((username: string) => {
    setTypingUsers((prev) => {
      const next = new Set(prev);
      next.delete(username);
      return next;
    });
  }, []);

  useEffect(() => {
    console.log("💬 useChat effect:", { isConnected, roomId });
    if (!isConnected || !roomId) return;

    if (prevRoomIdRef.current !== roomId) {
      setIsLoading(true);
      setMessages([]);
      setTypingUsers(new Set());
      prevRoomIdRef.current = roomId;
      // Clear all per-user expire timers on room switch
      typingExpireTimers.current.forEach((t) => clearTimeout(t));
      typingExpireTimers.current.clear();
    }

    console.log("📤 Sending get_messages for:", roomId);
    sendMessage({ type: "get_messages", roomId });

    const unsubMessagesList = subscribe("messages_list", (data) => {
      console.log("📬 messages_list received:", data.roomId, data.messages?.length);
      if (data.roomId === roomId) {
        setMessages(data.messages || []);
        setIsLoading(false);
      }
    });

    const unsubChat = subscribe("chat", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    const unsubDirectMessage = subscribe("direct_message", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    // Bug 4 fix: listen for live reaction updates
    const unsubReacted = subscribe("message_reacted", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    });

    // Bug 3 fix: auto-expire typing indicator per user after 5s
    const unsubTyping = subscribe("user_typing", (data) => {
      if (data.roomId !== roomId) return;
      const username: string = data.user.username;

      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.add(username);
        return next;
      });

      // Reset the per-user expiry timer
      if (typingExpireTimers.current.has(username)) {
        clearTimeout(typingExpireTimers.current.get(username)!);
      }
      const timer = setTimeout(() => removeTypingUser(username), TYPING_EXPIRE_MS);
      typingExpireTimers.current.set(username, timer);
    });

    const unsubStoppedTyping = subscribe("user_stopped_typing", (data) => {
      if (data.roomId !== roomId) return;
      // Server sends userId; we clear by username via the expire timers too
      // But since server now sends username, clear immediately
      if (data.username) {
        removeTypingUser(data.username);
        const timer = typingExpireTimers.current.get(data.username);
        if (timer) {
          clearTimeout(timer);
          typingExpireTimers.current.delete(data.username);
        }
      } else {
        // Fallback: clear all
        setTypingUsers(new Set());
        typingExpireTimers.current.forEach((t) => clearTimeout(t));
        typingExpireTimers.current.clear();
      }
    });

    const unsubError = subscribe("error", (data) => {
      toast.error(data.message || "An error occurred");
    });

    return () => {
      unsubMessagesList();
      unsubChat();
      unsubDirectMessage();
      unsubReacted();
      unsubTyping();
      unsubStoppedTyping();
      unsubError();
      // Clear all per-user timers on unmount
      typingExpireTimers.current.forEach((t) => clearTimeout(t));
      typingExpireTimers.current.clear();
    };
  }, [isConnected, roomId, subscribe, sendMessage, removeTypingUser]);

  const sendChatMessage = useCallback(
    (text: string) => {
      if (!roomId) return;
      sendMessage({ type: "chat", roomId, text });
    },
    [roomId, sendMessage]
  );

  // Bug 3 fix: fire typing immediately, then auto stop-type after 3s of silence
  const sendTyping = useCallback(() => {
    if (!roomId) return;

    if (!hasSentTypingRef.current) {
      sendMessage({ type: "typing", roomId });
      hasSentTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendMessage({ type: "stopped_typing", roomId });
      typingTimeoutRef.current = null;
      hasSentTypingRef.current = false;
    }, TYPING_SEND_DEBOUNCE_MS);
  }, [roomId, sendMessage]);

  const stopTyping = useCallback(() => {
    if (!roomId) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (hasSentTypingRef.current) {
      sendMessage({ type: "stopped_typing", roomId });
      hasSentTypingRef.current = false;
    }
  }, [roomId, sendMessage]);

  return {
    messages,
    isLoading,
    sendMessage: sendChatMessage,
    sendTyping,
    stopTyping,
    typingUsers,
  };
}
