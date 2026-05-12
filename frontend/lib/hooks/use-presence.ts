import { useState, useEffect, useMemo } from "react";
import { useWebSocket } from "../contexts/websocket-context";
import { createClient } from "@/lib/supabase/client";

export function usePresence() {
  const { subscribe, sendMessage } = useWebSocket();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [myProfile, setMyProfile] = useState<any>(null);
  const supabase = useMemo(() => createClient(), []);

  // Fetch the user profile directly from Supabase on mount as a reliable fallback.
  // This eliminates the race condition where auth_success fires before subscribers register.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (profile) setMyProfile(profile);
    });
  }, [supabase]);

  useEffect(() => {
    const unsubAuth = subscribe("auth_success", (data) => {
      setMyProfile(data.profile);
    });

    const unsubPresence = subscribe("presence", (data) => {
      setOnlineUsers(data.users || []);
    });

    return () => {
      unsubAuth();
      unsubPresence();
    };
  }, [subscribe]);

  const updateStatus = (status: "available" | "away" | "busy" | "offline") => {
    sendMessage({ type: "update_status", status });
  };

  return { onlineUsers, myProfile, updateStatus };
}
