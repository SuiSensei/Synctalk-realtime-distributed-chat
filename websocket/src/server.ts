import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import { IncomingMessage as HttpIncomingMessage } from "http";
import { parse as parseUrl } from "url";

import { config } from "./config";
import { supabase } from "./supabase";
import { UserProfile } from "./types";
import { connections, typingUsers } from "./state";
import { sendToUser, broadcastPresence } from "./helpers";
import { isRateLimited, setPresence, clearPresence } from "./redis";

// ─── Handlers ────────────────────────────────────────────────────────────────
import { handleChat } from "./handlers/chat";
import { handleDirectMessage } from "./handlers/direct-message";
import { handleTyping, handleStoppedTyping } from "./handlers/typing";
import { handleCreateRoom, handleJoinRoom, handleLeaveRoom } from "./handlers/room";
import { handleAddReaction, handleRemoveReaction } from "./handlers/reaction";
import { handleMarkAsRead } from "./handlers/read-receipt";
import { handleUpdateStatus } from "./handlers/status";
import { handleUpdateProfile } from "./handlers/profile";
import { handleGetRooms, handleGetMessages } from "./handlers/query";
import { handleSendFriendRequest, handleRespondFriendRequest } from "./handlers/friends";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", connections: connections.size, uptime: process.uptime() });
});

const server = app.listen(config.port, () => {
  console.log(`🚀 SyncTalk WS server listening on port ${config.port}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", async (req: HttpIncomingMessage, socket, head) => {
  const handlePreUpgradeError = (err: Error) => {
    console.error("Pre-upgrade error:", err);
  };
  socket.on("error", handlePreUpgradeError);

  try {
    const { query } = parseUrl(req.url || "", true);
    const token = query.token as string;

    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      console.warn("⚠️ Auth rejected:", authErr?.message);
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }

    // Fetch profile
    const { data: profile, error: profErr } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profErr || !profile) {
      console.warn("⚠️ Profile not found:", profErr?.message);
      socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
      socket.destroy();
      return;
    }

    (req as any).userId = user.id;
    (req as any).profile = profile as UserProfile;

    wss.handleUpgrade(req, socket, head, (ws) => {
      socket.removeListener("error", handlePreUpgradeError);
      wss.emit("connection", ws, req);
    });
  } catch (err) {
    console.error("Upgrade error:", err);
    socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
    socket.destroy();
  }
});

// ─── Connection Handler ──────────────────────────────────────────────────────

wss.on("connection", async (ws: WebSocket, req: HttpIncomingMessage) => {
  const userId: string = (req as any).userId;
  const profile: UserProfile = (req as any).profile;

  console.log(`✅ Connected: ${profile.username} (${userId})`);

  connections.set(userId, { ws, profile });

  // ─── Message Router (MUST be registered FIRST, before any async work) ──
  // The client sends get_rooms immediately on connect. If we await anything
  // before registering this handler, those messages are silently lost.

  ws.on("message", async (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      switch (data.type) {
        case "chat":
          if (await isRateLimited(userId, "msg", 30, 60)) {
            sendToUser(userId, { type: "error", message: "Rate limit exceeded. Max 30 messages/min." });
            break;
          }
          await handleChat(userId, profile, data); break;
        case "direct_message":
          if (await isRateLimited(userId, "msg", 30, 60)) {
            sendToUser(userId, { type: "error", message: "Rate limit exceeded. Max 30 messages/min." });
            break;
          }
          await handleDirectMessage(userId, profile, data); break;
        case "typing": await handleTyping(userId, profile, data); break;
        case "stopped_typing": await handleStoppedTyping(userId, data, profile.username); break;
        case "create_room": await handleCreateRoom(userId, profile, data); break;
        case "join_room": await handleJoinRoom(userId, profile, data); break;
        case "leave_room": await handleLeaveRoom(userId, profile, data); break;
        case "add_reaction": await handleAddReaction(userId, profile, data); break;
        case "remove_reaction": await handleRemoveReaction(userId, data); break;
        case "mark_as_read": await handleMarkAsRead(userId, data); break;
        case "update_status": await handleUpdateStatus(userId, profile, data); break;
        case "update_profile": await handleUpdateProfile(userId, data); break;
        case "send_friend_request": await handleSendFriendRequest(userId, profile, data); break;
        case "respond_friend_request": await handleRespondFriendRequest(userId, profile, data); break;
        case "get_rooms":
          console.log(`📋 get_rooms from ${profile.username}`);
          await handleGetRooms(userId); break;
        case "get_messages":
          console.log(`📋 get_messages from ${profile.username} for room ${data.roomId}`);
          await handleGetMessages(userId, data); break;
        default:
          sendToUser(userId, { type: "error", message: `Unknown type: ${data.type}` });
      }
    } catch (err) {
      console.error(`Message error from ${userId}:`, err);
      sendToUser(userId, { type: "error", message: "Invalid message format" });
    }
  });

  // ─── Disconnect ────────────────────────────────────────────────────────

  ws.on("close", async () => {
    try {
      // Only clean up if this WS is still the current connection for the user.
      // If the user already reconnected, a newer WS replaced this one in the map — don't delete it.
      const current = connections.get(userId);
      if (!current || current.ws !== ws) {
        console.log(`⏭️ Stale close event for ${profile.username} — newer connection exists, skipping cleanup`);
        return;
      }

      console.log(`❌ Disconnected: ${profile.username} (${userId})`);
      connections.delete(userId);
      typingUsers.delete(userId);
      await clearPresence(userId);

      const now = new Date().toISOString();
      await supabase.from("profile").update({ is_online: false, last_active: now, updated_at: now }).eq("id", userId);
      await supabase.from("user_status").upsert({ user_id: userId, status: "offline", last_active: now, updated_at: now });

      await broadcastPresence();
    } catch (err) {
      console.error(`Error during disconnect for ${userId}:`, err);
    }
  });

  ws.on("error", (err) => console.error(`WS error for ${profile.username}:`, err));

  // ─── Async setup (runs AFTER all event handlers are registered) ─────
  // This ensures no messages are lost during the async gap.
  const now = new Date().toISOString();
  await supabase.from("profile").update({ is_online: true, last_active: now, updated_at: now }).eq("id", userId);
  await supabase.from("user_status").upsert({ user_id: userId, status: "available", last_active: now, updated_at: now });
  await setPresence(userId, { id: profile.id, username: profile.username, status: "available" });
  await broadcastPresence();
  sendToUser(userId, { type: "auth_success", userId, profile });
});
