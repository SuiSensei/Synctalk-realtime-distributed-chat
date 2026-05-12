import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backoffRef = useRef(1000);
  const supabase = useMemo(() => createClient(), []);
  const onMessageRef = useRef<((data: any) => void) | null>(null);

  const connect = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return; // Wait for session

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        return; // Already connected
      }

      const ws = new WebSocket(`${WS_URL}/?token=${session.access_token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WS connected!");
        setIsConnected(true);
        setError(null);
        backoffRef.current = 1000; // Reset backoff
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessageRef.current?.(data); // dispatch directly, no React state
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };
      ws.onclose = () => {
        setIsConnected(false);
        // Attempt reconnect with exponential backoff
        reconnectTimerRef.current = setTimeout(() => {
          backoffRef.current = Math.min(backoffRef.current * 2, 30000);
          connect();
        }, backoffRef.current);
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        setError("Connection error");
      };
    } catch (err) {
      console.error("Failed to connect WS", err);
    }
  }, [supabase]);

  useEffect(() => {
    connect();

    // Listen for auth state changes (e.g. token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // If already connected, might not need to reconnect unless token is invalid
          // But to be safe on refresh, reconnect.
          if (wsRef.current) {
            wsRef.current.close(); // will trigger onclose and reconnect
          } else {
            connect();
          }
        } else if (event === "SIGNED_OUT") {
          if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
          }
        }
      }
    );

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
      subscription.unsubscribe();
    };
  }, [connect, supabase]);

  const sendMessage = useCallback((data: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected. Cannot send message.");
    }
  }, []);

  return { isConnected, sendMessage, lastMessage, error, onMessageRef };
}
