"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

type SubscribeCallback = (data: any) => void;

interface WebSocketContextValue {
  isConnected: boolean;
  sendMessage: (data: object) => void;
  subscribe: (type: string, callback: SubscribeCallback) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const backoffRef = useRef(1000);
  const supabase = useMemo(() => createClient(), []);

  // Listeners are always available synchronously — no race conditions
  const listenersRef = useRef<Map<string, Set<SubscribeCallback>>>(new Map());

  const dispatch = useCallback((data: any) => {
    console.log("🔔 dispatch called:", data?.type, "listeners:", listenersRef.current.has(data?.type) ? listenersRef.current.get(data.type)!.size : 0);
    if (data && data.type) {
      const typeListeners = listenersRef.current.get(data.type);
      if (typeListeners) {
        typeListeners.forEach((cb) => cb(data));
      }
    }
  }, []);

  const subscribe = useCallback((type: string, callback: SubscribeCallback) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set());
    }
    listenersRef.current.get(type)!.add(callback);

    return () => {
      const typeListeners = listenersRef.current.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
      }
    };
  }, []);

  const sendMessage = useCallback((data: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log("📤 Sending:", JSON.stringify(data).substring(0, 80));
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket not connected. Cannot send message. readyState:", wsRef.current?.readyState);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("⏳ No session yet, skipping connect");
        return;
      }

      // Guard: don't create a new WS if one is already open OR connecting
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        console.log("⏭️ WS already open/connecting, skipping");
        return;
      }

      console.log("🔗 Creating new WebSocket connection...");
      const ws = new WebSocket(`${WS_URL}/?token=${session.access_token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WS connected!");
        setIsConnected(true);
        backoffRef.current = 1000;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 WS message received:", data?.type);
          dispatch(data);
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };

      ws.onclose = () => {
        console.log("❌ WS closed, will reconnect in", backoffRef.current, "ms");
        setIsConnected(false);
        // Only reconnect if this is still the current WS (not replaced by a newer one)
        if (wsRef.current === ws) {
          reconnectTimerRef.current = setTimeout(() => {
            backoffRef.current = Math.min(backoffRef.current * 2, 30000);
            connect();
          }, backoffRef.current);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
      };
    } catch (err) {
      console.error("Failed to connect WS", err);
    }
  }, [supabase, dispatch]);

  useEffect(() => {
    connect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN") {
          // After login or page reload with existing session — connect if not already connected
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            connect();
          }
        } else if (event === "TOKEN_REFRESHED") {
          // Reconnect with fresh token
          if (wsRef.current) {
            wsRef.current.close(); // onclose will trigger reconnect
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

  const contextValue = useMemo(
    () => ({ isConnected, sendMessage, subscribe }),
    [isConnected, sendMessage, subscribe]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
