import { supabase } from "../supabase";
import { sendToUser } from "../helpers";
import { getCachedMessages, cacheMessages } from "../redis";

/**
 * Get all rooms the user belongs to, with last message preview and member count.
 */
export async function handleGetRooms(userId: string): Promise<void> {
  console.log(`[handleGetRooms] Starting for user ${userId}`);

  const { data: memberships, error: memberError } = await supabase
    .from("room_member")
    .select("room_id")
    .eq("user_id", userId);

  if (memberError) {
    console.error("[handleGetRooms] member query error:", memberError);
    sendToUser(userId, { type: "rooms_list", rooms: [] });
    return;
  }

  if (!memberships || memberships.length === 0) {
    console.log("[handleGetRooms] No memberships found, sending empty rooms");
    sendToUser(userId, { type: "rooms_list", rooms: [] });
    return;
  }

  const roomIds = memberships.map((m) => m.room_id);
  console.log(`[handleGetRooms] Found ${roomIds.length} room memberships`);

  const { data: rooms, error: roomError } = await supabase
    .from("room")
    .select("*")
    .in("id", roomIds);

  if (roomError) {
    console.error("[handleGetRooms] room query error:", roomError);
    sendToUser(userId, { type: "rooms_list", rooms: [] });
    return;
  }

  const roomsWithPreview = await Promise.all(
    (rooms || []).map(async (room) => {
      const { data: lastMsg } = await supabase
        .from("message")
        .select("content, created_at, user_id")
        .eq("room_id", room.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { count } = await supabase
        .from("room_member")
        .select("*", { count: "exact", head: true })
        .eq("room_id", room.id);

      console.log("Messages returned: ", lastMsg)
      return { ...room, lastMessage: lastMsg || null, memberCount: count || 0 };
    })
  );

  console.log(`[handleGetRooms] Sending ${roomsWithPreview.length} rooms to ${userId}`);
  sendToUser(userId, { type: "rooms_list", rooms: roomsWithPreview });
}

/**
 * Get messages for a room with pagination support.
 * Uses Redis cache (5 min TTL) for the default first page. Paginated requests
 * (with `before` cursor) bypass cache and always hit Supabase.
 */
export async function handleGetMessages(
  userId: string,
  data: { roomId: string; limit?: number; before?: string }
): Promise<void> {
  const limit = data.limit || 50;

  // For the default first page (no pagination cursor), check cache
  if (!data.before) {
    const cached = await getCachedMessages(data.roomId);
    if (cached) {
      sendToUser(userId, {
        type: "messages_list",
        roomId: data.roomId,
        messages: cached,
      });
      return;
    }
  }

  let query = supabase
    .from("message")
    .select("*, profile:user_id(id, username, first_name, last_name, avatar_url)")
    .eq("room_id", data.roomId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (data.before) {
    query = query.lt("created_at", data.before);
  }

  const { data: msgs, error } = await query;

  if (error) {
    console.error("Get messages error:", error);
    sendToUser(userId, { type: "error", message: "Failed to fetch messages" });
    return;
  }

  // Batch-fetch reactions
  const messageIds = (msgs || []).map((m) => m.id);
  const { data: reactions } = await supabase
    .from("message_reaction")
    .select("message_id, emoji, user_id, name")
    .in("message_id", messageIds.length > 0 ? messageIds : ["__none__"]);

  const reactionMap = new Map<string, any[]>();
  for (const r of reactions || []) {
    if (!reactionMap.has(r.message_id)) reactionMap.set(r.message_id, []);
    reactionMap.get(r.message_id)!.push(r);
  }

  // Reverse to chronological order (oldest first)
  const formatted = (msgs || []).reverse().map((m) => ({
    id: m.id,
    type: "chat",
    roomId: m.room_id,
    sender: m.profile || { id: m.user_id },
    content: m.content,
    timestamp: m.created_at,
    is_edited: m.is_edited,
    reactions: reactionMap.get(m.id) || [],
    parent_message_id: m.parent_message_id,
  }));

  // Cache the first page result in Redis (5 min TTL)
  if (!data.before) {
    await cacheMessages(data.roomId, formatted);
  }

  sendToUser(userId, {
    type: "messages_list",
    roomId: data.roomId,
    messages: formatted,
  });
}
