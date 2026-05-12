import { WebSocket } from "ws";
import { connections } from "./state";
import { supabase } from "./supabase";
import { UserProfile, SenderInfo } from "./types";
import {
  getCachedRoomMembers,
  cacheRoomMembers,
  setPresence,
  clearPresence,
} from "./redis";

// ─── Send / Broadcast ────────────────────────────────────────────────────────

/** Send a JSON message to a single connected user. */
export function sendToUser(userId: string, message: object): void {
  const conn = connections.get(userId);
  if (conn && conn.ws.readyState === WebSocket.OPEN) {
    conn.ws.send(JSON.stringify(message));
  }
}

/** Get member IDs for a room — Redis cache (60s) → Supabase fallback. */
export async function getRoomMemberIds(roomId: string): Promise<string[]> {
  // Try cache first
  const cached = await getCachedRoomMembers(roomId);
  if (cached) return cached;

  // Cache miss — query DB
  const { data } = await supabase
    .from("room_member")
    .select("user_id")
    .eq("room_id", roomId);
  const ids = data?.map((m) => m.user_id) || [];

  // Populate cache
  await cacheRoomMembers(roomId, ids);
  return ids;
}

/** Broadcast a message to all online members of a room. */
export async function broadcastToRoom(
  roomId: string,
  message: object,
  excludeUserId?: string
): Promise<void> {
  const memberIds = await getRoomMemberIds(roomId);
  const payload = JSON.stringify(message);
  for (const memberId of memberIds) {
    if (excludeUserId && memberId === excludeUserId) continue;
    const conn = connections.get(memberId);
    if (conn && conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(payload);
    }
  }
}

/** Broadcast the current online users list to every connected client. Also syncs to Redis. */
export async function broadcastPresence(): Promise<void> {
  const userList = Array.from(connections.values()).map((c) => ({
    id: c.profile.id,
    username: c.profile.username,
    first_name: c.profile.first_name,
    last_name: c.profile.last_name,
    avatar_url: c.profile.avatar_url,
    status: c.profile.status,
    is_online: true,
    last_active: c.profile.last_active,
  }));

  // Sync each user's presence to Redis (120s TTL, refreshed on each broadcast)
  for (const user of userList) {
    await setPresence(user.id, user);
  }

  const payload = JSON.stringify({ type: "presence", users: userList });
  for (const [, conn] of connections) {
    if (conn.ws.readyState === WebSocket.OPEN) {
      conn.ws.send(payload);
    }
  }
}

/** Extract the fields needed when embedding a sender in outgoing messages. */
export function getSenderInfo(profile: UserProfile): SenderInfo {
  return {
    id: profile.id,
    username: profile.username,
    first_name: profile.first_name,
    last_name: profile.last_name,
    avatar_url: profile.avatar_url,
  };
}

// ─── DM Room Helper ──────────────────────────────────────────────────────────

/**
 * Find or create a private 2-person room for a DM conversation.
 * Returns the room ID, or null on failure.
 */
export async function getOrCreateDmRoom(
  userA: string,
  userB: string
): Promise<string | null> {
  // Search existing private rooms that userA belongs to
  const { data: roomsA } = await supabase
    .from("room_member")
    .select("room_id")
    .eq("user_id", userA);

  if (roomsA) {
    for (const rm of roomsA) {
      const { data: room } = await supabase
        .from("room")
        .select("id")
        .eq("id", rm.room_id)
        .eq("is_private", true)
        .single();

      if (!room) continue;

      const { data: hasB } = await supabase
        .from("room_member")
        .select("user_id")
        .eq("room_id", room.id)
        .eq("user_id", userB)
        .single();

      if (!hasB) continue;

      const { count } = await supabase
        .from("room_member")
        .select("*", { count: "exact", head: true })
        .eq("room_id", room.id);

      if (count === 2) return room.id;
    }
  }

  // Create a new private DM room
  const profileA = connections.get(userA)?.profile;
  let nameB = "User";
  const connB = connections.get(userB);
  if (connB) {
    nameB = connB.profile.username;
  } else {
    const { data: pB } = await supabase
      .from("profile")
      .select("username")
      .eq("id", userB)
      .single();
    if (pB) nameB = pB.username;
  }

  const { data: newRoom, error } = await supabase
    .from("room")
    .insert({
      name: `DM: ${profileA?.username || "User"} & ${nameB}`,
      owner_id: userA,
      is_private: true,
    })
    .select()
    .single();

  if (error || !newRoom) {
    console.error("DM room creation error:", error);
    return null;
  }

  await supabase.from("room_member").insert([
    { room_id: newRoom.id, user_id: userA, role: "member" },
    { room_id: newRoom.id, user_id: userB, role: "member" },
  ]);

  return newRoom.id;
}
