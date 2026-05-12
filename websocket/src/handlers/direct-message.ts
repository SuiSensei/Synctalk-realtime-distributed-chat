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
  const dmRoomId = await getOrCreateDmRoom(userId, data.recipientId);
  if (!dmRoomId) {
    sendToUser(userId, { type: "error", message: "Failed to create DM conversation" });
    return;
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
