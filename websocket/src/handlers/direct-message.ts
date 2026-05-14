import { supabase } from "../supabase";
import { UserProfile } from "../types";
import { sendToUser, getSenderInfo, getOrCreateDmRoom } from "../helpers";
import { invalidateMessages } from "../redis";

/**
 * Handle a direct message.
 * Finds or creates a private DM room, persists to `message` + `direct_message`,
 * and sends to both sender and recipient.
 */
export async function handleDirectMessage(
  userId: string,
  profile: UserProfile,
  data: { recipientId: string; text: string }
) : Promise<void> {
  // Check if a DM room already exists before creating
  const existingRoomId = await findExistingDmRoom(userId, data.recipientId);
  const dmRoomId = await getOrCreateDmRoom(userId, data.recipientId);
  if (!dmRoomId) {
    sendToUser(userId, { type: "error", message: "Failed to create DM conversation" });
    return;
  }

  const isNewRoom = !existingRoomId;

  // If a new room was created, notify both users so their sidebar updates instantly
  if (isNewRoom) {
    const { data: roomData } = await supabase
      .from("room")
      .select("*")
      .eq("id", dmRoomId)
      .single();

    if (roomData) {
      const roomMsg = { type: "room_created", room: { ...roomData, lastMessage: null, memberCount: 2 } };
      sendToUser(userId, roomMsg);
      sendToUser(data.recipientId, roomMsg);
    }
  }

  // If no text, just open the room (used by New Chat dialog)
  if (!data.text || !data.text.trim()) {
    sendToUser(userId, { type: "dm_room_ready", roomId: dmRoomId });
    return;
  }

  const { data: msg, error } = await supabase
    .from("message")
    .insert({
      content: data.text,
      user_id: userId,
      room_id: dmRoomId,
      recipient_id: data.recipientId,
      type: "text",
    })
    .select()
    .single();

  if (error || !msg) {
    console.error("DM insert error:", error);
    return;
  }

  await supabase.from("direct_message").insert({
    sender_id: userId,
    recipient_id: data.recipientId,
    message_id: msg.id,
  });

  const outgoing = {
    id: msg.id,
    type: "direct_message",
    roomId: dmRoomId,
    sender: getSenderInfo(profile),
    content: msg.content,
    timestamp: msg.created_at,
    read: false,
  };

  sendToUser(userId, outgoing);
  sendToUser(data.recipientId, outgoing);
  await invalidateMessages(dmRoomId);
  console.log(`📩 DM: ${profile.username} → ${data.recipientId}`);
}

/**
 * Check if a DM room already exists between two users (without creating one).
 */
async function findExistingDmRoom(userA: string, userB: string): Promise<string | null> {
  const { data: roomsA } = await supabase
    .from("room_member")
    .select("room_id")
    .eq("user_id", userA);

  if (!roomsA) return null;

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

  return null;
}
